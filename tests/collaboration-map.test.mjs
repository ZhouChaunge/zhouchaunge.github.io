import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { projectCoordinate, renderCollaborationMap } from '../lib/collaboration-map.mjs';

const data = {
  home: { id: 'melbourne', city: 'Melbourne', country: 'Australia', longitude: 144.9631, latitude: -37.8136, institution: 'The University of Melbourne' },
  locations: [
    { id: 'singapore', city: 'Singapore', country: 'Singapore', longitude: 103.8198, latitude: 1.3521, institutions: [{ name: 'National University of Singapore', url: 'https://nus.edu.sg/', collaborators: [{ name: 'Junfeng Fang', papers: [{ id: 'physguard', roles: ['coauthor'] }] }] }] },
    { id: 'oslo', city: 'Oslo', country: 'Norway', longitude: 10.7522, latitude: 59.9139, institutions: [{ name: 'Norwegian Geotechnical Institute', collaborators: [{ name: 'Hans Petter Jostad', papers: [{ id: 'trace', roles: ['coauthor'] }] }] }] }
  ]
};
const publications = [{ id: 'physguard', title: 'PhysGuard' }, { id: 'trace', title: 'TRACE' }];

test('geographic projection preserves direction and stays within the map', () => {
  assert.deepEqual(projectCoordinate(-180, 85), [0, 0]);
  assert.deepEqual(projectCoordinate(180, -68), [800, 340]);
  const melbourne = projectCoordinate(144.9631, -37.8136);
  const oslo = projectCoordinate(10.7522, 59.9139);
  assert.ok(melbourne[0] > oslo[0] && melbourne[1] > oslo[1]);
  assert.throws(() => projectCoordinate(181, 0), /valid numeric/);
});

test('static rendering uses map buttons and initially hidden city and institution popups', () => {
  const html = renderCollaborationMap(data, publications);
  assert.match(html, /aria-labelledby="collaboration-map-title collaboration-map-description"/);
  const buttons = [...html.matchAll(/<button\b[^>]*data-collaboration-location="([^"]+)"[^>]*>/g)];
  assert.deepEqual(buttons.map(([, id]) => id), ['singapore', 'oslo']);
  for (const [tag, id] of buttons) {
    assert.match(tag, /type="button"/);
    assert.match(tag, /aria-expanded="false"/);
    assert.match(tag, /aria-label="[^"]+, [^"]+"/);
    assert.match(tag, /\bhidden(?:\s|>)/);
    assert.ok(tag.includes(`aria-controls="collaboration-popup-${id}"`));
  }
  const popups = [...html.matchAll(/<[^>]*data-collaboration-popup="([^"]+)"[^>]*>/g)];
  assert.deepEqual(popups.map(([, id]) => id), ['singapore', 'oslo']);
  for (const [tag, id] of popups) {
    assert.match(tag, /\bhidden(?:\s|>)/);
    assert.ok(tag.includes(`id="collaboration-popup-${id}"`));
  }
  assert.match(html, /National University of Singapore/);
  assert.match(html, /Norwegian Geotechnical Institute/);
  assert.match(html, /Norway/);
  assert.doesNotMatch(html, /collaboration-controls|collaboration-detail|href="#pub-|PhysGuard|TRACE/);
  assert.doesNotMatch(html, /Junfeng Fang|Hans Petter Jostad|First author|Corresponding author|>Coauthor</);
  assert.match(html, /class="collaboration-land" d="M/);
});

test('renderer escapes content and rejects unsafe institution URLs and broken paper ids', () => {
  const modified = structuredClone(data);
  modified.locations[0].city = '<Singapore & friends>';
  modified.locations[0].institutions[0].name = '"A" <B> Institute';
  assert.match(renderCollaborationMap(modified, publications), /&lt;Singapore &amp; friends&gt;/);
  assert.match(renderCollaborationMap(modified, publications), /&quot;A&quot; &lt;B&gt; Institute/);
  modified.locations[0].institutions[0].url = 'javascript:alert(1)';
  assert.throws(() => renderCollaborationMap(modified, publications), /HTTPS/);
  modified.locations[0].institutions[0].url = 'https://nus.edu.sg/';
  modified.locations[0].institutions[0].collaborators[0].papers = [{ id: 'missing', roles: ['coauthor'] }];
  assert.throws(() => renderCollaborationMap(modified, publications), /Unknown collaboration paper/);
  delete modified.home.id;
  assert.throws(() => renderCollaborationMap(modified, publications), /unique slugs/);
});

test('multiple collaborators do not duplicate institutions or expose people, roles, or papers', () => {
  const modified = structuredClone(data);
  modified.locations[0].institutions[0].collaborators.push({ name: 'Another coauthor', papers: [{ id: 'physguard', roles: ['corresponding'] }] });
  const html = renderCollaborationMap(modified, publications);
  assert.equal((html.match(/National University of Singapore/g) || []).length, 1);
  assert.doesNotMatch(html, /href="https:\/\/nus.edu.sg\/"/);
  assert.doesNotMatch(html, /Junfeng Fang|Another coauthor|Hans Petter Jostad|First author|Corresponding author|>Coauthor</);
  assert.doesNotMatch(html, /class="collaboration-(?:person|roles|role|contributors)"/);
  assert.doesNotMatch(html, /href="#pub-|PhysGuard|TRACE/);
});

test('author role provenance remains validated while the public map shows institutions only', () => {
  const modified = structuredClone(data);
  modified.locations = [modified.locations[0]];
  modified.locations[0].institutions[0].collaborators[0].papers = [
    { id: 'physguard', roles: ['first', 'corresponding'] },
    { id: 'trace', roles: ['coauthor'] }
  ];
  const html = renderCollaborationMap(modified, publications);
  assert.doesNotMatch(html, /href="#pub-|PhysGuard|TRACE/);
  assert.match(html, /National University of Singapore/);
  assert.doesNotMatch(html, /Junfeng Fang|First author|Corresponding author|>Coauthor</);
  assert.doesNotMatch(html, /class="collaboration-(?:person|roles|role|contributors)"/);
  for (const roles of [[], ['lead'], ['coauthor', 'coauthor'], null]) {
    modified.locations[0].institutions[0].collaborators[0].papers[0].roles = roles;
    assert.throws(() => renderCollaborationMap(modified, publications), /paper roles/);
  }
});

test('Melbourne affiliations are selectable without a duplicate marker or self-connection', () => {
  const modified = structuredClone(data);
  modified.home.institutions = [{ name: 'The University of Melbourne', collaborators: [{ name: 'Negin Yousefpour', papers: [{ id: 'physguard', roles: ['corresponding'] }] }] }];
  const html = renderCollaborationMap(modified, publications);
  assert.equal((html.match(/class="[^"]*\bcollaboration-home\b[^"]*"/g) || []).length, 1);
  assert.match(html, /class="[^"]*\bcollaboration-home\b[^"]*" data-map-location="melbourne"/);
  assert.match(html, /data-collaboration-location="melbourne"/);
  assert.match(html, /data-collaboration-location="singapore"/);
  assert.match(html, /data-collaboration-popup="melbourne"/);
  assert.equal((html.match(/class="collaboration-route"/g) || []).length, data.locations.length);
  assert.doesNotMatch(html, /class="collaboration-route" data-map-location="melbourne"/);
  assert.match(html, /id="collaboration-popup-melbourne"[\s\S]*?The University of Melbourne/);
  assert.doesNotMatch(html, /Negin Yousefpour|First author|Corresponding author|>Coauthor</);
  modified.locations = [];
  const localOnly = renderCollaborationMap(modified, publications);
  assert.match(localOnly, /data-collaboration-popup="melbourne"/);
  assert.doesNotMatch(localOnly, /class="collaboration-route"|Lines connect/);
});

test('label offsets move only the label and require two finite coordinates', () => {
  const modified = structuredClone(data);
  modified.locations[0].id = 'custom-city';
  modified.locations[0].labelOffset = [-12, 4];
  const html = renderCollaborationMap(modified, publications);
  const [x, y] = projectCoordinate(data.locations[0].longitude, data.locations[0].latitude);
  assert.ok(html.includes(`transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"`));
  assert.ok(html.includes(`x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${x - 12}" y2="${y + 4}"`));
  assert.ok(html.includes(`--pin-x:${((x - 12) / 800 * 100).toFixed(3)}%;--pin-y:${((y + 4) / 340 * 100).toFixed(3)}%`));
  for (const invalid of [null, [-12], [-12, 4, 3], ['-12', 4], [NaN, 4], [Infinity, 4]]) {
    modified.locations[0].labelOffset = invalid;
    assert.throws(() => renderCollaborationMap(modified, publications), /labelOffset/);
  }
});

// Exercise the actual browser script with event targets, focus and controllable timers.
// No HTML layout is simulated here; the browser QA covers visual placement.
function mapHarness({ width = 1024, height = 768 } = {}) {
  const target = (values = {}) => ({
    listeners: new Map(),
    addEventListener(type, handler) {
      const handlers = this.listeners.get(type) || [];
      handlers.push(handler);
      this.listeners.set(type, handlers);
    },
    emit(type, values = {}) {
      const event = { type, target: this, defaultPrevented: false, preventDefault() { this.defaultPrevented = true; }, ...values };
      for (const handler of this.listeners.get(type) || []) handler(event);
      return event;
    },
    ...values
  });
  const element = (values = {}) => {
    const classes = new Set();
    return target({
      dataset: {}, attributes: new Map(), style: {}, hidden: true,
      setAttribute(name, value) { this.attributes.set(name, String(value)); },
      getAttribute(name) { return this.attributes.get(name) ?? null; },
      removeAttribute(name) { this.attributes.delete(name); },
      contains(node) { return node === this || node?.parentElement === this; },
      classList: {
        toggle(name, enabled) { if (enabled) classes.add(name); else classes.delete(name); },
        contains: name => classes.has(name)
      },
      getBoundingClientRect() {
        const bounds = { ...this.rect };
        if (this.style.maxWidth) bounds.width = Math.min(bounds.width, parseFloat(this.style.maxWidth));
        if (this.style.maxHeight) bounds.height = Math.min(bounds.height, parseFloat(this.style.maxHeight));
        return bounds;
      },
      ...values
    });
  };
  const buttons = ['singapore', 'oslo'].map((id, index) => {
    const button = element({ dataset: { collaborationLocation: id }, rect: { left: 200 + index * 200, top: 150, bottom: 190, width: 80, height: 40 } });
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', `collaboration-popup-${id}`);
    return button;
  });
  const popups = buttons.map(button => element({ id: `collaboration-popup-${button.dataset.collaborationLocation}`, dataset: { collaborationPopup: button.dataset.collaborationLocation }, rect: { width: 250, height: 100 } }));
  const markers = buttons.map(button => element({ dataset: { mapLocation: button.dataset.collaborationLocation } }));
  const world = element();
  const map = element({
    querySelectorAll(selector) { return ({ '[data-collaboration-location]': buttons, '[data-collaboration-popup]': popups, '[data-map-location]': markers, '.collaboration-marker': markers })[selector] || []; },
    querySelector(selector) { return selector === '.collaboration-world' ? world : null; }
  });
  const outside = element({ hidden: false });
  const document = target({ querySelectorAll: () => [map], activeElement: outside, documentElement: { clientWidth: width, clientHeight: height } });
  const window = target({ innerWidth: width, innerHeight: height });
  const location = { hash: '#collaborations' };
  let nextTimer = 0;
  let now = 0;
  const timers = new Map();
  const setTimeout = (handler, delay) => { const id = ++nextTimer; timers.set(id, { handler, due: now + delay }); return id; };
  const clearTimeout = id => timers.delete(id);
  function advance(milliseconds = 100) {
    now += milliseconds;
    for (const [id, timer] of [...timers]) {
      if (timer.due <= now && timers.has(id)) { timers.delete(id); timer.handler(); }
    }
  }
  function focus(element) {
    if (document.activeElement === element) return;
    const previous = document.activeElement;
    document.activeElement = element;
    previous?.emit('blur', { relatedTarget: element });
    element.emit('focus', { relatedTarget: previous });
  }
  function click(button, pointerType = 'mouse') {
    document.emit('pointerdown', { target: button, pointerType });
    focus(button);
    button.emit('click', { pointerType });
  }
  vm.runInNewContext(readFileSync(new URL('../collaboration-map.js', import.meta.url), 'utf8'), { document, window, location, setTimeout, clearTimeout });
  return { buttons, popups, markers, world, map, outside, document, window, location, advance, focus, click };
}

function expectOpen(harness, index = -1) {
  harness.popups.forEach((popup, current) => assert.equal(popup.hidden, current !== index));
  harness.buttons.forEach((button, current) => {
    assert.equal(button.getAttribute('aria-expanded'), String(current === index));
    assert.equal(button.getAttribute('aria-describedby'), current === index ? harness.popups[index].id : null);
  });
  harness.markers.forEach((marker, current) => assert.equal(marker.classList.contains('is-selected'), current === index));
}

test('enhancement starts closed and enables native buttons without moving focus or changing the URL', () => {
  const harness = mapHarness();
  expectOpen(harness);
  assert.ok(harness.buttons.every(button => !button.hidden));
  assert.equal(harness.document.activeElement, harness.outside);
  assert.equal(harness.location.hash, '#collaborations');
});

test('hover remains open while crossing to the popup and closes after leaving both', () => {
  const harness = mapHarness();
  const { buttons, popups, advance } = harness;
  buttons[0].emit('pointerenter', { pointerType: 'mouse' });
  expectOpen(harness, 0);
  buttons[0].emit('pointerleave', { pointerType: 'mouse' });
  advance(50);
  expectOpen(harness, 0);
  popups[0].emit('pointerenter');
  advance(100);
  expectOpen(harness, 0);
  popups[0].emit('pointerleave');
  advance();
  expectOpen(harness);
  assert.equal(harness.document.activeElement, harness.outside);
});

test('moving between map labels shows only the newly hovered city', () => {
  const harness = mapHarness();
  harness.buttons[0].emit('pointerenter', { pointerType: 'mouse' });
  harness.buttons[0].emit('pointerleave', { pointerType: 'mouse' });
  harness.buttons[1].emit('pointerenter', { pointerType: 'mouse' });
  harness.advance();
  expectOpen(harness, 1);
});

test('the geographic point opens on hover and toggles by clicking its circle without moving focus', () => {
  const harness = mapHarness();
  const point = harness.markers[0];
  const circle = { parentElement: point };
  point.emit('pointerenter', { pointerType: 'mouse' });
  expectOpen(harness, 0);
  point.emit('pointerleave', { pointerType: 'mouse' });
  harness.advance();
  expectOpen(harness);
  harness.document.emit('pointerdown', { target: circle });
  point.emit('click', { target: circle });
  expectOpen(harness, 0);
  point.emit('pointerleave', { pointerType: 'mouse' });
  harness.advance();
  expectOpen(harness, 0);
  harness.document.emit('pointerdown', { target: circle });
  point.emit('click', { target: circle });
  expectOpen(harness);
  assert.equal(harness.document.activeElement, harness.outside);
});

test('keyboard focus opens and switches popups, then closes on leaving the controls', () => {
  const harness = mapHarness();
  harness.focus(harness.buttons[0]);
  expectOpen(harness, 0);
  harness.buttons[0].emit('pointerleave', { pointerType: 'mouse' });
  harness.advance();
  expectOpen(harness, 0);
  harness.focus(harness.buttons[1]);
  harness.advance();
  expectOpen(harness, 1);
  harness.focus(harness.outside);
  harness.advance();
  expectOpen(harness);
});

test('click pins a popup, switches cities and toggles the same city closed without changing focus or URL', () => {
  const harness = mapHarness();
  harness.click(harness.buttons[0]);
  expectOpen(harness, 0);
  harness.buttons[0].emit('pointerleave', { pointerType: 'mouse' });
  harness.buttons[1].emit('pointerenter', { pointerType: 'mouse' });
  harness.advance();
  expectOpen(harness, 0);
  harness.click(harness.buttons[1]);
  expectOpen(harness, 1);
  harness.click(harness.buttons[1]);
  harness.advance();
  expectOpen(harness);
  assert.equal(harness.document.activeElement, harness.buttons[1]);
  assert.equal(harness.location.hash, '#collaborations');
});

test('Escape closes a focused or pinned popup without moving focus or immediately reopening', () => {
  const harness = mapHarness();
  harness.focus(harness.buttons[0]);
  const firstEscape = harness.document.emit('keydown', { key: 'Escape' });
  harness.advance();
  expectOpen(harness);
  assert.equal(firstEscape.defaultPrevented, true);
  assert.equal(harness.document.activeElement, harness.buttons[0]);
  harness.click(harness.buttons[0]);
  expectOpen(harness, 0);
  harness.document.emit('keydown', { key: 'Escape' });
  harness.advance();
  expectOpen(harness);
  assert.equal(harness.document.activeElement, harness.buttons[0]);
  assert.equal(harness.document.emit('keydown', { key: 'Escape' }).defaultPrevented, false);
});

test('clicking inside a popup preserves it, while an outside pointer or map background closes it', () => {
  const harness = mapHarness();
  harness.click(harness.buttons[0]);
  harness.document.emit('pointerdown', { target: { parentElement: harness.popups[0] } });
  expectOpen(harness, 0);
  harness.document.emit('pointerdown', { target: harness.outside });
  expectOpen(harness);
  harness.click(harness.buttons[0]);
  harness.document.emit('pointerdown', { target: harness.map });
  expectOpen(harness);
});

test('touch interaction ignores hover events and opens, switches and closes by tapping', () => {
  const harness = mapHarness({ width: 390, height: 844 });
  harness.buttons[0].emit('pointerenter', { pointerType: 'touch' });
  expectOpen(harness);
  harness.click(harness.buttons[0], 'touch');
  harness.buttons[0].emit('pointerleave', { pointerType: 'touch' });
  harness.advance();
  expectOpen(harness, 0);
  harness.click(harness.buttons[1], 'touch');
  expectOpen(harness, 1);
  harness.click(harness.buttons[1], 'touch');
  expectOpen(harness);
});

test('popup placement stays in the viewport and follows its anchor during scroll or resize', () => {
  const harness = mapHarness({ width: 390, height: 600 });
  const button = harness.buttons[0];
  const popup = harness.popups[0];
  button.rect = { left: 355, top: 550, bottom: 590, width: 80, height: 40 };
  harness.focus(button);
  assert.ok(parseFloat(popup.style.left) >= 12);
  assert.ok(parseFloat(popup.style.left) + popup.rect.width <= 378);
  assert.ok(parseFloat(popup.style.top) + popup.rect.height < button.rect.top);
  button.rect = { left: 50, top: 100, bottom: 140, width: 80, height: 40 };
  harness.window.emit('scroll');
  assert.ok(parseFloat(popup.style.top) > button.rect.bottom);
  assert.equal(harness.world.getAttribute('viewBox'), '300 -25 500 400');
  harness.window.innerWidth = 1024;
  harness.document.documentElement.clientWidth = 1024;
  harness.window.emit('resize');
  assert.equal(harness.world.getAttribute('viewBox'), '0 0 800 340');
  expectOpen(harness, 0);

  // A 15px scrollbar reduces the available layout width below innerWidth.
  harness.window.innerWidth = 320;
  harness.document.documentElement.clientWidth = 305;
  popup.rect.width = 320;
  button.rect = { left: 230, top: 100, bottom: 140, width: 80, height: 40 };
  harness.window.emit('resize');
  assert.equal(popup.style.maxWidth, '281px');
  assert.equal(popup.getBoundingClientRect().width, 281);
  assert.equal(parseFloat(popup.style.left), 12);
  assert.equal(parseFloat(popup.style.left) + popup.getBoundingClientRect().width, 305 - 12);
  expectOpen(harness, 0);
});

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

test('static rendering includes all readable details and valid paper links before enhancement', () => {
  const html = renderCollaborationMap(data, publications);
  assert.match(html, /aria-labelledby="collaboration-map-title collaboration-map-description"/);
  assert.match(html, /class="collaboration-controls"[^>]* hidden/);
  assert.equal((html.match(/class="collaboration-detail"/g) || []).length, 2);
  assert.doesNotMatch(html, /class="collaboration-detail"[^>]* hidden/);
  assert.match(html, /href="#pub-physguard">PhysGuard<\/a>/);
  assert.match(html, /href="#pub-trace">TRACE<\/a>/);
  assert.match(html, /class="collaboration-land" d="M/);
});

test('renderer escapes content and rejects unsafe institution URLs and broken paper ids', () => {
  const modified = structuredClone(data);
  modified.locations[0].city = '<Singapore & friends>';
  modified.locations[0].institutions[0].collaborators[0].name = '"A" <B>';
  assert.match(renderCollaborationMap(modified, publications), /&lt;Singapore &amp; friends&gt;/);
  assert.match(renderCollaborationMap(modified, publications), /&quot;A&quot; &lt;B&gt;/);
  modified.locations[0].institutions[0].url = 'javascript:alert(1)';
  assert.throws(() => renderCollaborationMap(modified, publications), /HTTPS/);
  modified.locations[0].institutions[0].url = 'https://nus.edu.sg/';
  modified.locations[0].institutions[0].collaborators[0].papers = [{ id: 'missing', roles: ['coauthor'] }];
  assert.throws(() => renderCollaborationMap(modified, publications), /Unknown collaboration paper/);
  delete modified.home.id;
  assert.throws(() => renderCollaborationMap(modified, publications), /unique slugs/);
});

test('coauthors at the same institution share one paper link', () => {
  const modified = structuredClone(data);
  modified.locations[0].institutions[0].collaborators.push({ name: 'Another coauthor', papers: [{ id: 'physguard', roles: ['corresponding'] }] });
  const html = renderCollaborationMap(modified, publications);
  assert.match(html, /collaboration-person">Junfeng Fang/);
  assert.match(html, /collaboration-person">Another coauthor/);
  assert.equal((html.match(/href="#pub-physguard"/g) || []).length, 1);
});

test('author roles remain attached to the correct paper and support first plus corresponding', () => {
  const modified = structuredClone(data);
  modified.locations = [modified.locations[0]];
  modified.locations[0].institutions[0].collaborators[0].papers = [
    { id: 'physguard', roles: ['first', 'corresponding'] },
    { id: 'trace', roles: ['coauthor'] }
  ];
  const html = renderCollaborationMap(modified, publications);
  const physguard = html.split('<a href="#pub-physguard">')[1].split('</ul></li>')[0];
  const trace = html.split('<a href="#pub-trace">')[1].split('</ul></li>')[0];
  assert.match(physguard, />First author<.*>Corresponding author</);
  assert.doesNotMatch(physguard, />Coauthor</);
  assert.match(trace, />Coauthor</);
  assert.doesNotMatch(trace, />First author<|>Corresponding author</);
  for (const roles of [[], ['lead'], ['coauthor', 'coauthor'], null]) {
    modified.locations[0].institutions[0].collaborators[0].papers[0].roles = roles;
    assert.throws(() => renderCollaborationMap(modified, publications), /paper roles/);
  }
});

test('Melbourne affiliations are selectable without a duplicate marker or self-connection', () => {
  const modified = structuredClone(data);
  modified.home.institutions = [{ name: 'The University of Melbourne', collaborators: [{ name: 'Negin Yousefpour', papers: [{ id: 'physguard', roles: ['corresponding'] }] }] }];
  const html = renderCollaborationMap(modified, publications);
  assert.equal((html.match(/class="collaboration-home"/g) || []).length, 1);
  assert.match(html, /class="collaboration-home" data-map-location="melbourne"/);
  assert.match(html, /data-collaboration-location="melbourne"[^>]*><span[^>]*>1<\/span>Melbourne/);
  assert.match(html, /data-collaboration-location="singapore"[^>]*><span[^>]*>2<\/span>Singapore/);
  assert.match(html, /data-collaboration-detail="melbourne"/);
  assert.equal((html.match(/class="collaboration-route"/g) || []).length, data.locations.length);
  assert.doesNotMatch(html, /class="collaboration-route" data-map-location="melbourne"/);
  assert.match(html, /Negin Yousefpour/);
  modified.locations = [];
  const localOnly = renderCollaborationMap(modified, publications);
  assert.match(localOnly, /data-collaboration-detail="melbourne"/);
  assert.doesNotMatch(localOnly, /class="collaboration-route"|Lines connect/);
});

test('label offsets move only the label and require two finite coordinates', () => {
  const modified = structuredClone(data);
  modified.locations[0].labelOffset = [-12, 4];
  modified.locations[1].labelOffset = [12, -4];
  const html = renderCollaborationMap(modified, publications);
  assert.match(html, /class="collaboration-marker-number" x="-12" y="4" text-anchor="end">1/);
  assert.match(html, /class="collaboration-marker-number" x="12" y="-4" text-anchor="start">2/);
  const [x, y] = projectCoordinate(data.locations[0].longitude, data.locations[0].latitude);
  assert.ok(html.includes(`transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"`));
  for (const invalid of [null, [-12], [-12, 4, 3], ['-12', 4], [NaN, 4], [Infinity, 4]]) {
    modified.locations[0].labelOffset = invalid;
    assert.throws(() => renderCollaborationMap(modified, publications), /labelOffset/);
  }
});

test('enhancement selects a city without moving focus or changing the URL', () => {
  const button = id => ({ dataset: { collaborationLocation: id }, textContent: id === 'singapore' ? '1Singapore' : '2Oslo', attributes: {}, listeners: {}, setAttribute(key, value) { this.attributes[key] = value; }, addEventListener(event, handler) { this.listeners[event] = handler; } });
  const buttons = [button('singapore'), button('oslo')];
  const details = buttons.map(button => ({ dataset: { collaborationDetail: button.dataset.collaborationLocation }, hidden: false }));
  const markers = buttons.map(button => ({ dataset: { mapLocation: button.dataset.collaborationLocation }, selected: false, classList: { toggle(name, value) { this.selected = value; } } }));
  const controls = { hidden: true };
  const status = { hidden: true, textContent: '' };
  const map = { querySelectorAll(selector) { return ({ '[data-collaboration-location]': buttons, '[data-collaboration-detail]': details, '[data-map-location]': markers })[selector]; }, querySelector(selector) { return selector === '.collaboration-controls' ? controls : status; } };
  const document = { querySelectorAll: () => [map], activeElement: buttons[1] };
  const location = { hash: '#collaborations' };
  vm.runInNewContext(readFileSync(new URL('../collaboration-map.js', import.meta.url), 'utf8'), { document, location });
  assert.equal(controls.hidden, false);
  assert.deepEqual(details.map(detail => detail.hidden), [false, true]);
  buttons[1].listeners.click();
  assert.deepEqual(details.map(detail => detail.hidden), [true, false]);
  assert.equal(buttons[1].attributes['aria-pressed'], 'true');
  assert.equal(markers[1].classList.selected, true);
  assert.equal(status.textContent, 'Showing coauthor affiliations in Oslo.');
  assert.equal(document.activeElement, buttons[1]);
  assert.equal(location.hash, '#collaborations');
});

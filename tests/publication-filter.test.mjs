import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const script = readFileSync(new URL('../app.js', import.meta.url), 'utf8');

// Exercise the actual browser script with the small DOM surface it uses.
class Element {
  constructor(id, dataset = {}, textContent = '') {
    Object.assign(this, { id, dataset, textContent, hidden: false });
    this.attributes = new Map();
    this.listeners = new Map();
    this.bounds = { top: 100, bottom: 140 };
    this.scrollCalls = [];
  }
  setAttribute(name, value) { this.attributes.set(name, value); }
  getAttribute(name) { return this.attributes.get(name); }
  hasAttribute(name) { return this.attributes.has(name); }
  querySelectorAll(selector) { return selector === 'video' ? (this.videos || []) : []; }
  addEventListener(type, handler) { this.listeners.set(type, handler); }
  click() { this.listeners.get('click')?.(); }
  getBoundingClientRect() { return this.bounds; }
  scrollIntoView(options) { this.scrollCalls.push(options); }
}

function page(topicLists, { hash = '', threshold = 12, initialCount = 8 } = {}) {
  const filters = ['all', 'physical-ai', 'engineering'].map((id, i) => new Element('', {
    publicationFilter: id,
    publicationLabel: ['All', 'Physical AI', 'Engineering & Mechanics'][i],
  }));
  filters.forEach(button => button.setAttribute('aria-controls', 'publication-list'));
  const articles = topicLists.map((topics, i) => new Element(`pub-${i}`, { topics }));
  const section = new Element('publications', { collapseThreshold: String(threshold), initialCount: String(initialCount) });
  const controls = new Element('publication-controls');
  controls.hidden = true;
  controls.querySelectorAll = () => filters;
  const list = new Element('publication-list');
  list.querySelectorAll = () => articles;
  const result = new Element('publication-result-count');
  result.setAttribute('role', 'status');
  result.setAttribute('aria-live', 'polite');
  result.setAttribute('aria-atomic', 'true');
  const showAll = new Element('publication-show-all');
  showAll.hidden = true;
  const elements = new Map([section, controls, list, result, showAll].map(element => [element.id, element]));
  const windowListeners = new Map();
  const documentListeners = new Map();
  const frames = [];
  const document = {
    querySelectorAll: () => [],
    getElementById: id => elements.get(id),
    documentElement: { scrollHeight: 3000 },
    activeElement: null,
    addEventListener: (type, listener) => documentListeners.set(type, listener),
  };
  const window = {
    location: { hash }, innerHeight: 900, scrollY: 0,
    addEventListener: (type, listener) => windowListeners.set(type, listener),
  };
  const flush = () => { while (frames.length) frames.shift()(); };
  runInNewContext(script, { document, window, requestAnimationFrame: callback => frames.push(callback) });
  flush();
  return {
    filters, articles, controls, result, showAll, document, window,
    visible: () => articles.filter(article => !article.hidden).map(article => article.id),
    clickFilter(id) {
      const button = filters.find(filter => filter.dataset.publicationFilter === id);
      document.activeElement = button;
      button.click();
      flush();
    },
    clickMore() { document.activeElement = showAll; showAll.click(); flush(); },
    setHash(value) { window.location.hash = value; windowListeners.get('hashchange')(); flush(); },
    clickAnchor(href, { target, ...options } = {}) {
      const anchor = new Element('');
      anchor.setAttribute('href', href);
      if (target) anchor.setAttribute('target', target);
      const event = {
        button: 0, defaultPrevented: false,
        target: { closest: () => href.startsWith('#') ? anchor : null },
        preventDefault() { this.defaultPrevented = true; },
        ...options,
      };
      documentListeners.get('click')(event);
      flush();
      return event;
    },
  };
}

test('seven publications stay visible initially, with accessible filter state', () => {
  const p = page(['physical-ai', 'physical-ai', ...Array(5).fill('engineering')]);
  assert.equal(p.visible().length, 7);
  assert.equal(p.controls.hidden, false);
  assert.equal(p.showAll.hidden, true);
  assert.equal(p.result.textContent, '7 publications · Newest first');
  assert.equal(p.result.getAttribute('aria-live'), 'polite');
  assert.equal(p.result.getAttribute('aria-atomic'), 'true');
  assert.deepEqual(p.filters.map(button => button.getAttribute('aria-pressed')), ['true', 'false', 'false']);
});

test('filters switch in place, retain focus and the URL, and support overlapping topics', () => {
  const p = page(['physical-ai', 'engineering', 'physical-ai engineering']);
  p.clickFilter('physical-ai');
  assert.deepEqual(p.visible(), ['pub-0', 'pub-2']);
  assert.equal(p.result.textContent, '2 publications · Physical AI');
  assert.equal(p.document.activeElement, p.filters[1]);
  assert.equal(p.window.location.hash, '');
  assert.deepEqual(p.filters.map(button => button.getAttribute('aria-pressed')), ['false', 'true', 'false']);
  assert.equal(p.articles.flatMap(article => article.scrollCalls).length, 0);
  p.clickFilter('engineering');
  assert.deepEqual(p.visible(), ['pub-1', 'pub-2']);
  p.clickFilter('all');
  assert.deepEqual(p.visible(), ['pub-0', 'pub-1', 'pub-2']);
});

test('empty and singular results have accurate text', () => {
  const p = page(['physical-ai']);
  p.clickFilter('engineering');
  assert.deepEqual(p.visible(), []);
  assert.equal(p.result.textContent, '0 publications · Engineering & Mechanics');
  p.clickFilter('physical-ai');
  assert.equal(p.result.textContent, '1 publication · Physical AI');
});

test('the threshold applies to the selected list, with explicit expansion and collapse', () => {
  const p = page([...Array(11).fill('engineering'), 'physical-ai']);
  assert.equal(p.visible().length, 8);
  assert.equal(p.result.textContent, 'Showing 8 of 12 publications · Newest first');
  assert.equal(p.showAll.textContent, 'Show all 12 publications');
  assert.equal(p.showAll.getAttribute('aria-expanded'), 'false');
  p.clickMore();
  assert.equal(p.visible().length, 12);
  assert.equal(p.showAll.textContent, 'Show fewer');
  assert.equal(p.showAll.getAttribute('aria-expanded'), 'true');
  assert.equal(p.showAll.hidden, false);
  p.clickFilter('all');
  assert.equal(p.visible().length, 12, 'clicking the active filter does not collapse an expanded list');
  p.clickMore();
  assert.equal(p.visible().length, 8);
  assert.equal(p.showAll.scrollCalls.length, 0, 'no scroll if the focused button remains in view');
  p.clickFilter('engineering');
  assert.equal(p.visible().length, 11, 'eleven matches are not truncated');
  assert.equal(p.showAll.hidden, true);
  p.clickFilter('all');
  assert.equal(p.visible().length, 8, 'a newly selected long list starts collapsed');
});

test('collapsing only scrolls when the focused button has moved out of view, without animation', () => {
  const p = page(Array(24).fill('physical-ai'));
  p.clickMore();
  p.showAll.bounds = { top: -30, bottom: -10 };
  p.clickMore();
  assert.equal(p.visible().length, 8);
  assert.equal(p.showAll.scrollCalls.length, 1);
  assert.equal(p.showAll.scrollCalls[0].behavior, 'instant');
  assert.equal(p.showAll.scrollCalls[0].block, 'nearest');
  assert.equal(p.controls.scrollCalls.length, 0, 'the focused button, rather than the controls, stays in view');
  assert.equal(p.document.activeElement, p.showAll);
});

test('publication links reveal hidden items on initial load and hash changes', () => {
  const p = page([...Array(11).fill('physical-ai'), 'engineering'], { hash: '#pub-11' });
  assert.equal(p.visible().length, 12);
  assert.equal(p.articles[11].scrollCalls.length, 1);
  assert.equal(p.showAll.getAttribute('aria-expanded'), 'true');
  p.clickFilter('physical-ai');
  assert.equal(p.articles[11].hidden, true);
  p.setHash('#pub-11');
  assert.equal(p.articles[11].hidden, false);
  assert.equal(p.filters[0].getAttribute('aria-pressed'), 'true');
  p.setHash('#pub-0');
  assert.equal(p.visible().length, 8, 'an early linked item does not require expansion');
  assert.equal(p.articles[0].scrollCalls.length, 1);
});

test('unrelated, missing and malformed anchors do not change the selected view', () => {
  const p = page(['physical-ai', 'engineering']);
  p.clickFilter('engineering');
  for (const hash of ['#research', '#pub-missing', '#%', '']) {
    p.setHash(hash);
    assert.deepEqual(p.visible(), ['pub-1']);
    assert.equal(p.filters[2].getAttribute('aria-pressed'), 'true');
  }
});

test('clicking an unchanged publication fragment reveals a paper hidden by a later filter', () => {
  const p = page(['physical-ai', 'engineering'], { hash: '#pub-0' });
  p.clickFilter('engineering');
  assert.equal(p.articles[0].hidden, true);
  const event = p.clickAnchor('#pub-0');
  assert.equal(p.articles[0].hidden, false);
  assert.equal(p.filters[0].getAttribute('aria-pressed'), 'true');
  assert.equal(p.articles[0].scrollCalls.length, 2);
  assert.equal(p.window.location.hash, '#pub-0');
  assert.equal(event.defaultPrevented, false, 'native anchor navigation is retained');
});

test('anchor handling leaves modified clicks and other navigation untouched', () => {
  const p = page(['physical-ai', 'engineering'], { hash: '#pub-0' });
  p.clickFilter('engineering');
  for (const options of [{ ctrlKey: true }, { metaKey: true }, { shiftKey: true }, { altKey: true }, { button: 1 }, { target: '_blank' }, { defaultPrevented: true }]) {
    p.clickAnchor('#pub-0', options);
    assert.equal(p.articles[0].hidden, true);
  }
  for (const href of ['#research', '#pub-missing', '#%', 'https://example.com/#pub-0']) {
    const event = p.clickAnchor(href);
    assert.equal(p.articles[0].hidden, true);
    assert.equal(event.defaultPrevented, false);
  }
});

function playingVideo() {
  return {
    paused: false,
    pauseCalls: 0,
    pause() { this.paused = true; this.pauseCalls += 1; },
    play() { throw new Error('Showing a publication must not autoplay its video'); },
  };
}

test('filtering pauses videos that become hidden and never resumes them automatically', () => {
  const p = page(['physical-ai', 'engineering']);
  const physicalVideo = playingVideo();
  const engineeringVideo = playingVideo();
  p.articles[0].videos = [physicalVideo];
  p.articles[1].videos = [engineeringVideo];
  p.clickFilter('engineering');
  assert.equal(physicalVideo.paused, true);
  assert.equal(physicalVideo.pauseCalls, 1);
  assert.equal(engineeringVideo.paused, false, 'a video in a visible paper keeps playing');
  p.clickFilter('all');
  assert.equal(physicalVideo.paused, true);
  assert.equal(physicalVideo.pauseCalls, 1);
});

test('collapsing a long list pauses a playing video in a newly hidden paper', () => {
  const p = page(Array(12).fill('physical-ai'));
  p.clickMore();
  const video = playingVideo();
  p.articles[11].videos = [video];
  p.clickMore();
  assert.equal(p.articles[11].hidden, true);
  assert.equal(video.pauseCalls, 1);
  p.clickMore();
  assert.equal(p.articles[11].hidden, false);
  assert.equal(video.paused, true);
  assert.equal(video.pauseCalls, 1);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { renderPublicationMedia } from '../lib/publication-media.mjs';

const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const helpers = { esc, href: esc, assetUrl: path => `${path}?v=abc123` };
const paper = { title: 'TRACE: Contact memory', tags: ['Learned Simulation'], links: { paper: 'https://arxiv.org/abs/example' } };
const render = media => renderPublicationMedia({ ...paper, media }, helpers);

test('no-media fallback is clearly a paper link, with no invented figure', () => {
  const html = render();
  assert.match(html, /publication-visual is-placeholder/);
  assert.match(html, />Paper<\/span>/);
  assert.match(html, />TRACE<\/strong>/);
  assert.match(html, /aria-label="Read TRACE: Contact memory"/);
  assert.doesNotMatch(html, /<(img|video|svg)/);
});

test('images are lazy-loaded local assets, with escaped alt text and caption', () => {
  const html = render({ type: 'image', src: './assets/publications/trace.png', alt: 'Graph "A" <B>', caption: '<script>diagram</script>' });
  assert.match(html, /src="\.\/assets\/publications\/trace.png\?v=abc123"/);
  assert.match(html, /alt="Graph &quot;A&quot; &lt;B&gt;"/);
  assert.match(html, /loading="lazy" decoding="async"/);
  assert.match(html, /&lt;script&gt;diagram&lt;\/script&gt;/);
  assert.doesNotMatch(html, /<script>/);
});

test('video has native controls, no eager loading or autoplay, and supports captions', () => {
  const html = render({ type: 'video', src: './assets/publications/trace.mp4', poster: './assets/publications/trace.png', alt: 'Granular column collapse', hasSpokenAudio: true, captions: { src: './assets/publications/trace-en.vtt', srclang: 'en', label: 'English' } });
  assert.match(html, /<video controls playsinline preload="none"/);
  assert.match(html, /poster="\.\/assets\/publications\/trace.png\?v=abc123"/);
  assert.match(html, /type="video\/mp4"/);
  assert.match(html, /<track kind="captions"[^>]+srclang="en" label="English" default>/);
  assert.doesNotMatch(html, /autoplay|<iframe|loop=/);
});

test('unsupported types, external assets, path traversal and missing accessibility text fail the build', () => {
  for (const src of ['https://example.com/pixel.png', '//example.com/pixel.png', 'javascript:alert(1)', './assets/publications/../private.png', './assets/publications/test.svg', './assets/publications/pic.png?tracking=1']) {
    assert.throws(() => render({ type: 'image', src, alt: 'Diagram' }), /supported local file/);
  }
  assert.throws(() => render({ type: 'iframe', src: 'https://youtube.com/embed/abc', alt: 'Video' }), /Unsupported/);
  assert.throws(() => render({ type: 'image', src: './assets/publications/test.png', alt: '' }), /alt text/);
  assert.throws(() => render({ type: 'video', src: './assets/publications/test.mp4', alt: 'Narrated demo', hasSpokenAudio: true }), /captions track/);
});

// Local publication previews only: no third-party players or background requests.
const imageExtensions = /\.(?:png|jpe?g|webp|avif)$/i;
const videoTypes = { mp4: 'video/mp4', webm: 'video/webm', ogv: 'video/ogg' };

function localSource(value, extensions, label) {
  if (typeof value !== 'string' || !/^(?:\.\/)?assets\/publications\/[a-zA-Z0-9_./-]+$/.test(value)
      || value.split('/').includes('..') || !extensions.test(value)) {
    throw new Error(`${label} must be a supported local file in assets/publications/.`);
  }
  return value;
}

export function renderPublicationMedia(item, { assetUrl, href, esc }) {
  const paperUrl = item.links?.paper || item.links?.project || item.links?.code;
  const paperLink = (body, css) => paperUrl
    ? `<a class="${css}" href="${href(paperUrl)}" aria-label="${esc(`Read ${item.title}`)}">${body}</a>`
    : `<div class="${css}">${body}</div>`;
  const media = item.media;
  if (!media) {
    const firstPhrase = String(item.title || '').split(':')[0];
    const shortTitle = item.shortTitle || (firstPhrase.length <= 40 ? firstPhrase : item.tags?.[0]) || 'Research';
    const topic = item.tags?.find(tag => tag !== shortTitle);
    return `<figure class="publication-visual is-placeholder">${paperLink(`<span class="publication-placeholder-label">Paper</span><strong class="publication-placeholder-title">${esc(shortTitle)}</strong>${topic ? `<span class="publication-placeholder-topic">${esc(topic)}</span>` : ''}`, 'publication-placeholder')}</figure>`;
  }
  if (!['image', 'video'].includes(media.type)) throw new Error(`Unsupported publication media type: ${media.type}`);
  if (typeof media.alt !== 'string' || !media.alt.trim()) throw new Error('Publication media needs descriptive alt text.');
  const caption = media.caption ? `<figcaption class="publication-caption">${esc(media.caption)}</figcaption>` : '';
  if (media.type === 'image') {
    const src = localSource(media.src, imageExtensions, 'Publication image');
    return `<figure class="publication-visual">${paperLink(`<img src="${href(assetUrl(src))}" alt="${esc(media.alt)}" loading="lazy" decoding="async">`, 'publication-media-link')}${caption}</figure>`;
  }
  const src = localSource(media.src, /\.(?:mp4|webm|ogv)$/i, 'Publication video');
  const poster = media.poster ? ` poster="${href(assetUrl(localSource(media.poster, imageExtensions, 'Video poster')))}"` : '';
  if (media.hasSpokenAudio && !media.captions) throw new Error('Videos with spoken audio need a captions track.');
  let track = '';
  if (media.captions) {
    const captions = media.captions;
    if (!/^[a-z]{2,3}(?:-[a-zA-Z0-9]{2,8})*$/.test(captions.srclang || '') || !captions.label?.trim()) {
      throw new Error('Video captions need a language code and label.');
    }
    track = `<track kind="captions" src="${href(assetUrl(localSource(captions.src, /\.vtt$/i, 'Video captions')))}" srclang="${esc(captions.srclang)}" label="${esc(captions.label)}" default>`;
  }
  const type = videoTypes[src.split('.').pop().toLowerCase()];
  return `<figure class="publication-visual"><video controls playsinline preload="none"${poster} aria-label="${esc(media.alt)}"><source src="${href(assetUrl(src))}" type="${type}">${track}<a href="${href(assetUrl(src))}">Download video</a></video>${caption}</figure>`;
}

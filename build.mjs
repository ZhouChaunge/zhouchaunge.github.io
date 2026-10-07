// Generate a complete, searchable page from content.js. No dependencies required.
import { readFileSync, writeFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { createHash } from 'node:crypto';
import { renderPublicationMedia } from './lib/publication-media.mjs';
import { renderCollaborationMap } from './lib/collaboration-map.mjs';
import { prepareCollaborationMap } from './lib/collaboration-selection.mjs';

const root = new URL('./', import.meta.url);
const context = { window: {} };
runInNewContext(readFileSync(new URL('content.js', root), 'utf8'), context);
const p = context.window.ACADEMIC_PROFILE;
const assetUrl = path => `${path}?v=${createHash('sha256').update(readFileSync(new URL(path, root))).digest('hex').slice(0, 10)}`;
if (!p?.name || !p?.website) throw new Error('The profile needs a name and website.');
const topics = p.publicationTopics || [];
const topicIds = new Set(topics.map(topic => topic.id));
const paperIds = new Set();
if (topicIds.size !== topics.length || topics.some(topic => !/^[a-z][a-z0-9-]*$/.test(topic.id) || topic.id === 'all' || !topic.label)) {
  throw new Error('Publication topics need unique ids and labels.');
}
const publications = [...(p.publications || [])].sort((a, b) => Number(b.year) - Number(a.year));
for (const item of publications) {
  if (!/^[a-z][a-z0-9-]*$/.test(item.id) || paperIds.has(item.id)) throw new Error(`Invalid or repeated publication id: ${item.id}`);
  if (!/^\d{4}$/.test(String(item.year))) throw new Error(`Invalid publication year: ${item.title}`);
  if (!Array.isArray(item.topics) || !item.topics.length || item.topics.some(topic => !topicIds.has(topic))) {
    throw new Error(`Unknown or missing topic for: ${item.title}`);
  }
  if (!Array.isArray(item.tags) || item.tags.length < 1 || item.tags.length > 2 || item.tags.some(tag => typeof tag !== 'string' || !tag.trim())) {
    throw new Error(`Add one or two descriptive tags to: ${item.title}`);
  }
  paperIds.add(item.id);
}
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const href = value => {
  const url = new URL(value, p.website);
  if (!['https:', 'http:', 'mailto:'].includes(url.protocol)) throw new Error(`Unsupported URL: ${value}`);
  return esc(value);
};
const link = (text, url, css = '') => `<a${css ? ` class="${esc(css)}"` : ''} href="${href(url)}">${esc(text)}</a>`;
const authors = value => esc(value).split(esc(p.name)).join(`<strong>${esc(p.name)}</strong>`);
const aboutText = text => {
  const people = new Map(p.people.map(person => [person.name, person.url]));
  const names = [...people.keys()].map(name => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  return text.split(new RegExp(`(${names.join('|')})`, 'g')).map(part => people.has(part) ? link(part, people.get(part)) : esc(part)).join('');
};
const linkLabels = { paper: 'Paper', code: 'Code', video: 'Watch video', conference: 'Conference', review: 'OpenReview', simulations: 'Abaqus tools', project: 'Project', data: 'Data' };
const publication = item => `<article class="publication" id="pub-${esc(item.id)}" data-topics="${esc(item.topics.join(' '))}" aria-labelledby="pub-title-${esc(item.id)}">
  <div class="publication-preview"><span class="publication-year">${esc(item.year)}</span>${renderPublicationMedia(item, { assetUrl, href, esc })}</div>
  <div class="publication-body">
    <h3 id="pub-title-${esc(item.id)}">${esc(item.title)}</h3>
    <p class="publication-authors">${authors(item.authors)}</p>
    <p class="publication-venue">${esc(item.venue)}${item.status ? ` <span class="publication-status${item.status === 'Preprint' ? ' is-preprint' : ''}">${esc(item.status)}</span>` : ''}</p>
    <ul class="publication-tags" aria-label="Paper topics">${item.tags.map(tag => `<li>${esc(tag)}</li>`).join(' ')}</ul>
    <div class="publication-links">${Object.entries(item.links || {}).map(([key, url]) => link(linkLabels[key] || key, url)).join(' ')}</div>
  </div>
</article>`;
const sections = [['about', 'About Me'], ['background', 'Education & Work'], ['research', 'Research'], ['publications', 'Publications'], ['honors', 'Honors'], ['collaborations', 'Collaborations']];
const experienceTypes = new Set(['Education', 'Research', 'Industry']);
for (const item of p.experience) {
  if (!experienceTypes.has(item.type)) throw new Error(`Unknown experience type: ${item.institution}`);
}
const filters = [{ id: 'all', label: 'All' }, ...topics].map(topic => {
  const count = topic.id === 'all' ? publications.length : publications.filter(item => item.topics.includes(topic.id)).length;
  return `<button type="button" class="publication-filter" data-publication-filter="${esc(topic.id)}" data-publication-label="${esc(topic.label)}" aria-pressed="${topic.id === 'all'}" aria-controls="publication-list">${esc(topic.label)} <span class="filter-count">${count}</span></button>`;
}).join('\n          ');
const structuredData = {
  '@context': 'https://schema.org', '@type': 'Person', name: p.name, alternateName: p.nativeName,
  url: p.website, image: new URL(p.photo, p.website).href, jobTitle: p.position,
  affiliation: { '@type': 'CollegeOrUniversity', name: p.institution },
  sameAs: Object.values(p.links), email: `mailto:${p.email}`
};
const collaborationMap = prepareCollaborationMap(p.collaborations, publications, p.name);

const html = `<!doctype html>
<!-- Generated by node build.mjs. Edit content.js for profile changes. -->
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${esc(p.description)}">
  ${p.draft ? '<meta name="robots" content="noindex, nofollow">' : '<meta name="robots" content="index, follow">'}
  <meta name="color-scheme" content="light">
  <title>${esc(p.name)} | Academic Homepage</title>
  <link rel="canonical" href="${href(p.website)}">
  <meta property="og:type" content="profile">
  <meta property="og:title" content="${esc(p.name)} | Academic Homepage">
  <meta property="og:description" content="${esc(p.description)}">
  <meta property="og:url" content="${href(p.website)}">
  <meta property="og:image" content="${href(new URL(p.photo, p.website).href)}">
  <meta name="twitter:card" content="summary">
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' rx='10' fill='%23043361'/%3E%3Ctext x='20' y='27' text-anchor='middle' font-family='sans-serif' font-size='23' fill='white'%3EC%3C/text%3E%3C/svg%3E">
  <link rel="preload" href="./assets/fonts/nunito-regular.ttf" as="font" type="font/ttf" crossorigin>
  <link rel="stylesheet" href="${assetUrl('./styles.css')}">
  <link rel="stylesheet" href="${assetUrl('./collaboration-map.css')}">
  <script type="application/ld+json">${JSON.stringify(structuredData).replace(/</g, '\\u003c')}</script>
  <script src="${assetUrl('./app.js')}" defer></script>
  <script src="${assetUrl('./collaboration-map.js')}" defer></script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  ${p.draft ? '<div class="draft-notice">This homepage is a draft.</div>' : ''}
  <div class="page-layout">
    <aside class="profile" aria-label="Researcher profile">
      <div class="portrait"><img src="${href(assetUrl(p.photo))}" alt="${esc(p.name)} beside a mountain lake" width="300" height="300" fetchpriority="high"></div>
      <div class="profile-details">
        <h1>${esc(p.name)}</h1>
        <p class="native-name" lang="zh-Hans">${esc(p.nativeName)}</p>
        <p class="position">${esc(p.position)}</p>
        <p class="institution">${link(p.institution, p.links.faculty)}</p>
        <p class="location">${esc(p.location)}</p>
        <div class="profile-links">${link('Email', `mailto:${p.email}`)} ${link('Google Scholar', p.links.scholar)} ${link('ORCID', p.links.orcid)} ${link('GitHub', p.links.github)} ${link('LinkedIn', p.links.linkedin)}</div>
        ${link('Download CV ↗', assetUrl(p.cv), 'cv-link')}
      </div>
      <nav class="profile-nav" aria-label="Main navigation">
        ${sections.map(([id, label], i) => `<a class="nav-link${i === 0 ? ' active' : ''}" href="#${id}"${i === 0 ? ' aria-current="location"' : ''}>${label}</a>`).join('\n        ')}
      </nav>
    </aside>
    <main id="main">
      <section class="about section" id="about" aria-labelledby="about-heading">
        <h2 id="about-heading">About Me</h2>
        <div class="about-copy">${p.about.map(text => `<p>${aboutText(text)}</p>`).join('\n        ')}</div>
      </section>
      <section class="section" id="background" aria-labelledby="background-heading">
        <h2 id="background-heading">Education &amp; Experience</h2>
        <div class="timeline">${p.experience.map(item => `<article class="timeline-item"><span class="timeline-years">${esc(item.years)}</span><div><div class="timeline-title"><h3>${esc(item.institution)}</h3><span class="experience-type is-${esc(item.type.toLowerCase())}">${esc(item.type)}</span>${item.employment ? `<span class="experience-type">${esc(item.employment)}</span>` : ''}</div><p>${esc(item.role)}</p>${item.detail ? `<p class="timeline-detail">${esc(item.detail)}</p>` : ''}</div></article>`).join('\n        ')}</div>
      </section>
      <section class="section" id="research" aria-labelledby="research-heading">
        <h2 id="research-heading">Research Interests</h2>
        <ul class="research-list">${p.research.map(item => `<li class="research-item"><strong>${esc(item.title)}.</strong> ${esc(item.description)}</li>`).join('\n        ')}</ul>
      </section>
      <section class="section" id="publications" aria-labelledby="publications-heading" data-collapse-threshold="12" data-initial-count="8">
        <div class="section-title-row"><h2 id="publications-heading">Publications</h2>${link('Google Scholar ↗', p.links.scholar, 'text-link')}</div>
        <div class="publication-controls" id="publication-controls" hidden>
          <div class="publication-filters" role="group" aria-label="Filter publications by research area">${filters}</div>
          <p class="publication-result-count" id="publication-result-count" role="status" aria-live="polite" aria-atomic="true">${publications.length} publications · Newest first</p>
        </div>
        <div class="publication-list" id="publication-list">${publications.map(publication).join('\n        ')}</div>
        <button type="button" class="publication-show-all" id="publication-show-all" aria-controls="publication-list" hidden>Show all publications</button>
        <details class="research-software" id="software">
          <summary>Research software &amp; open-source contributions</summary>
          <div class="software-list">${p.projects.map(item => `<article class="software-item"><h3>${link(item.title, item.url)} <span class="project-label">${esc(item.label)}</span></h3><p>${esc(item.description)}</p></article>`).join('\n          ')}</div>
          <p class="contributions">I also contribute to ${p.contributions.map(item => `${link(item.name, item.url)} (${esc(item.description)})`).join(' and ')}.</p>
        </details>
      </section>
      <section class="section" id="honors" aria-labelledby="honors-heading">
        <h2 id="honors-heading">Selected Honors</h2>
        <ul class="awards-list">${p.awards.map(item => `<li>${esc(item.title)}${item.institution ? `, ${esc(item.institution)}` : ''}${item.year ? ` <span class="award-year">(${esc(item.year)})</span>` : ''}.</li>`).join('\n        ')}</ul>
      </section>
      <section class="section" id="collaborations" aria-labelledby="collaborations-heading">
        <h2 id="collaborations-heading">Research Collaborations</h2>
        <p class="section-intro">Institutions represented in my coauthored research.</p>
        ${renderCollaborationMap(collaborationMap, publications)}
      </section>
      <div class="contact-note" id="contact"><p>${esc(p.contactIntro)} ${link('Get in touch ↗', `mailto:${p.email}`)}</p></div>
      <footer class="site-footer"><span>${esc(p.name)} · Updated ${esc(p.updated)}</span><a href="#about">Back to top ↑</a></footer>
    </main>
  </div>
</body>
</html>
`;
writeFileSync(new URL('index.html', root), html.replace(/^[\t ]+$/gm, ''));
writeFileSync(new URL('robots.txt', root), `User-agent: *\n${p.draft ? 'Disallow: /' : 'Allow: /'}\nSitemap: ${p.website}sitemap.xml\n`);
writeFileSync(new URL('sitemap.xml', root), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${esc(p.website)}</loc></url></urlset>\n`);
console.log(`Generated homepage for ${p.name}: ${publications.length} papers across ${topics.length} research areas.`);

(() => {
  'use strict';
  const profile = window.ACADEMIC_PROFILE;
  if (!profile) return;
  const byId = id => document.getElementById(id);
  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const safeUrl = value => {
    if (typeof value !== 'string' || !value.trim()) return null;
    try {
      const url = new URL(value, document.baseURI);
      return ['https:', 'http:', 'file:'].includes(url.protocol) ? url.href : null;
    } catch { return null; }
  };
  const setLink = (node, value) => {
    const href = safeUrl(value);
    node.hidden = !href;
    if (!href) return false;
    node.href = href;
    if (new URL(href).origin !== location.origin) {
      node.target = '_blank';
      node.rel = 'noopener noreferrer';
    }
    return true;
  };
  const fill = (id, text) => { byId(id).textContent = text || ''; };
  document.title = `${profile.name || 'Academic Homepage'} | Academic Homepage`;
  document.querySelector('meta[name="description"]').content = profile.description || '';
  byId('draft-notice').hidden = profile.draft !== true;
  if (profile.draft === false) document.querySelector('meta[name="robots"]')?.remove();
  fill('profile-name', profile.name);
  fill('native-name', profile.nativeName);
  byId('native-name').hidden = !profile.nativeName;
  fill('monogram', profile.initials || (profile.name || '').split(/\s+/).slice(0, 2).map(n => n[0]).join(''));
  for (const key of ['position', 'institution', 'location']) {
    fill(key, profile[key]);
    byId(key).hidden = !profile[key];
  }
  fill('footer-name', profile.name);
  fill('contact-affiliation', profile.institution);
  fill('contact-intro', profile.contactIntro);
  byId('contact-intro').hidden = !profile.contactIntro;
  const photo = safeUrl(profile.photo);
  if (photo) {
    const img = element('img');
    img.alt = `Portrait of ${profile.name}`;
    img.width = 196;
    img.height = 220;
    img.addEventListener('load', () => byId('portrait').replaceChildren(img), { once: true });
    img.src = photo;
  }
  const about = Array.isArray(profile.about) ? profile.about : [];
  byId('about-copy').replaceChildren(...about.map((text, index) => element('p', index === 0 ? 'lead' : '', text)));
  const interests = Array.isArray(profile.interests) ? profile.interests : [];
  byId('interests').replaceChildren(...interests.map(text => element('span', 'interest', text)));
  byId('interests').hidden = interests.length === 0;
  const research = Array.isArray(profile.research) ? profile.research : [];
  byId('research-grid').replaceChildren(...research.map(item => {
    const row = element('li', 'research-item');
    row.append(element('strong', '', item.title), document.createTextNode(`: ${item.description || ''}`));
    return row;
  }));
  if (research.length === 0) {
    byId('research').hidden = true;
    document.querySelector('nav a[href="#research"]').hidden = true;
  }
  const links = profile.links || {};
  const profileLinks = byId('profile-links');
  for (const [key, label] of Object.entries({ scholar: 'Google Scholar', orcid: 'ORCID', github: 'GitHub' })) {
    const link = element('a', '', label);
    if (setLink(link, links[key])) profileLinks.append(link);
  }
  profileLinks.hidden = profileLinks.children.length === 0;
  setLink(byId('cv-link'), profile.cv);
  setLink(byId('all-publications'), links.scholar);
  const publications = Array.isArray(profile.publications) ? profile.publications : [];
  byId('empty-publications').hidden = publications.length > 0;
  byId('publication-list').replaceChildren(...publications.map(item => {
    const article = element('article', 'publication');
    const body = element('div', 'publication-body');
    body.append(element('h3', '', item.title), element('p', 'publication-authors', item.authors));
    if (item.venue) body.append(element('p', 'publication-venue', item.venue));
    const resources = element('div', 'publication-links');
    for (const [key, label] of Object.entries({ paper: 'Paper', code: 'Code', data: 'Data', project: 'Project' })) {
      const link = element('a', '', label);
      if (setLink(link, (item.links || {})[key])) resources.append(link);
    }
    if (resources.children.length) body.append(resources);
    article.append(element('span', 'publication-year', item.year), body);
    return article;
  }));
  if (typeof profile.email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
    const email = element('a', '', profile.email);
    email.href = `mailto:${encodeURIComponent(profile.email)}`;
    byId('contact-email').replaceChildren(email);
  }
  const nav = [...document.querySelectorAll('.nav-link')].filter(link => !link.hidden);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (!visible) return;
      nav.forEach(link => {
        const active = link.hash === `#${visible.target.id}`;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-24px 0px -45% 0px', threshold: 0 });
    document.querySelectorAll('main .section:not([hidden])').forEach(section => observer.observe(section));
  }
})();

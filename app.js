// All content is present in index.html; JavaScript enhances navigation and filtering.
(() => {
  'use strict';
  const links = [...document.querySelectorAll('.nav-link')];
  const sections = links.map(link => document.querySelector(link.hash)).filter(Boolean);
  let scheduled = false;
  const update = () => {
    scheduled = false;
    let current = sections[0];
    if (!current) return;
    const atEnd = window.scrollY > 0 && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= 100) current = section;
    }
    if (atEnd) current = sections[sections.length - 1];
    for (const link of links) {
      const active = link.hash === '#' + current.id;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  };
  const schedule = () => {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(update);
    }
  };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  window.addEventListener('load', update);
  update();

  const publications = document.getElementById('publications');
  const controls = document.getElementById('publication-controls');
  const list = document.getElementById('publication-list');
  const resultCount = document.getElementById('publication-result-count');
  const showAll = document.getElementById('publication-show-all');
  if (!publications || !controls || !list || !resultCount || !showAll) return;

  const filters = [...controls.querySelectorAll('[data-publication-filter]')];
  const articles = [...list.querySelectorAll('.publication')];
  if (!filters.length) return;
  const threshold = Number(publications.dataset.collapseThreshold) || 12;
  const initialCount = Number(publications.dataset.initialCount) || 8;
  const topics = new Map(articles.map(article => [article, (article.dataset.topics || '').split(/\s+/).filter(Boolean)]));
  let selected = 'all';
  let expanded = false;

  const render = () => {
    const matches = articles.filter(article => selected === 'all' || topics.get(article).includes(selected));
    const canCollapse = matches.length >= threshold;
    const visible = new Set(canCollapse && !expanded ? matches.slice(0, initialCount) : matches);
    for (const article of articles) {
      const hidden = !visible.has(article);
      if (hidden && !article.hidden) {
        for (const video of article.querySelectorAll('video')) {
          if (!video.paused) video.pause();
        }
      }
      article.hidden = hidden;
    }
    let label = 'Newest first';
    for (const button of filters) {
      const active = button.dataset.publicationFilter === selected;
      button.setAttribute('aria-pressed', String(active));
      if (active && selected !== 'all') {
        label = button.dataset.publicationLabel || button.textContent.replace(/\s*\(\d+\)\s*$/, '').trim();
      }
    }
    const noun = matches.length === 1 ? 'publication' : 'publications';
    const count = visible.size < matches.length ? `Showing ${visible.size} of ${matches.length}` : String(matches.length);
    resultCount.textContent = `${count} ${noun} · ${label}`;
    showAll.hidden = !canCollapse;
    showAll.textContent = expanded ? 'Show fewer' : `Show all ${matches.length} publications`;
    showAll.setAttribute('aria-expanded', String(canCollapse && expanded));
    schedule();
  };

  for (const button of filters) {
    button.addEventListener('click', () => {
      if (selected === button.dataset.publicationFilter) return;
      selected = button.dataset.publicationFilter;
      expanded = false;
      render();
    });
  }

  showAll.addEventListener('click', () => {
    expanded = !expanded;
    render();
    if (!expanded) {
      const buttonBounds = showAll.getBoundingClientRect();
      if (buttonBounds.top < 0 || buttonBounds.bottom > window.innerHeight) {
        // Collapsing a long list can move the focused button off screen.
        // Instant scrolling also respects a preference for reduced motion.
        showAll.scrollIntoView({ block: 'nearest', behavior: 'instant' });
      }
    }
  });

  const revealLinkedPublication = (hash = window.location.hash) => {
    let id;
    try {
      id = decodeURIComponent(hash.slice(1));
    } catch {
      return;
    }
    const index = articles.findIndex(article => article.id === id);
    if (index < 0) return;
    selected = 'all';
    expanded = articles.length >= threshold && index >= initialCount;
    render();
    requestAnimationFrame(() => articles[index].scrollIntoView({ block: 'start', behavior: 'instant' }));
  };

  render();
  controls.hidden = false;
  window.addEventListener('hashchange', () => revealLinkedPublication());
  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = event.target.closest?.('a[href^="#"]');
    if (!anchor || anchor.hasAttribute('download')) return;
    const target = anchor.getAttribute('target');
    if (target && target !== '_self') return;
    // Clicking the current fragment does not emit hashchange. Reveal its paper
    // if a filter has since hidden it, while retaining native link navigation.
    const hash = anchor.getAttribute('href');
    if (hash === window.location.hash) revealLinkedPublication(hash);
  });
  revealLinkedPublication();
})();

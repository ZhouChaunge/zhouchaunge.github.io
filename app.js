// Content is already present in index.html; JavaScript only enhances navigation.
(() => {
  'use strict';
  const links = [...document.querySelectorAll('.nav-link')];
  const sections = links.map(link => document.querySelector(link.hash)).filter(Boolean);
  let scheduled = false;
  const update = () => {
    scheduled = false;
    let current = sections[0];
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
})();

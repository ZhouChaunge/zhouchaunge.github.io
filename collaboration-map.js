(() => {
  document.querySelectorAll('[data-collaboration-map]').forEach(map => {
    const buttons = Array.from(map.querySelectorAll('[data-collaboration-location]'));
    const popups = Array.from(map.querySelectorAll('[data-collaboration-popup]'));
    const markers = Array.from(map.querySelectorAll('[data-map-location]'));
    const points = Array.from(map.querySelectorAll('.collaboration-marker'));
    const world = map.querySelector('.collaboration-world');
    if (!buttons.length || !popups.length || !world) return;
    let activeButton = null;
    let activePopup = null;
    let pinned = false;
    let hoveredButton = null;
    let hoveringPopup = false;
    let closeTimer;

    const cancelClose = () => { clearTimeout(closeTimer); };
    function positionPopup() {
      if (!activeButton || !activePopup) return;
      const viewportWidth = document.documentElement?.clientWidth || window.innerWidth;
      const viewportHeight = document.documentElement?.clientHeight || window.innerHeight;
      activePopup.style.maxWidth = `${Math.max(0, Math.min(320, viewportWidth - 24))}px`;
      activePopup.style.maxHeight = `${Math.max(0, Math.min(300, viewportHeight - 24))}px`;
      const anchor = activeButton.getBoundingClientRect();
      const bounds = activePopup.getBoundingClientRect();
      const margin = 12;
      const left = Math.max(margin, Math.min(anchor.left + anchor.width / 2 - bounds.width / 2, viewportWidth - bounds.width - margin));
      const below = anchor.bottom + 9;
      const top = Math.max(margin, Math.min(below + bounds.height <= viewportHeight - margin ? below : anchor.top - bounds.height - 9, viewportHeight - bounds.height - margin));
      activePopup.style.left = `${left}px`;
      activePopup.style.top = `${top}px`;
    }
    function close() {
      cancelClose();
      buttons.forEach(button => { button.setAttribute('aria-expanded', 'false'); button.removeAttribute('aria-describedby'); });
      popups.forEach(popup => { popup.hidden = true; });
      markers.forEach(marker => marker.classList.toggle('is-selected', false));
      activeButton = null;
      activePopup = null;
      hoveringPopup = false;
      pinned = false;
    }
    function open(button, pin = false) {
      const popup = popups.find(item => item.dataset.collaborationPopup === button.dataset.collaborationLocation);
      if (!popup) return;
      cancelClose();
      if (popup !== activePopup) hoveringPopup = false;
      activeButton = button;
      activePopup = popup;
      pinned = pin;
      buttons.forEach(item => {
        item.setAttribute('aria-expanded', String(item === button));
        if (item === button) item.setAttribute('aria-describedby', popup.id);
        else item.removeAttribute('aria-describedby');
      });
      popups.forEach(item => { item.hidden = item !== popup; });
      markers.forEach(marker => marker.classList.toggle('is-selected', marker.dataset.mapLocation === button.dataset.collaborationLocation));
      positionPopup();
    }
    function scheduleClose() {
      cancelClose();
      closeTimer = setTimeout(() => {
        if (!pinned && !hoveringPopup && hoveredButton !== activeButton && document.activeElement !== activeButton) close();
      }, 100);
    }
    function resizeMap() {
      world.setAttribute('viewBox', window.innerWidth <= 540 ? '300 -25 500 400' : '0 0 800 340');
      positionPopup();
    }
    function wirePointerTarget(target, button) {
      target.addEventListener('pointerenter', event => {
        if (event.pointerType === 'touch') return;
        hoveredButton = button;
        if (!pinned) open(button);
      });
      target.addEventListener('pointerleave', event => {
        if (event.pointerType === 'touch') return;
        if (hoveredButton === button) hoveredButton = null;
        scheduleClose();
      });
      target.addEventListener('click', () => {
        if (activeButton === button && pinned) close();
        else open(button, true);
      });
    }
    buttons.forEach(button => {
      wirePointerTarget(button, button);
      button.addEventListener('focus', () => open(button));
      button.addEventListener('blur', scheduleClose);
      button.hidden = false;
    });
    points.forEach(point => {
      const button = buttons.find(item => item.dataset.collaborationLocation === point.dataset.mapLocation);
      if (button) wirePointerTarget(point, button);
    });
    popups.forEach(popup => {
      popup.addEventListener('pointerenter', () => { hoveringPopup = true; cancelClose(); });
      popup.addEventListener('pointerleave', () => { hoveringPopup = false; scheduleClose(); });
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && activePopup) { event.preventDefault(); close(); }
    });
    document.addEventListener('pointerdown', event => {
      const onActivePoint = activeButton && points.some(point => point.dataset.mapLocation === activeButton.dataset.collaborationLocation && point.contains(event.target));
      if (activePopup && !activePopup.contains(event.target) && !activeButton.contains(event.target) && !onActivePoint) close();
    });
    window.addEventListener('resize', resizeMap);
    window.addEventListener('scroll', positionPopup, { passive: true, capture: true });
    resizeMap();
  });
})();

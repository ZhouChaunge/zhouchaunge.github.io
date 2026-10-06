(() => {
  document.querySelectorAll('[data-collaboration-map]').forEach(map => {
    const buttons = Array.from(map.querySelectorAll('[data-collaboration-location]'));
    const details = Array.from(map.querySelectorAll('[data-collaboration-detail]'));
    const markers = Array.from(map.querySelectorAll('[data-map-location]'));
    const controls = map.querySelector('.collaboration-controls');
    const status = map.querySelector('.collaboration-selection-status');
    if (!buttons.length || !details.length || !controls || !status) return;

    function selectLocation(id, announce = true) {
      const selected = buttons.find(button => button.dataset.collaborationLocation === id);
      if (!selected || !details.some(detail => detail.dataset.collaborationDetail === id)) return;
      buttons.forEach(button => button.setAttribute('aria-pressed', String(button === selected)));
      details.forEach(detail => { detail.hidden = detail.dataset.collaborationDetail !== id; });
      markers.forEach(marker => marker.classList.toggle('is-selected', marker.dataset.mapLocation === id));
      if (announce) status.textContent = `Showing research collaborations in ${selected.textContent.trim().replace(/^\d+\s*/, '')}.`;
    }

    buttons.forEach(button => button.addEventListener('click', () => selectLocation(button.dataset.collaborationLocation)));
    selectLocation(buttons[0].dataset.collaborationLocation, false);
    controls.hidden = false;
    status.hidden = false;
  });
})();

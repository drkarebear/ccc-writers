(function () {
  const mapEl = document.querySelector('#journal-map');
  const loadButton = document.querySelector('#load-map');
  if (!mapEl || !loadButton) return;

  const LEAFLET_CSS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  const LEAFLET_JS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
  const LEAFLET_CSS_SRI = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
  const LEAFLET_JS_SRI = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';

  let map = null;
  let layer = null;
  let currentJournals = window.CCC_JOURNALS || [];

  const safeHttpsUrl = window.safeHttpsUrl || (() => '');

  function loadLeaflet() {
    if (window.L) return Promise.resolve();
    return new Promise((resolve, reject) => {
      if (!document.querySelector(`link[href="${LEAFLET_CSS}"]`)) {
        const css = document.createElement('link');
        css.rel = 'stylesheet';
        css.href = LEAFLET_CSS;
        css.integrity = LEAFLET_CSS_SRI;
        css.crossOrigin = 'anonymous';
        document.head.appendChild(css);
      }

      const existing = document.querySelector(`script[src="${LEAFLET_JS}"]`);
      if (existing) {
        existing.addEventListener('load', resolve, { once: true });
        existing.addEventListener('error', reject, { once: true });
        return;
      }

      const script = document.createElement('script');
      script.src = LEAFLET_JS;
      script.integrity = LEAFLET_JS_SRI;
      script.crossOrigin = 'anonymous';
      script.addEventListener('load', resolve, { once: true });
      script.addEventListener('error', reject, { once: true });
      document.head.appendChild(script);
    });
  }

  function makePopup(journal, status) {
    const container = document.createElement('div');
    const college = document.createElement('strong');
    college.textContent = journal.college || '';
    const title = document.createElement('em');
    title.textContent = journal.journal || '';
    const statusLine = document.createElement('span');
    statusLine.textContent = status.label || '';

    container.append(college, document.createElement('br'), title, document.createElement('br'), statusLine);

    const url = safeHttpsUrl(journal.journal_url);
    if (url) {
      container.append(document.createElement('br'));
      const link = document.createElement('a');
      link.href = url;
      link.textContent = 'Visit journal';
      container.append(link);
    }
    return container;
  }

  function draw(journals) {
    if (!map || !layer) return;
    layer.clearLayers();
    const markers = [];
    journals.forEach(j => {
      if (typeof j.latitude !== 'number' || typeof j.longitude !== 'number') return;
      const pinIcon = L.divIcon({
        className: 'journal-marker',
        html: '<span class="journal-pin-shape" aria-hidden="true"><span class="journal-pin-center"></span></span>',
        iconSize: [34, 42],
        iconAnchor: [17, 41],
        popupAnchor: [0, -35]
      });
      const marker = L.marker([j.latitude, j.longitude], {
        icon: pinIcon,
        title: `${j.college || ''}: ${j.journal || ''}`
      });
      marker.bindPopup(makePopup(j, submissionStatus(j)));
      marker.addTo(layer);
      markers.push(marker);
    });
    if (markers.length > 1) {
      const group = L.featureGroup(markers);
      map.fitBounds(group.getBounds().pad(.15));
    }
  }

  function initMap() {
    map = L.map(mapEl, { scrollWheelZoom: false }).setView([36.8, -119.7], 5.6);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(map);
    layer = L.layerGroup().addTo(map);
    draw(currentJournals);
  }

  document.addEventListener('ccc:journals-filtered', event => {
    currentJournals = event.detail || [];
    draw(currentJournals);
  });

  loadButton.addEventListener('click', async () => {
    loadButton.disabled = true;
    loadButton.textContent = 'Loading map…';
    mapEl.hidden = false;
    mapEl.setAttribute('aria-busy', 'true');
    try {
      await loadLeaflet();
      initMap();
      mapEl.setAttribute('aria-busy', 'false');
      loadButton.remove();
    } catch (error) {
      mapEl.hidden = true;
      mapEl.setAttribute('aria-busy', 'false');
      loadButton.disabled = false;
      loadButton.textContent = 'Try loading the map again';
      const message = document.createElement('p');
      message.className = 'small error-message';
      message.textContent = 'The map could not load. The journal directory below is still available.';
      loadButton.parentElement?.appendChild(message);
      console.error(error);
    }
  });
})();

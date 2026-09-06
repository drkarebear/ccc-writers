(function () {
  const mapEl = document.querySelector("#journal-map");
  if (!mapEl || typeof L === "undefined") return;

  const map = L.map(mapEl, { scrollWheelZoom: false }).setView([36.8, -119.7], 5.6);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
  }).addTo(map);

  const layer = L.layerGroup().addTo(map);

  const draw = journals => {
    layer.clearLayers();
    const markers = [];
    journals.forEach(j => {
      if (typeof j.latitude !== "number" || typeof j.longitude !== "number") return;
      const marker = L.marker([j.latitude, j.longitude]);
      const status = submissionStatus(j);
      marker.bindPopup(`
        <strong>${j.college}</strong><br>
        <em>${j.journal}</em><br>
        ${status.label}<br>
        ${j.journal_url ? `<a href="${j.journal_url}">Visit journal</a>` : ""}
      `);
      marker.addTo(layer);
      markers.push(marker);
    });
    if (markers.length > 1) {
      const group = L.featureGroup(markers);
      map.fitBounds(group.getBounds().pad(.15));
    }
  };

  document.addEventListener("ccc:journals-filtered", event => draw(event.detail));
  if (window.CCC_JOURNALS) draw(window.CCC_JOURNALS);
})();

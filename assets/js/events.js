(async function () {
  const list = document.querySelector("#event-list");
  if (!list) return;

  const upgradeCommunityEventLink = () => {
    const link = list.querySelector('[data-community-form-link]');
    if (!link) return;
    fetch('data/site-config.json')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(config => {
        const u = new URL((config.community_form_url || '').trim());
        if (u.protocol === 'https:' && u.hostname === 'docs.google.com') link.href = u.href;
      })
      .catch(() => {});
  };
  try {
    const events = await (await fetch("data/events.json")).json();
    const today = new Date();
    const upcoming = events.filter(event => new Date(`${event.date}T23:59:59`) >= today)
      .sort((a,b) => a.date.localeCompare(b.date));
    if (!upcoming.length) {
      list.innerHTML = `<div class="empty-state"><h3>No verified upcoming events yet.</h3><p>This is the part we’ll populate through community submissions.</p><a class="button" data-community-form-link href="contribute.html">Share an event</a></div>`;
      upgradeCommunityEventLink();
      return;
    }
    list.innerHTML = upcoming.map(event => {
      const url = safeHttpsUrl(event.url);
      const title = escapeHTML(event.title);
      return `
      <article class="event-card">
        <div class="meta"><span>${escapeHTML(formatDate(event.date))}</span><span>${escapeHTML(event.format)}</span></div>
        <h3>${title}</h3>
        <p><strong>${escapeHTML(event.host)}</strong></p>
        ${event.time ? `<p><strong>Time:</strong> ${escapeHTML(event.time)}</p>` : ""}
        <p><strong>Location:</strong> ${escapeHTML(event.location)}</p>
        ${event.audience ? `<p>${escapeHTML(event.audience)}</p>` : ""}
        ${event.summary ? `<p>${escapeHTML(event.summary)}</p>` : ""}
        ${url ? `<a class="button secondary" href="${escapeHTML(url)}" aria-label="Event details for ${title}">Event details</a>` : ""}
      </article>`;
    }).join("");
  } catch (error) {
    list.innerHTML = `<div class="empty-state"><h3>Event data could not load.</h3></div>`;
    console.error(error);
  }
})();

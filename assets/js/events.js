(async function () {
  const list = document.querySelector("#event-list");
  if (!list) return;
  try {
    const events = await (await fetch("data/events.json")).json();
    const today = new Date();
    const upcoming = events.filter(event => new Date(`${event.date}T23:59:59`) >= today)
      .sort((a,b) => a.date.localeCompare(b.date));
    if (!upcoming.length) {
      list.innerHTML = `<div class="empty-state"><h3>No verified upcoming events yet.</h3><p>This is the part we’ll populate through community submissions.</p><a class="button" href="contribute.html">Share an event</a></div>`;
      return;
    }
    list.innerHTML = upcoming.map(event => `
      <article class="event-card">
        <div class="meta"><span>${formatDate(event.date)}</span><span>${event.format}</span></div>
        <h3>${event.title}</h3>
        <p>${event.host}</p>
        <p>${event.location}</p>
        ${event.url ? `<a class="button secondary" href="${event.url}">Event details</a>` : ""}
      </article>`).join("");
  } catch (error) {
    list.innerHTML = `<div class="empty-state"><h3>Event data could not load.</h3></div>`;
    console.error(error);
  }
})();

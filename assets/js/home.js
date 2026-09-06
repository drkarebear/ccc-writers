(async function () {
  const journalEl = document.querySelector("#home-journal-count");
  const openEl = document.querySelector("#home-open-count");
  const eventEl = document.querySelector("#home-event-count");
  if (!journalEl && !openEl && !eventEl) return;

  try {
    const [journalsResponse, eventsResponse] = await Promise.all([
      fetch("data/journals.json"),
      fetch("data/events.json")
    ]);
    if (!journalsResponse.ok || !eventsResponse.ok) throw new Error("Could not load homepage counts.");
    const journals = await journalsResponse.json();
    const events = await eventsResponse.json();
    const today = new Date();
    const upcomingEvents = events.filter(event => new Date(`${event.date}T23:59:59`) >= today);
    const openJournals = journals.filter(journal => submissionStatus(journal, today).key === "open");

    if (journalEl) journalEl.textContent = journals.length;
    if (openEl) openEl.textContent = openJournals.length;
    if (eventEl) eventEl.textContent = upcomingEvents.length;
  } catch (error) {
    console.error(error);
  }
})();

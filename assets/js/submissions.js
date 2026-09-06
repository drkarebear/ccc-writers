(async function () {
  const list = document.querySelector("#submission-list");
  if (!list) return;
  const filter = document.querySelector("#submission-genre");
  const onlyOpen = document.querySelector("#only-open");
  const search = document.querySelector("#submission-search");

  try {
    const journals = await (await fetch("data/journals.json")).json();
    [...new Set(journals.flatMap(j => j.genres || []))].sort().forEach(g => {
      const option = document.createElement("option");
      option.value = g;
      option.textContent = g;
      filter.append(option);
    });

    const render = () => {
      const q = normalize(search.value);
      const genre = normalize(filter.value);
      const openOnly = onlyOpen.checked;
      const filtered = journals.filter(j => {
        const status = submissionStatus(j);
        const matchesText = !q || normalize(`${j.college} ${j.journal} ${(j.eligibility || []).join(" ")}`).includes(q);
        const matchesGenre = !genre || (j.genres || []).map(normalize).includes(genre);
        const matchesOpen = !openOnly || status.key === "open";
        return matchesText && matchesGenre && matchesOpen;
      }).sort((a,b) => {
        const aStatus = submissionStatus(a);
        const bStatus = submissionStatus(b);
        const aDate = aStatus.deadline || "9999-12-31";
        const bDate = bStatus.deadline || "9999-12-31";
        return aDate.localeCompare(bDate);
      });
      list.innerHTML = filtered.map(journalCard).join("") || `<div class="empty-state"><h3>No opportunities match.</h3><p>Try showing closed journals or choosing another genre.</p></div>`;
    };

    [search, filter].forEach(c => c.addEventListener(c.tagName === "INPUT" ? "input" : "change", render));
    onlyOpen.addEventListener("change", render);
    render();
  } catch (error) {
    list.innerHTML = `<div class="empty-state"><h3>Submission data could not load.</h3></div>`;
    console.error(error);
  }
})();

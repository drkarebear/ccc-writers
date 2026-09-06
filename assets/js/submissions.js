(async function () {
  const list = document.querySelector("#submission-list");
  if (!list) return;
  const filter = document.querySelector("#submission-genre");
  const statusFilter = document.querySelector("#submission-status");
  const search = document.querySelector("#submission-search");
  const count = document.querySelector("#submission-count");

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
      const selectedStatus = statusFilter.value;
      const filtered = journals.filter(j => {
        const status = submissionStatus(j);
        const matchesText = !q || normalize(`${j.college} ${j.journal} ${(j.eligibility || []).join(" ")}`).includes(q);
        const matchesGenre = !genre || (j.genres || []).map(normalize).includes(genre);
        const matchesStatus = !selectedStatus || status.key === selectedStatus;
        return matchesText && matchesGenre && matchesStatus;
      }).sort((a,b) => {
        const aStatus = submissionStatus(a);
        const bStatus = submissionStatus(b);
        const aDate = aStatus.deadline || "9999-12-31";
        const bDate = bStatus.deadline || "9999-12-31";
        return aDate.localeCompare(bDate);
      });
      list.innerHTML = filtered.map(journalCard).join("") || `<div class="empty-state"><h3>No opportunities match.</h3><p>Try another status, genre, or search term.</p></div>`;
      if (count) count.textContent = `${filtered.length} opportunit${filtered.length === 1 ? "y" : "ies"} shown`;
    };

    [search, filter, statusFilter].forEach(c => c.addEventListener(c.tagName === "INPUT" ? "input" : "change", render));
    render();
  } catch (error) {
    list.innerHTML = `<div class="empty-state"><h3>Submission data could not load.</h3></div>`;
    console.error(error);
  }
})();

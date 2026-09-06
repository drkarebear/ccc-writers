(async function () {
  const list = document.querySelector("#journal-list");
  if (!list) return;

  const count = document.querySelector("#journal-count");
  const search = document.querySelector("#journal-search");
  const genre = document.querySelector("#genre-filter");
  const statusFilter = document.querySelector("#status-filter");
  const eligibility = document.querySelector("#eligibility-filter");

  try {
    const response = await fetch("data/journals.json");
    if (!response.ok) throw new Error("Could not load journal data.");
    const journals = await response.json();
    window.CCC_JOURNALS = journals;

    const genres = [...new Set(journals.flatMap(j => j.genres || []))].sort();
    genres.forEach(value => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      genre?.append(option);
    });

    const render = () => {
      const q = normalize(search?.value);
      const selectedGenre = normalize(genre?.value);
      const selectedStatus = statusFilter?.value || "";
      const selectedEligibility = eligibility?.value || "";

      const filtered = journals.filter(j => {
        const haystack = normalize(`${j.college} ${j.journal} ${j.city}`);
        const status = submissionStatus(j).key;
        const elig = (j.eligibility_tags || []);
        return (!q || haystack.includes(q)) &&
          (!selectedGenre || (j.genres || []).map(normalize).includes(selectedGenre)) &&
          (!selectedStatus || status === selectedStatus) &&
          (!selectedEligibility || elig.includes(selectedEligibility));
      });

      list.innerHTML = filtered.map(journalCard).join("") || `<div class="empty-state"><h3>No journals match those filters.</h3><p>Try clearing one filter or searching by college.</p></div>`;
      if (count) count.textContent = `${filtered.length} journal${filtered.length === 1 ? "" : "s"} shown`;
      document.dispatchEvent(new CustomEvent("ccc:journals-filtered", { detail: filtered }));
    };

    [search, genre, statusFilter, eligibility].forEach(control => {
      control?.addEventListener(control.tagName === "INPUT" ? "input" : "change", render);
    });
    render();
  } catch (error) {
    list.innerHTML = `<div class="empty-state"><h3>Journal data could not load.</h3><p>This prototype needs to run from GitHub Pages or a local web server rather than directly from a file.</p></div>`;
    console.error(error);
  }
})();

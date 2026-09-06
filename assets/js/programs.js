(async function () {
  const list = document.querySelector("#program-list");
  if (!list) return;
  const systemFilter = document.querySelector("#system-filter");
  const typeFilter = document.querySelector("#program-type-filter");
  const transferFilter = document.querySelector("#transfer-filter");
  const search = document.querySelector("#program-search");
  const resultCount = document.querySelector("#program-result-count");

  try {
    const programs = await (await fetch("data/programs.json")).json();
    const total = document.querySelector("#program-total");
    const csuTotal = document.querySelector("#csu-total");
    const ucTotal = document.querySelector("#uc-total");
    if (total) total.textContent = programs.length;
    if (csuTotal) csuTotal.textContent = programs.filter(p => p.system === "CSU").length;
    if (ucTotal) ucTotal.textContent = programs.filter(p => p.system === "UC").length;

    const render = () => {
      const q = normalize(search.value);
      const system = systemFilter.value;
      const type = typeFilter.value;
      const transfer = transferFilter.value;
      const filtered = programs.filter(p => {
        const text = normalize(`${p.institution} ${p.program} ${p.city} ${(p.genres || []).join(" ")} ${p.summary || ""} ${p.transfer_note || ""} ${p.secondary_offering || ""}`);
        return (!q || text.includes(q)) && (!system || p.system === system) && (!type || p.program_type === type) && (!transfer || p.transfer_strength === transfer);
      }).sort((a,b) => a.system.localeCompare(b.system) || a.institution.localeCompare(b.institution));
      if (resultCount) resultCount.textContent = `${filtered.length} program${filtered.length === 1 ? "" : "s"} shown`;
      list.innerHTML = filtered.map(programCard).join("") || `<div class="empty-state"><h3>No programs match those filters.</h3><p>Try removing one filter or searching a broader term.</p></div>`;
    };
    [systemFilter, typeFilter, transferFilter].forEach(c => c.addEventListener("change", render));
    search.addEventListener("input", render);
    render();
  } catch (error) {
    list.innerHTML = `<div class="empty-state"><h3>Program data could not load.</h3><p>Please try again or use the official-source links later.</p></div>`;
    console.error(error);
  }
})();

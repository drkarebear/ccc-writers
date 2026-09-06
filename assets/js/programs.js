(async function () {
  const list = document.querySelector("#program-list");
  if (!list) return;
  const systemFilter = document.querySelector("#system-filter");
  const typeFilter = document.querySelector("#program-type-filter");
  const search = document.querySelector("#program-search");

  try {
    const programs = await (await fetch("data/programs.json")).json();
    const render = () => {
      const q = normalize(search.value);
      const system = systemFilter.value;
      const type = typeFilter.value;
      const filtered = programs.filter(p => {
        const text = normalize(`${p.institution} ${p.program} ${p.city} ${(p.genres || []).join(" ")}`);
        return (!q || text.includes(q)) && (!system || p.system === system) && (!type || p.program_type === type);
      });
      list.innerHTML = filtered.map(programCard).join("") || `<div class="empty-state"><h3>No programs match those filters.</h3></div>`;
    };
    [systemFilter, typeFilter].forEach(c => c.addEventListener("change", render));
    search.addEventListener("input", render);
    render();
  } catch (error) {
    list.innerHTML = `<div class="empty-state"><h3>Program data could not load.</h3></div>`;
    console.error(error);
  }
})();

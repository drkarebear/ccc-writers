(async function () {
  const list = document.querySelector('#program-list');
  if (!list) return;

  const form = document.querySelector('#program-finder-form');
  const search = document.querySelector('#program-search');
  const typeFilter = document.querySelector('#program-type-filter');
  const genreFilter = document.querySelector('#genre-filter');
  const systemFilter = document.querySelector('#system-filter');
  const broadFilter = document.querySelector('#broad-region-filter');
  const regionFilter = document.querySelector('#region-filter');
  const transferFilter = document.querySelector('#transfer-filter');
  const resultCount = document.querySelector('#program-result-count');

  const resetOptions = (select, values, blankLabel) => {
    if (!select) return;
    const current = select.value;
    select.innerHTML = `<option value="">${blankLabel}</option>`;
    values.forEach(value => select.add(new Option(value, value)));
    if (values.includes(current)) select.value = current;
  };

  try {
    let programs = Array.isArray(window.CCC_PROGRAMS) ? window.CCC_PROGRAMS : null;
    if (!programs) programs = await loadJsonWithFallback('data/programs.json', window.CCC_PROGRAMS);

    const broadRegions = [...new Set(programs.map(p => p.broad_region).filter(Boolean))].sort();
    resetOptions(broadFilter, broadRegions, 'Anywhere in California');

    const refreshAreas = () => {
      const broad = broadFilter?.value || '';
      const areas = [...new Set(
        programs
          .filter(p => !broad || p.broad_region === broad)
          .map(p => p.region)
          .filter(Boolean)
      )].sort();
      resetOptions(regionFilter, areas, 'Any local area');
    };
    refreshAreas();

    const total = document.querySelector('#program-total');
    const finderTotal = document.querySelector('#program-finder-total');
    const csuTotal = document.querySelector('#csu-total');
    const ucTotal = document.querySelector('#uc-total');
    if (total) total.textContent = programs.length;
    if (finderTotal) finderTotal.textContent = programs.length;
    if (csuTotal) csuTotal.textContent = new Set(programs.filter(p => p.system === 'CSU').map(p => p.institution)).size;
    if (ucTotal) ucTotal.textContent = new Set(programs.filter(p => p.system === 'UC').map(p => p.institution)).size;

    const fullText = p => normalize(`${p.institution} ${p.program} ${p.city} ${p.broad_region || ''} ${p.region || ''} ${(p.genres || []).join(' ')} ${p.summary || ''} ${p.transfer_note || ''} ${p.secondary_offering || ''}`);

    const matchesTransfer = (program, filter) => {
      if (!filter) return true;
      if (filter === 'published-ccc-pathway') return program.transfer_strength === 'published-ccc-pathway';
      if (filter === 'transfer-specific-guidance') {
        return ['published-ccc-pathway', 'transfer-specific-guidance'].includes(program.transfer_strength);
      }
      if (filter === 'general') return program.transfer_strength === 'general';
      return true;
    };

    const renderPrograms = () => {
      const q = normalize(search?.value || '');
      const type = typeFilter?.value || '';
      const genre = genreFilter?.value || '';
      const system = systemFilter?.value || '';
      const broad = broadFilter?.value || '';
      const region = regionFilter?.value || '';
      const transfer = transferFilter?.value || '';

      const filtered = programs
        .filter(p => {
          const genreMatch = !genre || (p.genres || []).some(g => normalize(g) === normalize(genre));
          return (!q || fullText(p).includes(q)) &&
            (!type || p.program_type === type) &&
            genreMatch &&
            (!system || p.system === system) &&
            (!broad || p.broad_region === broad) &&
            (!region || p.region === region) &&
            matchesTransfer(p, transfer);
        })
        .sort((a, b) => a.institution.localeCompare(b.institution) || a.program.localeCompare(b.program));

      if (resultCount) {
        resultCount.textContent = `${filtered.length} route${filtered.length === 1 ? '' : 's'} match your choices. Results are listed alphabetically, not ranked.`;
      }

      list.innerHTML = filtered.map(programCard).join('') ||
        '<div class="empty-state"><h3>No routes match those choices.</h3><p>Try clearing one filter or searching a broader term.</p></div>';
    };

    broadFilter?.addEventListener('change', () => {
      refreshAreas();
      renderPrograms();
    });

    [typeFilter, genreFilter, systemFilter, regionFilter, transferFilter]
      .filter(Boolean)
      .forEach(control => control.addEventListener('change', renderPrograms));

    search?.addEventListener('input', renderPrograms);

    form?.addEventListener('submit', event => event.preventDefault());
    form?.addEventListener('reset', () => {
      window.setTimeout(() => {
        refreshAreas();
        renderPrograms();
        search?.focus();
      }, 0);
    });

    renderPrograms();
  } catch (error) {
    list.innerHTML = '<div class="empty-state"><h3>Program data could not load.</h3><p>Please try again or use the official-source links later.</p></div>';
    console.error(error);
  }
})();

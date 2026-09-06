(async function () {
  const list = document.querySelector('#program-list');
  if (!list) return;

  const systemFilter = document.querySelector('#system-filter');
  const regionFilter = document.querySelector('#region-filter');
  const typeFilter = document.querySelector('#program-type-filter');
  const transferFilter = document.querySelector('#transfer-filter');
  const search = document.querySelector('#program-search');
  const resultCount = document.querySelector('#program-result-count');

  const guidedForm = document.querySelector('#guided-program-form');
  const guidedFocus = document.querySelector('#guided-focus');
  const guidedGenre = document.querySelector('#guided-genre');
  const guidedSystem = document.querySelector('#guided-system');
  const guidedRegion = document.querySelector('#guided-region');
  const guidedTransfer = document.querySelector('#guided-transfer');
  const guidedCount = document.querySelector('#guided-result-count');
  const guidedResults = document.querySelector('#guided-program-results');

  try {
    let programs = Array.isArray(window.CCC_PROGRAMS) ? window.CCC_PROGRAMS : null;
    if (!programs) {
      programs = await loadJsonWithFallback('data/programs.json', window.CCC_PROGRAMS);
    }

    const regions = [...new Set(programs.map(p => p.region).filter(Boolean))].sort();
    const addRegions = (select) => {
      if (!select) return;
      const existing = new Set([...select.options].map(option => option.value));
      regions.forEach(region => {
        if (existing.has(region)) return;
        const option = document.createElement('option');
        option.value = region;
        option.textContent = region;
        select.appendChild(option);
      });
    };
    addRegions(regionFilter);
    addRegions(guidedRegion);

    const total = document.querySelector('#program-total');
    const csuTotal = document.querySelector('#csu-total');
    const ucTotal = document.querySelector('#uc-total');
    if (total) total.textContent = programs.length;
    if (csuTotal) csuTotal.textContent = programs.filter(p => p.system === 'CSU').length;
    if (ucTotal) ucTotal.textContent = programs.filter(p => p.system === 'UC').length;

    const fullText = (p) => normalize(`${p.institution} ${p.program} ${p.city} ${p.region || ''} ${(p.genres || []).join(' ')} ${p.summary || ''} ${p.transfer_note || ''} ${p.secondary_offering || ''}`);

    const renderDirectory = () => {
      const q = normalize(search?.value || '');
      const system = systemFilter?.value || '';
      const region = regionFilter?.value || '';
      const type = typeFilter?.value || '';
      const transfer = transferFilter?.value || '';
      const filtered = programs.filter(p => {
        return (!q || fullText(p).includes(q)) &&
          (!system || p.system === system) &&
          (!region || p.region === region) &&
          (!type || p.program_type === type) &&
          (!transfer || p.transfer_strength === transfer);
      }).sort((a, b) => a.system.localeCompare(b.system) || a.institution.localeCompare(b.institution));

      if (resultCount) resultCount.textContent = `${filtered.length} program${filtered.length === 1 ? '' : 's'} shown`;
      list.innerHTML = filtered.map(programCard).join('') || '<div class="empty-state"><h3>No programs match those filters.</h3><p>Try removing one filter or searching a broader term.</p></div>';
    };

    [systemFilter, regionFilter, typeFilter, transferFilter].filter(Boolean).forEach(control => control.addEventListener('change', renderDirectory));
    search?.addEventListener('input', renderDirectory);
    renderDirectory();

    const renderGuided = () => {
      if (!guidedResults || !guidedCount) return;
      const focus = guidedFocus?.value || '';
      const genre = guidedGenre?.value || '';
      const system = guidedSystem?.value || '';
      const region = guidedRegion?.value || '';
      const transfer = guidedTransfer?.value || '';

      let matches = programs.filter(p => {
        const focusMatch = !focus || p.program_type === focus;
        const genreMatch = !genre || (p.genres || []).some(g => normalize(g) === normalize(genre));
        const systemMatch = !system || p.system === system;
        const regionMatch = !region || p.region === region;
        let transferMatch = true;
        if (transfer === 'published-ccc-pathway') transferMatch = p.transfer_strength === 'published-ccc-pathway';
        if (transfer === 'transfer-specific-guidance') transferMatch = ['published-ccc-pathway', 'transfer-specific-guidance'].includes(p.transfer_strength);
        return focusMatch && genreMatch && systemMatch && regionMatch && transferMatch;
      });

      matches = matches.sort((a, b) => {
        const strength = {'published-ccc-pathway': 0, 'transfer-specific-guidance': 1, 'general': 2};
        return (strength[a.transfer_strength] ?? 3) - (strength[b.transfer_strength] ?? 3) || a.institution.localeCompare(b.institution);
      });

      guidedCount.textContent = `${matches.length} program${matches.length === 1 ? '' : 's'} match your choices. Matches are not rankings.`;
      guidedResults.innerHTML = matches.slice(0, 8).map(programCard).join('') || '<div class="empty-state"><h3>No exact matches yet.</h3><p>Try choosing “I’m open” for one answer, or use the full directory below.</p></div>';
      if (matches.length > 8) {
        guidedResults.insertAdjacentHTML('beforeend', `<p class="small">Showing 8 of ${matches.length} matches. Use the full directory below to see the rest.</p>`);
      }
    };

    if (guidedForm) {
      guidedForm.addEventListener('submit', (event) => {
        event.preventDefault();
        renderGuided();
        guidedCount?.scrollIntoView({block: 'nearest'});
      });
      guidedForm.addEventListener('reset', () => {
        window.setTimeout(() => {
          if (guidedCount) guidedCount.textContent = '';
          if (guidedResults) guidedResults.innerHTML = '';
        }, 0);
      });
    }
  } catch (error) {
    list.innerHTML = '<div class="empty-state"><h3>Program data could not load.</h3><p>Please try again or use the official-source links later.</p></div>';
    if (guidedResults) guidedResults.innerHTML = '<div class="empty-state"><h3>Program data could not load.</h3><p>Please try again later.</p></div>';
    console.error(error);
  }
})();

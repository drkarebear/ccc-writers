(async function () {
  const list = document.querySelector('#journal-list');
  if (!list) return;
  const count = document.querySelector('#journal-count');
  const search = document.querySelector('#journal-search');
  const genre = document.querySelector('#genre-filter');
  const broad = document.querySelector('#broad-region-filter');
  const region = document.querySelector('#region-filter');
  const statusFilter = document.querySelector('#status-filter');
  const eligibility = document.querySelector('#eligibility-filter');

  const resetAreas = (journals) => {
    const current = region?.value || '';
    const selectedBroad = broad?.value || '';
    const areas = [...new Set(journals.filter(j => !selectedBroad || j.broad_region === selectedBroad).map(j => j.region).filter(Boolean))].sort();
    if (region) { region.innerHTML='<option value="">All local areas</option>'; areas.forEach(v => region.add(new Option(v,v))); if (areas.includes(current)) region.value=current; }
  };

  try {
    const journals = await loadJsonWithFallback('data/journals.json', window.CCC_JOURNALS); window.CCC_JOURNALS=journals;
    [...new Set(journals.flatMap(j => j.genres || []))].sort().forEach(v => genre?.add(new Option(v,v)));
    [...new Set(journals.map(j => j.broad_region).filter(Boolean))].sort().forEach(v => broad?.add(new Option(v,v)));
    resetAreas(journals);

    const render = () => {
      const q=normalize(search?.value), selectedGenre=normalize(genre?.value), selectedBroad=broad?.value||'', selectedRegion=normalize(region?.value), selectedStatus=statusFilter?.value||'', selectedEligibility=eligibility?.value||'';
      const filtered=journals.filter(j => {
        const haystack=normalize(`${j.college} ${j.journal} ${j.city} ${j.broad_region||''} ${j.region||''}`), status=submissionStatus(j).key, elig=j.eligibility_tags||[];
        return (!q||haystack.includes(q)) && (!selectedGenre||(j.genres||[]).map(normalize).includes(selectedGenre)) && (!selectedBroad||j.broad_region===selectedBroad) && (!selectedRegion||normalize(j.region)===selectedRegion) && (!selectedStatus||status===selectedStatus) && (!selectedEligibility||elig.includes(selectedEligibility));
      });
      list.innerHTML=filtered.map(journalCard).join('')||'<div class="empty-state"><h3>No journals match those filters.</h3><p>Try clearing one filter or searching by college.</p></div>';
      if (count) count.textContent=`${filtered.length} journal${filtered.length===1?'':'s'} shown`;
      document.dispatchEvent(new CustomEvent('ccc:journals-filtered',{detail:filtered}));
    };
    broad?.addEventListener('change',()=>{resetAreas(journals);render();});
    [search,genre,region,statusFilter,eligibility].forEach(control=>control?.addEventListener(control.tagName==='INPUT'?'input':'change',render));
    render();
  } catch(error) { list.innerHTML='<div class="empty-state"><h3>Journal data could not load.</h3><p>This prototype needs to run from GitHub Pages or a local web server rather than directly from a file.</p></div>'; console.error(error); }
})();

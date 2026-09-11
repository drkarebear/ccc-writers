(async function () {
  const list=document.querySelector('#submission-list'); if(!list)return;
  const filter=document.querySelector('#submission-genre'), statusFilter=document.querySelector('#submission-status'), search=document.querySelector('#submission-search'), count=document.querySelector('#submission-count');
  const broad=document.querySelector('#submission-broad-region'), region=document.querySelector('#submission-region'), audience=document.querySelector('#submission-audience');
  try {
    const journals=await loadJsonWithFallback('data/journals.json',window.CCC_JOURNALS);
    [...new Set(journals.flatMap(j=>j.genres||[]))].sort().forEach(g=>filter.add(new Option(g,g)));
    const resetAreas=populateGeographyFilters(broad,region,{broadBlank:'All of California',localBlank:'All local areas'});
    const render=()=>{
      const q=normalize(search.value), genre=normalize(filter.value), selectedStatus=statusFilter.value, b=broad.value, area=region.value, selectedAudience=audience?.value||'';
      const filtered=journals.filter(j=>{
        const status=submissionStatus(j);
        const audienceTags=submissionAudienceTags(j);
        const matchesText=!q||normalize(`${j.college} ${j.journal} ${j.city} ${j.broad_region||''} ${j.region||''} ${(j.eligibility||[]).join(' ')} ${j.eligibility_area||''}`).includes(q);
        return matchesText&&(!genre||(j.genres||[]).map(normalize).includes(genre))&&(!selectedStatus||status.key===selectedStatus)&&(!b||j.broad_region===b)&&(!area||j.region===area)&&(!selectedAudience||audienceTags.includes(selectedAudience));
      }).sort((a,b)=>{const ad=submissionStatus(a).deadline||'9999-12-31',bd=submissionStatus(b).deadline||'9999-12-31';return ad.localeCompare(bd)||a.journal.localeCompare(b.journal);});
      list.innerHTML=filtered.map(journalCard).join('')||'<div class="empty-state"><h3>No opportunities match.</h3><p>Try another status, genre, audience, or location.</p></div>';
      if(count)count.textContent=`${filtered.length} opportunit${filtered.length===1?'y':'ies'} shown`;
    };
    broad.addEventListener('change',()=>{resetAreas();render();});
    [search,filter,statusFilter,region,audience].filter(Boolean).forEach(c=>c.addEventListener(c.tagName==='INPUT'?'input':'change',render));
    render();
  } catch(error){list.innerHTML='<div class="empty-state"><h3>Submission data could not load.</h3></div>';console.error(error);}
})();

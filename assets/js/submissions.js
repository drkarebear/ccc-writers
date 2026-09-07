(async function () {
  const list=document.querySelector('#submission-list'); if(!list)return;
  const filter=document.querySelector('#submission-genre'), statusFilter=document.querySelector('#submission-status'), search=document.querySelector('#submission-search'), count=document.querySelector('#submission-count');
  const broad=document.querySelector('#submission-broad-region'), region=document.querySelector('#submission-region');
  try {
    const journals=await loadJsonWithFallback('data/journals.json',window.CCC_JOURNALS);
    [...new Set(journals.flatMap(j=>j.genres||[]))].sort().forEach(g=>filter.add(new Option(g,g)));
    [...new Set(journals.map(j=>j.broad_region).filter(Boolean))].sort().forEach(v=>broad.add(new Option(v,v)));
    const resetAreas=()=>{const current=region.value, b=broad.value;const areas=[...new Set(journals.filter(j=>!b||j.broad_region===b).map(j=>j.region).filter(Boolean))].sort();region.innerHTML='<option value="">All local areas</option>';areas.forEach(v=>region.add(new Option(v,v)));if(areas.includes(current))region.value=current;}; resetAreas();
    const render=()=>{
      const q=normalize(search.value), genre=normalize(filter.value), selectedStatus=statusFilter.value, b=broad.value, area=region.value;
      const filtered=journals.filter(j=>{const status=submissionStatus(j);const matchesText=!q||normalize(`${j.college} ${j.journal} ${j.city} ${j.broad_region||''} ${j.region||''} ${(j.eligibility||[]).join(' ')}`).includes(q);return matchesText&&(!genre||(j.genres||[]).map(normalize).includes(genre))&&(!selectedStatus||status.key===selectedStatus)&&(!b||j.broad_region===b)&&(!area||j.region===area);}).sort((a,b)=>{const ad=submissionStatus(a).deadline||'9999-12-31',bd=submissionStatus(b).deadline||'9999-12-31';return ad.localeCompare(bd);});
      list.innerHTML=filtered.map(journalCard).join('')||'<div class="empty-state"><h3>No opportunities match.</h3><p>Try another status, genre, or location.</p></div>'; if(count)count.textContent=`${filtered.length} opportunit${filtered.length===1?'y':'ies'} shown`;
    };
    broad.addEventListener('change',()=>{resetAreas();render();}); [search,filter,statusFilter,region].forEach(c=>c.addEventListener(c.tagName==='INPUT'?'input':'change',render)); render();
  } catch(error){list.innerHTML='<div class="empty-state"><h3>Submission data could not load.</h3></div>';console.error(error);}
})();

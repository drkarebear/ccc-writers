(async function () {
  const list = document.querySelector('#read-journal-list');
  if (!list) return;
  const search = document.querySelector('#read-search');
  const region = document.querySelector('#read-region');
  const genre = document.querySelector('#read-genre');
  const count = document.querySelector('#read-result-count');

  try {
    const response = await fetch('data/journals.json');
    if (!response.ok) throw new Error('Journal data unavailable');
    const journals = await response.json();
    const readable = journals.filter(j => j.journal_url);
    [...new Set(readable.map(j => j.region).filter(Boolean))].sort().forEach(value => region.add(new Option(value, value)));
    [...new Set(readable.flatMap(j => j.genres || []))].sort().forEach(value => genre.add(new Option(value, value)));

    const card = (j) => `
      <article class="journal-card">
        <div class="meta"><span>${j.college}</span><span>${j.region || ''}</span><span>${j.city}, CA</span></div>
        <h3><cite>${j.journal}</cite></h3>
        <ul class="tag-list" aria-label="Genres">${(j.genres || []).map(g => `<li class="tag">${g}</li>`).join('')}</ul>
        <p class="small">Journal or publication page verified ${formatDate(j.last_verified)}.</p>
        <div class="button-row"><a class="button" href="${j.journal_url}" aria-label="Read or explore ${j.journal}">Read or explore journal</a><a class="button secondary" href="journals.html" aria-label="See directory details for ${j.journal}">Directory details</a></div>
      </article>`;

    const render = () => {
      const q = normalize(search.value);
      const r = region.value;
      const g = genre.value;
      const filtered = readable.filter(j => {
        const text = normalize(`${j.journal} ${j.college} ${j.city} ${j.region || ''} ${(j.genres || []).join(' ')}`);
        return (!q || text.includes(q)) && (!r || j.region === r) && (!g || (j.genres || []).includes(g));
      }).sort((a,b) => a.college.localeCompare(b.college) || a.journal.localeCompare(b.journal));
      count.textContent = `${filtered.length} journal${filtered.length === 1 ? '' : 's'} shown`;
      list.innerHTML = filtered.map(card).join('') || '<div class="empty-state"><h3>No journals match those filters.</h3><p>Try a broader search or remove one filter.</p></div>';
    };
    search.addEventListener('input', render);
    [region, genre].forEach(el => el.addEventListener('change', render));
    render();
  } catch (error) {
    list.innerHTML = '<div class="empty-state"><h3>Journal data could not load.</h3><p>Please try again later.</p></div>';
    console.error(error);
  }
})();

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

    const card = (j) => {
      const issueUrl = safeHttpsUrl(j.latest_issue_url);
      const url = issueUrl || safeHttpsUrl(j.journal_url);
      const journal = escapeHTML(j.journal);
      return `
      <article class="journal-card">
        <div class="meta"><span>${escapeHTML(j.college)}</span><span>${escapeHTML(j.region || '')}</span><span>${escapeHTML(j.city)}, CA</span>${j.journal_type ? `<span>${escapeHTML(j.journal_type)}</span>` : ''}</div>
        <h3><cite>${journal}</cite></h3>
        <ul class="tag-list" aria-label="Genres">${(j.genres || []).map(g => `<li class="tag">${escapeHTML(g)}</li>`).join('')}</ul>
        <p class="small">Journal or publication page verified ${escapeHTML(formatDate(j.last_verified))}.</p>
        <div class="button-row">${url ? `<a class="button" href="${escapeHTML(url)}" aria-label="${issueUrl ? 'Read current or latest verified issue of' : 'Read or explore'} ${journal}">${issueUrl ? 'Read latest verified issue' : 'Read or explore journal'}</a>` : ''}<a class="button secondary" href="journals.html" aria-label="See directory details for ${journal}">Directory details</a></div>
      </article>`;
    };

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

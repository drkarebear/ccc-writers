(async function () {
  const list = document.querySelector('#coverage-list');
  if (!list) return;
  const search = document.querySelector('#coverage-search');
  const status = document.querySelector('#coverage-status');
  const count = document.querySelector('#coverage-result-count');
  const labels = {
    'verified-active-journal': 'Verified active journal',
    'still-researching': 'Still researching',
    'no-journal-located': 'No active journal located after review',
    'historical-inactive': 'Historical/inactive journal located'
  };
  try {
    const response = await fetch('data/college-coverage.json');
    if (!response.ok) throw new Error('Coverage data unavailable');
    const colleges = await response.json();
    document.querySelector('#coverage-total').textContent = colleges.length;
    document.querySelector('#coverage-verified').textContent = colleges.filter(c => c.status === 'verified-active-journal').length;
    document.querySelector('#coverage-researching').textContent = colleges.filter(c => c.status === 'still-researching').length;
    const card = c => `<article class="coverage-card coverage-${c.status}"><div><h3>${c.college}</h3>${c.journals.length ? `<p><strong>${c.journals.join(' · ')}</strong></p>` : ''}${c.region ? `<p class="small">${c.region}</p>` : ''}</div><p class="coverage-status"><strong>${labels[c.status] || c.status}</strong>${c.last_verified ? `<br><span class="small">Verified ${formatDate(c.last_verified)}</span>` : ''}</p></article>`;
    const render = () => {
      const q = normalize(search.value); const s = status.value;
      const filtered = colleges.filter(c => (!q || normalize(`${c.college} ${(c.journals || []).join(' ')}`).includes(q)) && (!s || c.status === s));
      count.textContent = `${filtered.length} college${filtered.length === 1 ? '' : 's'} shown`;
      list.innerHTML = filtered.map(card).join('') || '<div class="empty-state"><h3>No colleges match those filters.</h3><p>Try a broader search.</p></div>';
    };
    search.addEventListener('input', render); status.addEventListener('change', render); render();
  } catch (error) {
    list.innerHTML = '<div class="empty-state"><h3>Coverage data could not load.</h3><p>Please try again later.</p></div>';
    console.error(error);
  }
})();

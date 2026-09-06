(async function () {
  const list = document.querySelector('#coverage-list');
  if (!list) return;
  const search = document.querySelector('#coverage-search');
  const status = document.querySelector('#coverage-status');
  const region = document.querySelector('#coverage-region');
  const count = document.querySelector('#coverage-result-count');
  const labels = {
    'verified-active-journal': 'Verified active journal',
    'active-publication-details-needed': 'Active publication — details needed',
    'recent-status-unclear': 'Recent/historical lead — current status unclear',
    'still-researching': 'Still researching',
    'no-journal-located': 'No active journal located after review',
    'historical-inactive': 'Historical/inactive journal located'
  };
  try {
    const colleges = await loadJsonWithFallback('data/college-coverage.json', window.CCC_COVERAGE);
    document.querySelector('#coverage-total').textContent = colleges.length;
    document.querySelector('#coverage-verified').textContent = colleges.filter(c => c.status === 'verified-active-journal').length;
    document.querySelector('#coverage-details-needed').textContent = colleges.filter(c => c.status === 'active-publication-details-needed').length;
    document.querySelector('#coverage-unresolved').textContent = colleges.filter(c => ['still-researching', 'recent-status-unclear'].includes(c.status)).length;
    [...new Set(colleges.map(c => c.region).filter(Boolean))].sort().forEach(value => region.add(new Option(value, value)));
    const card = c => `<article class="coverage-card coverage-${escapeHTML(c.status)}"><div><h3>${escapeHTML(c.college)}</h3>${c.journals.length ? `<p><strong>${c.journals.map(escapeHTML).join(' · ')}</strong></p>` : ''}${c.region ? `<p class="small">${escapeHTML(c.region)}</p>` : ''}${c.research_note ? `<p class="small">${escapeHTML(c.research_note)}</p>` : ''}</div><p class="coverage-status"><strong>${escapeHTML(labels[c.status] || c.status)}</strong>${c.last_verified ? `<br><span class="small">Checked ${escapeHTML(formatDate(c.last_verified))}</span>` : ''}</p></article>`;
    const render = () => {
      const q = normalize(search.value); const s = status.value; const r = region.value;
      const filtered = colleges.filter(c => (!q || normalize(`${c.college} ${(c.journals || []).join(' ')} ${c.region || ''} ${c.research_note || ''}`).includes(q)) && (!r || c.region === r) && (!s || c.status === s));
      count.textContent = `${filtered.length} college${filtered.length === 1 ? '' : 's'} shown`;
      list.innerHTML = filtered.map(card).join('') || '<div class="empty-state"><h3>No colleges match those filters.</h3><p>Try a broader search.</p></div>';
    };
    search.addEventListener('input', render); [region, status].forEach(el => el.addEventListener('change', render)); render();
  } catch (error) {
    list.innerHTML = '<div class="empty-state"><h3>Coverage data could not load.</h3><p>Please try again later.</p></div>';
    console.error(error);
  }
})();

(() => {
  const links = [...document.querySelectorAll('[data-community-form-link]')];
  if (!links.length) return;

  fetch('data/site-config.json')
    .then((response) => {
      if (!response.ok) throw new Error('Configuration unavailable');
      return response.json();
    })
    .then((config) => {
      const raw = typeof config.community_form_url === 'string'
        ? config.community_form_url.trim()
        : '';
      if (!raw) return;

      const parsed = new URL(raw);
      if (parsed.protocol !== 'https:' || parsed.hostname !== 'docs.google.com') return;

      links.forEach((link) => {
        link.href = parsed.href;
      });
    })
    .catch(() => {
      // Keep each link's accessible local fallback (contribute.html).
    });
})();

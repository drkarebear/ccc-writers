(() => {
  const links = [...document.querySelectorAll('[data-community-form-link]')];
  if (!links.length) return;

  loadJsonWithFallback('data/site-config.json', window.CCC_SITE_CONFIG)
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

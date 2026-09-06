(() => {
  const button = document.getElementById('community-form-link');
  const status = document.getElementById('community-form-status');
  if (!button || !status) return;

  loadJsonWithFallback('data/site-config.json', window.CCC_SITE_CONFIG)
    .then((config) => {
      const url = typeof config.community_form_url === 'string'
        ? config.community_form_url.trim()
        : '';

      if (!url) {
        button.hidden = true;
        status.textContent = 'The community submission form is being set up. In the meantime, use the official source links on each listing to verify current information.';
        return;
      }

      try {
        const parsed = new URL(url);
        if (parsed.protocol !== 'https:') throw new Error('Form URL must use HTTPS');
        button.href = parsed.href;
        button.hidden = false;
        status.textContent = 'The form opens in the same tab. Submissions are reviewed before anything appears on CCC Writers.';
      } catch (error) {
        button.hidden = true;
        status.textContent = 'The community form link needs to be corrected before submissions can open.';
      }
    })
    .catch(() => {
      button.hidden = true;
      status.textContent = 'The community submission form is temporarily unavailable.';
    });
})();

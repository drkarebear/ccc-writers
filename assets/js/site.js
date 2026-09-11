const formatDate = (iso, options = {}) => {
  if (!iso) return "Date not listed";
  const date = new Date(`${iso}T12:00:00`);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: options.includeYear === false ? undefined : "numeric"
  }).format(date);
};

const normalize = (value = "") => value.toString().toLowerCase().trim();

const escapeHTML = (value = "") => value.toString().replace(/[&<>"']/g, char => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}[char]));

const safeHttpsUrl = (value = "") => {
  if (!value) return "";
  try {
    const url = new URL(value, window.location.href);
    if (url.protocol !== "https:") return "";
    return url.href;
  } catch {
    return "";
  }
};

window.escapeHTML = escapeHTML;
window.safeHttpsUrl = safeHttpsUrl;

const submissionStatus = (journal, now = new Date()) => {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (journal.publication_status === "suspended") {
    return { key: "closed", label: "Publication suspended", deadline: null };
  }

  // A short-lived override lets us accurately reflect a status verified on a
  // source page even when the source does not publish a complete date range.
  // Once the verification window expires, the listing falls back to the
  // date-based or unknown state instead of silently becoming stale.
  const override = journal.status_override;
  if (override?.key && override?.label && override?.expires) {
    const expires = new Date(`${override.expires}T23:59:59`);
    if (today <= expires) {
      return { key: override.key, label: override.label, deadline: override.deadline || null };
    }
  }

  if (journal.accepting_year_round) {
    return { key: "open", label: "Open year-round", deadline: journal.next_deadline || null };
  }

  const periods = journal.submission_periods || [];
  for (const period of periods) {
    const opens = period.opens ? new Date(`${period.opens}T00:00:00`) : null;
    const closes = period.closes ? new Date(`${period.closes}T23:59:59`) : null;
    if (opens && closes && today >= opens && today <= closes) {
      return { key: "open", label: `Open now · due ${formatDate(period.closes, {includeYear:false})}`, deadline: period.closes };
    }
  }

  const future = periods
    .filter(p => p.opens && new Date(`${p.opens}T00:00:00`) > today)
    .sort((a,b) => a.opens.localeCompare(b.opens))[0];

  if (future) {
    return { key: "soon", label: `Opens ${formatDate(future.opens)}`, deadline: future.closes || null };
  }

  const deadlineOnly = periods
    .filter(p => !p.opens && p.closes && new Date(`${p.closes}T23:59:59`) >= today)
    .sort((a,b) => a.closes.localeCompare(b.closes))[0];

  if (deadlineOnly) {
    return { key: "soon", label: `Deadline ${formatDate(deadlineOnly.closes)}`, deadline: deadlineOnly.closes };
  }

  if (periods.length) return { key: "closed", label: "Currently closed", deadline: null };
  return { key: "unknown", label: "Deadline not verified", deadline: null };
};

const journalCard = journal => {
  const status = submissionStatus(journal);
  const genres = (journal.genres || []).map(g => `<li class="tag">${escapeHTML(g)}</li>`).join("");
  const eligibility = (journal.eligibility || []).map(escapeHTML).join(" · ");
  const verified = journal.last_verified ? `Verified ${formatDate(journal.last_verified)}` : "Verification date not listed";
  const sourceUrl = safeHttpsUrl(journal.source_url);
  const journalUrl = safeHttpsUrl(journal.journal_url);
  const submissionUrl = safeHttpsUrl(journal.submission_url);
  const journalName = escapeHTML(journal.journal);
  const college = escapeHTML(journal.college);
  const city = escapeHTML(journal.city);
  return `
    <article class="journal-card" data-journal-id="${escapeHTML(journal.id)}">
      <div class="meta"><span>${college}</span><span>${city}, CA</span>${journal.region ? `<span>${escapeHTML(journal.region)}</span>` : ""}${journal.journal_type ? `<span>${escapeHTML(journal.journal_type)}</span>` : ""}</div>
      <h3><cite>${journalName}</cite></h3>
      <p class="status ${escapeHTML(status.key)}">${escapeHTML(status.label)}</p>
      <ul class="tag-list" aria-label="Genres">${genres}</ul>
      <p><strong>Who can submit:</strong> ${eligibility || "Not yet verified"}</p>
      ${submissionAudienceTags(journal).length ? `<ul class="tag-list" aria-label="Submission eligibility">${submissionAudienceTags(journal).map(tag => `<li class="tag">${escapeHTML(SUBMISSION_AUDIENCE_LABELS[tag] || tag)}</li>`).join("")}${journal.eligibility_area ? `<li class="tag">${escapeHTML(journal.eligibility_area)}</li>` : ""}</ul>` : ""}
      <p class="small">${escapeHTML(verified)}${sourceUrl ? ` · <a href="${escapeHTML(sourceUrl)}" aria-label="Verification source for ${journalName}">Verification source</a>` : ""}</p>
      <div class="button-row">
        ${journalUrl ? `<a class="button secondary" href="${escapeHTML(journalUrl)}" aria-label="Visit ${journalName}">Visit journal</a>` : ""}
        ${submissionUrl ? `<a class="button" href="${escapeHTML(submissionUrl)}" aria-label="View submission details for ${journalName}">Submission details</a>` : ""}
      </div>
    </article>`;
};

const programCard = program => {
  const transferClass = program.transfer_strength === "published-ccc-pathway" ? "transfer-strong" : (program.transfer_strength === "transfer-specific-guidance" ? "transfer-guidance" : "");
  const transferLabel = program.transfer_strength === "published-ccc-pathway" ? `<li class="tag transfer-tag">Published CCC/ADT pathway</li>` : (program.transfer_strength === "transfer-specific-guidance" ? `<li class="tag guidance-tag">Transfer-specific guidance</li>` : "");
  const programUrl = safeHttpsUrl(program.program_url);
  const transferUrl = safeHttpsUrl(program.transfer_url);
  const institution = escapeHTML(program.institution);
  const title = escapeHTML(program.program);
  return `
  <article class="program-card ${escapeHTML(transferClass)}">
    <div class="meta"><span>${escapeHTML(program.system)}</span><span>${escapeHTML(program.region || program.city)}</span><span>${escapeHTML(program.city)}, CA</span></div>
    <h3>${institution}</h3>
    <p class="program-title"><strong>${title}</strong></p>
    <ul class="tag-list" aria-label="Program features">
      ${(program.genres || []).map(g => `<li class="tag">${escapeHTML(g)}</li>`).join("")}
      <li class="tag">${escapeHTML(program.program_type)}</li>
      ${transferLabel}
    </ul>
    <p>${escapeHTML(program.summary)}</p>
    ${program.secondary_offering ? `<p class="small"><strong>Also:</strong> ${escapeHTML(program.secondary_offering)}</p>` : ""}
    ${program.transfer_note ? `<p class="transfer-note"><strong>CCC transfer note:</strong> ${escapeHTML(program.transfer_note)}</p>` : ""}
    <p class="small">Verified ${escapeHTML(formatDate(program.last_verified))}</p>
    <div class="button-row">
      ${programUrl ? `<a class="button secondary" href="${escapeHTML(programUrl)}" aria-label="Explore ${title} at ${institution}">Explore program</a>` : ""}
      ${transferUrl ? `<a class="button" href="${escapeHTML(transferUrl)}" aria-label="View transfer guidance for ${institution}">Transfer guidance</a>` : ""}
    </div>
  </article>`;
};

window.CCC_GEOGRAPHY = {
  broadRegions: ["Southern California", "Central California", "Northern California", "Statewide/Online"],
  localAreasByBroadRegion: {
    "Southern California": ["Los Angeles Area", "Orange County", "Inland Empire", "Ventura Area", "San Diego Area", "Imperial Valley", "Desert"],
    "Central California": ["Central Coast", "Central Valley"],
    "Northern California": ["Bay Area", "Sacramento Area", "Sierra/Tahoe", "North Coast", "North/Far North"],
    "Statewide/Online": ["Statewide/Online"]
  }
};

const populateGeographyFilters = (broadSelect, localSelect, options = {}) => {
  if (!broadSelect || !localSelect) return () => {};
  const broadBlank = options.broadBlank || 'All of California';
  const localBlank = options.localBlank || 'All local areas';
  const geography = window.CCC_GEOGRAPHY;

  broadSelect.innerHTML = `<option value="">${broadBlank}</option>`;
  geography.broadRegions.forEach(value => broadSelect.add(new Option(value, value)));

  const refreshLocalAreas = () => {
    const current = localSelect.value;
    const selectedBroad = broadSelect.value;
    const areas = selectedBroad
      ? (geography.localAreasByBroadRegion[selectedBroad] || [])
      : geography.broadRegions.flatMap(region => geography.localAreasByBroadRegion[region] || []);
    localSelect.innerHTML = `<option value="">${localBlank}</option>`;
    areas.forEach(value => localSelect.add(new Option(value, value)));
    if (areas.includes(current)) localSelect.value = current;
  };

  refreshLocalAreas();
  return refreshLocalAreas;
};

const SUBMISSION_AUDIENCE_LABELS = {
  'all-ccc': 'All community college students',
  'location-based': 'Location-based eligibility',
  'college-students-alumni': 'Current/former students of the publishing college',
  'open-to-everyone': 'Open to everyone',
  'needs-verification': 'Eligibility needs verification'
};

const submissionAudienceTags = journal => Array.isArray(journal.submission_audience_tags)
  ? journal.submission_audience_tags
  : [];

window.populateGeographyFilters = populateGeographyFilters;
window.SUBMISSION_AUDIENCE_LABELS = SUBMISSION_AUDIENCE_LABELS;
window.submissionAudienceTags = submissionAudienceTags;


// Accessibility reporting links include the current page so barriers are easier to reproduce.
(() => {
  const links = document.querySelectorAll('[data-accessibility-report-link]');
  if (!links.length) return;
  const subject = 'CCC Writers Accessibility Issue';
  const body = `Page: ${window.location.href}\n\nWhat were you trying to do?\n\nWhat barrier did you encounter?\n\nBrowser/device or assistive technology (optional):\n`;
  const href = `mailto:karencrozer@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  links.forEach(link => { link.href = href; });
})();

window.loadJsonWithFallback = async (url, fallbackValue) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Could not load ${url}`);
    return await response.json();
  } catch (error) {
    if (fallbackValue !== undefined && fallbackValue !== null) return fallbackValue;
    throw error;
  }
};

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

const submissionStatus = (journal, now = new Date()) => {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

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
  const genres = (journal.genres || []).map(g => `<li class="tag">${g}</li>`).join("");
  const eligibility = (journal.eligibility || []).join(" · ");
  const verified = journal.last_verified ? `Verified ${formatDate(journal.last_verified)}` : "Verification date not listed";
  return `
    <article class="journal-card" data-journal-id="${journal.id}">
      <div class="meta"><span>${journal.college}</span><span>${journal.city}, CA</span></div>
      <h3><cite>${journal.journal}</cite></h3>
      <p class="status ${status.key}">${status.label}</p>
      <ul class="tag-list" aria-label="Genres">${genres}</ul>
      <p><strong>Who can submit:</strong> ${eligibility || "Not yet verified"}</p>
      <p class="small">${verified}${journal.source_url ? ` · <a href="${journal.source_url}" aria-label="Verification source for ${journal.journal}">Verification source</a>` : ""}</p>
      <div class="button-row">
        ${journal.journal_url ? `<a class="button secondary" href="${journal.journal_url}" aria-label="Visit ${journal.journal}">Visit journal</a>` : ""}
        ${journal.submission_url ? `<a class="button" href="${journal.submission_url}" aria-label="View submission details for ${journal.journal}">Submission details</a>` : ""}
      </div>
    </article>`;
};

const programCard = program => `
  <article class="program-card">
    <div class="meta"><span>${program.system}</span><span>${program.city}, CA</span></div>
    <h3>${program.institution}</h3>
    <p><strong>${program.program}</strong></p>
    <ul class="tag-list" aria-label="Program features">
      ${(program.genres || []).map(g => `<li class="tag">${g}</li>`).join("")}
      <li class="tag">${program.program_type}</li>
      ${program.transfer_pathway ? `<li class="tag">Transfer information</li>` : ""}
    </ul>
    <p>${program.summary}</p>
    <p class="small">Verified ${formatDate(program.last_verified)}</p>
    <div class="button-row">
      <a class="button secondary" href="${program.program_url}">Explore program</a>
      ${program.transfer_url ? `<a class="button" href="${program.transfer_url}">Transfer pathway</a>` : ""}
    </div>
  </article>`;

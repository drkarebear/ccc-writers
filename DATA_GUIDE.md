# Data Guide

## Journal record

```json
{
  "id": "college-journal-slug",
  "college": "College Name",
  "journal": "Journal Title",
  "city": "City",
  "region": "Southern California",
  "latitude": 34.00000,
  "longitude": -118.00000,
  "journal_url": "https://...",
  "submission_url": "https://...",
  "eligibility": ["Human-readable eligibility"],
  "eligibility_tags": ["campus", "all-ccc", "alumni", "public"],
  "genres": ["Poetry", "Fiction"],
  "accepting_year_round": false,
  "submission_periods": [
    {"label": "Fall 2026", "opens": "2026-09-01", "closes": "2026-12-31"}
  ],
  "last_verified": "2026-09-06",
  "source_note": "What the source establishes.",
  "source_url": "https://official-or-journal-source"
}
```

### Do not guess

If a current deadline cannot be verified, leave `submission_periods` empty. The interface will show **Deadline not verified**.

If an authoritative source explicitly says a journal is open or closed **now** but does not provide a complete date range, a short-lived `status_override` may be used:

```json
"status_override": {
  "key": "open",
  "label": "Accepting submissions · deadline not listed",
  "expires": "2026-12-05"
}
```

The `expires` field is required. After that date, the interface falls back to date-based logic or **Deadline not verified**. This prevents a manually verified “open now” label from remaining open forever.

## Program record

Program type values currently used by the filter:

- `Major`
- `Option/Concentration`
- `Specialization/Emphasis`
- `Minor`

Each program also includes a broad `region` browsing label. Region labels are for student discovery and are not official university classifications. Current labels include Bay Area, Central Coast, Central Valley, Inland Empire, Los Angeles Area, North/Far North, Orange County, Sacramento Area, San Diego County, and Ventura County.

`transfer_strength` uses three values:

- `published-ccc-pathway`
- `transfer-specific-guidance`
- `general`

Only set `transfer_pathway` to `true` when a specific official pathway has been verified and add the `transfer_url`.

## College coverage record

`college-coverage.json` tracks the 116-college census separately from journal records. This is intentional: **Still researching** must never be interpreted as **No active journal located**.

Coverage status values:

- `verified-active-journal` — a named active journal is supported by current or sufficiently recent authoritative evidence.
- `active-publication-details-needed` — current evidence confirms a literary publication effort, but a title, current issue, submission page, or another key detail remains unresolved.
- `recent-status-unclear` — a named recent or historical publication is documented, but current 2026 publication status cannot yet be verified.
- `still-researching` — research is incomplete or has not produced a strong enough lead.
- `no-journal-located` — a deliberate current-source review did not locate an active journal.
- `historical-inactive` — a historical publication is documented and evidence indicates that it stopped publishing or is explicitly inactive.

Use `no-journal-located` only after a deliberate review of current college sources. Never collapse `active-publication-details-needed`, `recent-status-unclear`, or `still-researching` into that category.

## Event record

```json
{
  "id": "event-slug",
  "title": "Event title",
  "host": "College or organization",
  "date": "2026-10-20",
  "time": "6:00 PM–8:00 PM",
  "format": "In person",
  "location": "Building, College, City, CA",
  "audience": "Who the event is for",
  "summary": "Short plain-language description",
  "url": "https://official-event-page",
  "last_verified": "2026-09-06"
}
```

Expired events are automatically hidden from the public upcoming-events list.


## Local Preview Note

`data/programs.json` remains the canonical program dataset. `data/programs-data.js` is a generated mirror used only so `pathways.html` can be previewed directly from a local file without Chrome blocking `fetch()` calls. Whenever `programs.json` changes, regenerate `programs-data.js` from the same JSON before publishing. GitHub Pages can use either source; the page prefers the generated local copy and falls back to JSON.


## Optional reading and journal-type fields

Journal records can also include:

- `latest_issue_url` — a verified HTTPS link to the current or latest readable issue. `Read CCC Writing` prefers this link over the general journal home page.
- `journal_type` — a short plain-language label when a publication needs scope clarification, such as `College-sponsored national journal`, `Student arts and letters magazine`, or `Umoja literary and arts journal`. Omit this field for ordinary student literary journals.

Do not add a current-issue link unless the issue itself has been verified. Do not infer that a college-sponsored journal is student-run.

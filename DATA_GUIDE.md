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

Only set `transfer_pathway` to `true` when a specific official pathway has been verified and add the `transfer_url`.

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

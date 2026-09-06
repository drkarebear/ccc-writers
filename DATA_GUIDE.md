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
  "source_note": "What the source establishes."
}
```

### Do not guess

If a current deadline cannot be verified, leave `submission_periods` empty. The interface will show **Deadline not verified**.

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
  "format": "In person",
  "location": "City, CA",
  "url": "https://official-event-page"
}
```

Expired events are automatically hidden from the public upcoming-events list.

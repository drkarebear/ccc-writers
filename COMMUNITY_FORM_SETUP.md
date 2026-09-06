# CCC Writers Community Contribution Form Setup

The site is designed for moderated community submissions. Contributors do not need a CCC Writers account, and nothing should publish automatically.

## Recommended setup: one Google Form

A ready-to-run Google Apps Script is included at:

`setup/google-form-builder.gs`

### Create the form

1. Open Google Apps Script while signed into the Google account that should own the form.
2. Create a new project.
3. Replace the starter code with the contents of `setup/google-form-builder.gs`.
4. Run `createCCCWritersContributionForm()` once.
5. Approve Google's requested permissions.
6. Open **Execution log**. Copy the **PUBLIC FORM URL**.
7. Open `data/site-config.json` in this repository and paste that URL between the quotation marks for `community_form_url`.
8. Commit the change. The **Open the Community Contribution Form** button on `contribute.html` will appear automatically.

Example:

```json
{
  "community_form_url": "https://docs.google.com/forms/d/e/EXAMPLE/viewform"
}
```

## Form settings to keep

- Do **not** require sign-in.
- Do **not** limit to one response.
- Do **not** automatically collect email addresses.
- Do **not** allow public responses to publish directly to the website.
- Keep name and email optional and use them only for follow-up.
- Do not add file-upload questions. File uploads force Google sign-in and create unnecessary privacy/storage concerns.

## Moderation workflow

Use the linked response spreadsheet as an inbox:

1. Review the official source URL.
2. Verify the college/institution and listing title.
3. Verify dates, eligibility, genres, event details, or program information.
4. Update the appropriate JSON file in `data/`.
5. Set or update `last_verified` in the public record.
6. If information cannot be verified, do not guess. Mark it as needing verification or leave it unpublished.

## Why this design

The form is intentionally separate from the public data. That prevents spam or accidental misinformation from becoming live content while still letting students, faculty, journal editors, and campus staff help maintain the statewide directory.

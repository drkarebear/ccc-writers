# CCC Writers — Starter Repository

**Working title:** CCC Writers  
**Purpose:** A statewide discovery hub for California Community College creative writers.

This is a static GitHub Pages prototype built with plain HTML, CSS, JavaScript, JSON, and Leaflet. It does not require a database.

## Visual identity

The site palette is built around the California-and-quill mark: deep navy (`#06265E`) and warm gold (`#ECB632`). Gold is used mainly as an accent or on dark backgrounds; body text and interactive controls use darker colors that meet accessible contrast targets. Headings use a restrained serif stack for a literary feel, while body copy stays in a highly readable system sans-serif stack.

## What is included

- `index.html` — student-first homepage
- `journals.html` — interactive California literary journal map + accessible filtered directory
- `submissions.html` — submission finder driven by the same journal data
- `events.html` — upcoming event board (ready for moderated submissions)
- `pathways.html` — Creative Writing Transfer Pathways finder for CSU/UC programs
- `read.html` — browse verified CCC journal and publication pages
- `coverage.html` — 116-college journal research coverage tracker
- `journal-toolkit.html` — research-informed best practices for starting, improving, and sustaining a CCC literary journal
- `contribute.html` — placeholder for moderated add/update forms
- `about.html` — scope, independence, accessibility, and data principles
- `assets/images/ccc-writers-mark.png`, `favicon.png`, `favicon-48.png`, and `apple-touch-icon.png` — California-and-quill visual identity in deep navy and warm gold
- `data/journals.json` — journal/location/deadline/eligibility data
- `data/programs.json` — CSU/UC program data
- `data/events.json` — event data

## Submission eligibility tags

Each journal now carries `submission_audience_tags` for student-facing filtering. The tags distinguish journals open to all community college students, location-based eligibility, college students/alumni, publications open to everyone, and records whose current eligibility still needs verification. Location-based records can also carry `eligibility_area` so a geographic restriction is not confused with the journal’s own campus location.

## Why one journal dataset matters

The journal map and the submission finder both read `data/journals.json`. A deadline or eligibility rule should be corrected once, not separately on multiple pages.

## Statewide journal research set

The journal dataset now contains **69 researched California community college literary journal records**. The 116-college coverage tracker currently identifies **67 colleges with a verified active journal**, **4 with a confirmed publication that still needs key details**, **3 recent/historical leads whose current status is unclear**, **39 still under research**, **2 where no active journal was located after review**, and **1 historical/inactive journal**.

The dataset intentionally distinguishes among:

- a journal verified as active;
- a submission window verified as open;
- a known past window that is now closed; and
- an active journal whose current deadline still needs verification.

That distinction is important: an old call for submissions should never be presented to students as current simply because the journal itself still exists.

University pathway starter records:

- UC Riverside — B.A. in Creative Writing
- CSU Northridge — English B.A., Creative Writing Option
- CSU Long Beach — English B.A., Creative Writing Option
- San Francisco State University — B.A. in Creative Writing

## Data verification principle

Every record should include `last_verified`. Unknown information stays unknown rather than being inferred.

Before adding a deadline, eligibility rule, or transfer pathway, verify it from an official college, journal, CSU, UC, or other authoritative source.

## Publish with GitHub Pages

1. Create a new GitHub repository (for example, `ccc-writers`).
2. Add the contents of this folder to the repository root.
3. In GitHub, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and `/ (root)` folder.
6. Save.

All links in the project are relative, so the site can run correctly from a project URL such as `https://USERNAME.github.io/ccc-writers/`.

## Local preview

Because the pages use `fetch()` to read JSON, do not test by double-clicking the HTML files. Run a small local server instead:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Map note

The prototype uses Leaflet and standard OpenStreetMap tiles. This is fine for development and light use, but a higher-traffic public site should review OpenStreetMap tile usage requirements and choose an appropriate production tile provider or hosting approach.

The map is never the only route to journal information; the complete accessible directory appears directly below it.

## Accessibility baseline

The starter includes:

- skip links
- semantic landmarks and headings
- keyboard-visible focus states
- minimum 44px interactive controls
- non-color status text
- responsive reflow
- reduced-motion support
- searchable/list-based alternatives to the map
- explicit labels for form controls

A production launch should still receive keyboard, screen-reader, zoom/reflow, contrast, WAVE, and axe testing.

## Privacy baseline

The static site itself has no user accounts, cookies, analytics, or database. The map loads third-party map tiles, which means a visitor's browser contacts that tile provider. If community forms are later embedded or linked, document their privacy implications on the site.

## Research sources

Each journal record carries its own `source_url`, `last_verified`, and `source_note` so verification travels with the data instead of living in a separate spreadsheet. Current journal research prioritizes official college or journal pages.

The Los Angeles Mission College record also uses current information supplied directly by the journal/department project team: current LAMC students and alumni may submit September 1 through December 31 at https://forms.gle/SkE9NdLeH6qfVnco7. The official LAMC journal page is https://www.lamc.edu/academics/pathways/scc/english-dept/student-literary journal.

University-pathway starter sources include official pages from UC Riverside, CSU Northridge, CSU Long Beach, and San Francisco State University.


## Journal Toolkit research base

The toolkit synthesizes practices from current community college publishing models and professional/accessibility guidance, including:

- Orange Coast College — ENGL A011: Intro to Literary Magazine Production
- Reedley College — *Kings River Review* / ENGL 15J
- Sacramento City College — College Literary Magazine + Production courses
- San Bernardino Valley College — *Phineas Literary Magazine* and blind review
- Community College Humanities Association — Literary Magazine Competition criteria
- Community of Literary Magazines and Presses — Contest Code of Ethics
- *Poets & Writers* — copyright and publication-rights guidance
- W3C Web Accessibility Initiative — design, image, heading, link, and responsive-accessibility guidance

## Best next build steps

1. Use the existing journal dataset to strengthen the student-facing submission finder, especially genre and eligibility filters.
2. Resolve the highest-confidence remaining journal leads through community corrections and scheduled re-verification rather than indefinite broad searching.
3. Expand and verify CSU/UC creative writing pathways.
4. Build a moderated form for journal corrections and event submissions.
5. Add a simple data-validation workflow so malformed JSON cannot break the site.
6. Add a scheduled re-verification workflow for time-sensitive submission statuses.
7. Conduct a full WCAG 2.2 AA review before public launch.

## Community contributions

CCC Writers supports a moderated community-submission workflow. A Google Form builder is included at `setup/google-form-builder.gs`, with setup instructions in `COMMUNITY_FORM_SETUP.md`. The public form URL is stored once in `data/site-config.json`; `contribute.html` reads that value and reveals the submission button automatically.

Nothing submitted through the form should publish automatically. Verify the official source, then update the appropriate JSON record and `last_verified` date.


## Community Contribution Form

The community contribution form is live and configured in `data/site-config.json`:

- Public form: https://docs.google.com/forms/d/e/1FAIpQLScNDhUFguVe67-bDuya3QqW_m8S8KyjadbnJ2UrHjBOChzoyw/viewform
- Public contribution links fall back to `contribute.html` if the configuration cannot be loaded.
- Community submissions are moderated before any listing is changed.


## CSU / UC pathway research

The September 7, 2026 pathway data now represents all 22 CSU universities and all 9 undergraduate UC campuses. There are 31 campus writing routes in the directory: 27 formal named creative-writing pathways and 4 clearly labeled coursework-only CSU routes. The audit also corrected Cal Poly SLO's older Creative Writing Emphasis label, updated CSU Bakersfield's current Creative Writing Specialization and new minor, and added the previously missing Cal Poly Pomona, CSU San Marcos, and Stanislaus State records. The directory distinguishes published CCC/ADT maps, transfer-specific guidance, and general transfer planning. See `data/programs.json`, `research/PASS_1_UC_CREATIVE_WRITING_PATHWAYS_2026.md`, and `research/PASS_2_CSU_CREATIVE_WRITING_PATHWAYS_2026.md`.


## Student-facing geography

The September 7, 2026 geography cleanup standardizes location filtering across journals, submissions, pathways, the statewide coverage census, and events. Each record now has a broad region plus a local area. For example, a user can browse all of **Southern California** or narrow to **Los Angeles Area**, **San Diego Area**, **Orange County**, **Inland Empire**, or **Ventura Area**. The labels are discovery aids, not official administrative classifications.


## Security and privacy hardening

This build includes a restrictive Content Security Policy, strict referrer handling, Leaflet 1.9.4 loaded only on user request with Subresource Integrity, DOM-safe map popups, and dedicated Privacy and Accessibility pages. The interactive map is optional; the journal directory works without loading third-party map resources.

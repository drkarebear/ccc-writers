# CCC Writers — Starter Repository

**Working title:** CCC Writers  
**Purpose:** A statewide discovery hub for California Community College creative writers.

This is a static GitHub Pages prototype built with plain HTML, CSS, JavaScript, JSON, and Leaflet. It does not require a database.

## Visual identity

The site palette is built around the California-and-quill mark: deep navy (`#06265E`) and warm gold (`#ECB632`). Gold is used mainly as an accent or on dark backgrounds; body text and interactive controls use darker colors that meet accessible contrast targets. Headings use a restrained serif stack for a literary feel, while body copy stays in a highly readable system sans-serif stack.

## What is included

- `index.html` — student-first homepage
- `journals.html` — interactive California literary-journal map + accessible filtered directory
- `submissions.html` — submission finder driven by the same journal data
- `events.html` — upcoming event board (ready for moderated submissions)
- `pathways.html` — CSU/UC creative-writing program finder
- `journal-toolkit.html` — research-informed best practices for starting, improving, and sustaining a CCC literary journal
- `contribute.html` — placeholder for moderated add/update forms
- `about.html` — scope, independence, accessibility, and data principles
- `assets/images/ccc-writers-mark.png`, `favicon.png`, `favicon-48.png`, and `apple-touch-icon.png` — California-and-quill visual identity in deep navy and warm gold
- `data/journals.json` — journal/location/deadline/eligibility data
- `data/programs.json` — CSU/UC program data
- `data/events.json` — event data

## Why one journal dataset matters

The journal map and the submission finder both read `data/journals.json`. A deadline or eligibility rule should be corrected once, not separately on multiple pages.

## Statewide journal research set

The journal dataset now contains **25 researched California community-college literary-journal records**, spanning the North Coast, Bay Area, Central California, Los Angeles, Ventura County, Orange County, the Inland Empire, the desert, and San Diego County.

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

The Los Angeles Mission College record also uses current information supplied directly by the journal/department project team: current LAMC students and alumni may submit September 1 through December 31 at https://forms.gle/SkE9NdLeH6qfVnco7. The official LAMC journal page is https://www.lamc.edu/academics/pathways/scc/english-dept/student-literary-journal.

University-pathway starter sources include official pages from UC Riverside, CSU Northridge, CSU Long Beach, and San Francisco State University.


## Journal Toolkit research base

The toolkit synthesizes practices from current community-college publishing models and professional/accessibility guidance, including:

- Orange Coast College — ENGL A011: Intro to Literary Magazine Production
- Reedley College — *Kings River Review* / ENGL 15J
- Sacramento City College — College Literary Magazine + Production courses
- San Bernardino Valley College — *Phineas Literary Magazine* and blind review
- Community College Humanities Association — Literary Magazine Competition criteria
- Community of Literary Magazines and Presses — Contest Code of Ethics
- *Poets & Writers* — copyright and publication-rights guidance
- W3C Web Accessibility Initiative — design, image, heading, link, and responsive-accessibility guidance

## Best next build steps

1. Continue the statewide journal census until every California community college has been checked, including a clear “no active journal found” research state.
2. Expand and verify CSU/UC creative-writing pathways.
3. Build a moderated form for journal corrections and event submissions.
4. Add a simple data-validation workflow so malformed JSON cannot break the site.
5. Add a scheduled re-verification workflow for time-sensitive submission statuses.
6. Conduct a full WCAG 2.2 AA review before public launch.

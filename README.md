# CCC Writers — Starter Repository

**Working title:** CCC Writers  
**Purpose:** A statewide discovery hub for California Community College creative writers.

This is a static GitHub Pages prototype built with plain HTML, CSS, JavaScript, JSON, and Leaflet. It does not require a database.

## What is included

- `index.html` — student-first homepage
- `journals.html` — interactive California literary-journal map + accessible filtered directory
- `submissions.html` — submission finder driven by the same journal data
- `events.html` — upcoming event board (ready for moderated submissions)
- `pathways.html` — CSU/UC creative-writing program finder
- `journal-toolkit.html` — research-informed best practices for starting, improving, and sustaining a CCC literary journal
- `contribute.html` — placeholder for moderated add/update forms
- `about.html` — scope, independence, accessibility, and data principles
- `assets/images/favicon.svg` and `favicon.png` — accessible visual identity: light-blue writer holding a dark-blue heart
- `data/journals.json` — journal/location/deadline/eligibility data
- `data/programs.json` — CSU/UC program data
- `data/events.json` — event data

## Why one journal dataset matters

The journal map and the submission finder both read `data/journals.json`. A deadline or eligibility rule should be corrected once, not separately on multiple pages.

## Starter records

The prototype begins with a deliberately small set of records so the architecture can be tested before statewide research is loaded:

- Los Angeles Mission College — *La Misión Review*
- Reedley College — *Kings River Review*
- Los Angeles City College — *The Citadel*
- Sierra College — *Sierra Journal*

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

## Current source set used for prototype research

- Kings River Review: https://www.kingsriverreview.com/ and https://www.kingsriverreview.com/submit
- LACC, *The Citadel*: https://www.lacc.edu/academics/pathways/lhc/english-esl-dept/the-citadel
- Sierra College Press / *Sierra Journal*: https://www.sierracollege.edu/library/sierra-college-press/
- UC Riverside Creative Writing: https://creativewriting.ucr.edu/undergraduate
- CSU Northridge Creative Writing Option: https://catalog.csun.edu/academics/engl/programs/ba-english-ii/creative-writing-option/
- CSU Northridge transfer road maps: https://catalog.csun.edu/resource/transfer-road-map/engl/
- CSU Long Beach English B.A.: https://www.csulb.edu/college-of-liberal-arts/english/bachelor-of-arts-ba
- San Francisco State Creative Writing: https://creativewriting.sfsu.edu/

The Los Angeles Mission College starter record uses current information supplied directly by the journal/department project team: current LAMC students and alumni may submit September 1 through December 31 at https://forms.gle/SkE9NdLeH6qfVnco7. The official LAMC journal page is https://www.lamc.edu/academics/pathways/scc/english-dept/student-literary-journal.


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

1. Decide the final site name and visual identity.
2. Research all California Community Colleges for active literary journals.
3. Add source URLs and verification notes to every record.
4. Build a moderated Google/Microsoft Form for journal corrections and events.
5. Add a simple data-validation workflow so malformed JSON cannot break the site.
6. Conduct a full WCAG 2.2 AA review before public launch.

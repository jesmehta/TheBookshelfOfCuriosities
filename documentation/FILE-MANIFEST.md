# File Manifest

Every code/config file in this repo and its role, organized by subsystem.
Companion to `README.md`'s own "Structure" section (the practical guide);
this is the exhaustive map, same relationship Cabinet's `FILE-MANIFEST.md`
has to its own `README.md`, and fffx's `FILE-MANIFEST.md` has to its own.
Not auto-built — update by hand alongside structural changes, same as
every other doc here. Generated 2026-09-05, alongside the `documentation/`
reorg that moved `BOOKSHELF-EDITOR.md`, `DESIGN-SYSTEM.md`, and
`LANDING-PAGE-NOTES.md` off repo root into per-feature folders, and the
`docs/` reorg (same date) that split `docs/assets/`/`docs/stylesheets/`
into the `_assets/`/`_images/` convention below.

## Root-level files

Only `README.md` and `WORLD-SYSTEMS.md` are root-required, matching
Cabinet's and fffx's own convention. `README.md` is a git/GitHub hosting
convention (root is where it's expected to render); `WORLD-SYSTEMS.md` is
hand-synced byte-for-byte across Cabinet/Bookshelf/fffx with its path
assumed identical in all three, so it can't move here without desyncing
the other two repos.

| File | Role |
|---|---|
| `README.md` | Practical guide: structure, deploy pipeline, landing-page intent/data model, changelog. Start here. |
| `WORLD-SYSTEMS.md` | Conventions shared across Cabinet/Bookshelf/fffx (data schema, status model, homepage rule). Hand-synced identically across all three repos — don't edit without also updating the other two. Currently stale (predates Cabinet's own 3-world rewrite of this file) — pending sync, tracked separately. |
| `mkdocs.yml` | MkDocs site config: nav tree, theme (slate scheme, custom primary via token override), plugins (`mkdocs-video`, `section-index` — see `LANDING-PAGE-NOTES.md` bug #8 for why the latter is needed), `extra_css`. |
| `requirements.txt` | Python deps for `mkdocs build`/`mkdocs serve`. If this machine has more than one Python install, `mkdocs` on `PATH` may resolve to a different one than `pip`/`py -3` — check `where mkdocs` vs `where python`/`py -3 -m pip show mkdocs` before assuming a package installed in one is visible to the other. |
| `CNAME` | Custom domain (`bookshelf.cabinetofcuriosities.in`) for GitHub Pages. |
| `.github/workflows/deploy.yml` | CI: `mkdocs build --site-dir public`, copies every standalone static sub-project under `projects/` into `public/`, then `actions/configure-pages` → `upload-pages-artifact` → `deploy-pages`. |
| `run-bookshelf-editor.bat` | Double-click launcher for `tools/bookshelf-editor.js` (the Admin Dash). |
| `.gitignore` | Ignores the versioned `.zip` archives under `zips/` (see below) and standard editor/OS cruft. |

## `documentation/` — project documentation, not root-required

Organized 2026-09-05 into one folder per feature, mirroring Cabinet's and
fffx's own `documentation/` structure. A subsystem with only one doc file
stays flat at `documentation/` root rather than getting a single-file
folder of its own — currently none do besides this manifest.

| File | Role |
|---|---|
| `FILE-MANIFEST.md` | This file. |

### `landing-page-notes/` — the landing page's visual + implementation design

| File | Role |
|---|---|
| `DESIGN-SYSTEM.md` | Visual language: typography, colour tokens, card/frame states, per-`frameMood` treatments. Own changelog, V1.1–V4.0+ phases, including the V1–V3 frame/mat system's full removal appendix. |
| `LANDING-PAGE-NOTES.md` | Portable MkDocs/Material implementation lessons — bugs hit, MkDocs-vs-plain-HTML reconciliations, a starter checklist for a sibling site. |

No conversation-log doc exists yet for this subsystem's original build — a
gap shared with fffx's equivalent folder before its own origin-conversation
recovery; not yet attempted here.

### `bookshelf-editor/` — the Admin Dash

| File | Role |
|---|---|
| `BOOKSHELF-EDITOR.md` | Design decisions and as-built record for `tools/bookshelf-editor.js` (mirrors Cabinet's `CABINET-EDITOR.md` and fffx's `FFFX-EDITOR.md`) — architecture, routes, files, update workflow, verified checks, todo, changelog. |
| `conversation-bookshelf-editor.md` | Conversation-log companion, recorded from the same live transcript as fffx's `conversation-fffx-editor.md` — this repo's Admin Dash was planned in one combined conversation covering both fffx and Bookshelf together, then built second. |

### `content/` — editorial documentation (what got written and why)

Umbrella for content-initiative docs, kept separate from the technical
subsystem docs above — these cover the actual written material (poems,
essays), not code or site mechanics. One subfolder per initiative; each
pairs a `*-CONTENT.md` reference doc with a `conversation-*.md` log of the
actual back-and-forth that produced it.

| File | Role |
|---|---|
| `favorite-poems/FAVORITE-POEMS-CONTENT.md` | What the three Favourite Poetry collections (`general/`/`long-poems/`/`workshop/`) are, where their source `.docx` files came from, the now-deleted custom docx→Markdown extraction pipeline, and editorial conventions (no invented prose, cross-link style, `poetry.com` sourcing). |
| `favorite-poems/conversation-favorite-poems-content.md` | Conversation-log companion — the user's own words behind the decisions above. |
| `my-writings/MY-WRITINGS-CONTENT.md` | What the three My Writings collections (`essays/`/`miscellany/`/`poems/`) are, their source `.docx`/`.pdf` files, the pandoc-based conversion approach, and editorial conventions (byline/date format, footnote handling). |
| `my-writings/conversation-my-writings-content.md` | Conversation-log companion for the above. |

## `content/` — canonical data sources (hand-edited, or via the Admin Dash)

| File | Role |
|---|---|
| `content/bookshelf-sections.tsv` | Section registry: `id, title, order, status, feature`. `feature` is optional, skipped from generated output when blank. No `weight` column — see `WORLD-SYSTEMS.md`'s note that Bookshelf has none; card size is set directly per-entry via `span` instead. |
| `content/bookshelf-entries.tsv` | Entry registry: `id, title, subtitle, href, section, kind, kicker, displayTag, tags, location, status, order, ghost, span, titleVariant`. `titleVariant` is optional, skipped when blank. `span` is a fixed `c4`–`c12` 12-column grid width, not a derived weight. Literal `<br>` and quote characters in cells (e.g. `scifi`'s `title`/`subtitle`) are real content, not TSV escaping — the parser/serializer must stay a naive tab-splitter, never CSV-quote-aware. |

## `tools/` — build and authoring scripts (never shipped to `docs/`)

| File | Role |
|---|---|
| `build-bookshelf-content.js` | Parses both `bookshelf-*.tsv` files into `docs/_assets/backend/js/bookshelf-generated-content.js`. Independent implementation from `bookshelf-tsv.js`'s parser (not refactored onto it), same as fffx's equivalent script. |
| `bookshelf-tsv.js` | Shared TSV parse/serialize/validate logic used by the Admin Dash server. Plain strict tab/newline splitter (no CSV-quote-awareness) — load-bearing here, since this schema's data genuinely contains literal `<br>`/quote characters that quoting would corrupt. |
| `bookshelf-editor.js` | Local-only zero-dependency Node HTTP Admin Dash server (`/admin/`, port `7858` by default, `BOOKSHELF_EDITOR_PORT` to override) — TSV CRUD/validate API plus two build-script routes (`rebuild-content`, `mkdocs-check`), all in one process (unlike Cabinet's editor-server/admin-controls-server split). |
| `bookshelf-editor-ui/index.html`, `editor.css`, `editor.js` | The Admin Dash's browser UI — Sections/Entries/Build tabs, sortable/resizable columns, a `<select>` for `span`/`location` from the fixed value lists documented in `WORLD-SYSTEMS.md`. |

## `docs/` — the live MkDocs site + standalone landing page

Reorganized 2026-09-05 around Cabinet's/fffx's own convention: a leading
underscore marks "supporting files, not a browsable page." Content page
folders (`docs/index.html`) were not relocated — MkDocs derives a page's
URL from its `docs/` path. `docs/agatha.md` (the old "Agatha Christie"
nav placeholder stub) was removed 2026-09-12 once Christie went live as
`projects/christie/` with a real absolute-URL nav entry, matching how
`scifi`/`asimov` are linked.

| Path | Role |
|---|---|
| `docs/index.html` | Standalone landing page — the firefly-lit gallery-wall field. Not rendered through Material's theme; MkDocs copies it through byte-for-byte. |
| `docs/favorite-poems/` | Plain Material content pages — poems by other poets. See `documentation/content/favorite-poems/FAVORITE-POEMS-CONTENT.md` for the `general/`/`long-poems/`/`workshop/` sub-collection layout and page conventions. |
| `docs/my-writings/` | Plain Material content pages — my own essays/miscellany/poems. See `documentation/content/my-writings/MY-WRITINGS-CONTENT.md`. |
| `docs/_images/` | `asimov.jpg`, `favicon.svg`, `hamzanama.jpg`, `scifi.jpg` — nav/card thumbnail images. |

### `docs/_assets/` — CSS/JS shipped to production

Split into `backend/` (the landing page's own engine — hand-written plus
one generated file, kept together since it's one subsystem rather than
split further) and `material/` (pure MkDocs theme chrome), matching
fffx's own split.

| File | Role |
|---|---|
| `backend/css/bookshelf-tokens.css` | Single source of truth for colour/font `--bookshelf-*` custom properties — shared between the landing page and the Material theme mapping below. |
| `backend/css/bookshelf-landing.css` | All landing-page CSS, scoped under `.bookshelf-landing`. V4.0 full replacement of the V1–V3 frame/mat system, removed entirely rather than left dead. |
| `backend/js/bookshelf-data.js` | Hand-edited stable config — display/config blocks not sourced from TSV. |
| `backend/js/bookshelf-generated-content.js` | Auto-generated from `content/bookshelf-*.tsv` by `tools/build-bookshelf-content.js` — do not hand-edit. |
| `backend/js/bookshelf-gallery.js` | Gallery rendering: card layout, dormant-card states, `span`-based grid placement. |
| `backend/js/bookshelf-cursor.js` | Custom cursor behaviour for the landing page. |
| `backend/js/bookshelf-particles.js` | The firefly particle-field simulation (state-machine sim as of V4.1 — see `DESIGN-SYSTEM.md`'s changelog). |
| `backend/js/bookshelf-reveal.js` | Scroll/reveal animation logic. |
| `material/css/bookshelf-material.css` | Maps `bookshelf-tokens.css`'s values onto MkDocs Material's own `--md-*` variables, so every non-landing page matches the landing page's palette. |

## `projects/` — standalone static sub-projects (no MkDocs build step)

Copied into `public/` verbatim by `.github/workflows/deploy.yml` (one
`cp -r` per subfolder, no allow-list — see README's "Adding a new
standalone static project"), served at their own path (`/scifi/`,
`/asimov/`, `/christie/`) alongside the MkDocs site. Moved under this
parent folder 2026-09-12 when Christie became the third such project,
firing the "root clutter threshold" plan recorded in README.md. Each
project's own docs (design notes, conversation logs) live inside its own
folder here, same as `scifi`'s `README.md`/`ToDo.md` and `asimov`'s
`Readme_N_*.md` set — the top-level `documentation/` tree is reserved for
mainstream MkDocs-integrated Bookshelf content (`bookshelf-editor/`,
`content/`, `landing-page-notes/`), not these standalone sub-projects.

| Path | Role |
|---|---|
| `projects/scifi/` | "The Golden Age of SciFi" interactive timeline — own `README.md`/`ToDo.md`, own `data/` (TSV + generated JSON), own `index.html`/`script.js`/`style.css`. Independent of the Bookshelf TSV/Admin Dash pipeline entirely. |
| `projects/asimov/` | "Isaac Asimov and the Foundation Series" timeline — own four-file `Readme_N_*.md` doc set (overview, design brief, working context, todo/decisions — an earlier, differently-shaped take on the same four-tier documentation principle), `app.js`, `data.js`, `index.html`, `style.css`. |
| `projects/christie/` | "Agatha Christie — Murder, She Wrote" — timeline + table + Short Stories tab (`christie-timeline-v3.html`), plus a separate map atlas (`christie-atlas-v2.html`, not yet wired into the tab UI), own `documentation.md` (design/font/changelog record) and `conversation-christie.md` (the reasoning behind it), the pre-repo conversation's own `christie-project-history.md`/`christie-timeline-changelog.md`, the two bibliography research tables this project started from (`agatha-christie-location-timeline.md`/`-v2.md`), and `fonts/`. |

## Archival / not-live

| Path | Role |
|---|---|
| `archived-landing-pages/bookshelf-index.md.bak` | Frozen pre-V4 landing-page markdown, from before the standalone `docs/index.html` shell replaced it. Not maintained, not authoritative for current behavior. |
| `zips/` | Versioned `.zip` snapshots (`sf_timeline_web_v1`–`v14`, `sf_timeline_data_v16`) of the SciFi timeline's pre-repo history — all gitignored except `zips/readme.md`. Local-only working history, not part of the deployed site. |

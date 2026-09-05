# Bookshelf Admin Dash — Design Decisions & As-Built Notes

A local-only Node HTTP admin server for editing `content/bookshelf-sections.tsv`
and `content/bookshelf-entries.tsv` through a browser UI instead of
hand-editing either file, plus buttons for the two build/check scripts
this repo has. Second of two copies built this session — see
`form-follows-fx/FFFX-EDITOR.md` for the first (built first since FFFX's
schema is the closer match to Cabinet's), and
`CabinetOfCuriosities/documentation/cabinet-editor/CABINET-EDITOR.md` for
the original this pattern is modeled on.

## Initial need

Same as FFFX's: Bookshelf already had a TSV → generated-JS content
pipeline (`tools/build-bookshelf-content.js`) but no editor — content was
hand-edited directly in the TSV files and rebuilt from the CLI. Cabinet
had since gained a full browser-based editor; this closes that gap here.

## Decisions and intent

Every architectural decision matches FFFX's copy (see `FFFX-EDITOR.md`'s
"Decisions and intent" for the full reasoning): separate,
independently-evolvable copy rather than a shared engine; one page
(Sections / Entries / Build tabs) rather than Cabinet's editor-server +
admin-controls-server split, since Bookshelf has no pre-existing separate
servers to avoid duplicating; no reserved/collapsible-column panel, since
Bookshelf's schema has no computed-over or intentionally-dormant columns
either. What's specific to Bookshelf:

**Literal `<br>` and quote characters are real cell content, not TSV/CSV
escaping.** Confirmed directly in the data (e.g. `scifi`'s `title` cell is
literally `Golden Age<br>Science Fiction`, its `subtitle` cell is wrapped
in literal `"` characters) and in `build-bookshelf-content.js`'s parser
(`line.split("\t")`, no quote-awareness at all). `bookshelf-tsv.js`'s
serializer therefore does a plain tab-join with **no escaping of any
kind** — the same naive approach FFFX's/Cabinet's already use, but here
it's load-bearing rather than incidental, since escaping (even
well-intentioned CSV-style quoting) would corrupt real data on the very
next save. Verified by a live round-trip: `PUT`ting the `scifi` row's
existing `<br>`/quote-bearing `title`/`subtitle` values back unchanged
produced a zero `git diff`.

**No `weight` field anywhere in this schema** (neither sections nor
entries) — confirmed via `WORLD-SYSTEMS.md`'s own note that Bookshelf
doesn't have one yet; card size is set directly per-entry via `span`
(`c4`–`c12`, a 12-column grid width) instead of derived from an
editorial-importance signal. `span` gets a `<select>` in the editor
(fixed list from `WORLD-SYSTEMS.md`'s documented values, all six of which
appear in the real data) rather than free text.

**`location` options differ from FFFX's** — Bookshelf's real data uses
`internal-html`/`internal-md` (FFFX uses `external`/`internal-md`); the
select list reflects what's actually in this repo's data plus the
documented `external` convention, not a copy-pasted list from FFFX.

**`sections.feature` and `entries.titleVariant` are optional, skip-if-blank
fields** in `build-bookshelf-content.js` (`if (row.feature) …`,
`if (row.titleVariant) …`) — same "optional, not required" treatment as
FFFX's `thumbnail`/`sourceFolder`/`relatedLinks`, just different field
names for this schema.

**Build tab has exactly two actions**, same reasoning as FFFX: no
static-build/promote/sitemap step exists in this repo either — Bookshelf
deploys straight from `docs/` via GitHub Actions on push (confirmed: no
`build-static.mjs`/`promote.mjs`/sitemap generator anywhere in the repo).
"Rebuild content" (`node tools/build-bookshelf-content.js`, after
validating both TSVs) and an `mkdocs build --strict` check against a
throwaway tmp site-dir.

## Architecture

```text
content/bookshelf-sections.tsv     -- source of truth, hand-edited or via the admin server
content/bookshelf-entries.tsv      -- source of truth, hand-edited or via the admin server
      |
      |  tools/bookshelf-tsv.js (shared: parse/serialize/validate)
      v
tools/build-bookshelf-content.js   -- CLI build: TSV -> docs/assets/js/bookshelf-generated-content.js (pre-existing, untouched)
tools/bookshelf-editor.js          -- local admin server: TSV CRUD API + the two build routes + static UI serving
tools/bookshelf-editor-ui/         -- the admin server's browser UI (index.html/editor.css/editor.js)
run-bookshelf-editor.bat           -- double-click launcher
```

`tools/bookshelf-tsv.js` is a plain tab/newline splitter with **no
escaping on write** — see "Decisions and intent" above for why this is
load-bearing here, not incidental.

`tools/bookshelf-editor.js` routes — identical shape to FFFX's (see
`FFFX-EDITOR.md`'s route table):

```text
GET    /api/state
POST   /api/sections           PUT /api/sections/:index           DELETE /api/sections/:index
POST   /api/sections/:index/move
POST   /api/entries            PUT /api/entries/:index            DELETE /api/entries/:index
POST   /api/entries/:index/move
POST   /api/run/rebuild-content
POST   /api/run/mkdocs-check
```

Binds `127.0.0.1` only, no auth, port `7858` by default (configurable via
`BOOKSHELF_EDITOR_PORT` — distinct from FFFX's `6858` and Cabinet's
`5757`/`5858`/`5959` so any of them can run side by side).

`tools/bookshelf-editor-ui/` — same three-tab (Sections / Entries /
Build) UI as FFFX's, same sortable/resizable columns, same
`change`-event-saves, same "⇕ Expand text" toggle. `kicker`, `displayTag`,
`ghost`, `tags`, `href`, and `subtitle` render as textareas (the
"wide fields" set) specifically because these are the columns most likely
to carry the literal `<br>`/quote content described above — a wide
textarea makes multi-part values readable, though the lossless round-trip
itself comes from the serializer, not the widget.

## Files

```text
content/bookshelf-sections.tsv    -- source of truth
content/bookshelf-entries.tsv     -- source of truth

tools/bookshelf-tsv.js            -- shared TSV parse/serialize/validate
tools/build-bookshelf-content.js  -- TSV -> docs/assets/js/bookshelf-generated-content.js (pre-existing, untouched)
tools/bookshelf-editor.js         -- local admin server
tools/bookshelf-editor-ui/        -- browser UI (index.html/editor.css/editor.js)
run-bookshelf-editor.bat          -- double-click launcher
```

## Update workflow

1. `node tools/bookshelf-editor.js` (or double-click
   `run-bookshelf-editor.bat` from the repo root). Prints a URL — open
   `http://127.0.0.1:7858/admin/` (port configurable via
   `BOOKSHELF_EDITOR_PORT`). `Ctrl+C` stops it.
2. Add/edit/reorder/delete sections and entries through the UI. Rows in
   red show a validation problem on hover.
3. Build tab → "Rebuild content" regenerates
   `docs/assets/js/bookshelf-generated-content.js`; "mkdocs check" runs a
   strict sanity build against a tmp dir outside the repo.
4. Commit the TSVs and the regenerated `bookshelf-generated-content.js`
   together — the editor never commits anything itself.

Hand-editing the TSVs directly still works exactly as before.

## Verified

- `node -e "require('./tools/bookshelf-tsv.js')"` loads clean.
- Live server exercised against the real content files: fetched
  `scifi`'s real entry row (containing literal `<br>` in `title` and
  literal `"` quotes wrapping `subtitle`) via `/api/state`, `PUT` the same
  values back unchanged, `git diff` showed **nothing** — confirms
  byte-exact round-trip of the quirky content this repo actually has.
- "Rebuild content" via `/api/run/rebuild-content` produced the same
  output as running `node tools/build-bookshelf-content.js` directly, zero
  `git diff` on the generated file.
- "mkdocs check" via `/api/run/mkdocs-check` correctly ran
  `mkdocs build --strict` and surfaced its real output — currently fails
  on one pre-existing, unrelated warning (see Todo below).
- `/admin/` served the UI (`200`).

## Todo / watch out for

- **`mkdocs --strict` currently fails** on one pre-existing issue: the
  `nav:` config references a bare `#` that doesn't resolve to any
  documentation file. Not caused by this work.
- **`build-bookshelf-content.js` was left as-is**, not refactored to
  import from `bookshelf-tsv.js` — same scope decision as FFFX's copy, see
  `FFFX-EDITOR.md`'s Todo for the reasoning. The two `parseStatus`
  implementations (build script's and `bookshelf-tsv.js`'s) are
  independent copies today.
- **The literal-`<br>`/quote content is the single most important thing
  to preserve if this editor is ever modified.** Any future change to
  `bookshelf-tsv.js`'s serializer, or to `editor.js`'s `esc()`/textarea
  handling, should be re-verified against a real row containing both
  (`scifi` in the current data) before shipping — see "Verified" above
  for the exact check.
- **Windows line-ending noise is expected and harmless** — same as noted
  in `FFFX-EDITOR.md`.
- **No image/thumbnail upload**, no cascade-rename of section ids —
  same stance as FFFX's copy and Cabinet's original.

## Changelog

### v1.0 — initial build (2026-09-04/05)

`tools/bookshelf-tsv.js`, `tools/bookshelf-editor.js`,
`tools/bookshelf-editor-ui/` created; `run-bookshelf-editor.bat` added.
First editor for this repo — no prior tooling replaced. Built second,
after FFFX's copy (`form-follows-fx/FFFX-EDITOR.md`), adapting for this
repo's larger entries-schema divergence (`kicker`/`displayTag`/`ghost`/
`span`/`titleVariant` instead of `weight`/`thumbnail`/`sourceFolder`) and
its literal-HTML/quote cell content.

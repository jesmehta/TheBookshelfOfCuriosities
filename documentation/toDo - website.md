# ToDo — Website

Bookshelf's technical, structural and visual work: the landing page, its
blocks, deployment, and cross-world wiring. Created 2026-10-02, taking over the
detailed "Bookshelf — structure and deployment" section that used to live in
Cabinet's `toDo - website.md` (Cabinet keeps a one-line summary per item).
Content tracking is in `toDo - content.md`.

## Landing-page blocks

- [x] **Non-section blocks managed in a TSV** (2026-10-02, `307e162`,
  `4fa8f29`) — ticker, bands, quotes and the section feature blocks moved
  from hand-edited `bookshelf-data.js` (deleted) into
  `content/bookshelf-blocks.tsv`, with an Admin Dash Blocks tab. Order and
  wording are both editable; more quotes/bands are just more rows. Hero
  description and footer deliberately stay in `docs/index.html`.
- [x] **Re-anchoring** — `beforeSection` is gone: ticker/band/quote have
  their own `order` on the sections' number line, so hiding a section no
  longer hides a neighbouring block. The Empire band is kept at order 15
  with `status false` (it is about the hidden Empire section).
- [ ] **Stretch: more quotes/bands.** Now just new rows in the Blocks tab —
  a content decision, not a build task.
- [x] **Bookshelf's `WORLD-SYSTEMS.md` updated for the blocks TSV**
  (2026-10-02) — this copy now runs ahead of Cabinet's and fffx's, with a
  note at the top saying so.
- [ ] **Reconcile `WORLD-SYSTEMS.md` across all three repos** — one later
  pass covering every recent update, shared or world-specific (tracked in
  Cabinet's website todo).
- [ ] **Footer links are dead** — Cabinet ↗ / About / Index all point at `#`.

## Cross-world and navigation

- [ ] **Add explicit return links to Cabinet and FFFX.** No cross-world links
  in Bookshelf's `docs/` or content registries (confirmed 2026-09-16). Also add
  a Bookshelf home link inside the standalone SciFi, Asimov and Christie
  projects, which do not inherit MkDocs navigation.
- [x] **Regenerate Cabinet's sitemap** after the 2026-10-02 restructure
  (`CabinetOfCuriosities/tools/generate_sitemap.py` → `docs/compass/sitemap.md`).
  It reads Bookshelf's TSVs from GitHub, so re-run it after any future pushed
  Bookshelf TSV change.

## Hygiene

- [x] **`site/` in `.gitignore`** (`cf3907f`, 2026-10-02).
- [x] **Stale My Writings reference** in `FAVORITE-POEMS-CONTENT.md` now
  points at the doc's new home in Cabinet (`031f2d8`, 2026-10-02).
- [x] **LF/CRLF warnings stopped** with `.gitattributes`: `* text=auto eol=lf`,
  `*.bat text eol=crlf` (`197e2e1`, 2026-10-02). Index was already LF; only
  working copies changed. A TSV re-saved from Excel (CRLF) may still warn
  once when staged — git normalises it to LF.
- [ ] **Recover the original SciFi and Asimov conversation records if still
  available.** README flags both as archival gaps; keep them inside their own
  project folders.

## Done

- [x] **Christie publication routing** — `/christie/` canonical (`28fe92a`),
  reverified 2026-09-16.
- [x] **Project-internal research files not deployed** — each project's
  `documentation/` and `.md` files dropped at copy time (`bdddbe9`,
  2026-09-30).
- [x] **Assembled entry points validated + CI parity checks** — copy loop
  rejects a missing `index.html` or a MkDocs collision;
  `tools/validate-deployment.js` checks TSV/nav hrefs against the assembled
  `public/` (`2aaff79`, 2026-10-02). To run it locally, assemble `public/`
  the way `deploy.yml` does (into a temp dir, not the repo) first — run on a
  bare checkout it reports every href as missing.
- [x] **Favourite Poetry landing integration** (`1880cc9`, 2026-10-02).

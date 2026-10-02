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
- [ ] **`WORLD-SYSTEMS.md` still describes `bookshelf-data.js`.** That file
  is meant to be synced identically across Cabinet/Bookshelf/FFFX and is
  already marked stale; fix Bookshelf's lines in the next sync rather than
  editing one copy alone.
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

- [ ] **Add `site/` to `.gitignore`.** A bare `mkdocs build` writes `site/`
  into the repo; it is not ignored (happened once, 2026-10-02, deleted).
- [ ] **Stale My Writings reference** in
  `documentation/content/favorite-poems/FAVORITE-POEMS-CONTENT.md` (~242–252,
  points at `docs/my-writings/` and a now-missing `MY-WRITINGS-CONTENT.md`;
  that doc now lives in Cabinet at
  `documentation/content/writings/MY-WRITINGS-CONTENT.md`).
- [ ] **LF/CRLF warnings** on the TSVs and generated JS at every commit —
  consider a `.gitattributes` so they stop.
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

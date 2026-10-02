# ToDo — Website

Bookshelf's technical, structural and visual work: the landing page, its
blocks, deployment, and cross-world wiring. Created 2026-10-02, taking over the
detailed "Bookshelf — structure and deployment" section that used to live in
Cabinet's `toDo - website.md` (Cabinet keeps a one-line summary per item).
Content tracking is in `toDo - content.md`.

## Landing-page blocks

- [ ] **Decide how non-section blocks are managed** — ticker, text band,
  quote break, "Books as Data" block, writings band (all hand-edited in
  `docs/_assets/backend/js/bookshelf-data.js`), plus the hero description and
  footer in `docs/index.html`. Managing them means both *order/placement* and
  *wording*; a stretch goal is several instances of a type (e.g. two or three
  quotes). Editing the JS by hand is the fallback if no better plan works.
  Under discussion 2026-10-02.
- [ ] **Re-anchor the blocks pinned to sections.** The text band and quote
  break use `beforeSection: "<section id>"`; if that section is hidden, the
  block silently disappears with it. Already happened: the Empire text band
  (anchored to the now-hidden `empire-adventure-great-game`). The quote break
  is anchored to `book-data-visualisation` and is at risk if that section is
  hidden. Dealt with as part of the block-management decision above.
- [ ] **Footer links are dead** — Cabinet ↗ / About / Index all point at `#`.

## Cross-world and navigation

- [ ] **Add explicit return links to Cabinet and FFFX.** No cross-world links
  in Bookshelf's `docs/` or content registries (confirmed 2026-09-16). Also add
  a Bookshelf home link inside the standalone SciFi, Asimov and Christie
  projects, which do not inherit MkDocs navigation.
- [ ] **Regenerate Cabinet's sitemap** (`CabinetOfCuriosities/tools/generate_sitemap.py`
  → `docs/compass/sitemap.md`) after Bookshelf TSV changes — it still lists the
  pre-2026-10-02 Bookshelf cards.

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

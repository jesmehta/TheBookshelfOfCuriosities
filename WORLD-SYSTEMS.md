# World systems: the shared Level 1 pattern

This file documents the conventions shared across Level 1 worlds in the
Cabinet of Curiosities ecosystem — currently **The Bookshelf of
Curiosities** (this repo) and **fffx** (Form follows f(x)). It exists so
the two repos' development approach, data schema, and naming stay
normalized even though their *visual* identity is deliberately distinct
(this file does not touch either site's design system — see this repo's
`DESIGN-SYSTEM.md` / fffx's `DESIGN-SYSTEM.md` for that).

A duplicate of this file lives in both repos. It's intentionally
duplicated, not symlinked or submoduled — these are separate
repos/deployments, and a shared file living in only one of them would be
easy to forget to check. Keep both copies in sync by hand when this
pattern changes; if they drift, treat whichever was edited more recently
as correct and backport.

## Conceptual levels

- **Level 1** — a world/domain. The Cabinet of Curiosities itself,
  Bookshelf, fffx. Each is its own repo, its own MkDocs site, its own
  GitHub Pages deployment.
- **Level 2** — a section/room/region within a Level 1 world.
  Bookshelf's `bookshelfSections[]` (`Author Explorations`, `Book Data &
  Visualisation`, etc.); fffx's `sections[]` registry
  (`prompt-collections`, `tools-and-libraries`, etc.).
- **Level 3** — an actual object/page/tool/project. Bookshelf's
  `bookshelfEntries[]`; fffx's `entries[]` portals.

## The common Level 1 world pattern

Every Level 1 world in this ecosystem:

- Uses **MkDocs Material** for normal (non-landing) pages.
- Has a **custom landing page** for its own homepage — not a generic
  Material content page. Bookshelf and fffx both use standalone
  `docs/index.html` shells that bypass Material for the homepage. See
  "Homepage rule" below for which pattern new worlds should use.
- Keeps **content data outside the renderer** — no content strings or entry
  data live in gallery/layout code. Bookshelf uses hand-edited
  `docs/assets/js/bookshelf-data.js` for display/config blocks plus
  generated `docs/assets/js/bookshelf-generated-content.js` from TSV
  sources; fffx follows the same split with `fffx-data.js` and
  `fffx-generated-content.js`.
- Maps **CSS tokens into MkDocs Material pages** — a `*-tokens.css` file
  (raw colour/font values, `:root`-scoped, single source of truth) feeds
  both the landing page's own stylesheet and a `*-material.css` file
  that overrides Material's `--md-*` variables, so Material-rendered
  content pages match the landing page's palette instead of defaulting
  to Material's own light theme. See "Asset naming" below.
- Deploys via **GitHub Pages**, built by a `.github/workflows/deploy.yml`
  GitHub Action (`mkdocs build` → copy any standalone static
  sub-projects → `actions/deploy-pages`). Both repos' workflows are
  currently identical in structure.

### Local world data vs. Cabinet data

A Level 1 world's own data file controls what appears on **that world's
own landing page**. It does not control whether that world (or an item
within it) appears on the **Cabinet's** own map/index of worlds — that's
a separate concern, governed by whatever data file the Cabinet repo
itself uses to list its Level 1 worlds. A project can exist in
Bookshelf's `bookshelfSections[]` (so it renders on Bookshelf's own
landing page) without necessarily being surfaced on the Cabinet's map,
and vice versa.

### Cross-listed projects

A project can legitimately belong to more than one Level 1 world's data
file (e.g. a project that's both a Bookshelf "data visualisation" and an
fffx "tool"). When that happens, **each world's data file gets its own
entry**, but both entries should link to the **same canonical URL**
rather than each world hosting its own copy of the content. Don't fork
the content; do duplicate the listing.

## Standard shared data fields

Every Level 1 world's entries (Level 3 objects) should carry these
fields where applicable. World-specific fields beyond this list are
allowed and expected — every world has its own texture — but must be
documented in that world's own notes file (`README.md` for
Bookshelf, `LANDING-PAGE-NOTES.md` for fffx).

```js
id              // stable, unique within the world
title
subtitle
href            // relative, never root-absolute (breaks under a GitHub
                // Pages project subpath — see each world's notes for
                // the incident that taught this)
section
sections        // optional, for genuinely cross-listed-within-one-world entries
kind
order           // placement priority — see "order-based rendering" below
weight          // editorial/visual importance — see below
status          // see "Standard status model" below
tags
location
repo            // { name, url } — if the entry has its own source repo
```

`section` (singular) is what both worlds currently use for an entry's
one home section. `sections` (plural) is the forward-looking field for
an entry that's genuinely cross-listed across multiple sections *within
the same world's data file* — neither world needs this yet (no entry
currently lives in more than one section), so neither has added it
mechanically. Adopt `sections` only when that need actually arises,
rather than bolting on unused fields now.

Section objects (Level 2) should carry:

```js
{
  id,       // stable, kebab-case, never just the display title
  title,
  order,
  status    // true | "wip" | false — same model as entries, see below
}
```

## Standard status model

One field, doing both visibility and "is this finished" duty:

```js
status: true      // visible, normal
status: "wip"     // visible but muted/dormant/work-in-progress
status: false     // hidden/not rendered
```

Both worlds now use this model directly for entries. Bookshelf's legacy
`live` boolean is gone: `status: true` renders the active clickable card,
`status: "wip"` renders the visible dormant card, and `status: false`
hides the entry. Bookshelf sections also use `status` for visibility;
today they only use `true`/`false`, but the same `"wip"` value remains
available if a section-level dormant state is ever needed.

## `weight` vs. world-specific layout fields

`weight` is the shared editorial/visual-importance signal — how much
visual presence an entry deserves, independent of how each world's
renderer turns that into actual pixels:

- **Bookshelf does not have a `weight` field yet** — card size is set
  directly via its own `span` field (`c4`/`c5`/`c6`/`c7`/`c8`/`c12`, a
  12-column grid width), with no separate editorial-importance signal.
  Adding `weight` and deriving `span` from it is deferred — see TODOs
  below.
- **fffx** uses `weight` directly as the subdivision tile-area scoring
  multiplier (`scoreRectForEntry` in `subdivision.js`) — higher weight
  targets a larger rectangle.

## Homepage rule

New Level 1 worlds should default to a **standalone `docs/index.html`**
for a fully custom landing page, not `docs/index.md` rendered through
Material with the header hidden.
The standalone-HTML approach needs no header-hiding CSS/JS workaround,
no Markdown-pipeline risk for inline logic, and no `:has()`/sibling-walk
fragility — see fffx's `LANDING-PAGE-NOTES.md` for the full comparison.

**Do not create `docs/index.md` in a repo that uses `docs/index.html`** —
MkDocs will happily build both, but only one can actually serve as `/`,
and the collision is a confusing, easy-to-reintroduce mistake (see the
guard described in fffx's `README.md`/`LANDING-PAGE-NOTES.md`).

Bookshelf's previous `docs/index.md` shell is archived at
`archived-landing-pages/bookshelf-index.md.bak`; keeping the backup outside
`docs/` prevents MkDocs from publishing it.

## Asset naming

Preferred convention for new or reorganized worlds:

```text
docs/assets/js/
docs/assets/css/
docs/assets/images/
docs/assets/thumbs/
docs/stylesheets/        # Material-facing CSS only (tokens + material override)
```

World-prefixed CSS filenames, so it's unambiguous which world a
stylesheet belongs to even out of context:

```text
bookshelf-tokens.css
bookshelf-landing.css
bookshelf-material.css

fffx-tokens.css
fffx-landing.css
fffx-material.css
```

Browser-facing JS, spreadsheet sources, and generator scripts follow the
same world prefix:

```text
bookshelf-data.js
bookshelf-generated-content.js
bookshelf-gallery.js
content/bookshelf-sections.tsv
content/bookshelf-entries.tsv
tools/build-bookshelf-content.js

fffx-data.js
fffx-generated-content.js
fffx-layout.js
fffx-random.js
fffx-subdivision.js
content/fffx-sections.tsv
content/fffx-entries.tsv
tools/build-fffx-content.js
```

Spreadsheet TSV convention:

- Prefer ASCII-safe source values for content that will be edited in Excel.
  Use ` / ` for compact display separators and `...` for ellipses in TSV;
  generators may restore those aliases to middle dots and ellipses in
  selected rendered text fields.
- Do not apply display prettification globally. Never transform URLs, IDs,
  tags, locations, or machine-readable fields.
- Parse `status` case-insensitively so Excel's `TRUE`/`FALSE` cells and
  human-entered `WIP` normalize to the shared JS values `true`, `false`,
  and `"wip"`.

Both worlds' `*-tokens.css` and `*-material.css` files already follow
this. Both worlds' landing stylesheet has been renamed to
`*-landing.css` to match (was `bookshelf.css` in Bookshelf, `landing.css`
in fffx). Bookshelf's JS and images have been moved to
`docs/assets/js/` and `docs/assets/images/` (was `docs/js/`,
`docs/images/` as siblings of `docs/stylesheets/` at `docs/` root) —
`docs/stylesheets/` stays where it is, matching fffx's own layout.
fffx's `docs/images/` move (to `docs/assets/images/`) is still
deferred — see TODOs below.

## Order-based rendering

Preferred model, applied wherever safe to do so without rewriting a
renderer's core logic:

- Every section has `order`.
- Every entry/card has `order`.
- The renderer sorts by `order` rather than relying on array position or
  string-matching against a display title.

Bookshelf's sections previously had no `order` field at all (array
position was the only ordering signal) and its `beforeSection` pinning
mechanism (for the text-band/quote-break inserts) matched against each
section's *display name* — fragile, since renaming a section in the UI
silently broke the pin. Both fixed: sections carry `id`/`order`, entries
carry `section`/`order`, and `beforeSection` matches against the stable
`id` instead of the display title. See this repo's `README.md` changelog
for the specific commit.

fffx's `entries[]`/`sections[]` already used explicit `order` from the
start; no change needed there.

## TODOs (deferred, not done in this pass)

- ~~Review fffx's extra attributes~~ — done 2026-06-30: removed unused
  `era` and `sourceFolder`, renamed the rendered `image` field to
  `thumbnail`, and removed uncurated `relatedLinks`/`notes`. Retained
  `location` and `repo`; `repo` holds a genuine source-repository link.
- **Review Bookshelf's extra attributes** — `cat`/`ghost`/`titleVariant`
  and similar remain world-specific; some may be worth promoting to
  shared fields and some may be removable. Not started.
- **Derive `span` from `weight`** instead of maintaining both
  independently, if/when the card grid is revisited — Bookshelf does not
  currently have a `weight` field, so it would need to be added first.
- ~~Move Bookshelf's `docs/js/`, `docs/images/` under `docs/assets/`~~ —
  done 2026-06-30: `docs/assets/js/`, `docs/assets/images/`, all
  references updated (`index.md` script tags, `mkdocs.yml` favicon,
  prose in README.md/DESIGN-SYSTEM.md/LANDING-PAGE-NOTES.md).
- ~~Move fffx's `docs/images/` under `docs/assets/images/`~~ — done
  2026-06-30; image references and documentation were updated.
- **Cross-world `sections[]` fields** — add only when
  an actual cross-listed-within-one-world entry exists; not bolted on
  speculatively.
- **Stricter CI checks** — e.g. a lint step that fails the build if an
  entry's `section` value doesn't match any registered section `id`. Not
  added this pass.
- **Card component unification** — Bookshelf's cards and fffx's tiles
  remain two separate, world-specific render functions. Not merged into
  one shared component; the two sites' visual identities are
  deliberately distinct enough that a shared component would likely
  fight both designs.

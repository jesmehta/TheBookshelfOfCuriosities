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
- **Level 3** — an actual object/page/tool/project. Bookshelf's section
  `cards[]`; fffx's `entries[]` portals.

## The common Level 1 world pattern

Every Level 1 world in this ecosystem:

- Uses **MkDocs Material** for normal (non-landing) pages.
- Has a **custom landing page** for its own homepage — not a generic
  Material content page. Bookshelf's is `docs/index.md` (rendered
  through Material with the header/nav hidden); fffx's is a standalone
  `docs/index.html` (bypasses Material entirely). See "Homepage rule"
  below for which pattern new worlds should use.
- Is driven by **one data file** as the editable IA/content source — no
  content strings or card data live in the renderer. Bookshelf:
  `docs/js/bookshelf-data.js`. fffx: `docs/assets/js/data.js`.
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
section         // OR primarySection — see below
sections        // optional, for genuinely cross-listed-within-one-world entries
primarySection
kind
order           // placement priority — see "order-based rendering" below
weight          // editorial/visual importance — see below
status          // see "Standard status model" below
tags
location
repo            // { name, url } — if the entry has its own source repo
relatedLinks    // [{ label, href }]
notes
```

`section` (singular) is what both worlds currently use for an entry's
one home section. `primarySection`/`sections` (plural) are the
forward-looking fields for an entry that's genuinely cross-listed across
multiple sections *within the same world's data file* — neither world
needs this yet (no entry currently lives in more than one section), so
neither has added it mechanically. Adopt `primarySection`/`sections`
instead of `section` when that need actually arises, rather than
bolting on unused fields now.

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

fffx's `entries[]` already use this exactly. Bookshelf's cards currently
use a different boolean, `live` (`true` = clickable/full-colour,
`false` = dormant placeholder — visually equivalent to `status: "wip"`,
not `status: false`, since dormant cards still render). Bookshelf now
also carries a `status` field on every card, computed from `live`
(`live: true` → `status: true`, `live: false` → `status: "wip"`) — added
*alongside* `live`, not replacing it, since the renderer still reads
`live` directly. Bookshelf's per-section `enabled` boolean has been
replaced outright with `status` (`enabled: true/false` mapped 1:1 to
`status: true/false`), since no section currently needs the "wip" middle
state and the renderer was already trivial to update for that one.

## `weight` vs. world-specific layout fields

`weight` is the shared editorial/visual-importance signal — how much
visual presence an entry deserves, independent of how each world's
renderer turns that into actual pixels:

- **Bookshelf** uses `weight` as the normalized editorial signal but
  still renders card size via its own `span` field (`c4`/`c5`/`c6`/`c7`/
  `c8`/`c12`, a 12-column grid width) — `span` is Bookshelf-specific
  layout plumbing, not a shared field, and is not derived from `weight`
  automatically. Unifying the two (deriving `span` from `weight`) is
  deferred — see TODOs below.
- **fffx** uses `weight` directly as the subdivision tile-area scoring
  multiplier (`scoreRectForEntry` in `subdivision.js`) — higher weight
  targets a larger rectangle.

## Homepage rule

New Level 1 worlds should default to a **standalone `docs/index.html`**
for a fully custom landing page (fffx's pattern), not `docs/index.md`
rendered through Material with the header hidden (Bookshelf's pattern).
The standalone-HTML approach needs no header-hiding CSS/JS workaround,
no Markdown-pipeline risk for inline logic, and no `:has()`/sibling-walk
fragility — see fffx's `LANDING-PAGE-NOTES.md` for the full comparison.

**Do not create `docs/index.md` in a repo that uses `docs/index.html`** —
MkDocs will happily build both, but only one can actually serve as `/`,
and the collision is a confusing, easy-to-reintroduce mistake (see the
guard described in fffx's `README.md`/`LANDING-PAGE-NOTES.md`).

Bookshelf still uses `docs/index.md` today. Migrating it to a standalone
`docs/index.html` is a real, deferred piece of work — see TODOs below —
not something to attempt incidentally while doing this normalization
pass.

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

Both worlds' `*-tokens.css` and `*-material.css` files already follow
this. Both worlds' landing stylesheet has been renamed to
`*-landing.css` to match (was `bookshelf.css` in Bookshelf, `landing.css`
in fffx). Neither world has fully moved its JS/images into
`docs/assets/` yet — Bookshelf has no `docs/assets/` at all (`docs/js/`,
`docs/images/`, `docs/stylesheets/` are siblings at `docs/` root); fffx
already has `docs/assets/js/`/`docs/assets/css/` but keeps
`docs/images/` separate. Both are deferred — see TODOs below — rather
than moved partially.

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
silently broke the pin. Both fixed: sections now carry `id`/`order`,
cards within a section now carry `order`, and `beforeSection` matches
against the stable `id` instead of the display title. See this repo's
`README.md` changelog for the specific commit.

fffx's `entries[]`/`sections[]` already used explicit `order` from the
start; no change needed there.

## TODOs (deferred, not done in this pass)

- **Migrate `docs/index.md` → standalone `docs/index.html`.** Real
  architectural change (drop the header-hiding CSS/JS, restructure how
  the page mounts), not attempted here.
- **Review and prune world-specific extra attributes** — Bookshelf's
  `cat`/`ghost`/`titleVariant` and similar, and fffx's `era` field, are
  unreviewed; some may be worth promoting to shared fields, some may be
  dead. Left alone this pass.
- **Derive `span` from `weight`** instead of maintaining both
  independently, if/when the card grid is revisited.
- **Move `docs/js/`, `docs/images/` under `docs/assets/`** to fully
  match the preferred asset layout — deferred because it touches every
  `<script src>` in `index.md` plus any image references; not attempted
  partially.
- **fffx: move `docs/images/` under `docs/assets/images/`** — same
  reasoning, smaller blast radius (one content page references the
  Circle Packing images).
- **Cross-world `primarySection`/`sections[]` fields** — add only when
  an actual cross-listed-within-one-world entry exists; not bolted on
  speculatively.
- **Stricter CI checks** — e.g. a lint step that fails the build if a
  `section`/`primarySection` value doesn't match any registered section
  `id`. Not added this pass.
- **Card component unification** — Bookshelf's cards and fffx's tiles
  remain two separate, world-specific render functions. Not merged into
  one shared component; the two sites' visual identities are
  deliberately distinct enough that a shared component would likely
  fight both designs.

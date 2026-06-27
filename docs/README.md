# Bookshelf landing page — design notes

This file documents the design decisions behind the custom landing page
(`index.md` + `stylesheets/bookshelf.css` + `js/bookshelf-data.js` /
`bookshelf-gallery.js`), the reasoning behind them, and a running changelog.
It lives in `docs/` (not the repo root) because it is documentation *about*
the docs site, not the project's general README.

## Intent

> The Bookshelf of Curiosities is a quiet literary gallery where books
> become maps, timelines, archives, and strange framed portals into
> worlds of reading.

The landing page is a **threshold space** — the front room of the
Bookshelf, not the archive itself. A visitor sees a few framed exhibits
and decides which world to enter. Each entry is treated as a specimen on
display (a framed thumbnail, a small curatorial caption, a short
description, a direct link), not as a navigation link with a thumbnail
attached.

Underneath, it's still MkDocs, mapped onto the same metaphor:

- the landing page = the gallery room
- the side nav / Markdown pages = the archive catalogue and reading rooms
- static interactives (`/scifi/`, `/asimov/`) = larger special exhibits in
  adjoining rooms

While unfinished, an exhibit sits inert with a curatorial status line
("Not yet on view" — `hamzanama`) instead of a normal link. No portal
pages, no iframes — the gallery is purely a front door.

Mood target (as of V2): *quiet museum gallery + literary archive +
slightly strange cabinet of maps and timelines.* Explicitly **not**: a
magical-library/old-parchment UI, heavy gold ornamentation, excessive
brown gradients, or theme-park antiquarianism. Considered, not gimmicky.

## Architectural decisions carried over (unchanged by this pass)

- `frameMood` stays a visual-only data field per project (`bookshelf-data.js`).
- `tag` (renamed from `contentType` in V2.7) stays in the data for future
  filtering; the full chip row (`.bookshelf-chips`) is still hidden, but
  as of V2.2 the first entry is surfaced as a single quiet tag above the
  title (`.bookshelf-tag`) — see
  "Museum-label treatment" below.
- The landing page hides MkDocs' side nav and TOC via front-matter
  (`hide: [toc, navigation]`); all other Markdown pages keep the normal
  Material theme layout.
- No portal/wrapper pages for SciFi or Asimov; gallery cards link directly
  to the live static sites.

## Styling pass — V1.1 (this round)

**Problem reported:** the V1 styling felt flat, the typography didn't suit
the mood, and the palette read as beige rather than warm.

**Note on source images:** all three thumbnails (`scifi.jpg`, `asimov.jpg`,
`hamzanama.jpg`) are currently the same placeholder graphic (a black
seahorse silhouette on cyan), not final art. Styling was done so the frame
treatment will look right once real thumbnails are dropped in — no
masking/duotone filter was added over the images themselves, per explicit
direction not to design around the placeholder.

### Typography

- Added **Fraunces** (variable serif, loaded via `@import` in
  `bookshelf.css`) for the `<h1>` and card titles (`.bookshelf-label h2`).
  Reasoning: the rest of the theme is set sans-serif (Ubuntu, via
  `mkdocs.yml` → `theme.font`); an all-sans-serif landing page read closer
  to a product page than a literary archive. A display serif on just the
  title and card labels signals "archive/gallery" without touching body
  copy or the rest of the Material theme.
- Kicker line gained a short centered rule beneath it (`::after`) in the
  new `--accent` color, to read more like a museum wall-label than a
  tagline.

### Depth ("flat" complaint)

- Added a faint SVG-noise paper-grain layer (`.bookshelf-landing::after`,
  `mix-blend-mode: multiply`) over the wall background. Pure CSS/SVG, no
  image asset, negligible weight.
- Frame background changed from a flat fill to a soft diagonal gradient
  (`--frame-soft` → `--frame` → near-black), simulating light falling
  across painted wood.
- Frame shadow split into two layers (ambient + contact) and now grows
  slightly on hover/focus, reinforcing the existing lift animation instead
  of leaving the shadow static while the card moves.

### Color

- Deepened `--ink` and warmed `--muted-ink` slightly for more contrast
  against the paper background.
- Introduced `--accent: #7a3b2c` (oxblood/brass-adjacent) used for the
  kicker rule and for the card title color on hover/focus — gives the
  palette a focal warm color beyond the existing neutral browns, without
  introducing a new bright/saturated color into the gallery mood.
- Mat board (the cream border around each thumbnail) given its own token
  (`--mat`) plus a thin dark outline, so it behaves like a real picture
  mat rather than a plain colored border.

### Explicitly out of scope for V1.1

Per existing project notes, none of these were touched: day/night switch,
gallery lighting animation, cat easter egg, dust motes, surprise-me
button, content-type filters, or rearrange-by-genre/map/timeline/author.
They remain V1.5/V2 ideas.

## Styling pass — V2: museum gallery, not parchment library

**Problem reported:** V1.1's frames (thick, gradient brown-to-black, with
an inner gilt-adjacent border) read as antiquarian/"magical library"
rather than a museum gallery. The page otherwise felt plain — no sense
of light, no curatorial texture beyond the title.

V2 reworks the frame, wall, and label treatment around a literal museum
room rather than a wood-paneled library, per explicit direction to avoid:
heavy gold frames, excessive brown gradients, dusty/parchment texture,
and "theme-park antiquarianism." Kept: the Fraunces display serif (called
out as the one thing already working), the quiet hover lift, slight
thumbnail zoom, and restrained motion.

### Wall

- Palette shifted from warm parchment (`#f3efe7`/`#e9e0d2`) to a cooler
  bone/greige (`#f1efe9`/`#e6e2d6`). Warmth now comes from a soft
  top-down light wash (`.bookshelf-landing::before`, a radial gradient)
  rather than from a sepia base tone.
- Removed the SVG-noise paper-grain layer entirely — it read as "dusty,"
  which was specifically ruled out. Nothing replaces it; the wall is
  meant to be clean.

### Frames

- Replaced the thick gradient frame (`--frame-soft` → `--frame` →
  near-black, padding up to ~0.95rem, plus a faint inner gilt-line
  border) with a single thin, near-flat charcoal frame (padding
  ~0.4–0.55rem, one soft inset highlight instead of a second border).
  This is the core fix for "the frames idea looks boring/heavy" — a real
  gallery frame is a thin neutral edge, not a wood-stained box.
- The mat board around each thumbnail was widened (0.5rem → 0.85rem) and
  lightened (`--mat: #f6f3eb`), so each piece sits in generous museum
  matting rather than a narrow cream border. Matting, not frame
  thickness, now carries the "considered" feeling.
- Per-`frameMood` tints moved off the brown family entirely — each is now
  a distinct desaturated hue (indigo-slate, teal-slate, plum-ink,
  moss-slate, graphite) so exhibits read as different rooms/specimens
  without any one of them looking like stained wood.

### The "alive underneath" hint

- Added a quiet radial-gradient light pool above each frame
  (`.bookshelf-card-inner::before`), like a single gallery spotlight
  hitting that piece. This is the V1 placeholder for the brief's "V1.5
  day/night gallery light switch" — it's static and unanimated for now,
  but the V1.5 light switch should toggle/animate this existing layer
  rather than introducing a new one.

### Museum-label treatment

- Each card label opens with a small caps line above the title
  (`.bookshelf-tag`), and the label is separated from the frame by a
  thin hairline rule — closer to a wall plaque (category, title,
  description) than a card caption.
  - V2 first tried a generated **"Exhibit No. 0N"** line here. Dropped in
    V2.2 — a bare ordinal didn't tell a visitor anything about the piece.
  - V2.2 replaced it with the first entry of `project.contentType` (e.g.
    "timeline", "map"), via `primaryTag()` in `bookshelf-gallery.js`.
    This is the one place a `contentType` value is shown — the full chip
    row stays hidden per the original decision above.
- Inactive-exhibit copy changed from "Not live yet" to **"Not yet on
  view"** (`bookshelf-gallery.js`) to stay inside the museum vocabulary.

### Accent color

- New accent: `--accent: #3f6b5e`, a verdigris/bronze-patina green —
  the brief's "one slightly odd, not-fantasy color note," standing in
  for a museum plaque's oxidized bronze rather than the previous
  oxblood/brown accent (which leaned antiquarian). Used for the kicker
  rule, the exhibit-number line, and the card-title hover color.

### Explicitly out of scope for V2

Still V1.5/V2-later per the brief: an actual day/night light *switch*
(only the static light pool exists now), a cat crossing the floor, dust
motes, a "surprise me" button, content-type filters, and
rearrange-by-genre/map/timeline/author. The spotlight glow is the one
piece of "alive underneath" texture introduced early, deliberately kept
static so it reads as a discovery later rather than the main UI now.

## Header bar — hidden on landing page only

The `hide: [navigation, toc]` front-matter on `index.md` removes the side
nav and TOC, but Material's top header bar (`.md-header` — site
title/logo/search) lives outside the page content as a sibling of
`.md-container`, so it can't be hidden the same way.

Fix: `body:has(.bookshelf-landing) .md-header { display: none; }` in
`bookshelf.css`. `:has()` lets the rule key off whether `.bookshelf-landing`
exists anywhere in the page, so the header disappears only on the landing
page and stays normal on every other Markdown page — no JS, no per-page
template overrides needed. Requires a `:has()`-capable browser (all current
major engines as of 2026); if a user's browser doesn't support it, the
header simply still shows, which is a safe fallback.

## Changelog

- **V2.9** — Fixed the real cause of the "dark bar" / off-center cropping
  reported after the V2.8 thumbnail swap: it wasn't the images (confirmed
  both `scifi.jpg` and `asimov.jpg` are exactly 480×480 via
  `System.Drawing.Image`), it was CSS specificity. Material's base styles
  ship `.md-typeset img { height: auto; max-width: 100% }`, which has
  higher specificity (class+type) than a plain `.bookshelf-thumbnail`
  rule (class only) and wins regardless of where each rule sits in the
  stylesheet. That let every `<img>` size itself to its own intrinsic
  square shape instead of stretching/cropping to
  `.bookshelf-image-wrap`'s enforced `aspect-ratio` box, exposing the
  wrap's dark background wherever a frame wasn't square — and since
  frame aspect ratio is now randomized per V2.3, that was most frames.
  Fixed by matching `.md-typeset` ancestry in the selector
  (`.md-typeset .bookshelf-thumbnail`), which reliably outranks Material's
  rule. File touched: `docs/stylesheets/bookshelf.css`.
- **V2.8** — Real thumbnails started landing (`scifi.jpg`, `asimov.jpg` —
  square source images with ample margin around the subject, meant to be
  cropped to whatever random frame aspect ratio lands on that card).
  `.bookshelf-thumbnail` already did the right thing via `object-fit:
  cover` (default `object-position: 50% 50%` crops symmetrically around
  center) — made that explicit with `object-position: center center` in
  `bookshelf.css` rather than relying on an unstated browser default. No
  behavior change, just stated intent. **`hamzanama.jpg` is still the old
  placeholder** (the cyan seahorse, not square) — swap it in the same way
  once real art exists. File touched: `docs/stylesheets/bookshelf.css`.
- **V2.7** — Two fixes from review:
  - `.frame-cosmic-archive .bookshelf-card:hover .bookshelf-frame` never
    matched — `.frame-cosmic-archive` and `.bookshelf-card` are classes on
    the *same* `<a>` element, not nested, so the descendant-selector space
    between them meant "an ancestor with this class," which doesn't exist.
    Fixed to `.bookshelf-card.frame-cosmic-archive:hover .bookshelf-frame`
    (and the `:focus-visible` twin), compounding both classes on the one
    element they're actually on. This is the only `.frame-*` rule that had
    a hover/focus variant, so it was the only one affected.
  - Renamed the `contentType` data field to `tag` (`bookshelf-data.js`),
    and the corresponding JS (`createContentChips` → `createTagChips`,
    parameter names) in `bookshelf-gallery.js`. Purely a naming change —
    behavior (hidden chip row, single tag shown above the title) is
    unchanged. Files touched: `docs/js/bookshelf-data.js`,
    `docs/js/bookshelf-gallery.js`, `docs/stylesheets/bookshelf.css`.
- **V2.6** — Two additions:
  - Brought texture back to the wall, but not the V1.1 paper-grain kind
    that was removed for reading as "dusty": a mild crosshatch
    (`.bookshelf-landing::after`, two `repeating-linear-gradient`s at
    opposing diagonals, `mix-blend-mode: multiply`) reads as a painted
    plaster/canvas wall rather than parchment. Visible up close, quiet
    from a distance.
  - `frameMood` now varies frame *style*, not just color. `--frame-pad`
    and `--mat-width` custom properties (defaulted on `.bookshelf-landing`,
    overridden per `.frame-*` class) drive `.bookshelf-frame`'s padding
    and `.bookshelf-image-wrap`'s border width. Five distinct treatments:
    pulp-cosmic (thin minimal frame), cosmic-archive (heavier frame +
    deeper shadow, its own hover box-shadow), illuminated-manuscript (a
    second inset line via `::after`, like a double mat), map-room
    (near-zero mat, bleeds to the edge, plus two small corner
    "registration tick" pseudo-elements), paperback (thin frame line,
    generous mat — art floats in white space). Files touched:
    `docs/stylesheets/bookshelf.css`.
- **V2.5** — Fixed a bug from V2.4: scaling frames by width alone made
  portrait frames look bigger than landscape frames at the same `weight`,
  because area = width² / aspect — a narrower aspect ratio inflates the
  height (and area) for a given width. `frameWidthFraction()` in
  `bookshelf-gallery.js` now solves for `width = areaScale * sqrt(aspect)`
  instead, which keeps `width² / aspect` (i.e. visual area) constant for
  a given weight regardless of orientation. Also switched
  `.bookshelf-gallery`'s `align-items` from `start` to `center`, so
  frames of different heights are centered within their row instead of
  all hanging from the top edge. Added six dummy entries to
  `bookshelf-data.js` (clearly marked, `id: "dummy-*"`, reusing the
  existing placeholder thumbnails) spanning the weight range, to preview
  how the wall behaves with more than three exhibits — remove them once
  there are enough real entries to judge the layout on its own. Files
  touched: `docs/js/bookshelf-gallery.js`, `docs/stylesheets/bookshelf.css`,
  `docs/js/bookshelf-data.js`.
- **V2.4** — `weight` (already in `bookshelf-data.js`, previously unused
  on the landing page) now scales each frame within its grid cell:
  `frameScale()` in `bookshelf-gallery.js` linearly maps weight 1–10 to a
  0.5–1.0 scale, written as a `--frame-scale` custom property on
  `.bookshelf-card-inner`. `bookshelf.css` reads it for both
  `.bookshelf-frame`'s width (centered via `margin-inline: auto`) and the
  spotlight glow's width, so a smaller frame doesn't sit under an
  oversized light pool. The grid cell itself is untouched — only the
  frame inside it shrinks, leaving visible wall space around lighter
  exhibits. Caption text (`.bookshelf-label`) is intentionally not
  scaled. Files touched: `docs/js/bookshelf-gallery.js`,
  `docs/stylesheets/bookshelf.css`.
  - Superseded by V2.5's area-based fix above (this version's width-only
    scaling was the source of the portrait/landscape size mismatch).
- **V2.3** — Frames are no longer locked to one aspect ratio. Each card
  gets a randomized shape computed in `randomFrameRatio()`
  (`bookshelf-gallery.js`): start from a square (ratio 1), then add one
  delta in a single step — landscape (70% of the time, ratio 1.18–1.50)
  favoured over portrait (30%, ratio 0.75–0.95) — set as an inline
  `aspect-ratio` on `.bookshelf-image-wrap`. Re-randomizes on every page
  load. Reasoning: a hand-hung gallery wall doesn't use uniform frame
  sizes; this is the cheapest way to make the wall feel considered/lived
  -in rather than templated, without touching layout structure. Required
  `align-items: start` on `.bookshelf-gallery` (CSS Grid defaults to
  `stretch`, which would have silently cancelled the height variation by
  forcing every card in a row to match the tallest one). The CSS
  `aspect-ratio: 1` on `.bookshelf-image-wrap` is now just the no-JS
  fallback. Files touched: `docs/js/bookshelf-gallery.js`,
  `docs/stylesheets/bookshelf.css`.
- **V2.2** — Swapped the "Exhibit No. 0N" line for the project's primary
  `contentType` tag (e.g. "timeline", "map") in the same label position.
  Files touched: `docs/js/bookshelf-gallery.js`,
  `docs/stylesheets/bookshelf.css` (class renamed
  `.bookshelf-exhibit-no` → `.bookshelf-tag`).
- **V2.1** — Removed the lower intro paragraph ("Framed exhibits from a
  growing cabinet...") from the title band, keeping only the kicker line
  above the `<h1>` as the page's one piece of intro copy. Removed the now
  -unused `.bookshelf-intro` CSS rule. Files touched: `docs/index.md`,
  `docs/stylesheets/bookshelf.css`.
- **V2** — Reworked the frame/wall/label treatment from a wood-and-mat
  library look to a museum gallery room: thin charcoal frames (down from
  thick gradient frames), wider/lighter mat board, cooler bone-grey wall
  (parchment tone and dusty paper-grain texture removed), a static
  per-exhibit spotlight glow, a museum-label "Exhibit No." line, "Not yet
  on view" status copy, and a verdigris accent replacing oxblood. Files
  touched: `docs/stylesheets/bookshelf.css`, `docs/js/bookshelf-gallery.js`.
- **V1.2** — Hid the Material header bar on the landing page only, via a
  `:has()`-scoped CSS rule (no JS/template changes). File touched:
  `docs/stylesheets/bookshelf.css`.
- **V1.1** — Typography (Fraunces for display text), paper-grain texture,
  frame gradient + dual shadow, mat-board treatment, oxblood accent color,
  hover color shift on card titles. Files touched:
  `docs/stylesheets/bookshelf.css` only. No changes to `index.md`,
  `bookshelf-data.js`, `bookshelf-gallery.js`, or `mkdocs.yml`.
- **V1** — Initial gallery-wall landing page: warm paper background,
  dark-framed cards, per-project `frameMood` tint, hidden side nav/TOC on
  the landing page only.

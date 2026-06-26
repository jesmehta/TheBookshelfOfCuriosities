# Bookshelf landing page — design notes

This file documents the design decisions behind the custom landing page
(`index.md` + `stylesheets/bookshelf.css` + `js/bookshelf-data.js` /
`bookshelf-gallery.js`), the reasoning behind them, and a running changelog.
It lives in `docs/` (not the repo root) because it is documentation *about*
the docs site, not the project's general README.

## Intent

The landing page is meant to read as a quiet gallery wall: a few framed
"exhibits," each linking straight out to a live interactive project
(`/scifi/`, `/asimov/`) or, while unfinished, sitting inert with a
"Not live yet" label (`hamzanama`). No portal pages, no iframes — the
gallery is purely a front door.

Mood target: *quiet gallery wall + literary archive*. Not playful, not
corporate, not theatrical. Warm paper tones, dark wood-and-mat framing,
restrained motion.

## Architectural decisions carried over (unchanged by this pass)

- `frameMood` stays a visual-only data field per project (`bookshelf-data.js`).
- `contentType` stays in the data for future filtering but chips are
  hidden visually (`.bookshelf-chips { display: none; }`).
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

### Explicitly out of scope for this pass
Per existing project notes, none of these were touched: day/night switch,
gallery lighting animation, cat easter egg, dust motes, surprise-me
button, content-type filters, or rearrange-by-genre/map/timeline/author.
They remain V1.5/V2 ideas.

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

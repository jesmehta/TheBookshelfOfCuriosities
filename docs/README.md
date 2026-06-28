# Bookshelf landing page — design notes

This file documents the design decisions behind the custom landing page
(`index.md` + `stylesheets/bookshelf.css` + `js/bookshelf-data.js` /
`bookshelf-gallery.js`), the reasoning behind them, and a running changelog.
It lives in `docs/` (not the repo root) because it is documentation *about*
the docs site, not the project's general README.

## V4.0 — full UI replacement (current)

As of V4.0, the landing page's visual system is governed by
**`DESIGN-SYSTEM_for_v4.0.md`** (repo root) — that file is the source of
truth going forward; this README's job from here is to record *why*
things changed and keep a changelog, not to restate the spec. Everything
below the "Intent" section (V1 through V3.2) is preserved as historical
record of the museum-gallery and dark-cabinet phases that preceded this
replacement, but **none of it describes the current system** — V4.0 is a
full swap, not a refinement, per the design doc's own instruction not to
blend old and new. See the V4.0 changelog entry near the bottom of this
file for what changed and why.

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

Mood target (as of V3): *dark literary gallery/cabinet* — rich, atmospheric,
typographic, editorial. A pivot from V2's light museum-wall mood, borrowing
a dark palette, split-title typography, a ghost-letter motif, a quiet
quote line, and an orbital cursor from a separate standalone HTML
reference (`BookshelfLanding/bookshelf-of-curiosities.html`, style
reference only, never part of this site). Explicitly **not** borrowed
from that reference: its marquee/ticker, multi-section "future content"
homepage structure, many dormant cards, p5.js particles, or heavy
animation anywhere. Considered, not gimmicky — still one quiet exhibit
gallery, not a crowded homepage.

V1/V2's anti-antiquarian guardrails still apply to the *frame* treatment
specifically: no heavy gold ornamentation, no excessive brown gradients,
no theme-park antiquarianism in how exhibits are framed — V3's dark
background is a deliberate mood choice, not a reversion to those V1
patterns (see "Frames" below for how this distinction is held).

## Architectural decisions carried over (unchanged by this pass)

- `frameMood` stays a visual-only data field per project (`bookshelf-data.js`),
  now recolored for the dark palette but with the same 5 names and the
  same per-mood *structural* treatment (frame thickness, mat width,
  corner ticks, double inset) — see V3 changelog.
- `tags` (plural, renamed from singular `tag` in V3; `tag` itself was
  renamed from `contentType` in V2.7) stays in the data for future
  filtering; the full chip row (`.bookshelf-chips`) is still hidden. As of
  V3, the visible line above the title (`.bookshelf-tag`) is a separate,
  hand-written `label` string field instead of being derived from the
  first array entry — see "Data model" in the V3 changelog below.
- The landing page hides MkDocs' side nav and TOC via front-matter
  (`hide: [toc, navigation]`); all other Markdown pages keep the normal
  Material theme layout.
- No portal/wrapper pages for SciFi or Asimov; gallery cards link directly
  to the live static sites (when live — see asimov's status in the V3
  changelog).

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

## Styling pass — V3: dark literary gallery/cabinet

**Goal:** pivot from V2's light museum-gallery mood to a darker, more
atmospheric "literary gallery/cabinet" feel — rich, typographic,
editorial — while keeping the page a single, restrained exhibit gallery
rather than growing into a busy multi-section homepage. Specific elements
were borrowed from a separate standalone HTML mockup
(`BookshelfLanding/bookshelf-of-curiosities.html`, style reference only,
never edited, not part of this site): its dark palette family, split-title
typography, ghost-letter motif, a quiet quote/type-break line, and an
orbital custom cursor. Explicitly *not* borrowed: its marquee/ticker,
multi-section structure, many dormant cards, p5.js particles, or heavy
animation, and its `cursor: none` was reworked for usability (see Cursor
below) rather than copied as-is.

### Palette

New dark token set on `.bookshelf-landing`: `--ink` (`#0e0c09`) and
`--deep` (`#161209`) for the background gradient, `--char` (`#1f1810`,
ghost-letter stroke/hairlines), `--bronze` (`#8a6030`), `--gold`
(`#b8842a`), `--amber` (`#d4a040`), `--sand` (`#c8a870`), `--vellum`
(`#e0c898`), `--ivory` (`#f5edd8`, primary text), and `--muted-ink`
(`#9c8f78`, secondary text — kept the same variable *name* as V2's
light-mode muted-ink token so existing rules referencing it didn't need
touching, just redefined the value). `--accent` (verdigris) moved
from `#3f6b5e` to a brightened `#4a7d6c` so it still reads against
near-black instead of bone — kept as the one strange, deliberately
not-gold accent note (kicker rule, tag label, hover title color), per the
explicit instruction not to let the palette collapse into all-gold/brown.

**Naming gotcha avoided:** V2's `--ink` was a *text*-color token (dark
text on a light wall). V3 repurposes `--ink` as a *background* token
(near-black) — every old rule that did `color: var(--ink)` had to be
hunted down and switched to `color: var(--ivory)` instead, not just have
the variable's value flipped, or text would have rendered near-black on
near-black and vanished. Also caught in the same pass: the focus-visible
outline (`rgba(31,29,26,0.65)`, near-black) and the is-inactive hover-reset
color, both invisible against a dark background in the old light-mode
values — outline moved to `var(--amber)`, hover-reset to `var(--ivory)`.

### Typography — 3 families, not 4

Kept `--font-display: "Fraunces"` for card titles and two of the four
hero-title spans. Added `--font-serif-display: "Libre Baskerville"` for
the one huge hero word ("Bookshelf") and the typographic ghost-letter
fallback (see Data model below) — its bold-italic is more condensed/forceful
than Fraunces at hero size. Added `--font-mono-label: "Syne Mono"` for the
kicker, the new `label` tag line, and the "of" hero span — an "editorial
mono-caps" voice distinct from both serifs. Did **not** import Instrument
Serif or Syne sans from the reference (it uses all four) — Fraunces
italic already covers that role; a 3-family stack was judged the
maintainable middle ground between the reference's 4 and V2's 1.

### Frames — reskinned in place, not restructured

The frame/mat/spotlight DOM (`.bookshelf-card` > `.bookshelf-card-inner` >
`.bookshelf-frame` > `.bookshelf-image-wrap` > `.bookshelf-thumbnail`) is
untouched structurally — this site has real photographic thumbnails, so
the reference's imageless ghost-letter-card pattern doesn't apply here,
only its *color* language does. Recolored: mat from cream to warm umber
(`--mat: #473423`), deliberately a visible lightness step *above* the
frame tones (not near-black like the frame) so the mat still reads as a
distinct ring rather than blending into it; spotlight glow recolored from
warm-white to amber-tinted, still static; all 5 `frameMood` names kept
unchanged (they describe structural treatment — thickness, mat width,
corner ticks, double inset — not color, so they still apply in a dark
palette) with only their `--frame` hex and accent-line colors shifted
into a dark warm-neutral family (illuminated-manuscript's double-inset
line now gold, map-room's corner ticks now amber). Inactive-exhibit
opacity reduced from `0.62` to `0.5` since dark-on-dark dims less
visibly than light-on-light did.

**Selector audit applied:** re-verified the `cosmic-archive` hover/focus
pair stayed a compound selector (`.bookshelf-card.frame-cosmic-archive:hover`,
fixed in V2.7) through the recolor edit, and used the same compound
pattern for every newly-touched rule, since `frame-${mood}` and
`bookshelf-card` are classes on the same `<a>` element, not nested.

### Hero — split title, ghost letter, type-break

`.bookshelf-title-band` replaced with `.bookshelf-hero`, containing: a
large stroked-only ghost letter (`.bookshelf-ghost`, "B", Libre
Baskerville bold italic, `color: transparent` + `-webkit-text-stroke`,
slow 18s drift animation, disabled under `prefers-reduced-motion`); the
existing kicker line; a split title (`.bht-the` / `.bht-bookshelf` /
`.bht-of` / `.bht-curiosities`, each a different font/size/color, mirroring
the reference's word-by-word typographic treatment). A new
`.bookshelf-typebreak` sits below the hero with one placeholder quote
line ("Every shelf is a map of attention.", marked with an HTML comment
for easy replacement) — deliberately text-only, no giant background
stroked word behind it like the reference's quote break, since stacking a
second typographic spectacle on top of the hero's ghost letter risked the
"busy" feeling explicitly ruled out for this pass.

### Cursor — reworked for usability, not copied as-is

New `js/bookshelf-cursor.js`, plus `#bookshelf-cur-dot`/`#bookshelf-cur-ring`
markup in `index.md`. Differs from the reference in the ways the brief
specifically asked for:

- The **dot has zero smoothing** — set directly to `e.clientX/clientY`
  every `mousemove`, so it is always exactly at the OS pointer position.
  Only the **ring** eases (`rx += (mx - rx) * 0.15` per
  `requestAnimationFrame`) for the orbital trail. The reference's cursor
  has no precise element at all, just two lagging pieces.
- Native cursor is **never set to `none` unconditionally**. The CSS rule
  hiding it is scoped to `body.bookshelf-cur-active .bookshelf-landing *`,
  and that class is only added by JS after a real `mousemove` confirms the
  dot is tracking. No mouse activity (or a guard tripping) means the
  native pointer is simply never hidden.
- Bails out entirely — no custom cursor, no hidden native cursor — under
  `prefers-reduced-motion: reduce` or `pointer: coarse` (touch), checked
  via `matchMedia` before attaching any listeners. A `change` listener on
  the reduced-motion query also deactivates mid-session if the user
  toggles the OS setting after load.
- Cursor elements are `aria-hidden="true"`, `pointer-events: none`, and
  the script never calls `.focus()` or intercepts clicks/keys — keyboard
  navigation and `.bookshelf-card`'s existing `:focus-visible` outline are
  completely unaffected, since keyboard-only users never trigger
  `mousemove` and so never activate the custom cursor at all.

### Data model

- `tag` (array) renamed to `tags` (array, same role/values, still feeds
  the hidden `.bookshelf-chips` row) — was singular while holding multiple
  values, which read oddly now that a separate single-value field exists.
- New `label` string field per project (e.g. "Timeline · Archive"), shown
  directly in `.bookshelf-tag` — a direct, hand-written museum-label
  phrase instead of deriving display text from `tags[0]`. `primaryTag()`
  deleted from `bookshelf-gallery.js`.
- **Typographic fallback for missing art:** `createThumbnailContent()` in
  `bookshelf-gallery.js` renders a large stroked initial
  (`.bookshelf-ghost-initial`, same visual language as the hero ghost)
  instead of an `<img>` when a project has no `thumbnail` field. This
  reuses `.bookshelf-image-wrap`'s existing random-aspect-ratio and
  weight-based area-scaling logic unchanged, since that box doesn't care
  what's inside it — no toggle UI, no dual-render state, ~20 lines total.
  (`.bookshelf-ghost-initial`'s `cqmin` font-sizing needed
  `container-type: size` added to `.bookshelf-image-wrap`, since
  container-query units don't resolve without a declared container.)
- **Dummy entries (`bookshelf-data.js`) trimmed from 5 to 3, kept rather
  than removed.** They now do double duty as a live demo of the
  typographic-fallback card (each omits `thumbnail`) sitting next to the
  photographic real exhibits — a direct visual comparison without
  building a toggle. This was a reversal mid-planning: the V3 plan
  originally called for removing all 5 outright to avoid a "busy fake
  future-content" feeling, but keeping a few with an actual job (the
  fallback demo) was judged better than either extreme.
- **Asimov set to inactive.** Verified directly (`curl`-equivalent fetch)
  that `https://bookshelf.cabinetofcuriosities.in/asimov/` is a live 404
  in production right now — there's no `asimov/` folder anywhere in this
  repo, unrelated to and not fixed by the deploy-pipeline work (see root
  `README.md`). `link` changed to `"#"` so it renders with the same
  inactive treatment as hamzanama ("Not yet on view") instead of linking
  to a dead page. Restore the real link once `asimov/` is actually built
  and deployed.

### Explicitly out of scope for V3

Still not pursued: an actual day/night light *switch* (only the static
amber spotlight exists), a cat crossing the floor, dust motes, a
"surprise me" button, content-type filters, rearrange-by-genre/map/
timeline/author, the reference's marquee/ticker, and its multi-section
"future content" homepage structure.

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

- **V4.1** — Replaced the particle field with a firefly sim per direct
  request: ~24 motes, noise-driven heading instead of a physics drift,
  states (flying/landing/resting/takeoff) with resting biased toward the
  side margins outside the 1080px content column, glow = sine breathing ×
  noise flicker. File touched: `docs/js/bookshelf-particles.js`.
- **V4.0.3** — Particles appeared on load, then visibly froze/faded.
  Real bug, inherited from the reference's own physics (not introduced by
  the V4.0.2 visibility boost, just made noticeable by it): each frame
  multiplies velocity by 0.982 with nothing sustaining it after the
  one-time random push at creation, so velocity decays to near-zero
  within ~3 seconds — particles stopped drifting and just sat there
  pulsing in place via the (correctly-working) alpha sine wave, which read
  as "appeared then faded for good." Fix: a small continuous upward nudge
  (`vy -= 0.0015`) applied every frame before the damping, so velocity
  settles into a steady drift speed instead of decaying to a stall. File
  touched: `docs/js/bookshelf-particles.js`.
- **V4.0.2** — Particle field was invisible. Not a bug, exactly — the
  reference mockup's own values (radius 0.6–2.6px, alpha capped ~58/255)
  were faint enough that the user confirmed they never saw the effect in
  the original mockup either. Boosted radius to 1.2–4.5px, alpha to
  45–140/255, and swapped the raw gold/sepia RGB triples for values
  closer to the actual `--amber`/`--bronze` design tokens — a deliberate
  departure from "exact port" since faithfully reproducing an
  effectively-invisible effect isn't useful. File touched:
  `docs/js/bookshelf-particles.js`.
- **V4.0.1** — The DOM-walk header fix (V4.0) removed the visible "Home"
  nav bar but left a thin residual white gap above the content. Root
  cause: hiding `.md-header` (or its siblings) removes the *element*, but
  Material reserves vertical space for it independently, via layout math
  that isn't tied to the header's own visibility. Two fixes layered
  together since which mechanism Material actually uses wasn't worth
  guessing a fourth time: (1) `bookshelf-cursor.js`'s ancestor-walk now
  also zeroes `padding-top`/`margin-top` on each *ancestor* on the path to
  `.bookshelf-landing` (not on `.bookshelf-landing` itself — it has its
  own deliberate negative top margin for the full-bleed background, which
  inline-style zeroing would otherwise have clobbered); (2)
  `bookshelf.css` zeroes the `--md-header-height` custom property when
  `body.bookshelf-landing-page` is set, in case the gap comes from a
  `calc()` reading that variable rather than a literal padding/margin
  value. Files touched: `docs/js/bookshelf-cursor.js`,
  `docs/stylesheets/bookshelf.css`.
- **V4.0** — Full UI replacement per `DESIGN-SYSTEM_for_v4.0.md` (repo
  root), superseding V3 entirely rather than refining it. This ports the
  standalone reference mockup's full structure into the real site,
  reversing several V3 exclusions explicitly approved this round: the
  scrolling ticker/marquee, a multi-section homepage (Author Explorations
  / Empire, Adventure & The Great Game / Comics & Sequential Art / Book
  Data & Visualisation / Writings on Reading), many dormant placeholder
  cards as a forward-looking content roadmap, and a p5.js particle field
  — all previously ruled out as "too busy," now reinstated because the
  user wants the roadmap structure visible now and switched on
  section-by-section as content goes live.
  - **Data model overhaul**: `bookshelf-data.js` is now the single source
    of truth for *everything* rendered, not just cards — ticker items,
    the "Empire" text band, the "READING"/Victor Hugo quote break, the
    dataviz feature block, the writings band, and all 5 sections each got
    an `enabled` flag (sections additionally gate their entire card grid)
    so any piece can be switched off without deleting content. This goes
    beyond the design doc's literal spec (which only required the card
    array to be the one editable file) to satisfy the user's explicit
    ask: ticker words, section titles, and on/off toggles all need to be
    easy to find and change in one place.
  - **Old V3 system fully removed**: `.bookshelf-frame`,
    `.bookshelf-image-wrap`, `.bookshelf-card-inner`, `frameMood`,
    `randomFrameRatio()`, `frameWidthFraction()`, the Fraunces-based font
    stack, and every `--font-display`/`--font-serif-display`/
    `--font-script` token are gone, not left dead in the stylesheet — the
    design doc explicitly forbids blending old and new systems.
  - **Header/tab bar — third attempt, different strategy.** V3.1 (a
    `:has()` rule plus a JS class targeting `.md-header`) and V3.2 (moved
    the class-setting to external JS, added `!important`) both failed to
    remove a bar showing a "Home" link, confirmed under real `mkdocs
    serve` testing each time. Rather than guess at Material's class names
    a third time,
    `bookshelf-cursor.js` now runs a DOM-walk routine on load: starting
    from `.bookshelf-landing`, it walks up to `<body>`, and at every
    level hides all *siblings* of each ancestor on that path. Whatever
    Material calls the offending element, it's structurally outside that
    path and gets hidden — no class names required. The `:has()`/
    `!important` CSS rule stays too, as defense-in-depth, per the design
    doc's explicit instruction not to remove it.
  - **New files**: `docs/js/bookshelf-reveal.js` (the `IntersectionObserver`
    scroll-reveal behavior, split out as page-generic behavior independent
    of what got rendered) and `docs/js/bookshelf-particles.js` (the p5.js
    mote field, isolated so it can be dropped independently if it turns
    out to hurt performance — flagged by the user as needing a visual
    check once live, since the particles weren't visibly noticeable in
    the original reference mockup either).
  - Files touched: `docs/index.md`, `docs/stylesheets/bookshelf.css`,
    `docs/js/bookshelf-data.js`, `docs/js/bookshelf-gallery.js`,
    `docs/js/bookshelf-cursor.js`, new `docs/js/bookshelf-reveal.js`, new
    `docs/js/bookshelf-particles.js`.
- **V3** — Pivoted from V2's light museum-gallery mood to a dark literary
  gallery/cabinet: new dark palette (ink/deep/bronze/gold/amber/vellum/
  ivory plus a brightened verdigris accent), a 3-font stack (Fraunces,
  Libre Baskerville, Syne Mono), a recolored frame/mat/spotlight treatment, a
  new split-title hero with a drifting ghost-letter motif and a placeholder
  quote line, a custom orbital cursor (precise dot + lagging ring,
  `prefers-reduced-motion`/touch guards, never breaks focus/keyboard
  access), a `tag`→`tags`+`label` data-model split, a typographic
  thumbnail fallback for projects without art, dummy entries trimmed from
  5 to 3 (kept, repurposed as the fallback demo), and asimov set to
  inactive (confirmed 404 in production, unrelated to the deploy-pipeline
  fix). Full rationale in "Styling pass — V3" above. Files touched:
  `docs/index.md`, `docs/stylesheets/bookshelf.css`,
  `docs/js/bookshelf-data.js`, `docs/js/bookshelf-gallery.js`, new
  `docs/js/bookshelf-cursor.js`.
- **V3.2** — Second round of feedback, given against direct screenshots of
  the source reference mockup (clarified mid-review: those screenshots
  are of `BookshelfLanding/bookshelf-of-curiosities.html` itself, not our
  site — its kicker copy and Clarke/Christie/Asimov cards don't exist in
  our `bookshelf-data.js`, useful as exact visual ground truth regardless):
  - **Header bar still showing under `mkdocs serve`**, even after V3.1's
    fallback. Confirmed via `git status` that nothing had been committed
    yet, but the user confirmed they were testing via `mkdocs serve`
    against the working directory, which does pick up uncommitted edits —
    so the V3.1 fix genuinely wasn't working, not a stale-deploy issue.
    Rather than keep guessing at why an inline `<script>` might fail,
    moved the `body.bookshelf-landing-page` class-setting out of
    `index.md`'s inline script entirely and into `js/bookshelf-cursor.js`
    (set unconditionally, before its reduced-motion/touch bail-out) —
    guaranteed to run as plain external JS, never touched by
    Python-Markdown's HTML-block handling the way inline markdown content
    theoretically could be. Also added `!important` to the `display: none`
    rule as a second hedge, in case Material's own bundled JS sets an
    inline style on the header (inline styles otherwise beat any
    stylesheet selector regardless of specificity).
  - **Spotlight glow "too tacky."** V3.1's hover treatment — a
    `brightness(1.5)` filter plus a full-perimeter amber `box-shadow` glow
    around the rectangular frame — read as a neon-sign halo, not "warm
    light catching a piece." Removed the perimeter glow entirely (both the
    generic hover rule and the `cosmic-archive`-specific override) and
    replaced the brightness filter with a smaller, contained effect: the
    spotlight ellipse itself widens and lifts slightly on hover
    (`scale(1.1) translateY(-2px)`) rather than blooming brighter. Base
    opacity also lowered (0.35 → 0.2) so the always-on glow is quieter.
  - **Typography/asymmetry fidelity**, checked directly against the
    reference screenshots: imported **Instrument Serif** after all
    (reversing the "3 families, not 4" call from V3 — the reference's
    "Curiosities"/"The" use a distinctly flowing decorative italic that
    Fraunces doesn't replicate closely enough once compared side-by-side;
    cost is one more font family in an existing `@import`, not new JS
    complexity) for `.bht-the` and `.bht-curiosities`. Added the
    reference's quiet "✦ ✦ ✦" divider ornament below the hero title
    (`.bookshelf-hero-divider`), previously dropped. Card-level ghost
    initials (Section "Data model" above) had their stroke thinned from
    1px to 0.5px and recolored from `--bronze` to a new, darker `--brown`
    token (`#2e2014`, matching the reference's own muted stroke color) —
    the original was too bold/present for what's meant to be a faint
    background detail.
  - Files touched: `docs/index.md`, `docs/stylesheets/bookshelf.css`,
    `docs/js/bookshelf-cursor.js`.
- **V3.1** — Four fixes from first-look feedback on V3:
  - **Header bar still showing.** Root cause: the `:has()` selector
    hiding `.md-header` likely isn't supported in the browser being
    tested. Added a JS-set `body.bookshelf-landing-page` class (an inline
    `<script>` at the top of `index.md`'s landing section) as a fallback
    selector alongside `:has()`, since a plain class selector has no
    browser-support gap.
  - **Lost asymmetry.** The hero title and the card-level ghost-letter
    fallback were both centered; the source reference is deliberately
    asymmetric (left-aligned hero text with the ghost letter peeking off
    one corner, card ghosts bleeding off a corner rather than sitting as
    a centered watermark). `.bookshelf-hero` switched to `text-align:
    left` (kicker rule and `.bht-line2` un-centered to match), and
    `.bookshelf-ghost-initial` repositioned from dead-center flex to
    `position: absolute; bottom:-8%; right:-4%`, cropped by the wrap's
    existing `overflow: hidden` — same "stamped, bleeding off the edge"
    effect as the source's `.card-ghost`.
  - **Hatch texture broke the velvety background.** Removed
    `.bookshelf-landing::after` (the V2-inherited crosshatch) entirely —
    it fought the smooth dark gradient the dark pivot was going for; no
    replacement texture added.
  - **Hover effects too weak / backwards.** Three sub-fixes: (1) the
    spotlight glow was static regardless of hover state — added a
    `brightness(1.5)` filter bump on hover/focus; (2) the frame's hover
    shadow was deepening in plain black, which barely reads against an
    already near-black wall — added an amber glow layer
    (`0 0 36px rgba(212,160,64,0.22)`) to both the base hover rule and
    the `cosmic-archive`-specific hover override (which fully replaces
    `box-shadow`, so needed the same layer added separately); (3) the
    title's hover color was `var(--accent)` (verdigris `#4a7d6c`), which
    is perceptibly *darker* than the default `var(--ivory)` —
    backwards for a "this one is selected" cue. Changed to `var(--amber)`
    plus a soft `text-shadow` glow, so hovering reads as brighter, not
    dimmer. Files touched: `docs/index.md`,
    `docs/stylesheets/bookshelf.css`.
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

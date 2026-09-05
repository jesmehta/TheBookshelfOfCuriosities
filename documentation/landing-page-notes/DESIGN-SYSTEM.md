# Bookshelf of Curiosities ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Design System

**This file defines the target visual system.** When anything else in the repo conflicts with it ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â existing CSS, old class names, MkDocs Material defaults ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â this file wins. Do not blend the old system with this one. Do not produce hybrids.

---

## Context: what this replaces

The existing `docs/stylesheets/bookshelf-landing.css` is the **old system** (V3, Fraunces-based, gallery-wall card metaphor, frame moods). It is being replaced in full. The new system uses a different font stack, a different card pattern, and different layout components. When you see `.bookshelf-frame`, `.bookshelf-image-wrap`, `frameMood`, `randomFrameRatio()`, `frameWidthFraction()` ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â those are the old system. Do not carry them forward.

---

## Site architecture

MkDocs Material site with a standalone static landing page. Landing page is `docs/index.html`; MkDocs copies it through as the site root while the rest of `docs/` remains normal Markdown documentation. All landing CSS goes in `docs/stylesheets/bookshelf-landing.css`. JS files live in `docs/assets/js/`. Standalone projects (`scifi/`, `asimov/`, etc.) are plain HTML/CSS/JS at the repo root, copied into `public/` by CI - MkDocs never touches them.

Raw colour/font values live in one place, `docs/stylesheets/bookshelf-tokens.css` (`:root`-scoped `--bookshelf-*` custom properties, plus the Google Fonts `@import`) ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â both `bookshelf-landing.css` (the landing page) and `docs/stylesheets/bookshelf-material.css` (Material's `--md-*` variables, for every page including the chrome around the landing page itself) read from it instead of hardcoding the same values twice. Change a value once in tokens.css; both flows pick it up. See "Fonts" and "Colour tokens" below for what each token does, and `README.md`'s changelog for why this split happened (a font/palette mismatch had been live between the landing page and the rest of the site).

The landing page is standalone HTML now, but all CSS rules should stay scoped under `.bookshelf-landing` so the same stylesheet can coexist safely with Material-rendered pages and historical shell assumptions. The old Material-header hiding rules remain harmless defense-in-depth.

---

## Fonts

Load via Google Fonts. Exactly these four, no substitutions. The `@import` lives in `docs/stylesheets/bookshelf-tokens.css`, not `bookshelf-landing.css` ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â loaded once, site-wide, since the font stacks are now shared with the rest of the site (see below).

```
https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Instrument+Serif:ital@0;1&family=Syne:wght@400;700;800&family=Syne+Mono&display=swap
```

| CSS variable | Font | Role |
|---|---|---|
| `--ff-serif` | Libre Baskerville | Primary display ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â hero "Bookshelf", card titles, ghost letters |
| `--ff-inst` | Instrument Serif (italic) | Flowing accent ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â "The", "Curiosities", card body text, descriptions |
| `--ff-sans` | Syne | Labels only ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â the word "of" in the hero title, section names |
| `--ff-mono` | Syne Mono | All mono detail ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â kicker, section numbers, tags, ticker, card category |

Of these four, only two extend beyond the landing page: `mkdocs.yml`'s `theme.font` sets `text: Libre Baskerville` / `code: Syne Mono` for every Material-rendered page — this was true through V4.11, but as of V4.12 the doc pages have their own font pair instead (see the note below the table). `--ff-inst`/`--ff-sans` stay landing-page-only decorative faces. Kept in sync with `bookshelf-tokens.css` *by hand* ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â plain YAML can't reference a CSS custom property.

**V4.12 update:** doc pages no longer use Libre Baskerville/Syne Mono at all. A type-specimen comparison (same paragraph and a Keats stanza, set on the real `--bookshelf-ink` background) found Libre Baskerville's thin hairlines halate on the dark ground and read cramped at Material's default size. Doc-page typography now runs on its own pair of tokens:

| CSS variable | Font | Role |
|---|---|---|
| `--bookshelf-ff-docs-heading` | Literata | `.md-typeset h1`-`h3` |
| `--bookshelf-ff-docs-body` | Spectral, 18.5px/1.8 line-height (up from Material's ~16px default) | Everything else `.md-typeset` sets |

`mkdocs.yml`'s `theme.font.text: Spectral` sets the Material-wide base (headings included); `bookshelf-material.css` overrides just `h1`-`h3` to Literata, since Material's font config has no separate heading slot. `theme.font.code` is now unset — no doc page has code blocks, so Syne Mono wasn't doing anything there beyond the landing page's own decorative use of it.

Runners-up, not implemented but worth revisiting if this pairing stops working: Spectral solo (no Literata split) at the same 18.5px, and a sans-body pairing (Spectral titles / Libre Franklin body) if the serif body ever feels wrong for a stretch of content. Comparison specimen (all six options, same sample text, same dark background): <https://claude.ai/code/artifact/c6943eda-ae74-4bb8-9a4b-323affe227a8>

---

## Colour tokens

Raw values live in `docs/stylesheets/bookshelf-tokens.css` (`--bookshelf-*`, `:root`-scoped ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â loaded on every page, not just the landing page). `bookshelf-landing.css` maps those onto the `.bookshelf-landing`-scoped names below (`--ink: var(--bookshelf-ink)`, etc.); `docs/stylesheets/bookshelf-material.css` maps the *same* tokens onto Material's `--md-*` variables for the rest of the site. Never hardcode a hex value directly in either consuming file ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â extend `bookshelf-tokens.css` first. Never introduce new colour values.

| Token | Hex | Use |
|---|---|---|
| `--ink` | `#0e0c09` | Page background |
| `--deep` | `#161209` | Card backgrounds, ticker background |
| `--char` | `#1f1810` | Borders, ghost letter stroke |
| `--brown` | `#2e2014` | Ghost letter strokes on cards, subtle borders |
| `--sepia` | `#5a3e20` | Divider lines, scroll hint, index text |
| `--bronze` | `#8a6030` | Kicker text, card category, hero description |
| `--gold` | `#b8842a` | Cursor ring, section labels, divider ornaments, ticker accents |
| `--amber` | `#d4a040` | Cursor dot, hover arrow, card top-bar on hover |
| `--sand` | `#c8a870` | "Curiosities" in hero |
| `--vellum` | `#e0c898` | Mid-weight text |
| `--paper` | `#ede0c4` | Default body text colour |
| `--ivory` | `#f5edd8` | Card titles, footer signature |

---

## Ghost letter technique

Used in two places: the hero background and inside cards. Identical technique both places:

```css
color: transparent;
-webkit-text-stroke: 0.5px var(--char);   /* hero ghost */
-webkit-text-stroke: 0.5px var(--brown);  /* card ghost (slightly warmer) */
```

- Stroke is always `0.5px`. Thicker reads as too present.
- No fill, no SVG, no image ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â just the letterform outline.
- Hero ghost: `position: absolute; top: -4%; right: -6%`, `font-size: clamp(280px, 38vw, 520px)`, animated with `ghostDrift` (18s, alternate, ease-in-out: translateY 0ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢20px, rotate -1degÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢0.5deg).
- Card ghost: `position: absolute; bottom: -8px; right: -4px`, `font-size: 96px`, shifts slightly on card hover (`translate(-4px,-4px) scale(1.04)`).
- `@media (prefers-reduced-motion: reduce)` must disable the hero drift animation.

---

## Hero title structure

The title is split into four typographically distinct spans, not a single heading. Exact structure:

```html
<div class="hero-title" aria-label="The Bookshelf of Curiosities">
  <span class="ht-the">The</span>
  <span class="ht-bookshelf">Bookshelf</span>
  <div class="bht-line2">
    <span class="ht-of">of</span>
    <span class="ht-curiosities">Curiosities</span>
  </div>
</div>
```

| Class | Font | Size | Style | Colour |
|---|---|---|---|---|
| `.ht-the` | Instrument Serif | clamp(18px, 3vw, 34px) | italic | `--bronze` |
| `.ht-bookshelf` | Libre Baskerville | clamp(68px, 11vw, 148px) | bold italic | `--ivory` |
| `.ht-of` | Syne | clamp(11px, 1.4vw, 16px) | uppercase, letter-spacing 0.26em | `--gold` |
| `.ht-curiosities` | Instrument Serif | clamp(46px, 7.5vw, 102px) | italic | `--sand` |

All four spans animate in with `riseIn` (opacity 0ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢1, translateY 18pxÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢0) with staggered delays: 0.35s, 0.5s, 0.7s, 0.75s.

---

## Page sections and components

### Ticker / marquee band
Full-width band between the hero and the first card section. Scrolls all project names and topics in a loop. CSS: `animation: ticker 50s linear infinite`. Doubled content so the loop is seamless. Items are `font-family: var(--ff-mono); font-size: 9.5px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--sepia)`. Accent marks (`ÃƒÂ¢Ã…â€œÃ‚Â¦`) are `color: var(--gold)`.

### Section headers
```html
<div class="sec-head">
  <span class="sec-num">i.</span>
  <span class="sec-name">Section Title</span>
  <div class="sec-rule"></div>
</div>
```
`sec-num`: Libre Baskerville italic, 11px, `--sepia`. `sec-name`: Syne bold, 8.5px, letter-spacing 0.32em, uppercase, `--gold`. `sec-rule`: flex:1, 0.5px, `--char`. Padding-top 5.5rem before each section header.

### Typographic text band
A full-bleed horizontal band used between sections as a visual break. Contains one large ghost-style outlined word (e.g. "Empire") plus a row of mono-label topic terms. The big word uses `-webkit-text-stroke: 0.5px var(--brown); color: transparent`.

### Typographic quote break
A centred quote block with a large outlined word behind it as texture (e.g. "READING"). Quote text: Libre Baskerville italic, `clamp(22px, 4vw, 48px)`, `--vellum`. Attribution: Syne Mono, 9px, letter-spacing 0.28em, uppercase, `--sepia`. The background word: `font-size: clamp(120px, 20vw, 260px)`, `color: transparent`, `-webkit-text-stroke: 0.5px var(--char)`.

### Dataviz block
A wide feature block with a large ghost word "DATA" rotated 90Ãƒâ€šÃ‚Â° as a background texture. Contains a kicker (Syne Mono, `--gold`), a display title (Libre Baskerville bold italic, `clamp(28px, 5vw, 58px)`), a description (Instrument Serif italic), and chip labels.

---

## Card system

### Card grid
12-column CSS grid, 9px gap. Span classes: `.c4` (span 4), `.c5` (span 5), `.c6` (span 6), `.c7` (span 7), `.c8` (span 8), `.c12` (span 12). On mobile ÃƒÂ¢Ã¢â‚¬Â°Ã‚Â¤720px all cards collapse to `span 12`.

### Card HTML anatomy (copy exactly)
```html
<a href="URL" class="card c7">               <!-- live card -->
  <div class="card-ghost" aria-hidden="true">G</div>
  <div class="card-inner">
    <span class="badge-live">Live ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â€</span>   <!-- only on live cards -->
    <p class="card-cat">Category Ãƒâ€šÃ‚Â· Type</p>
    <h2 class="card-title">Title</h2>
    <p class="card-body-text">Description.</p>
    <div class="card-foot">
      <span class="card-tag">Tag Ãƒâ€šÃ‚Â· Label</span>
      <span class="card-arrow">ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â€</span>
    </div>
  </div>
</a>

<div class="card c5 card-dormant">           <!-- dormant card ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â div not a -->
  <div class="card-ghost" aria-hidden="true">A</div>
  <div class="card-inner">
    <span class="soon-chip">In preparation</span>
    <p class="card-cat">Category Ãƒâ€šÃ‚Â· Type</p>
    <h2 class="card-title">Title</h2>
    <p class="card-body-text">Description.</p>
    <div class="card-foot">
      <span class="card-tag">Tag Ãƒâ€šÃ‚Â· Label</span>
      <span class="card-arrow" style="opacity:.25">ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â</span>
    </div>
  </div>
</a>
```

### Card states

**Live card** (`<a class="card">`)
- Full hover: `translateY(-4px)`, border shifts to `--gold`
- Gold top-bar: `::after` pseudo, `height: 2px`, `background: var(--amber)`, `scaleX(0ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢1)` on hover from left
- Card ghost shifts: `translate(-4px,-4px) scale(1.04)` on hover
- `badge-live`: Syne Mono 7px, `--amber` text, `--bronze` border

**Dormant card** (`<div class="card card-dormant">`)
- No hover effects, no pointer events ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â `pointer-events: none`
- Hatched diagonal overlay via `::before`: `repeating-linear-gradient(135deg, transparent, transparent 18px, rgba(30,20,10,.25) 18px, rgba(30,20,10,.25) 19px)`
- `soon-chip`: Syne Mono 7px, `--brown` text, `--char` border, "In preparation"
- Arrow replaced with `ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â` at `opacity: 0.25`

### Card typography
| Element | Font | Size | Colour |
|---|---|---|---|
| `.card-cat` | Syne Mono | 8px, ls 0.22em, uppercase | `--sepia` |
| `.card-title` | Libre Baskerville bold italic | clamp(18px, 2vw, 26px) | `--ivory` |
| `.card-title-inst` | Instrument Serif italic | clamp(20px, 2.4vw, 30px) | `--ivory` |
| `.card-body-text` | Instrument Serif italic | 13px | `--bronze` |
| `.card-tag` | Syne Mono | 7.5px, ls 0.15em, uppercase | `--brown` |
| `.card-ghost` | Libre Baskerville bold italic | 96px | transparent, stroke `--brown` |

---

## Scroll reveal

Every section header, card, and major block carries class `.reveal`. On `DOMContentLoaded`, an `IntersectionObserver` (threshold 0.07) adds class `.vis` when the element enters the viewport. CSS:

```css
.reveal { opacity: 0; transform: translateY(22px); transition: opacity .7s ease, transform .75s cubic-bezier(.16,1,.3,1); }
.reveal.vis { opacity: 1; transform: none; }
```

Cards within a grid use `transition-delay` in increments of 0.04s for a staggered reveal.

---

## Cursor

Two elements in the HTML: `#bookshelf-cur-dot` and `#bookshelf-cur-ring`. Behaviour:

- **Dot**: 5px amber circle, `mix-blend-mode: screen`, zero lag ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â always exactly at pointer position
- **Ring**: 32px gold circle, 1px border, opacity 0.45, eased lag (factor 0.1 per frame). Expands to 52px, `--amber` border, opacity 0.75 when hovering any `<a>` or `.card:not(.card-dormant)`
- Bail out on `pointer: coarse` and `prefers-reduced-motion` ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â cursor stays native, `cursor: none` is never set unconditionally
- `body.bookshelf-landing-page .md-header { display: none !important }` is set by the cursor JS (adds class to body) ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â preserve this

---

## P5.js particle field

Loaded from cdnjs: `https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js`

Fixed-position canvas behind all content (`z-index: 0`, `pointer-events: none`), attached to `#p5wrap`. As of V4.1 this is a firefly state-machine sim (~24 motes, noise-driven heading, flying/landing/resting/takeoff states) rather than the drifting-mote physics described in earlier versions of this doc ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â see `README.md`'s changelog (V4.1) and `LANDING-PAGE-NOTES.md` bug #5 for why. On `windowResized`, canvas resizes to match viewport.

---

## Data structure (TSV + generated content)

Landing content is split between spreadsheet-friendly TSV files and hand-edited display/config JS. Edit `content/bookshelf-sections.tsv` and `content/bookshelf-entries.tsv` for sections/entries, then run `node tools/build-bookshelf-content.js`; do not hand-edit `docs/assets/js/bookshelf-generated-content.js`. `bookshelf-gallery.js` reads the generated globals and renders HTML. Section/container metadata and entry/card metadata are separate:

```js
const bookshelfSections = [
  {
    id: "section-id",
    title: "Section Title",
    order: 10,
    status: true,
    feature: "dataviz" // optional: "dataviz" or "writings"
  }
];

const bookshelfEntries = [
  {
    id: "unique-slug",
    title: "Card Title",
    subtitle: "One sentence.",       // card-body-text
    href: "https://...",
    section: "section-id",           // must match bookshelfSections[].id
    kind: "author-page",
    kicker: "Category / Type",       // TSV alias; generator renders middle dot
    displayTag: "Tag / Label",       // TSV alias; generator renders middle dot
    tags: ["tag-one", "tag-two"],
    location: "internal-md",         // internal-md | internal-html | external | external-repo
    status: true,                    // true | "wip" | false
    order: 10,
    ghost: "G",                      // single letter/digraph; "" omits ghost
    span: "c7",                      // c4/c5/c6/c7/c8/c12
    titleVariant: "inst"             // optional
  }
];
```

`bookshelf-gallery.js` groups entries by `section`, renders a `.sec-head` for each visible section, then renders matching entries as cards. Section numbering (i, ii, iiiÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦) is derived from `bookshelfSections[].order`.

**To add an entry:** add one row to `content/bookshelf-entries.tsv`. Set `status: "wip"` and `href` blank until the page is ready, then regenerate with `node tools/build-bookshelf-content.js`.

**To activate an entry:** set `status` to `true` (or `TRUE`, if Excel uppercases it) and `href` to the real URL.

**TSV punctuation convention:** keep source TSVs ASCII-safe for Excel. Use ` / ` in compact labels where the page should display a middle dot, and `...` where the page should display an ellipsis. The generator restores those typographic characters in generated JS.

Feature blocks still use their own `enabled` flags, and `beforeSection` pinning for the text-band/quote-break still matches section IDs. See `README.md`'s "Current data model" section for the full current shape.

---

## What not to do

- Do not use `Fraunces`, `Playfair Display`, `Cormorant Garamond`, `Space Mono`, or `DM Serif Display`
- Do not use `.bookshelf-frame`, `.bookshelf-image-wrap`, `.bookshelf-card-inner`, `frameMood`, `frame-*` classes ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â those are the old system
- Do not use `randomFrameRatio()` or `frameWidthFraction()` ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â old system
- Do not add `cursor: none` to `body` or `.bookshelf-landing` unconditionally
- Do not hardcode hex colour values
- Do not add `<style>` blocks to `index.html`
- Do not put rendering logic in `index.html` or entry data in `bookshelf-gallery.js`
- Do not create or commit a `public/` folder ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â CI only
- Do not remove the `body:has(.bookshelf-landing) .md-header` rule

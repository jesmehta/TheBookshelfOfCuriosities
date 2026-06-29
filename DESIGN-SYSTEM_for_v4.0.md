# Bookshelf of Curiosities — Design System

**This file defines the target visual system.** When anything else in the repo conflicts with it — existing CSS, old class names, MkDocs Material defaults — this file wins. Do not blend the old system with this one. Do not produce hybrids.

---

## Context: what this replaces

The existing `docs/stylesheets/bookshelf.css` is the **old system** (V3, Fraunces-based, gallery-wall card metaphor, frame moods). It is being replaced in full. The new system uses a different font stack, a different card pattern, and different layout components. When you see `.bookshelf-frame`, `.bookshelf-image-wrap`, `frameMood`, `randomFrameRatio()`, `frameWidthFraction()` — those are the old system. Do not carry them forward.

---

## Site architecture (unchanged)

MkDocs Material site. Landing page is `docs/index.md`. All landing CSS goes in `docs/stylesheets/bookshelf.css`. JS files live in `docs/js/`. Standalone projects (`scifi/`, `asimov/`, etc.) are plain HTML/CSS/JS at the repo root, copied into `public/` by CI — MkDocs never touches them.

Raw colour/font values live in one place, `docs/stylesheets/bookshelf-tokens.css` (`:root`-scoped `--bookshelf-*` custom properties, plus the Google Fonts `@import`) — both `bookshelf.css` (the landing page) and `docs/stylesheets/bookshelf-material.css` (Material's `--md-*` variables, for every page including the chrome around the landing page itself) read from it instead of hardcoding the same values twice. Change a value once in tokens.css; both flows pick it up. See "Fonts" and "Colour tokens" below for what each token does, and `docs/README.md`'s changelog for why this split happened (a font/palette mismatch had been live between the landing page and the rest of the site).

The landing page must continue to work inside MkDocs Material's shell. All CSS rules must be scoped under `.bookshelf-landing` to avoid clashing with Material's own styles. The MkDocs header must be hidden on the landing page (existing mechanism: `body:has(.bookshelf-landing) .md-header` and `body.bookshelf-landing-page .md-header { display: none !important }` — keep this).

---

## Fonts

Load via Google Fonts. Exactly these four, no substitutions. The `@import` lives in `docs/stylesheets/bookshelf-tokens.css`, not `bookshelf.css` — loaded once, site-wide, since the font stacks are now shared with the rest of the site (see below).

```
https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Instrument+Serif:ital@0;1&family=Syne:wght@400;700;800&family=Syne+Mono&display=swap
```

| CSS variable | Font | Role |
|---|---|---|
| `--ff-serif` | Libre Baskerville | Primary display — hero "Bookshelf", card titles, ghost letters |
| `--ff-inst` | Instrument Serif (italic) | Flowing accent — "The", "Curiosities", card body text, descriptions |
| `--ff-sans` | Syne | Labels only — the word "of" in the hero title, section names |
| `--ff-mono` | Syne Mono | All mono detail — kicker, section numbers, tags, ticker, card category |

Of these four, only two extend beyond the landing page: `mkdocs.yml`'s `theme.font` sets `text: Libre Baskerville` / `code: Syne Mono` for every Material-rendered page, since Material's font config only has two slots and `--ff-inst`/`--ff-sans` are landing-page-only decorative faces. Kept in sync with `bookshelf-tokens.css` *by hand* — plain YAML can't reference a CSS custom property.

---

## Colour tokens

Raw values live in `docs/stylesheets/bookshelf-tokens.css` (`--bookshelf-*`, `:root`-scoped — loaded on every page, not just the landing page). `bookshelf.css` maps those onto the `.bookshelf-landing`-scoped names below (`--ink: var(--bookshelf-ink)`, etc.); `docs/stylesheets/bookshelf-material.css` maps the *same* tokens onto Material's `--md-*` variables for the rest of the site. Never hardcode a hex value directly in either consuming file — extend `bookshelf-tokens.css` first. Never introduce new colour values.

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
- No fill, no SVG, no image — just the letterform outline.
- Hero ghost: `position: absolute; top: -4%; right: -6%`, `font-size: clamp(280px, 38vw, 520px)`, animated with `ghostDrift` (18s, alternate, ease-in-out: translateY 0→20px, rotate -1deg→0.5deg).
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

All four spans animate in with `riseIn` (opacity 0→1, translateY 18px→0) with staggered delays: 0.35s, 0.5s, 0.7s, 0.75s.

---

## Page sections and components

### Ticker / marquee band
Full-width band between the hero and the first card section. Scrolls all project names and topics in a loop. CSS: `animation: ticker 50s linear infinite`. Doubled content so the loop is seamless. Items are `font-family: var(--ff-mono); font-size: 9.5px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--sepia)`. Accent marks (`✦`) are `color: var(--gold)`.

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
A wide feature block with a large ghost word "DATA" rotated 90° as a background texture. Contains a kicker (Syne Mono, `--gold`), a display title (Libre Baskerville bold italic, `clamp(28px, 5vw, 58px)`), a description (Instrument Serif italic), and chip labels.

---

## Card system

### Card grid
12-column CSS grid, 9px gap. Span classes: `.c4` (span 4), `.c5` (span 5), `.c6` (span 6), `.c7` (span 7), `.c8` (span 8), `.c12` (span 12). On mobile ≤720px all cards collapse to `span 12`.

### Card HTML anatomy (copy exactly)
```html
<a href="URL" class="card c7">               <!-- live card -->
  <div class="card-ghost" aria-hidden="true">G</div>
  <div class="card-inner">
    <span class="badge-live">Live ↗</span>   <!-- only on live cards -->
    <p class="card-cat">Category · Type</p>
    <h2 class="card-title">Title</h2>
    <p class="card-body-text">Description.</p>
    <div class="card-foot">
      <span class="card-tag">Tag · Label</span>
      <span class="card-arrow">↗</span>
    </div>
  </div>
</a>

<div class="card c5 card-dormant">           <!-- dormant card — div not a -->
  <div class="card-ghost" aria-hidden="true">A</div>
  <div class="card-inner">
    <span class="soon-chip">In preparation</span>
    <p class="card-cat">Category · Type</p>
    <h2 class="card-title">Title</h2>
    <p class="card-body-text">Description.</p>
    <div class="card-foot">
      <span class="card-tag">Tag · Label</span>
      <span class="card-arrow" style="opacity:.25">—</span>
    </div>
  </div>
</a>
```

### Card states

**Live card** (`<a class="card">`)
- Full hover: `translateY(-4px)`, border shifts to `--gold`
- Gold top-bar: `::after` pseudo, `height: 2px`, `background: var(--amber)`, `scaleX(0→1)` on hover from left
- Card ghost shifts: `translate(-4px,-4px) scale(1.04)` on hover
- `badge-live`: Syne Mono 7px, `--amber` text, `--bronze` border

**Dormant card** (`<div class="card card-dormant">`)
- No hover effects, no pointer events — `pointer-events: none`
- Hatched diagonal overlay via `::before`: `repeating-linear-gradient(135deg, transparent, transparent 18px, rgba(30,20,10,.25) 18px, rgba(30,20,10,.25) 19px)`
- `soon-chip`: Syne Mono 7px, `--brown` text, `--char` border, "In preparation"
- Arrow replaced with `—` at `opacity: 0.25`

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

- **Dot**: 5px amber circle, `mix-blend-mode: screen`, zero lag — always exactly at pointer position
- **Ring**: 32px gold circle, 1px border, opacity 0.45, eased lag (factor 0.1 per frame). Expands to 52px, `--amber` border, opacity 0.75 when hovering any `<a>` or `.card:not(.card-dormant)`
- Bail out on `pointer: coarse` and `prefers-reduced-motion` — cursor stays native, `cursor: none` is never set unconditionally
- `body.bookshelf-landing-page .md-header { display: none !important }` is set by the cursor JS (adds class to body) — preserve this

---

## P5.js particle field

Loaded from cdnjs: `https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js`

Fixed-position canvas behind all content (`z-index: 0`, `pointer-events: none`), attached to `#p5wrap`. 110 motes, two types:
- Large (`r > 1.8`): gold `rgba(180,128,42,a)`, elongated ellipse (height randomised 0.8–2.2× width)
- Small: sepia `rgba(90,62,32,a*0.6)`, circular

All motes drift upward (`vy` negative bias), scatter away from cursor (repulsion radius 130px, force factor 0.08), fade in and out via `sin(age * PI)` on alpha. Frame rate 42. On `windowResized`, canvas resizes to match viewport.

---

## Data structure (bookshelf-data.js)

The card data array is the **only file to edit** when adding or changing cards. `bookshelf-gallery.js` reads it and renders HTML. Structure per card:

```js
{
  id: "unique-slug",
  section: "Section Name",      // groups cards under a section header
  cat: "Category · Type",       // card-cat, mono label
  title: "Card Title",          // card-title
  desc: "One sentence.",        // card-body-text
  tag: "Tag · Label",           // card-foot tag
  href: "https://...",          // "" or "#" = dormant; real URL = live
  live: true,                   // true = <a> with badge-live; false = <div> with soon-chip
  ghost: "G"                    // single letter or digraph for the card-ghost
}
```

`bookshelf-gallery.js` should group cards by `section`, render a `.sec-head` for each group, then the cards. Section numbering (i, ii, iii…) is derived from the order sections first appear in the array.

**To add a card:** add one object to the array. Set `live: false` and `href: ""` until the page is ready. That is the only required step.

**To activate a card:** set `live: true` and `href` to the real URL.

---

## What not to do

- Do not use `Fraunces`, `Playfair Display`, `Cormorant Garamond`, `Space Mono`, or `DM Serif Display`
- Do not use `.bookshelf-frame`, `.bookshelf-image-wrap`, `.bookshelf-card-inner`, `frameMood`, `frame-*` classes — those are the old system
- Do not use `randomFrameRatio()` or `frameWidthFraction()` — old system
- Do not add `cursor: none` to `body` or `.bookshelf-landing` unconditionally
- Do not hardcode hex colour values
- Do not add `<style>` blocks to `index.md`
- Do not put rendering logic in `index.md` or card data in `bookshelf-gallery.js`
- Do not create or commit a `public/` folder — CI only
- Do not remove the `body:has(.bookshelf-landing) .md-header` rule

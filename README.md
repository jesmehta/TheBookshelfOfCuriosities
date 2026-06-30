# The Bookshelf of Curiosities

Repo-level practical guide and changelog. Two companion docs: [`DESIGN-SYSTEM.md`](DESIGN-SYSTEM.md) (the landing page's visual design rules — fonts, colour tokens, component anatomy) and [`LANDING-PAGE-NOTES.md`](LANDING-PAGE-NOTES.md) (portable MkDocs/Material implementation lessons, written to be reused in a future sibling site, e.g. a "Cabinet" or "fffx" site). For the SciFi project specifically, see `scifi/README.md`.

## Structure

- `docs/` — MkDocs Material source. `index.md` is the custom landing page (a mount-point shell — see "Landing page" below); other Markdown pages get the normal Material theme/sidebar. There is no `docs/README.md` — all project documentation lives at the repo root (see `LANDING-PAGE-NOTES.md` bug #6 for why mixing a docs-folder `README.md` with `index.md` is worth avoiding).
- `docs/stylesheets/bookshelf-tokens.css` — single source of truth for the site's colour/font values (`--bookshelf-*`), shared between `bookshelf-landing.css` (the landing page) and `bookshelf-material.css` (Material's `--md-*` variables, for every other page). See `DESIGN-SYSTEM.md` for the full token reference.
- `mkdocs.yml`, `requirements.txt` — MkDocs config and its Python dependencies.
- `scifi/` — a standalone static HTML/CSS/JS project (no build step), served at `/scifi/`. Independent of MkDocs; mkdocs never touches it.
- `CNAME` — custom domain (`bookshelf.cabinetofcuriosities.in`) for GitHub Pages.
- `.github/workflows/deploy.yml` — the deploy pipeline (see below).

## Deploy pipeline

`deploy.yml` runs on every push to `main`, as two jobs:

1. **`build`** — checks out the repo, installs Python deps, runs `mkdocs build --site-dir public` (this generates `public/` fresh inside the CI runner — it's never committed to git, never exists in your local checkout, and is discarded after the run), then copies any standalone static project folders (see below) into `public/`, then uploads `public/` as the Pages artifact.
2. **`deploy`** — publishes that artifact via `actions/deploy-pages`.

There is only one live version of the site. `public/` is not a second copy that can drift out of sync — it's regenerated entirely from the current state of `main` on every push, so there's no manual sync step between "the repo" and "the live site."

### Why `actions/deploy-pages` instead of a `gh-pages` branch

The workflow originally used `peaceiris/actions-gh-pages@v3`, copied from another working repo. It started failing here with no docs/code changes — most likely because GitHub now defaults `GITHUB_TOKEN` to read-only, which that action needs write access to push a `gh-pages` branch; it's also based on an aging Node runtime GitHub has been retiring. Migrated to GitHub's own first-party Pages actions (`configure-pages` → `upload-pages-artifact` → `deploy-pages`), which deploy via the Pages API directly using OIDC (`id-token: write`) instead of a pushed branch — no `gh-pages` branch exists or is needed anymore.

This requires one one-time, per-repo manual step that isn't in the YAML: **Settings → Pages → Build and deployment → Source → "GitHub Actions"** (instead of "Deploy from a branch").

### Adding a new standalone static project

Projects like `scifi/` (plain HTML/CSS/JS, no build step, edited and committed directly, no mkdocs involvement) are published by an explicit allow-list in the `Copy static interactive projects` step in `deploy.yml`:

```yaml
- name: Copy static interactive projects
  run: |
    for proj in scifi asimov; do
      if [ -d "$proj" ]; then
        cp -r "$proj" "public/$proj"
      fi
    done
```

Each name in the list is guarded by `if [ -d "$proj" ]`, so listing a project before it exists is harmless — it's just skipped until the folder shows up. `asimov` is already in the list pre-emptively for this reason (and has since gone live — see below).

To add a new one:
1. Create the project's folder at the **repo root** (sibling of `docs/`, `scifi/`), self-contained (its own `index.html`, assets, data).
2. Add its folder name to the `for proj in ...` list in `deploy.yml` (skip this step if it's already pre-listed, e.g. `asimov`).
3. Push to `main` — it'll be live at `/<folder-name>/`, served standalone (no MkDocs theme/sidebar — mkdocs never processes these folders, they're copied byte-for-byte).

This keeps everything under one custom domain with path-based routing (`bookshelf.cabinetofcuriosities.in/scifi/`, etc.) without extra infrastructure. The tradeoff: all these projects live in one repo rather than each having its own. Splitting them into separate repos would mean giving up path-based subpaths for subdomains (or adding a reverse-proxy layer) — not pursued here since subpath routing under one domain was the goal.

## Landing page

The landing page (`docs/index.md` + `docs/stylesheets/bookshelf-landing.css` + `docs/js/bookshelf-data.js` / `bookshelf-gallery.js`) is a fully custom, JS-rendered front page living inside an otherwise-normal MkDocs Material site. Visual rules (fonts, colour tokens, component anatomy) live in `DESIGN-SYSTEM.md`; portable implementation lessons (bugs hit, MkDocs-vs-plain-HTML reconciliations, a starter checklist for a sibling site) live in `LANDING-PAGE-NOTES.md`. This section covers intent and the current data model; the full version history is in the Changelog below.

### Intent

> The Bookshelf of Curiosities is a quiet literary gallery where books become maps, timelines, archives, and strange framed portals into worlds of reading.

The landing page is a **threshold space** — the front room of the Bookshelf, not the archive itself. A visitor sees a few framed exhibits and decides which world to enter.

Underneath, it's still MkDocs, mapped onto the same metaphor:

- the landing page = the gallery room
- the side nav / Markdown pages = the archive catalogue and reading rooms
- static interactives (`/scifi/`, `/asimov/`) = larger special exhibits in adjoining rooms

While a section isn't ready, its cards render dormant (see `DESIGN-SYSTEM.md`'s card states) instead of linking out — no portal pages, no iframes; the gallery is purely a front door.

### Current data model (V4.0+)

The whole page is data-driven from one file, `docs/js/bookshelf-data.js`. `docs/js/bookshelf-gallery.js` reads every block below and renders it into empty mount points in `index.md` — no content strings or rendering logic live anywhere else. Every block has an `enabled` flag; flip it to remove that block from the page without deleting its content. This is the actual current shape, which extends past `DESIGN-SYSTEM.md`'s simpler single-card example to cover the whole page:

| Variable | Shape | Renders as |
|---|---|---|
| `bookshelfTicker` | `{ enabled, items: string[] }` | the scrolling marquee band |
| `bookshelfTextBand` | `{ enabled, beforeSection, word, topics: string[] }` | full-bleed ghost-word break, pinned immediately above the named section |
| `bookshelfQuoteBreak` | `{ enabled, beforeSection, bgWord, quote, attribution }` | centered pull-quote over a ghost-word texture, same pinning mechanism |
| `bookshelfDataviz` | `{ enabled, kicker, title, desc, chips: string[] }` | the wide feature block — only rendered for the section with `feature: "dataviz"` |
| `bookshelfWritings` | `{ enabled, big, sub, chip }` | the single dormant writings band — only rendered for the section with `feature: "writings"` |
| `bookshelfSections` | `[{ name, enabled, feature?, cards: Card[] }]` | section header (numbered i/ii/iii… by array order) + a 12-col card grid |

A `Card` is `{ id, cat, title, desc, tag, href, live, ghost, span, titleVariant? }`. `live: true` + a real `href` renders an `<a class="card">` with a "Live ↗" badge; `live: false` renders a `<div class="card card-dormant">` (hatched overlay, `pointer-events: none`, a "soon-chip" instead). Both `scifi` and `asimov` are `live: true` as of V4.0 — Asimov went live at `/asimov/` after being recorded as a dead link in the V3-era data. `span` is one of `c4`/`c5`/`c6`/`c7`/`c8`/`c12` (12-column grid). `ghost: ""` omits the card-ghost letter entirely (used for the three dataviz cards, which don't have one in the source reference). `titleVariant: "inst"` swaps the title font from Libre Baskerville to Instrument Serif for that one card.

`bookshelfTextBand`/`bookshelfQuoteBreak`'s `beforeSection` must exactly match a `name` in `bookshelfSections` — the renderer inserts that block immediately before the matching section as it iterates, which is also why section *names* are load-bearing, not just labels: renaming a section without updating any `beforeSection` referencing it silently drops the text band or quote break with no error.

The header/tab-bar hiding mechanism, cursor behaviour, and the firefly particle field are implementation details — see `LANDING-PAGE-NOTES.md` and the Changelog below rather than restating them here.

### Deferred ideas (not built)

Raised at various points pre-V4.0, never picked up, presumed still open: an actual day/night light switch, a cat crossing the floor, dust motes, a "surprise me" button, content-type filter chips, and a rearrange-by-genre/map/timeline/author view. (V3's other deferred items — the scrolling ticker, a multi-section homepage, dormant placeholder cards, a particle field — were reversed and built in V4.0; see the changelog entry below.)

## Changelog

- **V4.4** — Fixed `geography-of-murder`'s `href: "/agatha/"` (root-absolute)
  to `href: "agatha/"` (relative) — same bug class fixed in fffx's
  `entries[].href` earlier: a root-absolute href only resolves correctly
  when the page serving it sits at a domain root, and breaks under a
  GitHub Pages project subpath (`*.github.io/TheBookshelfOfCuriosities/`)
  with no custom domain active. Currently masked in production by the
  `CNAME` (`bookshelf.cabinetofcuriosities.in`) actually being live, but
  latent the moment that assumption stops holding. `docs/agatha.md` is
  the first of what's intended to be a growing set of plain-Markdown
  content pages linked from cards (as opposed to `scifi`/`asimov`,
  which are standalone static HTML, copied in by CI, not MkDocs pages
  at all) — worth getting the href convention right now since this
  entry is the one that'll get copied for the next one.
- **V4.3** — Cross-world normalization pass (see new `WORLD-SYSTEMS.md`,
  shared with the fffx sibling repo). Renamed `bookshelf.css` ->
  `bookshelf-landing.css` to match the world-prefixed CSS naming
  convention (fffx's equivalent files got the matching treatment in its
  own repo). Updated every reference — `mkdocs.yml`'s `extra_css`,
  `bookshelf-tokens.css`/`bookshelf-material.css`'s own comments,
  `bookshelf-cursor.js`/`bookshelf-reveal.js`'s comments, and prose
  throughout this file/`DESIGN-SYSTEM.md`/`LANDING-PAGE-NOTES.md` —
  except inside already-dated changelog entries below describing
  earlier states, which correctly still say `bookshelf.css` (what was
  true at the time).
- **V4.2** — Synced colour/typography between the landing page and the
  rest of the Material-rendered site (prompted by doing the equivalent
  work on the fffx sibling site and noticing this site's version was
  incomplete). Root issue: `theme.font` (`Ubuntu`/`Ubuntu Mono`) never
  matched the landing page's actual fonts (`Libre Baskerville`/
  `Instrument Serif`/`Syne`/`Syne Mono`), and the existing
  `[data-md-color-primary="custom"]` override in `bookshelf.css` only
  patched the header bar (`--md-primary-fg-color`/`--md-accent-fg-color`)
  — body background/text/code colours were untouched, still
  Material's light-theme defaults. Both were invisible until now because
  there's no actual Material content page yet besides the landing page
  itself (header hidden there) — see `LANDING-PAGE-NOTES.md`'s bug entry
  #7 for the full lesson.
  Fixed by extracting every colour/font value into a new
  `docs/stylesheets/bookshelf-tokens.css` (`:root`-scoped `--bookshelf-*`
  custom properties, single source of truth — the Google Fonts `@import`
  moved here too) and adding `docs/stylesheets/bookshelf-material.css`
  (a *complete* Material variable mapping — default bg/fg, primary,
  accent, code, link colours — targeting
  `[data-md-color-scheme="slate"]`, replacing the old partial inline
  block). `bookshelf.css` now reads `--ink`/`--gold`/etc. from the
  tokens file instead of hardcoding them a second time.
  `mkdocs.yml`: added `theme.palette.scheme: slate`; `theme.font` →
  `text: Libre Baskerville`, `code: Syne Mono` (the other two fonts,
  Instrument Serif and Syne, stay landing-page-only — Material's font
  config only has two slots); `theme.favicon` → `images/favicon.svg`
  (copied in by hand from mkdocs-material's bundled `material/lighthouse`
  MDI icon — `theme.favicon` doesn't resolve `material/<name>` slugs the
  way `theme.icon.logo` does, it just emits a broken `<link>` if you try;
  found this by actually building and inspecting the output HTML, not by
  assumption). `theme.icon.logo` (`material/tortoise`) left as-is — it
  actually fits this site, unlike on fffx where it was a flagged
  leftover. See `DESIGN-SYSTEM.md`'s "Site architecture", "Fonts", and
  "Colour tokens" sections, all updated to match.
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
- **V4.0** — Full UI replacement per `DESIGN-SYSTEM.md` (repo
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
    array to be the one editable file) to satisfy the explicit ask:
    ticker words, section titles, and on/off toggles all need to be easy
    to find and change in one place.
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
    a third time, `bookshelf-cursor.js` now runs a DOM-walk routine on
    load: starting from `.bookshelf-landing`, it walks up to `<body>`,
    and at every level hides all *siblings* of each ancestor on that
    path. Whatever Material calls the offending element, it's
    structurally outside that path and gets hidden — no class names
    required. The `:has()`/`!important` CSS rule stays too, as
    defense-in-depth, per the design doc's explicit instruction not to
    remove it. Full portable writeup: `LANDING-PAGE-NOTES.md` bug #2.
  - **New files**: `docs/js/bookshelf-reveal.js` (the `IntersectionObserver`
    scroll-reveal behavior, split out as page-generic behavior independent
    of what got rendered) and `docs/js/bookshelf-particles.js` (the p5.js
    mote field, isolated so it can be dropped independently if it turns
    out to hurt performance).
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
  fix). Specific elements (dark palette family, split-title typography,
  ghost-letter motif, quote/type-break line, orbital cursor) were borrowed
  from a separate standalone HTML mockup
  (`BookshelfLanding/bookshelf-of-curiosities.html`, style reference only,
  never edited, not part of this site); its marquee/ticker, multi-section
  structure, many dormant cards, and p5.js particles were explicitly *not*
  borrowed at this stage — all four were reinstated later, in V4.0. Files
  touched: `docs/index.md`, `docs/stylesheets/bookshelf.css`,
  `docs/js/bookshelf-data.js`, `docs/js/bookshelf-gallery.js`, new
  `docs/js/bookshelf-cursor.js`.
- **V3.2** — Second round of feedback, given against direct screenshots of
  the source reference mockup (clarified mid-review: those screenshots
  are of `BookshelfLanding/bookshelf-of-curiosities.html` itself, not our
  site — its kicker copy and Clarke/Christie/Asimov cards don't exist in
  our `bookshelf-data.js`, useful as exact visual ground truth regardless):
  - **Header bar still showing under `mkdocs serve`**, even after V3.1's
    fallback. Confirmed via `git status` that nothing had been committed
    yet, but testing was against `mkdocs serve` on the working directory,
    which does pick up uncommitted edits — so the V3.1 fix genuinely
    wasn't working, not a stale-deploy issue. Rather than keep guessing at
    why an inline `<script>` might fail, moved the
    `body.bookshelf-landing-page` class-setting out of `index.md`'s inline
    script entirely and into `js/bookshelf-cursor.js` (set
    unconditionally, before its reduced-motion/touch bail-out) —
    guaranteed to run as plain external JS, never touched by
    Python-Markdown's HTML-block handling the way inline markdown content
    theoretically could be. Also added `!important` to the `display: none`
    rule as a second hedge, in case Material's own bundled JS sets an
    inline style on the header (inline styles otherwise beat any
    stylesheet selector regardless of specificity).
  - **Spotlight glow "too tacky."** The hover treatment — a
    `brightness(1.5)` filter plus a full-perimeter amber `box-shadow` glow
    around the rectangular frame — read as a neon-sign halo, not "warm
    light catching a piece." Removed the perimeter glow entirely and
    replaced the brightness filter with a smaller, contained effect: the
    spotlight ellipse itself widens and lifts slightly on hover
    (`scale(1.1) translateY(-2px)`) rather than blooming brighter. Base
    opacity also lowered (0.35 → 0.2) so the always-on glow is quieter.
  - **Typography/asymmetry fidelity**, checked directly against the
    reference screenshots: imported **Instrument Serif** after all
    (reversing the "3 families, not 4" call from V3 — the reference's
    "Curiosities"/"The" use a distinctly flowing decorative italic that
    Fraunces doesn't replicate closely enough once compared side-by-side)
    for the title's "The"/"Curiosities" spans. Added the reference's
    quiet "✦ ✦ ✦" divider ornament below the hero title, previously
    dropped. Card-level ghost initials had their stroke thinned from 1px
    to 0.5px and recolored from `--bronze` to a new, darker `--brown`
    token (`#2e2014`, matching the reference's own muted stroke colour) —
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
    a centered watermark). Hero switched to left-aligned text, and the
    ghost-letter fallback repositioned from dead-center flex to an
    absolute bottom-right offset, cropped by the wrap's existing
    `overflow: hidden` — same "stamped, bleeding off the edge" effect as
    the source's `.card-ghost`.
  - **Hatch texture broke the velvety background.** Removed the
    V2-inherited crosshatch overlay entirely — it fought the smooth dark
    gradient the dark pivot was going for; no replacement texture added.
  - **Hover effects too weak / backwards.** Three sub-fixes: the
    spotlight glow was static regardless of hover state — added a
    `brightness(1.5)` filter bump on hover/focus; the frame's hover
    shadow was deepening in plain black, which barely reads against an
    already near-black wall — added an amber glow layer to the hover
    rule; the title's hover colour was perceptibly *darker* than the
    default, backwards for a "this one is selected" cue — changed to
    `var(--amber)` plus a soft text-shadow glow, so hovering reads as
    brighter, not dimmer. Files touched: `docs/index.md`,
    `docs/stylesheets/bookshelf.css`.
- **V2.9** — Fixed the real cause of a "dark bar" / off-center cropping
  reported after a thumbnail swap: it wasn't the images (confirmed both
  source images were exactly 480×480), it was CSS specificity. Material's
  base styles ship `.md-typeset img { height: auto; max-width: 100% }`,
  which has higher specificity (class+type) than a plain
  `.bookshelf-thumbnail` rule (class only) and wins regardless of where
  each rule sits in the stylesheet. That let every `<img>` size itself to
  its own intrinsic square shape instead of stretching/cropping to the
  enforced `aspect-ratio` box, exposing the wrap's dark background
  wherever a frame wasn't square — and since frame aspect ratio was
  randomized per card (V2.3), that was most frames. Fixed by matching
  `.md-typeset` ancestry in the selector (`.md-typeset .bookshelf-thumbnail`),
  which reliably outranks Material's rule. File touched:
  `docs/stylesheets/bookshelf.css`.
- **V2.8** — Real thumbnails started landing (square source images with
  ample margin around the subject, meant to be cropped to whatever random
  frame aspect ratio landed on that card). `object-fit: cover` already
  did the right thing; made `object-position: center center` explicit
  rather than relying on an unstated browser default. File touched:
  `docs/stylesheets/bookshelf.css`.
- **V2.7** — Two fixes from review: a hover/focus selector
  (`.frame-cosmic-archive .bookshelf-card:hover .bookshelf-frame`) never
  matched because the two classes it tried to relate were on the *same*
  element, not nested — descendant-selector syntax (a space) means "an
  ancestor with this class," which doesn't exist when both classes sit on
  one `<a>`. Fixed by compounding both classes on the element they're
  actually on (`.bookshelf-card.frame-cosmic-archive:hover ...`). Also
  renamed the `contentType` data field to `tag` across
  `bookshelf-data.js`/`bookshelf-gallery.js` — naming only, no behaviour
  change.
- **V2.6** — Two additions: a mild crosshatch wall texture (two opposing
  `repeating-linear-gradient`s, `mix-blend-mode: multiply`) that read as
  painted plaster rather than the earlier "dusty paper" texture that had
  been removed; and `frameMood` began varying frame *style* (padding,
  mat width), not just colour, via five distinct per-mood treatments
  (pulp-cosmic, cosmic-archive, illuminated-manuscript, map-room,
  paperback).
- **V2.5** — Fixed a bug from V2.4: scaling frames by width alone made
  portrait frames look bigger than landscape frames at the same weight,
  since area = width² / aspect. Switched to solving for
  `width = areaScale * sqrt(aspect)`, which keeps visual area constant
  regardless of orientation. Also centered frames of different heights
  within their grid row instead of top-aligning them, and added six
  clearly-marked dummy entries to preview wall density ahead of real
  content.
- **V2.4** — A per-project `weight` field (already in the data, previously
  unused) began scaling each frame within its grid cell (0.5–1.0×,
  linearly mapped from weight 1–10) — superseded one version later by
  V2.5's area-based fix above, which corrected this version's
  width-only-scaling bug.
- **V2.3** — Frames stopped being locked to one aspect ratio: each card
  gets a randomized shape (favouring landscape 70% of the time) computed
  on load, re-randomizing every page view — the cheapest way to make a
  gallery wall feel hand-hung rather than templated.
- **V2.2** — Swapped a generated "Exhibit No. 0N" label line for the
  project's primary content-type tag (e.g. "timeline", "map") in the same
  position — a bare ordinal didn't tell a visitor anything about the
  piece.
- **V2.1** — Removed a lower intro paragraph from the title band, keeping
  only the kicker line above the `<h1>` as the page's one piece of intro
  copy.
- **V2** — Reworked the frame/wall/label treatment from a wood-and-mat
  library look to a museum gallery room: thin charcoal frames (down from
  thick gradient frames), wider/lighter mat board, a cooler bone-grey
  wall (parchment tone and dusty paper-grain texture removed), a static
  per-exhibit spotlight glow, a museum-label line, "Not yet on view"
  status copy, and a verdigris accent replacing oxblood — explicit
  direction to avoid heavy gold frames, brown gradients, dusty/parchment
  texture, and "theme-park antiquarianism."
- **V1.2** — Hid the Material header bar on the landing page only, via a
  `:has()`-scoped CSS rule (no JS/template changes).
- **V1.1** — Typography (Fraunces for display text), a paper-grain
  texture, frame gradient + dual shadow, mat-board treatment, an oxblood
  accent colour, hover colour shift on card titles.
- **V1** — Initial gallery-wall landing page: warm paper background,
  dark-framed cards, a per-project `frameMood` tint, hidden side nav/TOC
  on the landing page only.

## Appendix: the V1–V3 frame/mat system (historical, fully removed in V4.0)

The Changelog above records *what* changed each version; this appendix is
the fuller design rationale for the frame/mat/spotlight card system
specifically (hex values, exact measurements, per-mood treatments) from
before V4.0 deleted it outright (`.bookshelf-frame`, `.bookshelf-image-wrap`,
`.bookshelf-card-inner`, `frameMood`, `randomFrameRatio()`,
`frameWidthFraction()` — none of this exists in the codebase anymore).
Kept here rather than left to `git log` alone, since "what did the frame
system actually look like and why" is exactly the kind of thing worth
having on hand without digging through commits.

### V1.1 — first depth/color pass

**Problem reported:** the V1 styling felt flat, the typography didn't suit
the mood, and the palette read as beige rather than warm.

- Added **Fraunces** (variable serif) for the `<h1>` and card titles.
  Reasoning: the rest of the theme was sans-serif (Ubuntu, via
  `mkdocs.yml`); an all-sans-serif landing page read closer to a product
  page than a literary archive.
- Frame background changed from a flat fill to a soft diagonal gradient
  (`--frame-soft` → `--frame` → near-black), simulating light falling
  across painted wood. Frame shadow split into two layers (ambient +
  contact), growing slightly on hover/focus.
- `--accent: #7a3b2c` (oxblood/brass-adjacent) introduced for the kicker
  rule and card-title hover color.
- Mat board (the cream border around each thumbnail) given its own token
  (`--mat`) plus a thin dark outline, so it behaved like a real picture
  mat rather than a plain colored border.
- Added a faint SVG-noise paper-grain layer over the wall background
  (later removed in V2 for reading as "dusty").

### V2 — museum gallery, not parchment library

**Problem reported:** V1.1's frames (thick, gradient brown-to-black, with
an inner gilt-adjacent border) read as antiquarian/"magical library"
rather than a museum gallery.

V2 reworked the frame, wall, and label treatment around a literal museum
room rather than a wood-paneled library, per explicit direction to avoid
heavy gold frames, excessive brown gradients, dusty/parchment texture, and
"theme-park antiquarianism."

- **Frames**: replaced the thick gradient frame (padding up to ~0.95rem,
  plus a faint inner gilt-line border) with a single thin, near-flat
  charcoal frame (padding ~0.4–0.55rem, one soft inset highlight instead
  of a second border) — the core fix for "the frames idea looks
  boring/heavy."
- **Mat**: widened 0.5rem → 0.85rem and lightened to `--mat: #f6f3eb`, so
  each piece sat in generous museum matting rather than a narrow cream
  border. Matting, not frame thickness, carried the "considered" feeling.
- **Per-`frameMood` tints** moved off the brown family entirely — each
  became a distinct desaturated hue (indigo-slate, teal-slate, plum-ink,
  moss-slate, graphite) so exhibits read as different rooms/specimens
  without any one looking like stained wood.
- A quiet radial-gradient light pool was added above each frame, like a
  single gallery spotlight hitting that piece — static and unanimated,
  the placeholder for a never-built "day/night light switch" idea.
- Wall palette shifted from warm parchment (`#f3efe7`/`#e9e0d2`) to a
  cooler bone/greige (`#f1efe9`/`#e6e2d6`); warmth instead came from a
  soft top-down radial light wash.
- New accent: `--accent: #3f6b5e`, a verdigris/bronze-patina green,
  replacing the V1.1 oxblood (judged too antiquarian).

V2.6 later added five distinct per-`frameMood` *structural* treatments
(not just color), via `--frame-pad`/`--mat-width` custom properties:
pulp-cosmic (thin minimal frame), cosmic-archive (heavier frame + deeper
shadow, its own hover box-shadow), illuminated-manuscript (a second inset
line via `::after`, like a double mat), map-room (near-zero mat, bleeds
to the edge, plus two small corner "registration tick" pseudo-elements),
paperback (thin frame line, generous mat).

### V3 — dark literary gallery/cabinet (frames reskinned, not restructured)

V3 pivoted the whole page to a dark palette. The frame/mat/spotlight DOM
itself (`.bookshelf-card` > `.bookshelf-card-inner` > `.bookshelf-frame` >
`.bookshelf-image-wrap` > `.bookshelf-thumbnail`) was left structurally
untouched — only recolored:

- Mat changed from cream to warm umber (`--mat: #473423`), deliberately a
  visible lightness step *above* the frame tones (not near-black like the
  frame) so the mat still read as a distinct ring rather than blending
  into it.
- Spotlight glow recolored from warm-white to amber-tinted, still static.
- All 5 `frameMood` names were kept unchanged (they describe *structural*
  treatment — thickness, mat width, corner ticks, double inset — not
  color, so they still applied in a dark palette); only their `--frame`
  hex and accent-line colors shifted into a dark warm-neutral family
  (illuminated-manuscript's double-inset line became gold, map-room's
  corner ticks became amber).
- Inactive-exhibit opacity reduced from `0.62` to `0.5`, since
  dark-on-dark dims less visibly than light-on-light did.
- New dark token set: `--ink` (`#0e0c09`), `--deep` (`#161209`), `--char`
  (`#1f1810`), `--bronze` (`#8a6030`), `--gold` (`#b8842a`), `--amber`
  (`#d4a040`), `--sand` (`#c8a870`), `--vellum` (`#e0c898`), `--ivory`
  (`#f5edd8`, primary text). **Naming gotcha hit and fixed**: V2's `--ink`
  had been a *text*-color token (dark text on a light wall); V3 repurposed
  `--ink` as a *background* token (near-black) — every old rule doing
  `color: var(--ink)` had to be hunted down and switched to
  `color: var(--ivory)`, not just have the variable's value flipped, or
  text would have rendered near-black on near-black and vanished.

### Why it's gone, not deprecated-in-place

`DESIGN-SYSTEM.md`'s own preamble for V4.0 was explicit: "Do not blend the
old system with this one. Do not produce hybrids." The card pattern
changed from photographic-thumbnail-in-a-frame to a typographic
ghost-letter card with no image at all, so the frame/mat/spotlight DOM
had no role left to play — V4.0 deleted it rather than leaving dead CSS
selectors with no matching markup.

# Christie Timeline — Documentation

Covers `christie-timeline-v3.html`: an interactive Art Deco–styled timeline + sortable
table of Agatha Christie's full bibliography, laid along her own lifespan (1890–1976),
with works branching into protagonist lanes (Hercule Poirot, Miss Marple, Parker Pyne,
Mr Satterthwaite, Tommy and Tuppence, Standalone, Various).

---

## Design decisions & intent

**Starting point.** The page arrived as a "dark literary" theme — Libre Baskerville /
Instrument Serif / Syne Mono, a muted gold/UK-green/terracotta/grey four-way location
colour, a top filter bar + side legend-and-year-range panel, and an explanatory hint
paragraph under the chart. First review flagged one real problem: the Poirot lane's
1933–38 run rendered as a solid overlapping blob of dots — the chart's only serious
legibility issue.

**Full Art Deco / Swing Jazz / Lost Generation restyle** (explicit direction, replacing
"dark literary" outright, not layering on top of it):
- **Palette** — black lacquer background, gold leaf, and three jewel-tone location
  colours: emerald (UK), oxblood/garnet (The Continent and the Orient), turquoise
  (Elsewhere) — the classic black+gold+jewel-tone Deco combination, evoking the
  Tutankhamun-exhibition turquoise craze as much as ballroom gold.
- **Linework** — a `.deco-frame` double-line border (outer + inset inner rule) on every
  panel, a chevron/zigzag strip replacing the flat rule under the masthead, and later a
  `repeating-conic-gradient` sunburst fanning out behind the masthead — a motif absent
  from the original design entirely.
- **Two themes, one language.** Dark ("lacquer") and light ("cream card-stock") share
  the same custom-property system rather than being two different designs. The light
  theme's first pass read as "flat SaaS beige, not Deco" — the fix wasn't the base cream
  colour so much as contrast: `--frame-outer`/`--frame-inner` swap roles per theme (dark
  = gold outer / soft inner; light = **true black ink** outer / gold inner), because
  faded-gold-on-cream is what read as generic pastel, not the paper tone itself.
- **Layout** — filter chips moved from a horizontal top bar into a vertical sticky left
  sidebar; the legend was trimmed to two rows (shape · format, colour · location),
  dropping both the "Structure" row (the lifetime-line swatch) and the year-range
  control entirely — removed from `state`/`matches()`, not just hidden. The descriptive
  hint paragraph under the chart was removed outright; the legend + tooltips now carry
  that job alone.

**Decluttering the Poirot cluster (jitter).** Two iterations:
1. *Zigzag* (`0, +s, -s, +2s, -2s, …`), assigned in ascending-x order — looked wrong in
   practice: magnitude grows monotonically with index while walking left-to-right, so
   it draws two diagonal "ramps" (one up, one down), not a scatter.
2. **Bisection ladder** (current) — magnitudes `0, N/2, N, N/4, 3N/4, N/8, 3N/8, …`,
   each rung emitted as a `+`/`−` pair before the next rung is used. Every new point
   lands as far as possible from every point placed so far, which reads as a genuine
   scatter regardless of x-order. See `bisectionRungs()` / `computeJitter()`.

**Stroke-only + hatch-fill treatment.** Early on the title became hollow (transparent
fill + `-webkit-text-stroke`, theme-aware via `var(--ivory)`) with the interior filled
by a repeating hatch instead of solid color — an engraved-plate look. The hatch itself
went through its own small arc: fixed 45° `repeating-linear-gradient` first (diagonal
chosen to echo the sunburst/chevron's existing diagonal geometry) → upgraded to a
**`repeating-conic-gradient`** centered near the sunburst's own convergence point
(`50% 196px`, hand-matched to the `::before` sunburst's computed origin), so the hatch
genuinely radiates through the letterforms in continuity with the rays behind them,
rather than sitting at an unrelated flat angle → briefly tried as flat vertical stripes
instead (to test a specific font's thick/thin contrast) → **settled back on the
radiating sunburst pattern at mid density** as the final choice (see the last entry
below).

**Masthead typography — seven passes, each a direct response to feedback:**
1. *Cinzel Decorative* — first Deco pass, ornamental Roman caps.
2. *Poiret One* — swapped in after three user-named fonts (Metro 39 / Welo Thin /
   Matthew's Modern) turned out not to exist as exact matches, locally or on Google
   Fonts (see **Font sourcing**, below); Poiret One is the de facto "web Deco" default.
3. *Bodoni Moda* — Poiret One was called out as a "Gatsby movie-poster cliché."
   Replaced with a high-contrast didone serif — the actual typeface family of 1920s
   Vogue/fashion print advertising, chosen over three other offered directions (a bold
   condensed "skyscraper Deco" slab, a restrained classical Roman-caps face, and plain
   Cinzel) specifically to reference print/fashion Deco rather than film-title lettering.
4. *Monsante* — a genuine period-styled Art Deco display sans by Arterfak Project,
   supplied directly by the user as `monsante-font.zip` after both "Monsante" and
   "Marmalede" were confirmed real (but non-Google-Fonts) fonts. Self-hosted via
   `@font-face`. Rejected once live: its own built-in engraved detail left no open
   counter-space for the hatch to actually read against.
5. *Jost* — tried in response to "how about Bauhaus?" ITC Bauhaus/"Bauhaus 93" turned
   out to be a real but Windows-bundled commercial font (Microsoft's bundled ITC fonts
   are licensed for use on that install, not for extracting and re-embedding), so Jost
   was used instead — it's literally named after Bauhaus typographer Joost Schmidt and
   built on 1920s geometric-sans forms, with no licensing ambiguity. Better than
   Monsante for hatch visibility, but not the best.
6. *Notable* — chosen over two other named options (Gravitas One, Abril Fatface)
   specifically because both of those are extreme-contrast "fat face" Didones (heavy
   stems, hairline thins) where a hatch shows beautifully in the thick strokes and
   vanishes in the thin ones. Notable's letterforms are modeled on US currency/banknote
   engraving lettering — even stroke weight, big open counters — giving the best hatch
   legibility of any candidate tried.
7. **Abril Fatface** (final) — despite the fat-face contrast tradeoff flagged when
   rejecting Gravitas One, the user asked to see it rendered anyway. It reads well
   enough in practice (the hatch shows clearly in the heavy stems; thin strokes go
   hairline-solid rather than looking broken) and was chosen as the final masthead font,
   paired with the **radiating sunburst hatch at mid density** and the tagline kept in
   Josefin Sans throughout all of this (never changed from the original two-tier
   masthead layout).

**Content changes.** Protagonist lane labels went from shorthand to full names —
Hercule Poirot, Miss Marple, Mr Satterthwaite (dropping "Quin" from "Quin &
Satterthwaite" per the user's literal list), Tommy and Tuppence, Parker Pyne unchanged
— updated in `LANES` and every `DATA` row so chart, sidebar chips, and table all stay in
sync (they all read from the same arrays). The region "Europe & the Orient" became
"The Continent and the Orient" (`REGIONS`, every `DATA.region`, and the abbreviated
legend label). Filter-chip font size was bumped 11px → 13px afterward, since the
now-longer full names made the original size feel small.

---

## Font sourcing note

Three fonts named early on (Metro 39, Welo Thin, Matthew's Modern) don't exist as exact
matches — checked against Google Fonts and, once, against local font folders (that local
search briefly ran unscoped across entire drives rather than the session's declared
working directories; caught, discussed, and corrected — a permanent rule now blocks
open-ended filesystem scans like that going forward). Later, "Monsante" and "Marmalede"
were verified as real Art Deco fonts via web search: Monsante is freeware/personal-use
(Arterfak Project) and was supplied directly by the user; Marmalede is an Envato
Elements marketplace font and was never sourced (no subscription/license available).

"Bauhaus" as a request resolved to ITC Bauhaus / "Bauhaus 93" (Ed Benguiat's classic
geometric display face, based on Herbert Bayer's Bauhaus-era alphabet) — a real font,
but bundled with Windows under a license that (per Microsoft's usual terms for bundled
ITC fonts) permits use on that Windows install, not extracting the file and re-embedding
it elsewhere. Rather than check whether it happened to be on this machine and risk a
licensing grey area, went straight to a clean Google Fonts equivalent (Jost). Later,
"Notable" and "Gravitas One" were checked against real Google Fonts specimens before
being tried — Gravitas One turned out to share Abril Fatface's fat-face contrast
problem, which ruled it out at that stage.

The user separately supplied four more font zips found in the project folder —
Chapleau, Deco Majesty, Decolmax, and Marbold — all freeware/personal-use, same
licensing tier as Monsante. These were organized into `fonts/` alongside their licenses
and source zips, and added to the comparison artifacts (below), though none of the four
was chosen for the live masthead.

**Comparison artifacts.** Two Claude Artifacts were built (and are not part of this
repo — they're separate hosted pages) to compare fonts and hatch treatments visually
rather than iterating by screenshot in chat:

- **Christie Masthead Trials** — a type-specimen sheet showing all 11 fonts tried
  (the 7 masthead passes above, plus the 4 user-supplied extras) across all 4 hatch
  directions × 2 densities simultaneously, each rendered live with the real
  stroke+hatch CSS technique (not screenshots).
- **Christie Masthead Comparator** — three independent live "masthead" previews, each
  with its own title-font dropdown, tagline-font dropdown, hatch-direction toggle, and
  density toggle, for testing up to three full combinations (including tagline pairings
  like Decolmax or Poiret One in place of Josefin Sans) side by side at real size.

**Licensing:** Monsante and the four extra fonts are **free for personal,
non-commercial use only** — see each font's `-license.txt` in `fonts/`. A commercial
license from the respective foundry would be needed before any monetized or
public-commercial use of this page. Confirmed with the user (2026-09-12) that this is a
personal project, so the current licenses are sufficient. The live masthead font,
**Abril Fatface**, is a Google Fonts / SIL Open Font License face, so this licensing
caveat doesn't apply to what's actually shipping — it only matters if Monsante or the
four extras are ever reused for something else.

---

## Changelog

- Reviewed original dark-literary v3 page; flagged Poirot 1933–38 cluster density as
  the one real legibility problem.
- Full Art Deco restyle: new colour system (black/gold/emerald/oxblood/turquoise),
  Cinzel Decorative / Cormorant Garamond / Josefin Sans type system, double-frame
  borders, chevron divider, sidebar-based filter layout, legend trimmed to shape+colour,
  year-range control removed, hint paragraph removed, first (zigzag) jitter pass.
- Light theme rebuilt for real Deco contrast (black ink linework, saturated jewel
  accents) instead of a flat pastel/cream look; added the conic-gradient sunburst motif
  behind the masthead (both themes); fixed a stacking-order bug where the newly
  `position:relative` masthead painted over and ate clicks on the theme-toggle button
  (fixed with an explicit `z-index` on the toggle).
- Jitter algorithm replaced: zigzag → bisection-ladder, fixing a "two ramps instead of
  a scatter" defect.
- Answered: fonts in use (Cinzel Decorative / Cormorant Garamond / Josefin Sans at the
  time).
- Attempted to source Metro 39 / Welo Thin / Matthew's Modern; none matched exactly.
  User chose a Google Fonts equivalent → **Poiret One** installed for the masthead.
- Renamed page/masthead to "Agatha Christie — Murder Across Time and Space"; removed
  the descriptive hint paragraph under the masthead subtitle; masthead restructured
  into a two-tier title + tagline.
- Poiret One called out as a cliché → offered 4 alternative directions → **Bodoni
  Moda** chosen and installed (weight/tracking retuned for a didone vs. a thin
  geometric sans).
- Masthead title made stroke-only (hollow/outline).
- Added diagonal hatch fill inside the stroke (chosen over vertical to match existing
  diagonal motifs).
- Hatch upgraded from fixed-angle to radiating, centered to match the sunburst's own
  convergence point.
- Investigated "Monsante"/"Marmalede" as named Deco fonts; confirmed both real via web
  search, neither on Google Fonts. Attempted automated download of Monsante — blocked
  by Cloudflare bot-protection / JS-rendered pages on every source tried; asked the user
  to download manually instead of trying to script around the bot walls.
- User supplied `monsante-font.zip` directly. Unzipped, moved `Monsante-Regular.otf`
  plus its license note and the source zip into a new `fonts/` folder, self-hosted via
  `@font-face`, and set as the masthead font (Bodoni Moda kept as fallback).
- Answered: italic font used for book titles in the table (Cormorant Garamond,
  inherited body font + `font-style:italic` — no per-row override), asked once
  generally and once about a specific title.
- Protagonist lane labels expanded to full names (Hercule Poirot, Miss Marple, Mr
  Satterthwaite, Tommy and Tuppence, Parker Pyne unchanged) across `LANES` and all
  `DATA` rows. Region "Europe & the Orient" renamed to "The Continent and the Orient"
  across `REGIONS`, all `DATA` rows, and the abbreviated legend label.
- Masthead title size bumped 48px → 54px on a misread of "make the font bigger";
  corrected back to 48px once clarified the ask was about the sidebar filter chips,
  which were bumped 11px → 13px instead.
- Documentation file created.
- "How about Bauhaus?" → ITC Bauhaus/"Bauhaus 93" confirmed real but Windows-bundled
  under commercial licensing terms → **Jost** installed instead (named after Bauhaus
  typographer Joost Schmidt, no licensing ambiguity).
- Reported the hatch was invisible inside Jost/Monsante-style fonts → asked for
  **Notable, Gravitas One, or Abril Fatface** → both Gravitas One and Abril Fatface
  flagged as extreme-contrast fat-faces where hatch visibility would be patchy →
  **Notable** installed (banknote-engraving lettering, best hatch legibility found).
- Built **Christie Masthead Trials**, a live type-specimen-sheet artifact comparing
  every font tried (7 masthead passes) across all 4 hatch directions × 2 densities
  simultaneously — no more screenshot-per-combination iteration.
- User dropped 4 more font zips into the project folder (Chapleau, Deco Majesty,
  Decolmax, Marbold) — all freeware/personal-use. Organized into `fonts/` and added
  to the specimen sheet (11 fonts total).
- User asked to see **Abril Fatface** rendered despite its flagged contrast tradeoff;
  tried with radial hatch, then flat vertical hatch, then a tighter vertical spacing —
  all saved to `tests/` as reference screenshots.
- User asked "are you capturing screenshots for all the tests?" — confirmed yes but
  they'd been deleted after each check; started keeping them in a new `tests/` folder
  instead, with descriptive filenames.
- Specimen sheet's per-cell titles reported too small to actually judge hatch quality →
  widened the table (horizontal scroll, ~2× larger cells) and bumped every font's
  specimen size accordingly; republished.
- Built a second artifact, **Christie Masthead Comparator** — three independent live
  masthead previews (font + hatch-direction + density controls each), opening with
  three different starting combinations rather than three identical panels.
- Added a second dropdown per comparator panel for the **tagline font** (separate from
  the title font), to test Decolmax or Poiret One as tagline candidates in place of
  Josefin Sans; defaulted two of the three panels to show those combinations live on
  load.
- **Final decision applied to the live page:** masthead font set to **Abril Fatface**,
  hatch set to **radiating sunburst at mid density**, tagline kept in **Josefin Sans**.
- Legend simplified: "Shape · format" / "Colour · location" group titles shortened to
  plain **Format** / **Location** — the swatch shapes and colours already carry the
  distinction, so the extra words were redundant.
- **Reworked the jitter system into three selectable layouts** instead of one scatter
  algorithm for every lane: `computeJitter()` now takes a `layout` argument and returns
  `{y, x, size}` maps (previously just a y-offset map).
  - `"scatter"` (default, all lanes): the existing bisection-ladder spread, unchanged.
  - `"fishbone"` (Hercule Poirot lane only, via a `LANE_LAYOUT` lookup): ranked rungs
    alternate above/below the centreline and step outward in **both x and y together**,
    so the crowded 1933–38 run reads as a staircase/comb radiating from the spine
    rather than a scatter of dots.
  - `"cascade"` (Parker Pyne lane only): a single-direction fan, monotonically
    increasing x/y offset in publication order — the seven 1933 short stories now
    overlap top-to-bottom like a spread hand of cards instead of stacking on one point.
- **Table body text switched to Josefin Sans** (previously inherited the page's serif
  body font); book titles in the title column stay in italic Cormorant Garamond
  (bumped to 16.5px) since that was an earlier deliberate choice the user liked.
- **Added inline book-title labels on the timeline chart** for marks that don't share a
  cluster with anything else — dense runs (Poirot's 1933–38 cluster, Parker Pyne's 1933
  run) intentionally get no inline label, since real title text is far wider than the
  fishbone/cascade spacing between crowded marks; those still rely on the existing
  hover tooltip and the table below. A running `lastLabelEnd` guard also skips a label
  that would collide with the previous one even when its own mark isn't clustered (two
  solo books a few years apart).
- User asked about getting a **real, recognizable map** (not the current placeholder
  outlines) working in `christie-atlas-v2.html`'s triptych — see that file's `PANELS`
  object, where `london`/`europe` are literally a bare rectangle and `uk` is a
  hand-drawn blob path, none GIS-accurate. Recommended pulling real coastline data
  (e.g. a public-domain Natural Earth/world-atlas TopoJSON via a CDN, rendered with
  d3-geo) and reprojecting each entry's `rw` ("closest real place") as an actual
  lat/long point, rather than the current hand-guessed `cx`/`cy` percentages. Not yet
  implemented — flagged as its own follow-up rather than folded into this batch, since
  it needs real geodata sourcing and per-entry coordinate research (~70 places).
- **Corrected the fishbone/cascade jitter to be strictly vertical.** The first pass
  had also nudged marks a few px horizontally (off their correct year), with connector
  lines drawn on the angle — user caught this as a graphical-correctness problem:
  a mark must sit on its true year regardless of how it's decluttered. `computeJitter()`
  now returns a plain y-offset map (no x-offset at all) for all three layouts, and the
  connector lines are drawn strictly vertical (`x1===x2`).
- **Replaced "label every isolated mark" with a curated landmark set.** Inline chart
  labels had become either crowded or sat right on the lane's centreline overlapping
  each other. Now only ~9 titles ever get a label: first + last across the whole
  corpus, first + last for the Poirot and Marple lanes (computed from `DATA` by year,
  not hardcoded), plus a short hand-picked `HIT_TITLES` list of famous cases (Orient
  Express, Roger Ackroyd, And Then There Were None, Death on the Nile). Labels bin-pack
  across up to 3 vertical rows (offset above/below the mark, never moving the mark) so
  nearby landmarks don't collide — found and fixed a bug where the row-tracking array
  was one element short, silently blocking the third row.
- Tagline changed from "Murder Across Time and Space" to **"Murder, She Wrote"**.
- **Lanes now have dynamic height instead of a fixed 56px row.** User asked to "increase
  height to manage overlap if x dimension is not enough" — a dense cluster (Poirot's
  1932-38 run, 12 chained entries) was jittering marks ±60px or more vertically, which
  overflowed a fixed-height row into its neighbours. `laneHeight` is now computed per
  lane from that lane's own max jitter magnitude (`Math.max(rowH, maxAbs*2+40)`), and
  lanes stack via cumulative `laneTop` offsets rather than `idx*rowH`. Poirot's lane is
  now visibly taller than sparse lanes like Standalone; total chart height grows to fit.
- **Ported label placement from the SciFi Golden Age timeline** (a sibling project at
  `TheBookshelfOfCuriosities/scifi/script.js`, found after the user asked "did you check
  sci-fi golden age?") rather than continuing to hand-roll it. That project already
  solves the same problem with `computeLabelLayout()`: try placing a label right of its
  mark, then left, across a small set of close vertical tracks, picking whichever
  side/track combination doesn't collide with anything already placed there; drop the
  label rather than force an overlap. Ported as `computeLabelLayout()` +
  `approxTextWidth()`, adapted to this file's data shape. Landmark labels are now
  visibly clearer too: switched from italic Cormorant Garamond at low-contrast
  `--ivory-faint` to Josefin Sans semibold at full `--ivory`, with a `paint-order:stroke`
  halo (stroke colored `--panel`) so text stays legible over the busy dot field.
- First pass at the ported layout put all landmark labels in one shared strip above the
  entire chart, with long leader lines running down to each mark — user rejected this
  immediately ("no no no yuck the labels need to be with the dots... move them as far
  away as needed **and no further than that**"). Corrected to place each label as close
  to its own mark as the track search allows, per lane, matching how the SciFi Golden
  Age original actually works (it keeps labels near their marks too, not in a banner).
- **Found and fixed a real collision bug in the ported algorithm**: track offsets
  (`trackOffsets`) were being added on top of each mark's own jitter offset, which
  differs per mark — so two labels assigned to genuinely different tracks could still
  land at nearly the same absolute y if their marks' jitter happened to differ by about
  the same amount, defeating the collision math (which assumes same-track = same y).
  Fixed by anchoring track offsets to the lane's shared `baseY` instead of each mark's
  jittered position, and always drawing the leader line from that label position to the
  mark's true (jittered) position — the two may coincide, but usually don't.
- **Started converting the page into a 3-tab app**: Timeline (this content, unchanged),
  Atlas (placeholder — real map work not started yet), Short Stories (new). User chose
  to merge `christie-atlas-v2.html`'s map into this file rather than keep it separate,
  and to build the Short Stories tab before the map. Added `.tab-bar`/`.tab-btn` CSS
  (same pattern as the atlas file's existing tab UI) and a `SHORT_STORIES` array —
  intentionally a separate dataset from the timeline's `DATA`, so filling it in doesn't
  disturb the timeline's deliberate collection-level bundling.
- **Populated the Short Stories tab: 100 individual stories**, researched via a
  background agent (Wikipedia + agathachristie.com + the Christie Fandom wiki, cross-
  checked). Covers all of Poirot Investigates, The Listerdale Mystery, The Labours of
  Hercules, The Adventure of the Christmas Pudding, Double Sin and Other Stories,
  Poirot's Early Cases, Miss Marple's Final Cases, While the Light Lasts, plus the
  remaining stories in the two partially-broken-out collections (Mysterious Mr Quin,
  Parker Pyne Investigates). Also picked up **The Hound of Death and Other Stories**
  (1933, UK) — not one of the originally-requested collections, but 5 of its stories
  turned out to be the real first-collection source for reprints inside The Golden Ball,
  so they're included for genuine completeness. Where a story was reprinted across
  multiple collections (common — many US collections in the 1950s predate the "leftover"
  UK compilations of 1974/1979 by decades), only one row exists per story, with the
  earliest as `firstColl` and later ones listed in `otherColl`.
  - **Research flags worth knowing about, not just archiving:** "The Capture of
    Cerberus" (Labours of Hercules) is a full 1947 rewrite of a story the *Strand*
    rejected in 1939 — the original draft stayed unpublished until 2009, so 1947 is
    the correct year for the text actually in the book. "The Adventure of the
    Christmas Pudding" and "The Mystery of the Spanish Chest" are themselves expanded
    rewrites of two 1920s/30s originals ("Christmas Adventure," "The Mystery of the
    Baghdad Chest") — both versions are listed as separate rows since they're
    genuinely different lengths/texts, cross-referenced via `otherColl`. "Strange
    Jest" and "Tape-Measure Murder" (Miss Marple's Final Cases) have no confirmed
    earlier book appearance — flagged as possibly-incomplete rather than asserted
    complete. "The Strange Case of Sir Arthur Carmichael" — confirmed correct title
    (a source draft had briefly rendered it "Sir Andrew").

---

## Known considerations / watch-out-for

- **Live masthead font is Abril Fatface (Google Fonts, OFL)** — no licensing
  restriction on the shipping page. Monsante and the four extra fonts (Chapleau, Deco
  Majesty, Decolmax, Marbold) are **personal-use only** and are no longer used live,
  but their `@font-face`/files are still sitting in the page/`fonts/` folder (Monsante's
  `@font-face` is still declared but unused, kept "in case wanted elsewhere" per its own
  code comment). Don't ship this page anywhere commercial without checking that no
  personal-use-only font got re-enabled.
- **The hatch/sunburst alignment is hand-tuned, not derived.** The conic-gradient
  hatch origin (`at 50% 196px` on `.masthead-title`) was matched by calculation to the
  sunburst `::before`'s geometry (`top:-34px`, `230px` tall, centered at `50% 100%`
  of that box). If the masthead's font-size, line-height, or the sunburst box's own
  dimensions change again, these two will drift out of visual alignment and need
  re-matching — there's no live binding between them. This matters more now: Abril
  Fatface's fat-face contrast means the hatch is genuinely only clear in the thick
  stems, so a drifted/misaligned hatch would be more noticeable than it was on an
  even-weight face like Notable.
- **Year-range filtering is fully gone, not hidden.** If it needs to come back, it
  requires re-adding to `state`, `matches()`, and the sidebar markup — the old
  `#yearMin`/`#yearMax` inputs and their wiring were deleted outright.
- **`fonts/` folder** now holds 5 font families (Monsante, Chapleau, Deco Majesty,
  Decolmax, Marbold), each with its own font file(s), `-license.txt`, and `-source.zip`
  — keep each trio bundled together if this page is ever moved or shared. Only
  Chapleau ships as a real family (regular/bold/italic/bold-italic); the rest are
  single demo weights.
- **The two comparison artifacts are separate hosted pages, not part of this repo** —
  useful as a live record of what was tried and rejected, but they embed their own
  copies of the font files (as base64 data URIs) and won't reflect future changes to
  this page unless explicitly republished. Treat them as a snapshot of the font/hatch
  decision process, not a living reference.
- **Fishbone/cascade layouts are hardcoded per lane name** (`LANE_LAYOUT` maps
  `"Hercule Poirot"` → fishbone, `"Parker Pyne"` → cascade) rather than driven by
  cluster size — if another lane becomes similarly dense later, it needs adding to
  that lookup by hand; it won't pick up the pattern automatically.
- **Inline chart labels are limited to `LANDMARK_IDS`** (corpus/lane firsts+lasts plus
  the `HIT_TITLES` set) rather than anything density-based. Placement itself is now
  `computeLabelLayout()` (ported from the SciFi Golden Age timeline, see changelog) —
  label width is estimated via `approxTextWidth()` (`length*size*0.62`), not measured,
  so a `.dot-label` font-size change should be reflected in the `fontSize` option passed
  at each call site. Track offsets are anchored to each lane's `baseY`, not to the
  individual mark's jitter — that decoupling is what makes the collision math valid;
  don't reintroduce mark-relative offsets without re-checking that assumption.
- **Not every landmark is guaranteed a visible label** — `computeLabelLayout()` drops a
  label outright if no side/track combination fits near its mark, rather than forcing
  an overlap or pushing it further away. Its mark, tooltip, and table row are always
  unaffected; only the inline chart label can go missing under real crowding.
- **`christie-atlas-v2.html`'s triptych maps are still placeholder outlines**, not
  real coastlines — see the changelog entry above. Whenever that gets picked up, it's
  a separate, larger pass (geodata + per-entry lat/long), not a quick tweak.
- **Filesystem-access scope**: an unrelated but consequential episode mid-conversation
  — a font search briefly used unscoped `find` across entire drives rather than the
  session's declared working directories. Corrected, and a standing rule is now in
  place (tracked in this assistant's cross-session memory, not in this repo) against
  open-ended filesystem exploration outside explicitly-named paths.

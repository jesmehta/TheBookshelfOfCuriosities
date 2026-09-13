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
- **Built the Atlas tab for real**, replacing the placeholder. Ported the real-coastline
  triptych map (London / UK / Europe & the Orient) from `christie-atlas-v3.html`, a
  standalone atlas revision that was never carried into the maintained
  `christie-atlas-v2.html` — recovered from this repo's own git history (commit
  `9744cb0`, from the Christie-project history-reconstruction pass). Confirmed via a
  title diff that this file's `DATA` and Atlas v3's `DATA` are identical, 78/78 rows
  (Atlas v3 is `DATA`'s direct ancestor), so the real projected `cx`/`cy` coordinates
  were merged straight onto the existing `DATA` rows by title-match rather than
  standing up a second dataset — one array now backs both the Timeline chart and the
  Atlas map. Restyled the whole thing onto this file's own design tokens (Josefin
  Sans / Cormorant Garamond, `var(--gold-bright)` etc.) instead of keeping Atlas v3's
  separate Libre Baskerville/Syne palette, and made it theme-aware (Atlas v3 predates
  the light/dark toggle).
  - **London panel stays the symbolic river-sketch**, not a real street map — country
    coastline data doesn't get you street-level recognizability; that would need a
    different data source and is left as a follow-up, not attempted here.
  - **Filter state is independent of the Timeline tab's own filters** — same pattern
    the Short Stories tab already uses (its own `atlasState`, not the Timeline's
    `state`). Cross-tab filter syncing was considered and set aside: the tabs' filter
    axes don't line up 1:1 (Atlas needs Story type as its own axis; Timeline doesn't),
    so unifying them would be a real state-architecture change for limited payoff.
  - **Inline map labels reuse the Timeline chart's `LANDMARK_IDS`** rather than
    labeling every dot — the first pass (labeling every entry in the zoomed/focused
    panel, as Atlas v3 originally did) reproduced the exact same illegible-crowding
    problem already solved once for the chart itself, so the fix was to reuse that
    existing curation instead of re-solving it. No 2D collision-avoidance layout was
    built for the map (unlike the chart's `computeLabelLayout()`) — with only ~4
    landmarks per panel this hasn't needed one, but two labels can still sit close
    together in a dense corner; revisit if more landmarks are added later.
  - Added a second tooltip element (`#atlasTooltip` / `atlasTip()` / `atlasUntip()`),
    scoped to the Atlas tab — the Timeline tab's `#tooltip` lives inside `#tab-timeline`,
    which is `display:none` while another tab is active, so a `position:fixed` element
    inside it still doesn't render; sharing it wasn't an option.
- **The "real coastline" data ported from Atlas v3 above was not actually real** —
  user asked "why are the maps crap?" after looking at the shipped result, and they
  were right. Atlas v3's commit message claimed the shapes were "fetched and
  simplified from a GeoJSON source," but the actual path data was ~20-30 vertices of
  amorphous blob with no recognizable coastline features (no Cornwall peninsula, no
  Scotland taper on the UK; the Europe/Orient panel was ~10 disconnected polygon
  fragments scattered across empty space, closer to confetti than a map — exactly the
  "basic squiggles" rejected once already, earlier in this project's history). It was
  ported uncritically this session, checked only for "renders without JS errors and
  filters work," never for "does this look like Britain." That was the actual, literal
  original ask, and it went unverified.
  - **Fixed by fetching genuinely real boundary data** — `johan/world.geo.json`
    (public-domain, Natural Earth-derived per-country GeoJSON), via `curl` directly
    (not `WebFetch`, which summarizes/processes content through a model rather than
    returning raw bytes — wrong tool for coordinate data). Pulled GBR, IRL for the UK
    panel; FRA, ESP, PRT, ITA, SVN, HRV, BIH, MNE, ALB, GRC, TUR, CYP, SYR, LBN, ISR,
    JOR, IRQ, IRN, EGY, LBY, TUN, DZA, MAR, DEU, CHE, AUT for Europe & the Orient
    (Mallorca is hand-approximated — an 8-point traced outline — since the Balearics
    aren't in that source's Spain file, and "Problem at Pollensa Bay" plots directly
    on the island).
  - **Every location's `cx`/`cy` was recomputed from real lat/long**, not carried over
    from Atlas v3's fabricated projection. Assigned by hand from known geography (68
    locations across both panels) — real places (Petra, Baghdad, Shiraz, Abney Hall,
    etc.) get their actual coordinates; explicitly fictional/"Unconfirmed" settings
    (e.g. "Woodleigh Common", "Broadhinny") get a plausible representative point in
    the right general region rather than false precision, since the data itself
    already says the real-world location isn't confirmed. All entries pointing at
    Abney Hall, Cheshire (six of them — Christie's own reused architectural template)
    now correctly land on the exact same real point, which is accurate, not a bug.
  - **Projection**: equirectangular with a `cos(lat0)` correction (same technique
    Atlas v3 claimed to use), `lat0`/`lon0` taken from each panel's own coastline
    bounding-box center, scaled so viewBox width lands at 100 units — chosen to match
    the existing dot-radius/label-font-size constants (tuned for a ~100-wide viewBox)
    without having to retune them. Panel extents are the *full* real bounding box of
    every fetched country (not cropped to just where data points sit), so islands and
    silhouette features stay intact — a data point sitting in a corner doesn't need to
    imply cropping the rest of the landmass away.
  - Verified visually before touching the live file: built a standalone preview page
    (coastlines + dots, no app chrome) and looked at a screenshot before merging
    anything in — the failure mode this entry exists to fix was exactly "ported
    without looking," so this pass didn't repeat it.
  - `christie-atlas-v3.html` (the git-history-recovered file, still sitting in
    `projects/christie/` as a superseded artifact per the earlier changelog entry)
    still has the fabricated geometry — it was not corrected, since the file itself
    isn't live. Don't mistake it for a source of real coordinates if referenced later.
- **Refined the map further**: smoothed coastlines, added Isle of Wight, and built a
  real London panel — user asked "can the maps be better refined? esp the UK? do
  London as well?" after the previous real-coastline pass.
  - **Smoothing**: the UK/Europe coastlines were real but visibly polygonal (straight
    line segments between vertices, since that's what the source GeoJSON is). Added a
    Catmull-Rom-to-cubic-Bezier conversion (`smoothPath()`, tension 1/6 — the standard
    factor) applied to every ring after projection, so the same real vertices now draw
    as a smooth curve instead of a faceted outline. This is display smoothing only —
    it doesn't add or move data, just interpolates a curve through the existing real
    points.
  - **Isle of Wight added to the UK panel** — hand-traced (8 points, from memory of its
    real rough shape/extent), the same way Mallorca was added to the Europe panel,
    since `johan/world.geo.json`'s GBR file doesn't include it either.
  - **Built a real London panel**, replacing the fake sine-wave river. Sourced the
    Thames' actual course from Natural Earth's `ne_10m_rivers_lake_centerlines`
    dataset (found by fetching it directly and searching for a feature named
    "Thames" — the smaller `ne_10m_rivers_europe` regional file doesn't include it,
    the global one does), filtered to the ~44-point stretch running through Greater
    London, and smoothed the same way as the coastlines. All 14 London-panel
    locations got real lat/long (Mayfair, Westminster, Bloomsbury, Chelsea, Croydon
    Airport, etc.) projected the same way as UK/Europe, replacing the old hand-guessed
    0–100 square placement. No landmass shape is drawn for London (unlike UK/Europe) —
    just the river on the panel's own dark background, matching the original
    symbolic version's convention of "river only." Updated the on-page hint text,
    which still called London "a symbolic river-sketch" — that's no longer accurate;
    it's real data now, just without a street grid.
  - At this generalization level the Thames' famous tight loop around the Isle of
    Dogs reads as a gentler S-curve rather than the sharp meander a Londoner would
    recognize up close — that's Natural Earth's own simplification at this scale,
    not something to "fix" by hand-editing points to look more dramatic; the real
    data is more trustworthy than a hand-tuned approximation, even if slightly less
    dramatic-looking.
- **Corrected course on the above pass** — user came back with "I did not need a
  curvier smoother map of the UK, I needed it to be better resolution. Also, the
  London map is still a squiggle." Right on both counts: the Catmull-Rom smoothing
  was cosmetic, not resolution, and Natural Earth's rivers-only Thames without any
  surrounding landmass never was going to read as "a map of London" no matter how
  precisely it was drawn. Also directly answered "do you need better sources? …
  do you need me to give you a plotted map?" — no: real vector boundary data (paths
  with actual coordinates) is strictly more useful here than a supplied image or
  SVG basemap would be, since placing points accurately needs real projectable
  coordinates, not a picture to eyeball against.
  - **Removed all curve smoothing** — every ring/line is straight-line SVG path
    segments again (`M...L...L...Z`), no `smoothPath()`/Catmull-Rom step. What
    reads as "smooth" now comes entirely from having enough real vertices close
    together, not from curve-fitting.
  - **UK/Ireland rebuilt from Natural Earth's 10m admin-0 countries** (`ne_10m_
    admin_0_countries.geojson`, fetched in full — 13MB, all countries — then
    filtered to GBR/IRL), not the `johan/world.geo.json` mirror used previously.
    Raw detail: 7113 points/57 rings for the UK, 2394 points/7 rings for Ireland —
    every real island (Hebrides, Orkney, Shetland, Isle of Wight, Anglesey) is its
    own ring already, so the hand-traced Isle of Wight from the previous pass is
    gone, replaced by the real thing. Simplified with `@turf/turf`'s `simplify`
    (true Douglas-Peucker, tolerance 0.004° ≈ 400m) rather than left at full
    resolution — mainland Britain still carries ~2000 points after simplifying,
    versus the ~56 points the whole UK had before this pass. `npm install
    @turf/turf` worked fine in the scratchpad for this — first time this
    project's needed a real npm dependency rather than hand-rolled geometry code.
  - **Europe & the Orient rebuilt the same way**, from the same `ne_10m_admin_0_
    countries.geojson` file (all 26 countries were already in it — no separate
    fetch needed), same 0.01° tolerance. Spain's high-res polygon includes Mallorca
    for real this time (ring index 15, 154 points) — the hand-traced 8-point
    approximation from the previous pass is gone. A bounding-box filter
    (`filterByBbox()`) drops each country's far-flung territories (Canary Islands,
    Spain's African exclaves, etc.) by sub-polygon centroid, so they don't
    silently balloon the panel's extent.
  - **London rebuilt as a real map, not a river-only sketch**: dissolved all 33
    real London borough polygons (`radoi90/housequest-data`'s `london_boroughs.
    geojson`) into one outer Greater London boundary via `turf.union`, simplified
    to 283 points (tolerance 0.0015°) — this is now the panel's landmass, the
    same visual role UK/Europe's coastlines play, replacing "no landmass, just a
    line."
  - **Thames sourced from OpenStreetMap** via the Overpass API (`way[waterway=
    river][name="River Thames"]` in a Greater London bounding box) instead of
    Natural Earth's continental-scale rivers layer, which had generalized away
    the Isle of Dogs loop entirely. OSM returned 145 separate way segments
    (3601 points total, since a long river is split into many edited-separately
    segments) that had to be stitched into one ordered line by matching endpoints
    within ~50m (`stitch_thames.js`) — the main chain came out to 2594 points
    spanning Richmond to past Dartford; discarded ~30 smaller disconnected
    fragments (side channels, distributary stubs). Simplified to 228 points
    (tolerance 0.0002° — much finer than the coastlines, since this river's
    real shape, not just its general course, was the point). The Isle of Dogs
    loop (and what looks like the Greenwich peninsula's own loop) are both
    genuinely visible now, confirmed by rendering a zoomed-in crop before
    merging into the live file — the "generalized into an S-curve" limitation
    noted in the previous entry is resolved by using the right-resolution
    source, not by hand-editing points.
  - The first overpass-api.de request timed out (504, server load) — retried
    against the `overpass.kumi.systems` mirror, which succeeded. Public Overpass
    instances are shared infrastructure and can be slow/unavailable; a mirror
    retry is the right first move, not assuming the query itself is wrong.
  - All 68 UK/Europe + 14 London location points were re-projected under the new
    bboxes/scales (even where the underlying lat/long didn't change, the pixel
    position did, since panel extents shifted with the new source geometry).
- **Naming, chrome, framing, and a real clutter fix**, from four follow-up requests
  in one message: rename the Europe panel, drop the watermarks, trim Britain's
  frame, and explain the London crowding.
  - **Renamed "Europe & the Orient" → "The Continent and The Orient"** — the Atlas
    panel's own label, plus every other place the name appears (the Timeline tab's
    `region` field/filter chip/table column, the `REGIONS` array, the map hint text)
    for consistency, so the two tabs don't show two different capitalizations of
    the same region.
  - **Removed the large decorative watermark text** ("britain" / "the city" /
    "europe & the orient" looming behind each panel) entirely — both the CSS
    (`.map-watermark`) and the JS that rendered it (`buildMapPanel()`'s `wm` div).
    The existing small corner label (top-left, e.g. "UK", "LONDON") was already
    what was asked for ("at best a label at the top or bottom right") and needed
    no repositioning, just the watermark stripped out from around it.
  - **Trimmed Orkney and Shetland off the UK panel** — both sit entirely north of
    mainland Scotland's own northernmost point (~58.68°N; verified against the
    Natural Earth data directly rather than guessed) and have zero data points on
    them. Added a bounding-box cutoff at 58.75°N to `filterByBbox()`'s UK call —
    high enough to keep the Hebrides (which sit within mainland's own latitude
    range) but drop Orkney/Shetland's 17 sub-polygons. Panel height dropped from
    157 to 123 units at the same 100-unit width, i.e. Britain and Ireland now fill
    visibly more of the frame with the same zoom.
  - **Answered "why are all the London cases crowded in one place?"** — because
    it's true: 12 of the 14 London-set books/stories really do sit within about a
    3km radius (Mayfair, Westminster, Bloomsbury, Chelsea, the West End — Christie's
    own fashionable interwar London), with only Croydon Airport genuinely far out.
    Two entries ("Third Girl" and "Elephants Can Remember", both tagged Chelsea)
    land on the exact same coordinate. That's not a projection bug — but it does
    mean several real dots were sitting exactly on top of each other,
    unclickable as separate points, so it was worth fixing anyway.
  - **Added `declutterPoints()`** — a small anchored force-relaxation pass (50
    iterations, pairwise repulsion under a minimum distance, each point's total
    drift from its true position clamped to a max radius) run once per panel at
    render time. It only nudges points that are genuinely colliding; isolated
    points don't move. This only affects where a dot is *drawn* — `DATA`'s
    stored `cx`/`cy` (and everything reading real position: the table, the
    tooltip, the "closest real place" column) is untouched. Same fix quietly
    helps the UK panel's Abney Hall cluster (six coincident points) and the
    Continent/Orient panel's exact-duplicate pairs (Petra ×2, Luxor ×2) too,
    not just London — the same underlying pattern (a handful of true locations
    reused across the corpus) shows up on all three panels.
- **London zoom crop + orientation landmarks on all three panels**, from a
  follow-up asking whether London should zoom in on its cluster, and whether all
  three maps could use "standard references" (cities for UK/Europe, streets/
  districts for London) to help a reader unfamiliar with the geography place the
  dots.
  - **Recovered each panel's exact lon/lat→SVG projection constants** by
    re-running the same build scripts (`build_maps3.js` for UK/Europe,
    `build_london.js` for London) with the projector's internals (`lon0`,
    `lat0`, `cosLat0`, `minX`/`minY`, `scale`) exposed instead of discarded, and
    checked the result against a known baked point in the live file (id 0's
    Abney Hall coordinate, id 6's Lord Edgware Dies coordinate) before trusting
    it. This is what makes it possible to add new reference points that land in
    exactly the same coordinate space as the existing coastlines/dots, without
    re-deriving or re-merging any panel geometry.
  - **Added `REFERENCE_POINTS`**: 6 real UK cities (London, Birmingham,
    Manchester, Edinburgh, Bristol, Dublin), 6 Continent/Orient cities (Paris,
    Rome, Athens, Istanbul, Cairo, Baghdad), and 7 London districts/landmarks
    (Hyde Park, Piccadilly Circus, Trafalgar Sq., Bloomsbury, Chelsea,
    Westminster, The City) — all real lat/long, projected through the recovered
    constants. Drawn as a small neutral "+" cross with a faint uppercase label,
    focused-panel view only (same as the curated book-landmark labels), so
    thumbnails stay clean.
  - **London's focused view now zooms to a `bigViewBox` crop** instead of
    reusing the full Greater-London viewBox: 12 of London's 14 books cluster
    within about a 8×10-unit box (Mayfair/Bloomsbury/Westminster/Chelsea/
    Piccadilly), so the full-boundary view was mostly empty space at that
    scale. The crop's bounds were taken from the *post-`declutterPoints()`*
    positions, not the raw `cx`/`cy` — an earlier version sized the crop off
    the raw coordinates and it clipped two genuinely-clustered books whose
    jitter had pushed them a couple of units outward (verified by screenshot,
    caught before merging). Dot radius, label font-size, landmass/Thames
    stroke-width, and label offsets are all multiplied by `scaleF` (the crop's
    width ÷ the panel's native 100-unit width) so a zoomed-in mark reads at the
    same on-screen size as an unzoomed one — the thing that actually changes
    with the zoom is how much real detail/spacing is visible, not how big the
    dots are.
  - **Croydon Airport genuinely falls outside that crop** ("Death in the
    Clouds") — rather than silently clip it, it's listed in a small
    "Off this crop: …" note (same spirit as the elsewhere-strip below the
    triptych), still clickable through to its table row.
  - **The London thumbnail draws a dashed rectangle** (`.map-crop-hint`) at the
    same coordinates as the focused view's crop, so the unfocused triptych
    hints at what clicking through will zoom to, rather than the crop being a
    surprise. This is generic — any panel that gains a `bigViewBox` in future
    gets the same hint automatically.
  - **Known minor overlap**: the UK panel's Manchester reference label sits
    close enough to the Abney Hall/"Styles" book-landmark label that the two
    visually touch — Manchester and Abney Hall (Cheshire) are genuinely only
    ~50km apart in reality, so this is real-geography crowding rather than a
    placement bug, and wasn't worth moving either label off its true position
    to avoid.
- **Fixed the Timeline tab's own landmark labels sitting on the spine / on top
  of unrelated marks** — user reported labels overlapping other dots or the
  lane's horizontal line instead of sitting clearly above/below with a leader
  line. Two separate bugs, both in `computeLabelLayout()`/its one call site
  (the Timeline chart's landmark labels — the Atlas map's own labels don't use
  this function and weren't affected):
  - **`trackOffsets` defaulted to `[0]` first**, i.e. "on the lane's spine,
    same height as the densest jittered-dot band" was the *first* choice tried,
    not a last resort — and for any lane sitting at the row-height floor
    (`rowH=56`, `maxTrack` computes to 12px, short of the first 14px step), it
    was the *only* choice ever generated, so every landmark label in a
    lower-density lane rendered exactly on the spine, no leader line needed
    because there was no vertical gap to bridge. Fixed by building real
    above/below tracks first (falling back to `±maxTrack` when a lane's too
    short for a full 14px step) and pushing `0` onto the end of the list as a
    genuine last resort.
  - **`computeLabelLayout()` only checked a candidate track against other
    *labels*, never against the lane's actual dots** — so even a label placed
    on a real off-spine track could still land directly on top of an
    unrelated, unlabeled mark that happened to jitter to a nearby y at that
    x (visually: the mark's own opaque text-halo stroke eats a bite out of
    the dot behind it). Fixed by passing every dot in the lane (real jittered
    x/y, not just the labeled subset) into `computeLabelLayout()` as
    obstacles; a track is now only chosen if it's clear of other labels *and*
    clear of every dot within an 11px vertical band. Confirmed by screenshot
    before/after on the Poirot lane's 1933–38 cluster (the worst case) in both
    themes — no more label/dot collisions, three landmark labels now stack
    cleanly above the spine with visible leader lines down to their marks.

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
- **`christie-atlas-v2.html` and `christie-atlas-v3.html` are now both superseded**,
  not maintained. The Atlas tab inside `christie-timeline-v3.html` is the live map —
  see the changelog entry above. v2's triptych is still the old placeholder-outline
  geometry (never real coastlines); v3 (recovered from git history) is where the real
  coastlines actually came from, but that file itself isn't touched going forward.
- **All three Atlas panels use real geographic data, no curve smoothing, no
  hand-traced shapes** — every path is straight-line SVG segments through actual
  source coordinates. UK/Ireland and Europe & the Orient come from Natural Earth's
  `ne_10m_admin_0_countries.geojson` (10m resolution, filtered by ISO_A3 and
  simplified with `@turf/turf`'s `simplify`, not the earlier `johan/world.geo.json`
  mirror or any hand-added islands — Isle of Wight and Mallorca are both the real
  polygons now). London's landmass is 33 real boroughs (`radoi90/housequest-data`'s
  `london_boroughs.geojson`) dissolved into one boundary via `turf.union`; its
  river is OpenStreetMap's actual Thames way, pulled via the Overpass API and
  stitched from 145 separate segments into one line. See the changelog entries
  above for exact tolerances and country lists. **None of this is preserved as a
  repo file** — every fetch/simplify/project step was a scratchpad build script,
  run once and discarded. Reconstructing any of it means re-fetching the source
  (Natural Earth for coastlines, Overpass for the Thames, the boroughs GeoJSON for
  London's boundary), re-running `@turf/turf`'s `simplify` at a similar tolerance,
  and re-projecting with `x=(lon-lon0)*cos(lat0), y=(lat0-lat)` scaled to viewBox
  width 100 — not a manual tweak to the existing SVG path strings, and not
  re-adding a smoothing step (that was tried and explicitly rejected: "I did not
  need a curvier smoother map of the UK, I needed it to be better resolution").
- **Per-location coordinates for "Unconfirmed"/fictional settings are plausible
  placeholders, not researched positions** — e.g. "Woodleigh Common," "Broadhinny,"
  "Gipsy's Acre" get a reasonable representative point in roughly the right part of
  England, spread out so they don't all stack on one pixel, not a claim about where
  Christie actually meant. This matches what the `rw` field already says ("Unconfirmed")
  — the map isn't asserting more precision than the table already disclaims.
- **Filesystem-access scope**: an unrelated but consequential episode mid-conversation
  — a font search briefly used unscoped `find` across entire drives rather than the
  session's declared working directories. Corrected, and a standing rule is now in
  place (tracked in this assistant's cross-session memory, not in this repo) against
  open-ended filesystem exploration outside explicitly-named paths.
- **The UK panel's northern cutoff (58.75°N) is a hardcoded constant**, chosen by
  checking mainland Scotland's own real northernmost point in the Natural Earth
  data rather than guessed — if a future data point needs plotting in Orkney,
  Shetland, or further north, that cutoff has to be raised (and re-run through
  the same rebuild pipeline) or it'll silently have no landmass to sit on.
- **`declutterPoints()`'s `minDist`/`maxDrift` (2.6/5 units) are tuned by eye**
  against this specific data's clusters (London's dozen-strong center, Abney
  Hall's six coincident points), not derived from panel size or dot radius
  programmatically. If a panel's data changes substantially (many more entries,
  or entries much closer/further apart), these two numbers are the first thing
  to revisit — the function itself doesn't need to change.
- **London's `bigViewBox` crop is a hardcoded box** (`"38.58 28.84 13.45
  12.39"`), sized against the *current* London DATA (13 clustered books once
  Croydon Airport is excluded) plus the 7 reference landmarks — not derived
  live from whatever's currently plotted. If a future London entry lands well
  outside that box, it'll silently join the "Off this crop" note instead of
  being clipped, so it stays visible either way — but if several new entries
  land just outside the current crop, the box should be recomputed (bbox of
  the post-`declutterPoints()` positions, not raw `cx`/`cy` — see the
  changelog entry above for why) rather than nudged by eye.
- **`REFERENCE_POINTS`'s three lists are curated by hand**, not generated —
  adding/removing a book location doesn't touch them, and there's no
  mechanism that would catch a reference city silently becoming irrelevant
  (e.g. if every UK entry moved south, Edinburgh would stay plotted despite
  adding nothing). Revisit the lists directly if the underlying book data's
  geographic spread changes substantially.
- **The projector constants each panel was built with (`lon0`, `lat0`,
  `cosLat0`, `minX`/`minY`, `scale`) are not stored anywhere in the live
  file** — only their output (baked `cx`/`cy` and the SVG path strings) is.
  `REFERENCE_POINTS`' coordinates were produced by re-deriving those constants
  in a scratchpad script (re-running the same steps as `build_maps3.js`/
  `build_london.js`) and verifying against known baked points before trusting
  the result. Any future point that needs to land in one of these three
  panels' existing coordinate space (another reference landmark, say) should
  go through the same re-derive-and-verify step, not a hand-eyeballed guess.

# Isaac Asimov’s Future History  
## Foundation Galaxy + Asimov Bibliography Prototype

This repo contains an experimental webpage for an **Isaac Asimov page** within **The Bookshelf of Curiosities**.

The page is **Asimov-first**, but its landing “Boom Wow” feature is the **Foundation / Robot / Empire future-history galaxy map + synchronized in-universe timeline**.

The broader Asimov bibliography is a secondary but important layer: it helps show Asimov not only as a science-fiction writer, but as a writer of systems, explanations, histories, mysteries, essays, science books, and cultural guides.

---

# Core Intent

The page should communicate two related ideas.

First:

> Isaac Asimov built a fictional future-history so large that it moves from Earth, outward through robots, Spacer worlds, Empire, Trantor, Foundation, Gaia, and finally back toward Earth and the Moon.

Second:

> Asimov’s work was not limited to Foundation or science fiction. He mapped knowledge across popular science, chemistry, astronomy, mathematics, Bible studies, Shakespeare, history, mysteries, essays, autobiography, humor, and more.

The page should therefore begin as a **galaxy-sized story engine**, then zoom out to reveal Asimov as a writer who mapped knowledge itself.

---

# Page Hierarchy

The page is structured as a tabbed interface.

## Tab 1 — Galaxy Map + In-Universe Timeline

This is the landing tab and main visual feature.

It contains:

- Interpretive galaxy map
- World-first location model
- Book/location back-and-forth interaction
- Right sidebar:
  - Location panel above
  - Book panel below
- In-universe timeline below the galaxy map

## Tab 2 — Publication Date × In-Universe Date

An XY plot showing the tension between:

- when a work was published
- when it occurs in Asimov’s fictional future-history

This matters because the Robot, Empire, and Foundation books began as separate clusters and were later connected into a single future-history.

## Tab 3 — Bibliography

A broader Asimov bibliography visualization and sortable/filterable table.

This is secondary to the Foundation galaxy, but essential for the Asimov-wide page.

## Tab 4 — Short Stories / Essays / Data Notes

Supporting material, future expansion, source notes, and scope disclaimers.

---

# Design Decision: Asimov-First, Foundation-Hero

The page is not only a Foundation page.

However, Foundation is the visual and conceptual centrepiece.

The intended hierarchy is:

```text
Hero:
Foundation Galaxy + Synchronized In-Universe Timeline

Secondary:
Asimov Bibliography Across Domains

Tertiary:
Short stories, essay collections, source notes, expansion notes
```

The full bibliography should not overpower the landing experience.

---

# Design Decision: World-First Galaxy Map

The galaxy map locates **worlds**, not books.

This is important because:

- one book can involve multiple worlds
- one world can appear in multiple books
- some worlds recur across the future-history
- the story route is not the same thing as a set of one-book markers

Examples:

- Earth appears in Robot material, Empire backstory, and *Foundation and Earth*.
- Trantor appears across Empire and Foundation-related works.
- Terminus appears across many Foundation books.
- *The Currents of Space* involves Florina, Sark, and Trantor.
- Anacreon belongs near Terminus as a Periphery neighbour.

Selecting a book should highlight its related worlds.

Selecting a world should show all books associated with that world.

The core interaction loop should be:

```text
Book → related worlds → world’s books → another book → another world
```

This loop is one of the most important interaction principles in the project.

---

# Galaxy Map Logic

The galaxy map is an **interpretive narrative map**, not a literal astronomical star chart.

It should feel like a barred spiral galaxy / holographic future-history map, but the fictional locations are arranged to support narrative clarity.

## Key anchor locations

### Earth / Sol / Moon

- Origin and return point
- On a galactic arm / local spur, not at the galactic core
- Has a nearby cluster or sphere of Spacer worlds
- The Moon is important as the final hidden endpoint of the Foundation cycle

### Spacer Worlds

- Aurora, Solaria, Melpomenia, etc. should be near Earth/Sol
- They belong in or near the “Fifty Spacer Worlds” sphere
- New Earth / Alpha can be near Sol but should be visually distinct from the core Spacer cluster

### Trantor

- Near the galactic core
- Major anchor world
- Imperial centre
- Connected to Empire and Foundation material

### Terminus

- On the galactic periphery / outer rim
- Major anchor world
- Home of the First Foundation
- Anacreon and other Periphery worlds should sit near Terminus

### Gaia

- A distinct world/node
- Important late-cycle decision point
- Should not become a giant galaxy-wide “Galaxia” overlay in V1

### Comporellon

- On the return arc toward Earth

### Florina / Sark

- Empire-era worlds
- Placed along the broader narrative route

---

# Galaxy Map Route Logic

The route is narrative, not astronomical.

A rough conceptual route:

```text
Earth / Sol / Moon
→ Spacer Worlds
→ Empire-era worlds
→ Trantor
→ Terminus / Periphery
→ Gaia
→ Comporellon
→ Earth / Moon
```

The route should form a broad circular or looping path, because one of the central poetic ideas is that Asimov’s future-history begins at Earth and ultimately returns to Earth/Moon.

---

# Galaxy Map Interaction Decisions

- All worlds should be active by default.
- Legend items act as checkbox filters.
- The legend should sit directly on the map in a transparent or semi-transparent container.
- Avoid a blocked header strip above the map.
- Remove unnecessary helper text such as “all worlds are active.”
- Hover tooltips should show:
  - location name
  - category
  - associated books
- Clicking a world should:
  - select the world
  - show the location panel
  - select the first associated book by publication year in the book panel
- The location panel should show all associated books, and those book entries should be clickable.
- Clicking a book should:
  - update the book panel
  - highlight related worlds
  - preserve the location/book loop

---

# Book Card Decisions

The Book panel should stay focused and readable.

Include:

- Title
- Publication year
- In-universe date or range
- Series / cluster
- Author
- Previous / next relationships where useful
- Related worlds as clickable two-column cards

Do not foreground:

- Series Order
- Universe Order
- Canon level

Those can be moved to a later reading-list table or data notes.

Also avoid showing both “Core Series” and “Series Cluster.”  
Use one clear field such as `series`.

---

# In-Universe Timeline Decisions

The in-universe timeline is not a card list.  
It is a proper timeline.

It plots works from near-future Robot-era material through the far-future Foundation era.

## Timeline scale

A temporary toggle exists for:

```text
Segmented / discontinuity timeline
Unbroken timeline
```

This is useful because the fictional chronology covers a very long span and is difficult to show cleanly on a single linear scale.

## Timeline bands

The timeline should preserve series/era bands:

- Robot
- Spacer
- Empire
- Foundation
- Authorized continuation

Bands help organize the works, but must not cover markers or labels.

## Timeline marks

- Point-like works can be circles.
- Works spanning a duration should be rendered as proper rounded duration bands.
- If marks overlap, they may be slightly stacked or scattered vertically within the band.

## Timeline labels

Timeline labels should use a style similar to the earlier SciFi timeline:

- leader line from mark to text
- line angles up/down toward the label
- short horizontal tick beneath the start of the label
- tick should be only around 5–10px
- tick should sit a few pixels below the text, not exactly on the baseline
- avoid long underlines
- avoid crossing leader lines where possible
- avoid label overlaps
- use full names, not abbreviations such as `Fdn`

## Timeline axis

The axis needs to keep separate:

- year labels
- series/era labels
- discontinuity break marks

These should not overlap visually.

---

# Publication × In-Universe Time Plot

This plot is important because it reveals how publication chronology and fictional chronology diverge.

For example, Asimov’s early Empire novels and later Foundation prequels do not line up neatly when comparing publication date with in-universe date.

## Decisions

- Axes should remain swappable for now.
- Chart should fit comfortably in the viewport.
- Hover tooltip should show:
  - title
  - publication year
  - in-universe date/range
  - series
- Labels should use the same short leader/tick logic as the main timeline.
- Marks and labels should have generous click targets.

---

# Bibliography Page Intent

The bibliography section is not trying to become a definitive 500+ item Asimov database in V1.

Instead, it should be a curated but meaningful Asimov-wide view.

Include:

- major novels
- major short-story collections
- major essay collections
- major nonfiction anchor books
- Foundation / Robot / Empire novels
- Lucky Starr books
- Black Widowers books
- Azazel-related books
- major standalone fiction

Exclude or defer:

- every foreword
- every column
- every introduction
- minor anthology appearances
- exhaustive edited anthology credits

---

# Bibliography Timeline Design

The bibliography timeline uses a signed Y-axis.

```text
Fiction above the timeline / positive Y
Nonfiction below the timeline / negative Y
```

## Fiction Y-axis

For fiction, Y-axis category should be:

```text
Series / Genre
```

Examples:

- Foundation
- Robot
- Empire
- Lucky Starr
- Black Widowers
- Azazel
- Standalone SF
- Mystery
- Short Story Collection
- Fantasy / Other Fiction

## Nonfiction Y-axis

For nonfiction, Y-axis category should be:

```text
Domain
```

Examples:

- Popular Science
- Chemistry
- Physics
- Astronomy
- Mathematics
- Biology
- History
- Bible
- Shakespeare / Literature
- Essays
- Autobiography
- Humor
- Reference

## Bibliography marks

- Fiction = circles above the timeline
- Nonfiction = 45-degree rotated squares / diamonds below the timeline
- Color by series/domain
- Labels for all marks
- Thin lines connect books in a series or meaningful cluster

Examples of clusters to connect:

- Foundation
- Robot
- Empire
- Lucky Starr
- Black Widowers
- Azazel

---

# Bibliography Table

The bibliography table should be sortable and filterable.

Recommended columns:

```text
title
year
type
series / cluster
domain
fiction / nonfiction
notes
```

Recommended filters:

```text
search
domain
type
series / cluster
fiction / nonfiction
```

Rows should be clickable and sync with the bibliography timeline selection where appropriate.

---

# Data Sources

Primary source recommendations:

- Asimov Online
- Asimov Online bibliography/title lists
- Isaac Asimov bibliography pages
- Foundation universe references
- Robot / Empire / Foundation reading order references

Useful online source:

```text
http://www.asimovonline.com/
```

Wikipedia can be used as a secondary source for quick cross-checking, especially for:

- publication years
- broad bibliography categories
- Foundation universe chronology
- title lists
- series membership

However, the page should keep clear data notes because Asimov’s bibliography is large, messy, and full of reprints, collections, alternate editions, and editorial credits.

---

# Current Technical Direction

The page is a static frontend.

Current expected files:

```text
index.html
style.css
app.js
data.js
Readme_1_overview.md
```

Data is currently embedded in `data.js`.

No backend is required for V1.

D3 is allowed and preferred.

The page is intended to run online, so CDN use is acceptable.

---

# Suggested Code Structure

Recommended rendering functions:

```js
renderGalaxy()
renderUniverseTimeline()
renderXYPlot()
renderBibliographyTimeline()
renderBibliographyTable()
selectBook(bookId)
selectWorld(worldId)
updatePanels()
applyFilters()
```

Recommended central state:

```js
state = {
  selectedBookId,
  selectedWorldId,
  activeWorldTypes,
  xyAxisMode,
  timelineScaleMode,
  bibliographyFilters
}
```

Relationships between books and worlds should be derived from data rather than hardcoded inside render functions.

---

# Version History

## V1 — Data Pack

Initial V1 data pack created.

Included TSV and JSON versions of:

```text
foundation_universe_works
foundation_locations
asimov_works_v1_curated
short_stories_v1_curated
essay_collections_v1
README
```

Main decisions:

- Foundation hero dataset first
- Robot → Spacer → Empire → Foundation → Gaia/Galaxia → Earth/Moon arc
- Asimov’s seven Foundation books included
- Benford / Bear / Brin Second Foundation trilogy included
- Initial curated Asimov-wide bibliography
- Initial short-story and essay collection datasets

---

## V2 — First Rendered Prototype

First static webpage prototype.

Included:

```text
index.html
style.css
app.js
data.js
Readme_1_overview.md
```

Features:

- Foundation Galaxy + Timeline landing feature
- timeline selections synced with map nodes and book cards
- Play route button
- secondary Asimov bibliography section
- short stories and essay placeholders

Limitations:

- galaxy was too symbolic
- timeline was more like ordered cards than a proper time axis
- map was book-first rather than world-first

---

## V3 — D3 + Tabs

Major structural improvement.

Changes:

- switched visualizations to D3 via CDN
- compact title: “Isaac Asimov’s History of the Future”
- added proper tabs:
  - Galaxy + Timeline
  - Publication × In-universe Time
  - Asimov Bibliography
  - Short Stories + Essays / Data Notes
- added hover tooltips to:
  - galaxy nodes
  - timeline book points
  - XY plot points
  - bibliography timeline points
- simplified book metadata display
- added Asimov Online to source notes

---

## V4 — World-First Galaxy Model

Structural correction.

Changes:

- galaxy map became world-first, not book-first
- selecting a book highlighted all connected worlds
- world tooltip listed all connected books
- route followed in-universe reading/event sequence through focal worlds
- removed Galaxia overlay
- added zoom/pan to galaxy map
- added legend toggles
- placed Aurora, Solaria, Melpomenia, Baleyworld/New Earth, Alpha/New Earth into Sol/local cluster logic
- split *The Currents of Space* across Florina, Sark, and Trantor
- timeline labels banded by series height

---

## V5 — Interaction Loop Refinement

Changes:

- moved timeline above galaxy map temporarily
- made timeline more compact
- improved timeline label placement
- removed abbreviations like `Fdn`
- added Swap Axes to XY plot
- all worlds active by default
- legend chips became checkbox filters
- clicking a world selected the earliest associated book by publication year
- selected-world panel listed all connected books
- connected books became clickable
- improved book ↔ location loop

---

## V6 — Layout Correction

Changes:

- galaxy map moved back above timeline
- timeline moved below galaxy section again
- right sidebar stacked:
  - Location panel on top
  - Book panel below
- fixed timeline clipping:
  - Robot and Spacer labels no longer went off-panel
  - Empire markers/labels no longer hidden under band/background layer
- series bands preserved

---

## V7 — Cleaner Galaxy + Timeline Leaders

Changes:

- kept book ↔ location loop intact
- legend checkboxes made into a vertical stack
- worlds no longer faded just because a book was selected
- removed helper text under Foundation galaxy
- removed helper text under in-universe timeline
- timeline labels given angled leader lines and short underline/tick styling
- markers and labels kept visible above band layers

---

## V8 — Transparent Map Legend + Timeline Scale Toggle

Changes:

- galaxy legend moved onto the map as a transparent overlay
- timeline duration marks introduced
- added temporary toggle:
  - discontinuity / segmented timeline
  - complete unbroken timeline
- timeline leaders improved:
  - angled leader from mark to label
  - horizontal underline/tick beneath label
- improved label separation and edge avoidance
- overlapping timeline marks slightly stacked
- discontinuity markers reworked as clearer break marks

---

## V9 — Duration Bands + Compact XY Chart

Changes:

- XY chart vertical height reduced
- XY chart given label leader lines and short ticks
- XY label overlap handling improved
- in-universe timeline duration-based books now rendered as rounded bands instead of two dots joined by a line
- timeline label placement scoring improved to reduce overlaps and leader-line crossings
- timeline scale toggle retained

---

## V10 — Galaxy UI Polish + Bibliography Start

Changes:

- Foundation galaxy title moved onto the map as transparent overlay
- legend moved onto the map near the top margin
- removed blocked header strip above galaxy
- removed Series Order and Universe Order from book card
- related worlds displayed as two-column clickable cards
- short leader-line tick adjusted to about 8px
- bibliography page started:
  - fiction/nonfiction visual distinction
  - color by domain / series
  - connecting lines for clusters
  - sortable/filterable bibliography table

---

## V11 — Expanded Bibliography + Signed Y-Axis

Changes:

- expanded curated bibliography dataset to around 97 entries
- included:
  - major Asimov novels
  - Foundation / Robot / Empire novels
  - Lucky Starr juvenile novels
  - major standalone SF novels
  - major mystery novels
  - major short-story collections
  - Black Widowers collections
  - Azazel / fantasy collections
  - nonfiction anchor works
- bibliography timeline reworked:
  - fiction above timeline
  - nonfiction below timeline
  - fiction Y-axis = series / genre
  - nonfiction Y-axis = domain
  - fiction marks = circles
  - nonfiction marks = 45° rotated squares / diamonds
  - marks colored by series/domain
  - labels shown for all marks
  - recurring series connected by thin lines

---

## V12 — Defensive Interaction Patch + Timeline Axis Cleanup

Changes:

- fixed runtime bug in selected-world link drawing
- added larger invisible click targets for:
  - galaxy worlds
  - timeline marks
  - XY plot marks
- bibliography marks made clickable
- bibliography labels made clickable
- bibliography table rows made clickable / keyboard-selectable
- in-universe timeline year labels cleaned up
- year numbers and era labels separated
- Robot / Spacer / Empire / Foundation segment labels no longer sit on top of year labels
- tick density reduced in segmented timeline to prevent clashes

---

## Post-V12 Local Update - Bibliography Row Spacing

Changes:

- bibliography timeline height increased from 620 to 820 SVG units
- fiction series rows and nonfiction domain rows spread farther apart
- central publication-year axis gap increased before the nearest bibliography rows
- `Readme_1_overview.md`, `Readme_3_working_context.md`, and `Readme_4_todo_decisions.md` now identify the context-delivery files and local update status

Reason:

- the bibliography timeline was visually dense, and the series/domain rows needed more Y spacing for easier scanning

---

# Current Known Issues / Next Priorities

## Interaction

- Recheck click reliability across all charts.
- Ensure SVG overlays do not block pointer events.
- Make labels and marks both clickable.
- Keep invisible hit targets large.

## Galaxy

- Improve galaxy background.
- Keep map world-first.
- Remove real-world Milky Way arm labels.
- Keep legend transparent and on-map.
- Improve relative placement after hand-drawn sketch is available.

## Timeline

- Further reduce label overlaps.
- Further reduce leader-line crossings.
- Recheck discontinuity indicators.
- Keep duration bands clean and readable.
- Keep year labels and era labels separate.

## XY Plot

- Compact height.
- Improve label placement.
- Keep axes swappable.
- Match leader-line style with main timeline.

## Bibliography

- Continue expanding curated data.
- Improve signed Y-axis layout.
- Improve label collision handling.
- Keep fiction/nonfiction visual distinction.
- Maintain sortable/filterable table.

---

# Future Data Expansion

Potential V2 or later expansions:

- full short-story database
- first publication source for each short story
- collection appearances for each short story
- individual essay database
- source/column origin for essays
- edited anthology tracking
- reading-order table
- canon/authorized-continuation notes
- source citations per data row
- manual TSV editing pipeline

---

# Working Principle

This page should not merely say:

> Here is everything Asimov wrote.

It should say:

> Here is how Asimov built connected systems — fictional, scientific, historical, and explanatory — across a lifetime of writing.

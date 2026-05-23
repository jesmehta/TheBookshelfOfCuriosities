# Science Fiction Reading Timeline

Public-facing static webpage for exploring science-fiction authors, works, magazines, editors, media adaptations, and publication history across time.

The project is intended to remain simple to preview and deploy through GitHub Pages.

## Project Scope

Active project folder:

`TheBookshelfOfCuriosities`

Current static site files:

- `index.html`
- `style.css`
- `script.js`
- `data.js`
- `README.md`
- `ToDo.md`

For now, all editing work should stay inside this folder. Avoid changes outside this project unless explicitly requested and confirmed.

## Current Baseline

Current handover baseline: **v14**.

The page is a single-page static site with five main tabs:

- Author timeline
- Global timeline
- Reading list
- Publications & editors
- About

The page should open with **Author timeline** active by default.

## Preview

Recommended local preview:

- Open the folder in VSCode.
- Use Live Server on `index.html`.

The current dataset is embedded in `data.js`, so the page can also be opened directly in a browser. Live Server is still preferred because it better resembles GitHub Pages behavior and avoids browser-specific local-file quirks.

## Architecture

The site deliberately avoids a build system and framework dependencies.

- `index.html` defines the public page structure and tab containers.
- `style.css` defines layout, themes, timeline styling, table styling, and responsive behavior.
- `script.js` renders the interactive timelines, tables, filters, tabs, themes, and fallback behavior.
- `data.js` contains `EMBEDDED_DATA`.
- `README.md` records project state, changelog entries, and design decisions.
- `ToDo.md` tracks planned work, status changes, completed tasks, and parked ideas.

D3 is currently loaded from a CDN in `index.html`. The Global Timeline has a native SVG fallback if D3 is unavailable.

## Data Model

`data.js` exposes `EMBEDDED_DATA` with these main arrays:

- `authors`
- `works`
- `publications`
- `magazines`
- `editors`

`publications` is the canonical publishing-entity array. `magazines` is currently kept as a backward-compatible duplicate for older code paths and should not be treated as the long-term primary structure.

Reference JSON extracts may exist in the `data/` folder. They are for inspection/reference only; the webpage currently reads from `data.js`.

Publication records may include:

- `publication_type`
- `title_history`
- `publication_id` references from editor records

Del Rey Books is represented as a book-publishing imprint, not as a magazine.

### Work Type Rules

The `type_path` field describes publication or object format, not genre.

Examples:

- `Novel`
- `Novel/Series`
- `Novel/Series/Trilogy`
- `Novel/Fix-up`
- `Collection`
- `Collection/Anthology`
- `Short story`
- `Novella`
- `Novelette`
- `Nonfiction`
- `Nonfiction/Popular science`
- `Media/Film`
- `Media/Radio`

Important rules:

- A magazine is not a work type just because a story first appeared in a magazine.
- Magazine history belongs in `magazines` and editor history belongs in `editors`.
- Do not use `Novel/Film`; use separate `Novel` and `Media/Film` records if both need to be represented.

### List Source Values

Current public UI values:

- `Reading list`
- `Additional Favourites`

Older labels should not appear in the UI:

- `Original reading list`
- `User addition`

## Public Content Rules

The public webpage should not mention:

- workshops
- slides
- screenshots
- OCR
- source file names
- day-based drafting references

The page should read as a polished public project, not as an internal notes page.

## Current Behavior

### Author Timeline

- Main overview and default tab.
- Authors appear vertically.
- Time runs horizontally.
- Author lifelines are shown when birth and death data exist.
- Works appear as colored dots along each author's row.
- Some major works have inline labels.
- Clicking an author opens an inline Author Detail panel below the main timeline.
- Magazine context may be shown as an optional overlay if enabled by the UI.

Author sorting rule:

- Known authors are sorted by birth year.
- Authors with missing birth or death details are inserted into that order by comparing their first included publication year against the first-publication years of known authors.
- This keeps the structure primarily based on author generation rather than pure publication date.

Birth and death point shapes are not needed on the Author Timeline. Those belong in the Global Timeline.

### Author Detail

Current improvement targets:

- Use decade ticks rather than 25-year markings.
- Add an author lifeline row.
- Reduce label overlap.
- Use one `Standalone / other works` row.
- Use separate rows only for meaningful series or subseries.

Useful separate series rows include examples such as:

- Foundation
- Robot / Spacer
- Empire
- Merged Foundation universe
- Space Odyssey
- Rama
- Tarzan
- Barsoom
- Pellucidar

Work forms should usually be distinguished by color/type, not by creating extra rows for every type.

### Global Timeline

The Global Timeline is a hybrid view:

- A horizontal SVG timeline for point events and long-running magazine/editor bands.
- A vertical Event Stream below it for the full chronological list.

The Event Stream should expand down the page. Avoid scroll-inside-scroll behavior.

Global Timeline filters should affect both the horizontal timeline and the Event Stream:

- Works / books
- Films / radio / media
- Author births
- Author deaths
- Publication lifetimes
- Editor tenures
- Editor start / exit events

Visual rules:

- Work events use dots.
- Birth events use triangles.
- Death events use diamonds.
- Media events use a distinct play-like or media symbol.
- Editor start and exit events use distinct symbols.
- Publication lifetimes use thicker horizontal bands.
- Editor tenures use thinner horizontal bands.
- Editor tenures should align with magazine timelines where possible.

### Theme System

Current theme options:

- Archive
- Pulp
- Space chart
- Archive + accents
- 1950s - Atomic Pulp
- 1970s - New Wave Cosmos
- 1980s - Neon Orbit

Preferred likely direction:

- Archive + subtle pulp accents.
- Readable, literary, and slightly textured.
- Visually rich but not distracting.
- Avoid overly kitschy or overly dark treatment unless the design direction is intentionally changed.

Background texture should remain CSS-only, subtle, and low contrast.

## Design Decisions

### Static GitHub Pages Architecture

The site remains plain HTML, CSS, and vanilla JavaScript so it can be previewed easily through VSCode Live Server and deployed through GitHub Pages without a build step.

### Embedded Data

`data.js` remains the active data source because it makes the page easy to open, preview, and deploy. TSV files can be useful for editing or future data workflows, but they are not the runtime source.

### Overview Before Detail

The Author Timeline is the default view because it gives readers an immediate map of the field by author generation. Author Detail panels then provide deeper local context without forcing the user into a separate page.

### Generation-Based Author Order

Author ordering is primarily based on author birth year, with missing-date authors inserted by first included publication year. This preserves historical generation structure while avoiding dumping unknown-date authors at the end.

### Global Timeline as Hybrid Visualization

The horizontal timeline gives an immediate historical shape, while the Event Stream gives a readable chronological list. The two views should stay synchronized through shared filters.

### Low-Distraction Visual Richness

Themes should add atmosphere without overpowering text or labels. Timeline readability and label clarity are more important than decorative density.

### Fallback Rendering

D3 is useful for timeline rendering, but a native SVG fallback is kept so the Global Timeline does not go blank when the CDN fails, is blocked, or has caching issues.

## Changelog

### v62 Fix About text encoding artifacts

- Corrected mojibake/encoding artifacts in About and control text (quotes, apostrophes, ellipsis, and em dashes).
- Fixed broken sequences such as `â€œ â€ â€™ â€¦ â€”` across the page content.

Design decision:

- Keep public-facing narrative text typographically clean and readable, since encoding noise breaks credibility and scanability in long-form sections.

### v61 About section in-page navigation

- Added a lightweight navigation strip at the top of the About section.
- Added jump links to Part 1, Part 2, and Part 3 headings.
- Added minor About-nav styling for spacing and readability.

Design decision:

- The About section has grown into long-form content, so readers need quick in-page movement across major parts without changing tabs or adding new pages.

### v60 About section case-study rewrite

- Replaced the About panel with an expanded two-part narrative.
- Part 1 now presents a public-facing making-of and dataviz case-study story.
- Part 2 now summarizes development history as phase-based notes instead of a raw version log.

Design decision:

- The About section should communicate human-led decision-making and project intent in a format suitable for teaching, PR, and case-study reuse, while keeping technical implementation details in README and ToDo.

### v59 HR-inspired Space Chart star colors

- Added more fixed irregular star points to the Space Chart background.
- Introduced subtle star color variation inspired by the Hertzsprung-Russell diagram: mostly white and blue-white stars, with a smaller number of pale yellow, amber, and soft red points.

Design decision:

- The color variation should suggest astronomical star temperatures without becoming decorative noise. Blue-white and white remain dominant so the background still reads as a subdued chart texture.

### v58 Denser Space Chart starfield

- Added more fixed irregular star points to the Space Chart background.

Design decision:

- A denser starfield makes the texture read more clearly while preserving the non-repeating scatter introduced in v56.

### v57 Strengthen Space Chart starfield

- Increased the visibility of the fixed irregular Space Chart starfield.
- Added more scattered points with slightly stronger opacity and radius variation.

Design decision:

- The first irregular starfield was too sparse/faint in normal viewing. This pass keeps the non-repeating approach but makes the points visible enough to read as intentional texture.

### v56 Space Chart irregular starfield

- Replaced the Space Chart theme's two overlapping dot grids with a fixed irregular starfield.
- Kept the soft blue and purple background glows.

Design decision:

- The previous 60px and 90px dot grids created a subtle larger repeating pattern. A static irregular starfield keeps the sci-fi chart atmosphere without the distracting lattice effect.

### v55 Period sci-fi visual themes

- Added three switchable visual themes: `1950s - Atomic Pulp`, `1970s - New Wave Cosmos`, and `1980s - Neon Orbit`.
- Extended the theme switcher without changing the default `Archive` theme.
- Moved more chart, guide, tooltip, event stream, form, and panel colors onto theme variables so the new palettes apply consistently across views.
- Kept background textures CSS-only and low contrast.

Design decision:

- The new themes are exploratory visual directions rather than a final rebrand. They keep the existing layout and data visualization structure intact while testing period-specific sci-fi palettes with readable text, subdued gridlines, and clearly differentiated event colors.

### v54 Darker Author Timeline name guides

- Matched Author Timeline author-name guide styling to the publication-name guide styling used in the Global Timeline.

Design decision:

- Matching guide styling keeps cross-view visual language consistent.

### v53 Author Timeline guide polish

- Added faint dashed horizontal guide lines from author names toward their lifespan timelines.
- Shortened the main Author Timeline label baseline segment to better match the smaller mark-to-label distance.
- Applied both changes to the D3 renderer and native SVG fallback.

Design decision:

- Author names should visually connect to their timeline rows, while main timeline label leaders should stay proportionate to the tighter row spacing.

### v52 D3 Author Timeline renderer

- Added a D3-based renderer for the main Author Timeline.
- Kept the previous native SVG renderer as a fallback when D3 is unavailable.
- Preserved the existing row height, layout constants, sorting, magazine context overlay, selected-author styling, and click-to-detail behavior.
- Applied stricter label placement in the D3 path so unplaceable major-work labels are dropped rather than forced into collisions; work dots and tooltips remain.

Design decision:

- The Author Timeline can now evolve with D3-based data-visualization tooling while keeping the stable native SVG renderer available as a fallback. The first D3 pass intentionally preserves the same compact vertical rhythm and visual essence.

### v51 Main Author Timeline label leaders

- Applied the Author Detail baseline-leader style to main Author Timeline labels.
- Main timeline leaders now start from the center of the work mark, bend to the label baseline, and extend beneath the first few label characters.
- Reordered drawing so leader lines render before work marks and labels render last.

Design decision:

- The main Author Timeline and Author Detail should share the same label-to-mark visual language, with marks remaining visually foregrounded over connector lines.

### v50 Author Detail mark draw order

- Reordered Author Detail mini timeline drawing so connectors and leaders render before work marks.
- Work marks now sit on top of leader lines, hiding the portion of the line inside each circular mark.

Design decision:

- The leader should visually connect to the mark, but the mark should remain the foreground object.

### v49 Centered Author Detail leader starts

- Adjusted Author Detail label leaders so the angled segment starts from the center of the work mark.

Design decision:

- Center-origin leaders make each label connection read as attached to the mark itself rather than to an arbitrary edge of the circle.

### v48 Visible Author Detail label underline

- Moved the Author Detail label leader baseline segment slightly below the text baseline.
- Extended the segment further so it remains visible beneath the first few label characters despite text stroke styling.

Design decision:

- The baseline connector needs to remain visible after the label's white text halo is painted.

### v47 Longer Author Detail label leaders

- Extended the horizontal segment of Author Detail label leaders to sit under roughly the first one or two label letters.

Design decision:

- A slightly longer baseline segment makes the leader feel attached to the text rather than merely pointing near it.

### v46 Author Detail baseline leaders

- Changed Author Detail label leaders from simple lines to polylines.
- Leaders now run from the work mark to the label baseline, then extend a short horizontal baseline segment.

Design decision:

- Baseline leaders make the connection between a dot and its label easier to read without making the labels heavier.

### v45 Author Detail global label packing

- Replaced per-lane Author Detail label placement with a global collision pass across the full mini timeline.
- Prioritized lower `timeline_level` works before lower-priority works when deciding which labels to keep.
- Prevented labels from spilling into neighboring lane bands.

Design decision:

- Dense Author Detail views need label placement to understand the whole mini timeline, not just one lane at a time. A clean high-priority label set is more useful than showing every possible title.

### v44 Normalize generic series labels

- Mapped generic `series` values such as `Standalone novels` into `Standalone / other works` for Author Detail grouping.

Design decision:

- Generic lane and series labels need the same normalization path; otherwise a broad `series` value can recreate the same sorting issue after the generic `lane` value is ignored.

### v43 Normalize generic Works lane

- Mapped generic `Works` lanes into `Standalone / other works` for Author Detail grouping.

Design decision:

- `Works` is a generic bucket, not a meaningful series/world lane, so it should follow the standalone/other lane priority.

### v42 Normalize standalone lane labels

- Mapped `Standalone novels` data lanes into `Standalone / other works` for Author Detail grouping.

Design decision:

- Broad standalone labels should not be treated as meaningful series lanes. This keeps Author Detail ordering consistent across authors with slightly different data labels.

### v41 Author Detail nonfiction lane

- Added `Nonfiction` as its own Author Detail lane after `Collaborations`.

Design decision:

- Nonfiction should remain visible as a distinct late lane rather than being folded into standalone/other works or collaborations.

### v40 Author Detail lane priority

- Updated Author Detail vertical lane priority to: Timeline, Standalone / other works, Collections, Series, Collaborations.
- Collection/poetry works now use a dedicated `Collections` lane.
- Coauthored works now use a dedicated `Collaborations` lane placed after series lanes.

Design decision:

- Author Detail should first show the chronological spine, then standalone work, collected material, structured series, and finally collaborations as a distinct lower-priority grouping.

### v39 Author Detail timeline connectors

- Renamed the Author Detail `Life` row to `Timeline`.
- Kept the author lifespan band in the top timeline row.
- Added small work markers on the top timeline row for every publication.
- Added faint vertical connectors from each work's series/other-work lane back to its point on the top timeline.

Design decision:

- Series lanes should keep labels and primary marks, while the top timeline provides a unified chronological spine for the author's whole bibliography.

### v38 Simplify Author Detail life row

- Removed birth/death point markers from the Author Detail `Life` row.
- Kept the lifespan line and tooltip.

Design decision:

- In an author-specific detail panel, birth and death endpoints are self-evident from the life band and header dates. Removing the extra symbols keeps the detail timeline quieter.

### v37 Author Detail timeline cleanup

- Changed Author Detail mini timelines to use decade ticks.
- Added a `Life` row with author lifespan line and birth/death markers when dates are available.
- Collapsed broad format-based rows into `Standalone / other works`.
- Preserved meaningful series/subseries rows such as Foundation, Robot / Spacer, Empire, Space Odyssey, Rama, Tarzan, Barsoom, and Pellucidar.
- Reduced Author Detail label overlap by dropping labels that cannot be placed cleanly; dots remain available with tooltips.

Design decision:

- Author Detail should distinguish actual narrative/series structures, not every publication format. When labels are too dense, a clean dot with tooltip is preferable to unreadable overlapping text.

### v36 Rename Global label density control

- Renamed the Global Timeline `Label density` control to `Event labels`.

Design decision:

- The control changes how many event text labels appear, so `Event labels` is clearer public UI wording.

### v35 Stable timeline controls across data views

- Kept Timeline detail visible across Author timeline, Global timeline, Reading list, and Publications & editors.
- Kept From/To, Theme, and Reset visible across data views.
- About remains minimal and only keeps Theme while theme testing is still active.

Design decision:

- Timeline detail and year range form a stable cross-view time lens. Search and Type remain contextual because they apply only to work/author-oriented views.

### v34 Contextual controls

- Added tab-aware visibility for the shared top controls.
- Search and Type now show only for Author timeline and Reading list.
- Timeline detail now shows only for Author timeline and Global timeline.
- Year range controls show for Author timeline, Global timeline, Reading list, and Publications & editors.
- Theme remains available on every tab while theme testing continues.
- Publications & editors now respects the visible year range.

Design decision:

- The project should stay a single tabbed page for now, but controls should behave like local view controls so inactive filters do not visually or behaviorally confuse the user.

### v33 Hardcoded compact publication spacing

- Removed the temporary `Publication spacing` slider from Global Timeline controls.
- Hardcoded the publication-lane gap to the chosen compact minimum value.

Design decision:

- The temporary slider served its tuning purpose. The chosen compact spacing keeps the publication zone shorter without exposing a draft control in the public UI.

### v32 True-zero publication spacing

- Adjusted Global Timeline publication-lane spacing so the `Publication spacing` slider minimum is effectively zero inter-lane gap.
- Reduced hidden baseline padding between consecutive publication bands while preserving each lane's internal label space.

Design decision:

- The temporary spacing slider should expose the full useful range, including a truly compact no-gap option, so the final hardcoded value can be chosen visually.

### v31 Publication spacing tuning and TimeStream

- Added a temporary Global Timeline `Publication spacing` slider so publication-lane gaps can be tuned visually before hardcoding a final value.
- Renamed the Event Stream heading to `TimeStream`.
- Left same-year event expansion as an experimental interaction design item rather than implementing it directly.

Design decision:

- Publication spacing is now close enough that visual tuning is more useful than guessing constants. The TimeStream rename is public-facing copy, while radial event expansion needs interaction design review before it touches the stable timeline.

### v30 Lower Global Timeline spacing range

- Added two lower Global Timeline scale/spacing levels by changing the slider range from `4-18` to `2-16`.
- The lowest spacing is now half of the previous minimum.

Design decision:

- Dense publication/history views need a more compact horizontal option. Trimming the highest spacing levels keeps the slider range practical.

### v29 Compact publication lane spacing

- Reduced vertical spacing between publication lanes in the Global Timeline.
- Slightly tightened publication label-row spacing while preserving the existing editor/title label packing behavior.

Design decision:

- The publication zone should be shorter overall, but the internal lane layout should remain readable because the current editor/title spacing is working well.

### v28 Related-publication merger labels

- Updated Global Timeline merger/absorbed labels to read from `related_publications` instead of `title_history`.
- Placed `merged_into` labels at the end of the source publication's time band.
- Kept `absorbed` labels at the recorded relationship year on the receiving publication.

Design decision:

- Title history represents names used by the same publication entity. Mergers and absorptions are relationships between different publication entities and should be drawn from relationship data.

### v27 Softer 20-year publication guides

- Aligned Global Timeline vertical guide lines and year-axis labels to 20-year intervals.
- Lightened and thinned vertical guide lines.
- Stopped vertical guides at the end of the publication zone so they do not run into main timeline event entries.

Design decision:

- Year guides should support reading the publication zone without competing with the main event timeline below it.

### v26 Visible vertical year guides

- Strengthened vertical Global Timeline year guides with a fixed warm neutral stroke.
- Moved vertical guide rendering after the publication bands so the guides remain visible over the publication zone.

Design decision:

- The guides need to survive browser SVG/CSS quirks and remain visible enough to support timeline reading.

### v25 Stronger Global Timeline guides

- Increased publication-name guide opacity and stroke weight.
- Changed vertical year guides from gradient strokes to visible dashed guide lines using theme colors.

Design decision:

- Guide lines should be subtle, but they still need to be legible across themes and browser SVG rendering differences.

### v24 Global Timeline guide lines

- Added faint dashed horizontal guides from publication lane names to the start of their publication bands.
- Added fading vertical year guides from the upper year axis through the publication zone toward the main timeline.
- Applied both guide systems to the D3 renderer and native SVG fallback.

Design decision:

- The publication zone is now visually denser, so subtle guides help connect labels, dates, and bands without adding heavy grid lines.

### v23 Compact publication lanes and merger labels

- Made publication lane label height dynamic instead of reserving the same tall label band for every publication.
- Moved editor labels down to sit just above their own editor tenure lines.
- Added relationship labels from publication title history, such as merged/absorbed publication events, at the relevant year.

Design decision:

- Simple publication lanes should stay compact, while dense lanes can expand only as much as their labels require. Editor labels should visually belong to editor tenures, not to the magazine title-history band.

### v22 Packed publication lane labels

- Restored a start-of-band publication name while avoiding duplicate title-history labels for the same name.
- Added collision-aware packing for publication names, title-history labels, and editor names within each publication lane.
- Reserved a small label band above each publication lane so editor/title labels do not sit directly on magazine bands.

Design decision:

- Publication lanes need both identity and title-change detail, but dense early magazine history should be staggered as a label system rather than drawn as raw overlapping text.

### v21 Publication label de-duplication

- Suppressed redundant publication names on Global Timeline bands because the publication name is already shown as the lane label.
- Hid title-history labels when the title is identical to the publication's main name.

Design decision:

- The left lane label should carry the publication identity; inline band labels should be reserved for meaningful title changes.

### v20 Publication title-history labels

- Added title-history markers and labels above publication bands on the Global Timeline.
- Compacted Global Timeline publication lanes by reducing top margin, lane gaps, row gaps, and band stroke widths.
- Applied title-history labels to both the D3 renderer and native SVG fallback.

Design decision:

- Publication title changes are part of the publishing-history story, so they belong directly on the relevant publication band. The timeline should stay compact enough to scan, even if it becomes slightly denser.

### v19 Publications data assimilation

- Updated the app to prefer `EMBEDDED_DATA.publications` while retaining `magazines` as a fallback.
- Updated editor/publication matching to use `publication_id` when available.
- Renamed the public publishing tab and Global Timeline label language from magazine-only wording to publication wording.
- Added publication title histories to the Publications & editors table.
- Documented the new publications data model and clarified that JSON files in `data/` are reference extracts only.

Design decision:

- Publishing entities are now broader than magazines because the data includes imprints such as Del Rey Books. The UI should describe that broader model without changing the static `data.js` loading architecture.

### v18 Grouped Global Timeline publication lanes

- Changed Global Timeline span layout from two broad lanes to publication-specific lanes.
- Placed editor tenure spans directly under their related magazine/publication.
- Removed the previous five-row cap that caused later magazine/editor spans to overlap.

Design decision:

- Magazine lifetimes and editor tenures should read as one publishing-history unit. Grouping them by publication is clearer than separating all magazines from all editors.

### v17 Global Timeline span breathing room

- Increased vertical spacing between Global Timeline magazine/editor span rows.
- Increased the separation between magazine lifetime lanes and editor tenure lanes.
- Applied the spacing change to both the D3 renderer and native SVG fallback.

Design decision:

- Long-running publication bands need to read as distinct historical layers, not as a compressed bundle. Extra vertical space is preferable to overlap in this overview.

### v16 Global Timeline axis spacing

- Moved the Global Timeline year axis from just above the central event baseline to a fixed top band near the upper edge of the visualization panel.
- Applied the same axis placement to both the D3 renderer and the native SVG fallback renderer.
- Kept the central event baseline in place so event points and labels retain their existing vertical rhythm.

Design decision:

- The year scale should behave like a framing reference for the whole panel, not like another event label row. Keeping it at the top improves scannability and gives the dense timeline content more visual room.

### v15 README baseline

- Reworked `README.md` into the living project handover and maintenance record.
- Added explicit project boundary for `TheBookshelfOfCuriosities`.
- Added current architecture, public content rules, current behavior, design decisions, and future-maintenance expectations.
- Cleaned up stale labels and mojibake from earlier README notes.
- Added `ToDo.md` as the living task list for active priorities, future improvements, completed work, and parked ideas.

Design decision:

- Keep README as the canonical lightweight project memory, and keep `ToDo.md` as the evolving execution queue. This separates long-term project reasoning from practical task status.

### v14

- Re-centered the Global Timeline vertically so labels above and below the axis have more balanced breathing room.
- Staggered magazine and editor span bands to make overlapping long-running publications more distinguishable.
- Removed internal scrolling from the Event Stream; it now expands naturally down the page.
- Added event-type styling to the Event Stream using symbols, colored year markers, and colored left borders.

### v13

- Fixed Global Timeline blank rendering when the D3 CDN is unavailable or not yet loaded.
- The Global Timeline still uses D3 when available, but now has a native SVG fallback.
- This makes the page more robust when opened offline, from a local file, or on networks that block CDN scripts.

### v12

- Rebuilt the Global Timeline as a hybrid view:
  - D3-based horizontal timeline for event points and long-running bands.
  - Vertical Event Stream below it for the complete filtered historical sequence.
- Added Global Timeline event filters.
- Added global scale / spacing slider and label-density slider.
- Added All / Clear controls for Global Timeline event filters.
- Added a theme switcher with Archive, Pulp, Space chart, and Archive + accents options.
- Added subtle CSS-only background texture / corner graphics.
- Set Author Timeline as the explicit default opening panel.
- Renamed list source values:
  - `Original reading list` -> `Reading list`
  - `User addition` -> `Additional Favourites`

### v11

- Fixed author click/detail panel not opening after v10 changes.
- Author detail now renders only in the inline detail slot to avoid duplicate mini-timeline IDs.

### v10

- Author timeline no longer uses birth/death shapes; those are used only on the Global Timeline.
- Added optional magazine context overlay on the Author Timeline.
- Global Timeline magazine bands now include editor tenures aligned underneath magazine lifetimes.
- Global Timeline also adds editor start and exit events.
- Unknown-author ordering uses known-author birth order as the spine, then inserts unknown-date authors by earliest included publication year.

### v9

- Author sort uses a clean public control while handling unknown author dates internally.
- In Author birthdate mode, authors with known birth years are sorted by birth year.
- If an author birth year is missing, the internal fallback is that author's earliest included publication year.

### v8

- Removed the separate Meccania sort mode.
- Meccania / Owen Gregory is handled by the general unknown-date fallback rather than a public special case.

### v7

- Added author sort options.
- Added dot/shape legends to the Global Timeline.
- Birth and death events now use different shapes from book/work dots.
- Magazine/editor band labels are placed after the colored run with a background label chip.
- Author detail opens inline under the author timeline area and scrolls into view when an author is clicked.

### v6

- Added `list_source` to works.
- Expanded Isaac Asimov's extended Foundation universe with Robot / Spacer, Empire, and Foundation titles.
- Changed author timeline sorting work in preparation for better unknown-date handling.
- Improved left-side label alignment.

### v5

- Added better greedy label collision avoidance.
- Added selected major-work labels in the main Author Timeline.
- Made datatype colors more distinct.
- Improved equal-height rows in Author Detail.

### v4

- Improved Author Detail row ordering.
- Added basic label spacing and staggering.
- Split Asimov's Foundation universe into Empire, Foundation, and merged rows.
- Fixed legend colors.

### v3

- Renamed Author lifelines to Author timeline.
- Added dot-color legend.
- Author Detail labels changed from years to book/work titles.
- Type filtering became hierarchical.

### v2

- Added same-page Author Detail panel.
- Added author timelines for Asimov and Clarke.
- Introduced cleaner `type_path`.

### v1 standalone

- Embedded data so the page could open by double-clicking `index.html`.

### v1

- First static webpage prototype.
- Included Author Lifelines, Global Timeline, Reading List, and Magazines & Editors sections.
- Used updateable TSV-style data files.

## Maintenance Notes

After each meaningful update, update this README with:

- Files changed.
- Behavior changed.
- Design decisions behind the change.
- Possible visual side effects.
- Browser testing notes.

Also update `ToDo.md` when a task is completed, started, deferred, blocked, or newly discovered.

Do not remove existing functionality unless explicitly requested. Do not rewrite the whole app from scratch. Keep the project static, public-facing, and GitHub Pages-friendly.

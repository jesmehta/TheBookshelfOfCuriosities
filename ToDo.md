# Science Fiction Reading Timeline To Do

Living task list for `TheBookshelfOfCuriosities`.

Status key:

- `Not started`
- `In progress`
- `Done`
- `Deferred`
- `Blocked`

## Active Priorities

| Status | Task | Notes |
| --- | --- | --- |
| Not started | Stabilize current v14 baseline | Check that `index.html`, `style.css`, `script.js`, and `data.js` load correctly through VSCode Live Server. |
| Not started | Confirm Author Timeline default tab | Page should open with Author timeline active. |
| Not started | Confirm Global Timeline D3 render | Verify horizontal Global Timeline renders when D3 CDN loads. |
| Not started | Confirm Global Timeline fallback render | Verify fallback does not go blank if D3 is unavailable. |
| Done | Improve Author Detail timeline | v37 adds decade ticks, Life row, simpler row grouping, and cleaner labels. |
| Not started | Keep README updated after each change | Include files changed, behavior changed, design decisions, visual side effects, and test notes. |
| Done | Rename Event stream to TimeStream | v31 changed the public heading. |

## Author Detail Improvements

| Status | Task | Notes |
| --- | --- | --- |
| Done | Use decade ticks | v37 uses decade ticks in Author Detail mini timelines. |
| Done | Add author timeline row | v39 keeps a top `Timeline` row with lifespan band, work markers, and connectors to series lanes. |
| Done | Simplify generic work rows | v37 collapses broad formats into `Standalone / other works`. |
| Done | Preserve meaningful series rows | v37 keeps actual series/subseries rows such as Foundation, Robot / Spacer, Empire, Space Odyssey, Rama, Tarzan, Barsoom, and Pellucidar. |
| Done | Reduce label overlap | v37 drops unplaceable labels while keeping dots and tooltips. |
| Done | Review selected-author feedback | Existing selected author styling remains subtle and sufficient for now. |

## Author Timeline Rework

| Status | Task | Notes |
| --- | --- | --- |
| Done | Explore D3-based Author Timeline renderer | v52 adds a D3 renderer for the main Author Timeline. |
| Done | Preserve current vertical compactness | v52 keeps the existing row height and layout constants. |
| Done | Keep current Author Timeline stable during experiments | v52 keeps the previous native SVG renderer as a fallback if D3 is unavailable. |

## Global Timeline Refinements

| Status | Task | Notes |
| --- | --- | --- |
| In progress | Review magazine/editor band staggering | v18 groups editor tenures under their publication and removes the five-row overlap cap; still needs browser review. |
| Not started | Review label clipping | Make sure labels above and below the axis are not clipped at common viewport widths. |
| Done | Add title-history labels to publication bands | v20 marks publication title changes above the relevant band positions. |
| In progress | Refine publication/editor label packing | v22 packs publication names, title-history labels, and editor names per lane; needs browser review around Astounding. |
| Done | Add publication merger labels | v28 shows merged/absorbed relationships from `related_publications`; merged-into labels sit at the source band end. |
| Done | Add publication and year guide lines | v24 adds faint label-to-band guides and fading year marks across the publication zone. |
| Not started | Prototype author isolation from birth/death events | Experimental: clicking an author birth/death event could show that author's timeline as an isolated band above the main Global Timeline. |
| Not started | Prototype work isolation from book/media events | Experimental: clicking a work event could show all works by that author as a separate series above the main Global Timeline. |
| Not started | Keep Global Timeline interaction experiments separate | These pop-up/isolation features should be tested as separate experimental versions so the stable core remains intact. |
| Not started | Explore radial same-year event expansion | Experimental: hover/click on stacked same-year events could expand them radially into separate selectable marks. Needs design review before implementation. |
| Not started | Refine label density slider behavior | Confirm density settings feel meaningful and predictable. |
| Not started | Review Event Stream spacing | Keep it readable without internal scrolling. |
| Not started | Check filter sync | Filters should affect both horizontal timeline and Event Stream. |
| Done | Move Global Timeline year axis upward | v16 moved the year axis to a fixed top band so it no longer crowds the central event baseline. |
| Deferred | Bundle D3 locally | Optional. Would improve offline/local reliability for GitHub Pages-style deployment. |

## Theme And Visual Design

| Status | Task | Notes |
| --- | --- | --- |
| Not started | Evaluate current four themes | Archive, Pulp, Space chart, Archive + accents. |
| In progress | Rework theme system | v55 adds three period sci-fi themes; final public visual direction still needs choosing. |
| Done | Add period sci-fi themes | v55 adds 1950s Atomic Pulp, 1970s New Wave Cosmos, and 1980s Neon Orbit. |
| Done | Replace Space Chart repeating grids | v56 uses a fixed irregular starfield instead of overlapping 60px/90px dot grids; v57 makes it more visible; v58 adds density; v59 adds HR-inspired star colors. |
| Not started | Refine likely final direction | Preferred direction is archive with subtle pulp accents. |
| Not started | Check background texture subtlety | CSS-only textures should stay low contrast and non-distracting. |
| Not started | Review mobile layout | Check controls, tables, timeline labels, and event stream on narrow screens. |
| Not started | Review table readability | Reading List and Publications & editors should remain useful, not just raw data dumps. |

## Data And Content

| Status | Task | Notes |
| --- | --- | --- |
| Not started | Audit public-facing language | Page should not mention workshops, slides, screenshots, OCR, source file names, or day references. |
| Not started | Audit list source values | UI should use `Reading list` and `Additional Favourites` only. |
| Not started | Audit `type_path` values | Avoid magazine-as-work-type errors and invalid combinations like `Novel/Film`. |
| Done | Assimilate publications data model | v19 uses `publications` as canonical, keeps `magazines` as fallback, and uses `publication_id` for editor matching. |
| Not started | Review links and dates | Dataset should be reviewed before formal publication. |

## Deployment

| Status | Task | Notes |
| --- | --- | --- |
| Not started | Confirm GitHub Pages readiness | Static files should work without a build step. |
| Not started | Add deployment notes if needed | README can include final GitHub Pages instructions once deployment path is known. |

## Completed

| Version | Task | Notes |
| --- | --- | --- |
| v15 | Convert README into living project record | Added project scope, architecture, current behavior, design decisions, changelog, and maintenance notes. |
| v15 | Create ToDo.md | Added this living task list seeded from the handover priorities. |
| v16 | Move Global Timeline year axis upward | Axis now stays near the upper edge of the panel in both D3 and fallback renderers. |
| v17 | Add Global Timeline span breathing room | Increased spacing between magazine/editor rows and between span lanes. |
| v18 | Group publication lanes | Editor tenure spans now sit below their related magazine; row cap removed to prevent forced overlap. |
| v19 | Assimilate publications data | App now prefers `publications`, preserves `magazines` fallback, and shows title histories in the publishing table. |
| v20 | Add publication title-history labels | Global Timeline now labels title changes along publication bands and uses a more compact span layout. |
| v21 | De-duplicate publication labels | Publication names now stay in the left lane label; inline labels are reserved for changed titles. |
| v22 | Pack publication lane labels | Start names, title history, and editor labels now use collision-aware rows above each publication lane. |
| v23 | Compact publication lanes and merger labels | Lane height is dynamic, editor names sit near tenure lines, and merger/absorbed events are labeled. |
| v24 | Add Global Timeline guide lines | Faint publication-name guides and fading vertical year guides improve scanability. |
| v25 | Strengthen Global Timeline guide lines | Horizontal guides are darker; vertical year guides use visible dashed theme strokes. |
| v26 | Make vertical year guides visible | Vertical guides now use a fixed stroke and render above publication bands. |
| v27 | Refine vertical year guides | Guides now align to 20-year ticks, are lighter/thinner, and stop before the main event entries. |
| v28 | Use related-publication merger labels | Merger/absorbed labels now come from `related_publications`, not title history. |
| v29 | Compact publication lane spacing | Reduced overall publication-zone height while preserving internal label packing. |
| v30 | Lower Global Timeline spacing range | Scale slider now runs `2-16`, adding two compact levels and trimming the high end. |
| v31 | Add publication spacing tuning and TimeStream | Added temporary publication-spacing slider and renamed Event Stream heading to TimeStream. |
| v32 | Make publication spacing minimum true zero | Removed extra hidden inter-lane padding at the slider minimum. |
| v33 | Hardcode compact publication spacing | Removed temporary slider and fixed publication-lane gap at the chosen compact value. |
| v34 | Add contextual controls | Top controls now show only on relevant tabs; Publications & editors respects year range. |
| v35 | Stabilize timeline controls across data views | Timeline detail, From/To, Theme, and Reset remain visible across data tabs; Search/Type stay contextual. |
| v36 | Rename label density control | Global Timeline control now reads Event labels. |
| v37 | Clean up Author Detail timeline | Added decade ticks, Life row, simpler work lanes, and cleaner label placement. |
| v38 | Simplify Author Detail life row | Removed redundant birth/death markers from the Life row. |
| v39 | Add Author Detail timeline connectors | Work dots remain in series lanes and also connect back to a top author timeline band. |
| v40 | Set Author Detail lane priority | Lanes now order as Timeline, Standalone, Collections, Series, then Collaborations. |
| v41 | Add Author Detail nonfiction lane | Nonfiction now appears as the final Author Detail lane after Collaborations. |
| v42 | Normalize standalone lane labels | `Standalone novels` now maps into `Standalone / other works` for consistent Author Detail sorting. |
| v43 | Normalize generic Works lane | `Works` now maps into `Standalone / other works` for Author Detail grouping. |
| v44 | Normalize generic series labels | Generic `series` values such as `Standalone novels` now also map into `Standalone / other works`. |
| v45 | Improve Author Detail label packing | Labels now use a global collision pass across the mini timeline and prioritize major works. |
| v46 | Add Author Detail baseline leaders | Label leaders now connect to the label baseline and extend a short horizontal segment. |
| v47 | Extend Author Detail baseline leaders | Horizontal leader segment now reaches under roughly one or two label letters. |
| v48 | Make Author Detail label underline visible | Baseline segment is lower and longer so the text halo no longer hides it. |
| v49 | Center Author Detail leader starts | Leader angled segments now start from the center of the work mark. |
| v50 | Draw Author Detail marks above leaders | Work marks now render after connector lines so line segments inside circles are hidden. |
| v51 | Apply baseline leaders to main Author Timeline | Main Author Timeline labels now use the same centered baseline leader style as Author Detail. |
| v52 | Add D3 Author Timeline renderer | Main Author Timeline now uses D3 when available and keeps native SVG fallback. |
| v53 | Polish main Author Timeline guides | Added author-name guide lines and shortened main timeline label baselines. |
| v54 | Match Author Timeline guide styling | Author-name guides now use the same stroke/dash/opacity settings as publication guides. |
| v55 | Add period sci-fi themes | Added 1950s Atomic Pulp, 1970s New Wave Cosmos, and 1980s Neon Orbit theme options. |
| v56 | Replace Space Chart dot grids | Space Chart now uses a fixed irregular starfield to avoid subtle repeating lattice patterns. |
| v57 | Strengthen Space Chart starfield | Increased star count, point size, and opacity so the irregular field is visible in normal viewing. |
| v58 | Densify Space Chart starfield | Added more scattered star points while keeping the fixed irregular background approach. |
| v59 | Add HR-inspired star colors | Space Chart starfield now uses subtle blue-white, white, yellow, amber, and soft red star colors. |
| v60 | Rewrite About section into two-part case study | Replaced About with a public-facing making-of narrative and phase-based development history. |
| v61 | Add About section part navigation | Added jump links to Part 1/2/3 with minor About-nav styling for long-form readability. |
| v62 | Fix About text encoding artifacts | Repaired mojibake characters (quotes/dashes/ellipsis/apostrophes) in About and related UI text. |

## New Ideas Parking Lot

Add new ideas here before promoting them to an active section.

| Status | Idea | Notes |
| --- | --- | --- |
| Not started | Add final chosen visual direction note | Once theme direction is chosen, document the decision in README and update style goals here. |

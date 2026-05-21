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
| Not started | Improve Author Detail timeline | Main next feature area. See dedicated section below. |
| Not started | Keep README updated after each change | Include files changed, behavior changed, design decisions, visual side effects, and test notes. |

## Author Detail Improvements

| Status | Task | Notes |
| --- | --- | --- |
| Not started | Use decade ticks | Replace or refine current 25-year tick behavior in Author Detail. |
| Not started | Add author lifeline row | Detail panel should include a `Life` row when birth/death data exists. |
| Not started | Simplify generic work rows | Use one `Standalone / other works` row rather than separate rows for standalone novels, collections, nonfiction, and similar broad forms. |
| Not started | Preserve meaningful series rows | Keep distinct rows for real series/subseries such as Foundation, Robot / Spacer, Empire, Space Odyssey, Rama, Tarzan, Barsoom, and Pellucidar. |
| Not started | Reduce label overlap | Improve label placement/staggering in Author Detail timelines. |
| Not started | Review selected-author feedback | Keep selected state visible but subtle: color, underline, or font change is enough. |

## Global Timeline Refinements

| Status | Task | Notes |
| --- | --- | --- |
| In progress | Review magazine/editor band staggering | v18 groups editor tenures under their publication and removes the five-row overlap cap; still needs browser review. |
| Not started | Review label clipping | Make sure labels above and below the axis are not clipped at common viewport widths. |
| Done | Add title-history labels to publication bands | v20 marks publication title changes above the relevant band positions. |
| In progress | Refine publication/editor label packing | v22 packs publication names, title-history labels, and editor names per lane; needs browser review around Astounding. |
| Done | Add publication merger labels | v23 shows merged/absorbed relationships from title-history data at the relevant year. |
| Done | Add publication and year guide lines | v24 adds faint label-to-band guides and fading year marks across the publication zone. |
| Not started | Refine label density slider behavior | Confirm density settings feel meaningful and predictable. |
| Not started | Review Event Stream spacing | Keep it readable without internal scrolling. |
| Not started | Check filter sync | Filters should affect both horizontal timeline and Event Stream. |
| Done | Move Global Timeline year axis upward | v16 moved the year axis to a fixed top band so it no longer crowds the central event baseline. |
| Deferred | Bundle D3 locally | Optional. Would improve offline/local reliability for GitHub Pages-style deployment. |

## Theme And Visual Design

| Status | Task | Notes |
| --- | --- | --- |
| Not started | Evaluate current four themes | Archive, Pulp, Space chart, Archive + accents. |
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

## New Ideas Parking Lot

Add new ideas here before promoting them to an active section.

| Status | Idea | Notes |
| --- | --- | --- |
| Not started | Add final chosen visual direction note | Once theme direction is chosen, document the decision in README and update style goals here. |

# Isaac Asimov Foundation Galaxy Prototype V12

Static webpage prototype for **Asimov’s History of the Future**.

## Open

Open `index.html` in a browser. The page uses D3 from a CDN, so an internet connection is expected.

## Context files

- `Readme_2_future_history_design_brief.md` is the long-form project brief, design rationale, version history, and future-priority document.
- `Readme_3_working_context.md` is the live Codex working-context summary.
- `Readme_4_todo_decisions.md` tracks done items, remaining work, open questions, and design decisions.

## V6 changes

- Moved the galaxy map back above the timeline.
- Stacked the right sidebar with the selected-world/location panel above the selected-work/book panel.
- Increased timeline internal headroom so Robot/Spacer labels do not clip off the panel.
- Repositioned series bands and labels so Empire markers are no longer hidden under band/background layers.
- Kept the timeline compact while preserving series bands and avoiding `Fdn`-style abbreviations.
- Added a swappable-axis control to the Publication × In-universe Time plot.
- Changed the galaxy map interaction to be world-first:
  - all worlds are active by default;
  - legend chips are checkbox filters;
  - selecting a world opens the first associated book by publication year;
  - selected-world panel lists all associated books and lets you select them.
- The book panel remains focused on the selected work, while the smaller world panel handles recurring worlds.

## Notes

This is still a visual/interaction prototype. The galaxy placement is interpretive and should be replaced with the user’s hand-drawn map when available.


## V12 changes
- Moved the galaxy legend into a transparent overlay on the map.
- Added duration-aware timeline marks for works spanning a range of in-universe years.
- Added a temporary toggle between segmented/discontinuity timeline scale and a complete unbroken scale.
- Improved timeline labels with angled leaders to text baselines and horizontal underlines under the label text.
- Added basic collision/edge avoidance and close stacking for overlapping timeline book marks.


## V12 changes
- Shorter XY plot with leader-line labels and collision handling.
- Universe timeline duration works render as solid rounded bands rather than endpoint dots.
- Timeline label placement includes stronger overlap and crossing penalties.


## V12 changes

- Foundation galaxy title and legend now sit directly on the map with transparent overlays.
- Book card now removes Series Order and Universe Order; reading-order data can move to a later table.
- Related worlds are displayed as a two-column click grid.
- Timeline and XY leader underlines are short 8px ticks placed just below the label baseline.
- Bibliography page now has a true timeline: fiction as circles above the axis, nonfiction as diamond/square marks below the axis, colored by domain/series, with thin connecting lines for series/clusters.
- Bibliography table is sortable by title, year, type, series/cluster, domain, fiction/nonfiction, and notes.
- Bibliography filters include search, domain, type, series/cluster, and fiction/nonfiction.


## V12 fixes

- Fixed a runtime bug in selected-world link drawing that could interrupt later click handlers.
- Added larger invisible hit targets for galaxy worlds, timeline marks, and XY marks.
- Made bibliography marks, labels, and table rows clickable.
- Reworked in-universe timeline axis labels so year numbers and era labels do not overlap.

## Post-V12 local updates

- Increased the bibliography timeline height from 620 to 820 SVG units.
- Spread fiction series and nonfiction domain rows farther apart on the bibliography timeline.
- Increased the central-axis gap before the nearest bibliography rows.

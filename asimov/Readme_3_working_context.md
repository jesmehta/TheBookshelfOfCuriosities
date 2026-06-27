# Readme3 - Working Context

This file is the live working summary for the Asimov Foundation Galaxy prototype. Keep it updated as the implementation changes.

## Project Scope

The active project folder is:

```text
D:\Projects\AsimovPage\asimov_foundation_prototype_v12_Codex
```

Current expected frontend files:

- `index.html`
- `style.css`
- `app.js`
- `data.js`
- `Readme_1_overview.md`
- `Readme_2_future_history_design_brief.md`
- `Readme_3_working_context.md`
- `Readme_4_todo_decisions.md`

The project is a static frontend prototype. It uses D3 from a CDN, with data currently embedded in `data.js`. No backend is required for the current version.

## Core Intent

The page is an Asimov-first page whose main visual hook is the Foundation / Robot / Empire future-history galaxy map and synchronized in-universe timeline.

The experience should communicate two linked ideas:

- Asimov built a fictional future-history that begins near Earth, expands through robots, Spacer worlds, Empire, Trantor, Foundation, Gaia, and returns toward Earth and the Moon.
- Asimov's larger body of work mapped knowledge across fiction, science, history, essays, mysteries, Bible studies, Shakespeare, autobiography, humor, and other domains.

## Current Page Structure

The prototype is organized as a tabbed interface:

- Galaxy Map + In-Universe Timeline
- Publication Date x In-Universe Date
- Bibliography
- Short Stories / Essays / Data Notes

The landing tab should remain the strongest visual feature. Bibliography is important, but secondary to the Foundation galaxy experience.

## Interaction Model

The galaxy map is world-first, not book-first.

Important behavior:

- All worlds are active by default.
- Legend chips act as checkbox filters.
- Selecting a world shows the selected location panel and selects the earliest associated work by publication year.
- Selecting a book highlights its related worlds.
- Location panel book entries are clickable.
- Related worlds in the book panel are clickable.
- The intended loop is: book to worlds to a world's books to another book to another world.

## Visualization Principles

Galaxy:

- Interpretive narrative map, not a literal astronomical chart.
- Earth/Sol/Moon sit away from the galactic core.
- Spacer worlds cluster near Earth/Sol.
- Trantor anchors the imperial core.
- Terminus anchors the outer rim.
- Gaia, Comporellon, Florina, Sark, Anacreon, and other worlds support the narrative route.
- The route should preserve the poetic loop from Earth outward and eventually back to Earth/Moon.

Timeline:

- Proper in-universe time axis, not a card list.
- Duration works render as rounded bands.
- Point works render as marks.
- Labels use angled leaders and short 5-10px ticks under the label.
- Labels should use full names rather than abbreviations.
- Year labels, era labels, and discontinuity markers must remain visually separate.

Publication x In-Universe Plot:

- Shows the tension between publication chronology and fictional chronology.
- Axes remain swappable for now.
- Labels should follow the same leader/tick style as the timeline.
- Marks and labels need generous hit targets.

Bibliography:

- Curated, meaningful Asimov-wide view, not an exhaustive database in this version.
- Fiction appears above the axis; nonfiction below.
- Fiction uses circles; nonfiction uses diamonds.
- Color by series/domain.
- Connect recurring series or meaningful clusters with thin lines.
- Table remains sortable and filterable.

## Current Known Version

The available README history identifies the current prototype as V12.

Recent V12 work includes:

- Transparent title and legend overlays on the galaxy map.
- Duration-aware timeline bands.
- Temporary toggle between segmented and unbroken timeline scales.
- Improved timeline labels, leader lines, and short ticks.
- Improved overlap handling for timeline and XY labels.
- Book panel simplified by removing series order and universe order.
- Related worlds displayed as clickable two-column cards.
- Bibliography timeline and sortable/filterable table added.
- Larger invisible hit targets added to charts.
- Bibliography marks, labels, and rows made clickable.
- In-universe timeline axis labels separated from era labels.

## Current Local Updates

- Increased the bibliography timeline height from 620 to 820 SVG units.
- Expanded the vertical space used by fiction series and nonfiction domain rows.
- Increased the gap between the central publication-year axis and the nearest bibliography rows.
- Audited context-delivery files and updated `Readme_1_overview.md` / `Readme_2_future_history_design_brief.md` to reflect the current V12 plus post-V12 local state.

Why: the bibliography page had dense series/domain rows, so the timeline needed more Y spacing for legibility and easier label scanning.

## Notes For Future Updates

When changing code, update this file with:

- What changed.
- Why the change matters.
- Any design decision that affects future work.
- Any data assumption or source uncertainty.

Use `Readme_4_todo_decisions.md` for task status and decision logging.

# ToDo - Asimov Foundation Prototype

This file tracks completed work, remaining work, and design decisions for the current project folder.

## Done

- Read `Readme_1_overview.md`.
- Read `Readme_2_future_history_design_brief.md`.
- Confirmed this is a static D3 frontend prototype.
- Confirmed the current project version is V12.
- Confirmed the main files currently present:
  - `index.html`
  - `style.css`
  - `app.js`
  - `data.js`
  - `Readme_1_overview.md`
  - `Readme_2_future_history_design_brief.md`
  - `test_clicks.py`
- Created `Readme_3_working_context.md` as a living working-context summary.
- Created `Readme_4_todo_decisions.md` as the live task and decision tracker.
- Increased Y spacing between bibliography timeline series/domain rows.
- Audited and refreshed the context-delivery files for the current V12 plus post-V12 local state.

## Not Found / Needs Clarification

- `readme2.md` was listed in the IDE tabs but was not present in `D:\Projects\AsimovPage\asimov_foundation_prototype_v12_Codex` when checked.

## Next Priorities

- Review `index.html`, `style.css`, `app.js`, and `data.js` before making behavioral or visual changes.
- Verify current runtime behavior in a browser or local server.
- Recheck click reliability across:
  - galaxy worlds
  - galaxy labels or hit targets
  - in-universe timeline marks
  - in-universe timeline labels
  - XY plot marks and labels
  - bibliography marks, labels, and table rows
- Ensure SVG overlays do not block pointer events.
- Continue reducing timeline label overlaps and leader-line crossings.
- Improve galaxy background while keeping the map readable.
- Remove or avoid real-world Milky Way arm labels unless explicitly useful.
- Improve relative world placement after a hand-drawn sketch is available.
- Continue expanding and cleaning the curated bibliography data.
- Improve bibliography label collision handling.
- Preserve fiction/nonfiction visual distinction in the bibliography timeline.

## Design Decisions

### Asimov-first, Foundation-hero

Decision: The page is about Isaac Asimov broadly, but the landing feature is the Foundation / Robot / Empire future-history galaxy.

Why: Foundation provides the strongest visual and conceptual hook, while the broader bibliography shows Asimov as a mapper of knowledge, not only a science-fiction author.

### Static frontend for current version

Decision: Keep the prototype as static HTML/CSS/JS with D3 loaded from a CDN.

Why: This keeps the prototype easy to open, share, and iterate without backend complexity.

### World-first galaxy map

Decision: Worlds are primary objects on the galaxy map; books connect to worlds.

Why: A single book can involve multiple worlds, and a single world can appear across multiple books. This supports exploratory navigation better than one marker per book.

### Book-location interaction loop

Decision: Preserve the interaction loop: book to related worlds to world books to another book.

Why: This loop is the conceptual engine of the page and turns the map into an explorable future-history system.

### Interpretive galaxy map

Decision: The map is narrative and interpretive rather than astronomically literal.

Why: Fictional locations need to support clarity, story route, and user comprehension.

### Transparent map overlays

Decision: Title and legend sit directly on the galaxy map in transparent or semi-transparent overlays.

Why: This keeps the map visually central and avoids a heavy header strip.

### Compact but proper in-universe timeline

Decision: The timeline should remain compact but behave like a real time axis.

Why: The fictional chronology is vast, so the design needs both compression and clarity.

### Segmented/unbroken timeline toggle

Decision: Keep the temporary toggle between segmented and unbroken scales.

Why: The segmented version improves readability, while the unbroken version helps users understand the true scale distortion.

### Duration bands

Decision: Works spanning ranges should render as rounded bands.

Why: Duration bands are clearer than endpoint dots for long-running in-universe periods.

### Short leader ticks

Decision: Timeline and XY labels use angled leaders and short ticks rather than long underlines.

Why: Short ticks preserve the earlier visual style without cluttering dense charts.

### Bibliography is curated, not exhaustive

Decision: The bibliography should be meaningful and representative rather than complete in this version.

Why: Asimov's full bibliography is large and messy, with reprints, collections, alternate editions, introductions, and edited anthologies.

### Signed bibliography timeline

Decision: Fiction appears above the bibliography axis; nonfiction appears below.

Why: This provides an immediate visual separation between Asimov's fictional systems and explanatory/domain writing.

### Roomier bibliography row spacing

Decision: Increase the bibliography timeline height from 620 to 820 SVG units and expand the Y ranges for fiction series and nonfiction domains.

Why: More vertical distance between rows makes the bibliography timeline easier to scan and reduces the cramped feeling between series/domain bands.

## Open Questions

- Should `readme2.md` be restored or recreated from another location?
- Should `Readme_3_working_context.md` become the main working README, or remain a separate Codex collaboration log?
- Which source should be treated as canonical for in-universe dates when references disagree?
- How exhaustive should bibliography expansion become before the design needs a data pipeline?
- Is there a hand-drawn galaxy sketch ready to replace or guide the current interpretive placement?

## Update Log

### 2026-05-29

- Created this tracker.
- Created `Readme_3_working_context.md`.
- Captured initial project context, current status, known issues, next priorities, and design decisions from the existing README files.
- Increased bibliography timeline Y spacing by making the SVG taller and spreading category rows farther apart.

### 2026-06-27

- Verified context-delivery files against the current project files.
- Updated `Readme_1_overview.md` title from V6 to V12.
- Added context-file roles to `Readme_1_overview.md`.
- Added the post-V12 bibliography row-spacing update to `Readme_1_overview.md` and `Readme_2_future_history_design_brief.md`.

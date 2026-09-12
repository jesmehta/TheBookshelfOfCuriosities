# Christie Timeline — Build History (v1 → v3)

A record of the original request and the two rounds of revisions that followed, for reference alongside the three HTML files.

---

## Original request (→ v1: `christie-timeline.html`)

> Let's work on the simpler timeline first: Similar to SciFi or Asimov, drop each Christie book on a common timeline along X axis, but with separate bands along Y axis for each of the protagonists — Poirot, Marple, Parker Pyne, etc. Colour each mark based on location. Novel can be squares, short stories triangles, and short story collections can be circles. Allow filters based on Protagonist, Location, Year of publication, in-universe year if enough works have that. Refer to the SciFi Golden Age repo as well as Asimov's repo for this — they are subfolders inside the Bookshelf repo.

**What v1 delivered:**
- Pulled structural conventions directly from `TheBookshelfOfCuriosities/scifi` and `/asimov`: lane-bands per protagonist, a "publishing span" bar per lane (modelled on the author life-bar), decade gridlines, hover tooltips, sortable table underneath.
- X-axis: publication year, with a toggle to switch to a best-effort in-universe year.
- In-universe year was extracted from the `time` text where an explicit year was stated (only 15 of 87 entries qualified); everything else fell back to publication year, marked with a dashed "approx" ring.
- Marker shape = format (▪ novel · ▸ short story · ● collection), marker colour = location, using the same four-way London / UK / Europe & the Orient / Elsewhere split established in the earlier Christie Atlas.
- Filters: Protagonist, Location (the four-way split), Format, plus a dual year-range input.
- Kept the Atlas's dark near-black/antique-gold "ledger" visual identity rather than copying the Sci-Fi page's parchment theme or the Asimov page's space-blue theme, on the reasoning that each of the Bookshelf's existing data portraits already has its own bespoke palette.

---

## Round 1 revisions (v1 → v2: `christie-timeline-v2.html`)

> Updates: add the author's lifetime as the primary timeline on which the rest of the works emerge out of vertically. Don't bother with in-universe year. Add more distinct locations to the location filter. Layout the filters and the legend better — filters on the left side, legend on the right side, at top of the main canvas.

**Four changes made:**

1. **Christie's own lifetime as the spine.** Added a gold line at the top of the chart spanning 1890–1976 (her actual birth and death dates), directly modelled on the Sci-Fi repo's `Timeline` lane + `detail-timeline-connector` pattern. Every work now drops a thin dashed thread down from that spine into its protagonist's lane, so the whole chart visually "hangs" from her life rather than floating as independent lanes.
2. **In-universe year removed entirely** — the axis toggle, the year-extraction logic, and the related hint text were all deleted. X-axis is publication year only.
3. **Location filter expanded from 4 to ~20 categories** — introduced a separate `region` field (Essex, Devon & Cornwall, Oxfordshire & Cotswolds, Cheshire, Wales, Sussex, Yorkshire, Hampshire, Home Counties, France, the Balkans, Egypt, Jordan, Iraq, Iran, Greece, Spain, Morocco, Germany, Monaco & Corsica, South Africa, Caribbean, Global/Unconfirmed) used only for filtering, while marker *colour* stayed on the simpler 4-way scheme so the chart itself didn't turn into 20 colours of noise.
4. **Layout restructured** — filters moved into a wide flexible bar on the left; legend and the year-range control moved into a narrower fixed panel on the right, both positioned directly above the chart canvas (previously everything was stacked in full-width rows).

---

## Round 2 revision (v2 → v3: `christie-timeline-v3.html`)

> Go back to the previous locations list but only expand the "Elsewhere" section.

**One change made:**

- Reverted the ~20-category `region` field back down to the original broad categories (**London / UK / Europe & the Orient**) for every entry that isn't in "Elsewhere."
- Left the **Elsewhere** bucket expanded rather than collapsing it back to one catch-all tag — it now splits into **South Africa**, **Caribbean**, and **Global / Unconfirmed**, since those three are genuinely distinct rather than one diffuse "everything else."
- Net result: the location filter went from 4 → ~20 → 6 categories (London, UK, Europe & the Orient, South Africa, Caribbean, Global/Unconfirmed), landing on the middle ground the request asked for.
- Updated the in-chart hint text and code comments to describe the new 6-category scheme accurately.

---

## Summary

| File | Core change from previous |
|---|---|
| `christie-timeline.html` (v1) | Initial build: protagonist lanes, publication/in-universe year toggle, 4-way location colour, shape-by-format |
| `christie-timeline-v2.html` | Added Christie's lifetime as the spine with drop-threads; removed in-universe year; expanded location filter to ~20 regions; left-filters/right-legend layout |
| `christie-timeline-v3.html` | Collapsed the ~20-region filter back to broad categories, keeping only "Elsewhere" split into South Africa / Caribbean / Global-Unconfirmed |

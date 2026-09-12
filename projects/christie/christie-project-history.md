# Christie Project — Full Build History

A complete record of the conversation, from the first bibliography request through to the Atlas and Timeline tools, for reference alongside the delivered files.

---

## Stage 1 — The bibliography itself

**Request:** *"Can you make a list of Agatha Christie's writings?"*

**Delivered (in-chat, no file):** A categorized list of her full output — Poirot novels, Miss Marple novels, other standalone novels, short story collections, plays, and other works (memoir, autobiography, poems) — each with publication year.

---

## Stage 2 — Splitting mysteries from others, adding locations

**Request:** *"Separate the murder mysteries from others. Establish the location (multiple if applicable) of the narrative — e.g., English town of X, town of Y, Egypt, etc."*

**Delivered (in-chat):** The bibliography re-sorted into **Murder Mysteries** (Poirot novels, Marple novels, standalone mysteries) vs. **Others** (Tommy & Tuppence adventure/spy novels, the Mary Westmacott romances, plays, memoirs), each entry now paired with its in-universe setting (e.g. *Death on the Nile* → Egypt; *Evil Under the Sun* → Smugglers' Island, Devon).

---

## Stage 3 — Adding Tommy & Tuppence, Quin, and Parker Pyne; geographic categorization

**Request:** *"Do include T&T, they are part of her mainstream stories. I hope you've included the Harlequin stories involving Mr Satterthwaite... and the ones about the gentleman who hires actors to solve problems of happiness in his clients' lives?"* Followed by: split into **Non-Europe International | Europe | UK | London**; identify specific London-area locations; estimate the real-world basis for fictional UK place names (with reasoning); estimate real-world locations for the recurring "country house" settings.

**Delivered (in-chat):**
- Folded Tommy & Tuppence into the mainstream mystery list per instruction.
- Identified and added the two additional series requested: **Harley Quin / Mr Satterthwaite** (*The Mysterious Mr Quin* and related stories) and **Mr Parker Pyne** (*Parker Pyne Investigates*).
- A full geographic breakdown across the four requested buckets, including a dedicated London-locations table (Mayfair/Park Lane, Bloomsbury, Chelsea, Westminster, etc. — with reasoning for why certain plot types cluster in certain London areas).
- A table of fictional UK place-name → real-world-location estimates, each with reasoning and a confidence rating (e.g. St Mary Mead → contested between Wallingford, Oxfordshire and a Hampshire location; Market Basing → Wallingford, based on Christie's own notebooks).
- A parallel table for the recurring "country house" settings, identifying **Abney Hall, Cheshire** (her sister's home) as the real-world basis reused under many different fictional names (Styles, Chimneys, Stonygates, Rutherford Hall, Enderby Hall, Gorston Hall).

---

## Stage 4 — The comprehensive reference table

**Request:** *"Give me a table with: Book title, Book detail (protagonist, story type, book type, publication date, etc.), In-universe location, In-universe time/year-month, Closest real-world location, Reasoning, Confidence of reasoning."*

**Delivered:** `agatha-christie-location-timeline.md` — every novel individually, plus Tommy & Tuppence, Quin, and Parker Pyne as grouped entries, plus the minor short-story collections grouped at collection level.

**Follow-up request:** Same table, but add a **Notes/other fields** column, and (implicitly) push for more granularity.

**Delivered:** `agatha-christie-location-timeline-v2.md` — added the Notes column throughout, and broke the two character-driven collections (Quin, Parker Pyne) out to full story level (14 Quin stories, 12+2 Parker Pyne stories) since those had reliable individual settings. The minor anthologies (Poirot Investigates, Listerdale Mystery, Labours of Hercules, etc.) stayed grouped, flagged as candidates for further breakdown if wanted.

---

## Stage 5 — The Christie Atlas (interactive map + table webpage)

**Request:** *"Give me a web page with: a triptych map — London++ | UK++ | Middle East — that marks the locations; a filter system to filter by protagonist, book type, etc.; a table that lists the book details... A reader should be able to explore Christie's bibliography as a table vs a map at the same time. A second reading list tab that allows the user to slice and dice the data + filters + groupings."*

**Delivered (v1): `christie-atlas.html`** — three illustrative map panels (London / UK / Middle East), click-to-sync between map dots and table rows, filters that dim rather than hide non-matches, and a second "Reading List" tab with grouping (by protagonist/decade/format/type/region) and a persistent "on my list" checkbox.

**Revision 1 request:** Brainstorm better ways to show the Europe/Middle East split — options discussed included merging into one honest geographic band, going to five clean panels, adding a small world-locator inset, or a bigger zoomable redesign. You picked a combination: merge Europe + Middle East into one true geographic band, and add the zoom interaction as well.

**Delivered (v2): `christie-atlas-v2.html`** — merged "Europe & the Orient" into one west-to-east band (France/Monaco/Corsica/Germany/Mallorca/Morocco → Balkans/Greece → Egypt/Jordan/Iraq/Iran), plus a click-to-focus zoom: clicking a panel expands it large with readable labels while the other two shrink to thumbnails.

**Revision 2 request:** Fix a bug where the Protagonist filter showed nothing; fix multi-detective anthologies being stored as one combo string instead of proper tags; and make the maps geographically real rather than hand-drawn shapes.

**Delivered (v3): `christie-atlas-v3.html`** — fixed the filter bug (it was looking up a nonexistent data field), converted protagonist to a proper tag array so multi-detective collections match every relevant filter, consolidated the exploded story-type list down to ~4 real categories, and rebuilt the UK and Europe/Orient maps from real country-boundary data (fetched and simplified from a GeoJSON source), with every location's dot re-projected from its actual latitude/longitude using the same true-aspect projection as the coastlines.

---

## Stage 6 — The Christie Timeline

**Request:** *"Let's work on the simpler timeline first: similar to SciFi or Asimov, drop each Christie book on a common timeline along the X axis, with separate bands along the Y axis for each protagonist. Colour each mark based on location. Novel = squares, short stories = triangles, short story collections = circles. Filters for Protagonist, Location, Year of publication, in-universe year if enough works have that. Refer to the SciFi Golden Age repo and Asimov's repo — they're subfolders inside the Bookshelf repo."*

**Delivered (v1): `christie-timeline.html`** — pulled structural conventions from the actual `TheBookshelfOfCuriosities/scifi` and `/asimov` repo code (lane-bands per protagonist, a publishing-span bar per lane, decade gridlines, hover tooltips, sortable table). Publication-year X-axis with a toggle to a best-effort in-universe year (only 15 of 87 entries had an explicit year stated in the text; the rest fell back to publication year as an estimate).

**Revision 1 request:** Add Christie's own lifetime as the primary timeline that the works emerge from vertically; drop the in-universe year entirely; add more distinct locations to the filter; move filters to the left and the legend to the right, above the chart.

**Delivered (v2): `christie-timeline-v2.html`** — added a gold spine across the top spanning 1890–1976 (her actual lifespan), with dashed threads dropping each work down into its protagonist's lane; removed in-universe year completely; expanded the location filter from 4 to ~20 real regions (Essex, Devon & Cornwall, Cheshire, Egypt, Iraq, etc.) while keeping marker colour on the simpler 4-way scheme; restructured the layout into a left filter bar and a right-side legend/year-range panel.

**Revision 2 request:** Go back to the previous (broad) location list, but only expand the "Elsewhere" bucket.

**Delivered (v3): `christie-timeline-v3.html`** — reverted the ~20-region filter back to broad London / UK / Europe & the Orient categories, while keeping "Elsewhere" split into South Africa, Caribbean, and Global/Unconfirmed rather than one catch-all tag.

---

## All files produced, in order

| Stage | File |
|---|---|
| 4 | `agatha-christie-location-timeline.md` |
| 4 | `agatha-christie-location-timeline-v2.md` |
| 5 | `christie-atlas.html` (v1) |
| 5 | `christie-atlas-v2.html` |
| 5 | `christie-atlas-v3.html` |
| 6 | `christie-timeline.html` (v1) |
| 6 | `christie-timeline-v2.html` |
| 6 | `christie-timeline-v3.html` |

(Stages 1–3 were delivered directly in conversation, not as standalone files.)

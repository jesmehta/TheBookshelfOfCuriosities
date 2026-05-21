# Science Fiction Reading Timeline

Static webpage package.

## Open

Double-click `index.html`.

The current dataset is embedded in `data.js`, so the page does not need a local server for preview.

## Editable data

Editable TSV copies are in the `data/` folder:

- `authors.tsv`
- `works.tsv`
- `magazines.tsv`
- `editors.tsv`

For the current preview, `data.js` is the file actually read by the page.

## Notes

The `type_path` field describes publication/object format, not genre. Examples:

- `Novel`
- `Novel/Series`
- `Novel/Series/Trilogy`
- `Novel/Fix-up`
- `Novella`
- `Short story`
- `Collection`
- `Collection/Anthology`
- `Nonfiction`
- `Nonfiction/Biography`
- `Nonfiction/Popular science`
- `Poetry/Collection`
- `Media/Film`
- `Media/Radio`

## v3 notes

- The author detail mini timeline labels points with work titles, not years.
- The UI uses “Series” for grouping; works without a series display as “Standalone”.
- Type filtering is hierarchical: selecting `Novel` includes `Novel/Series`, `Novel/Fix-up`, and other Novel subtypes.
- A dot colour legend is shown above the author timeline.

## v6 notes

- Added `list_source` to works to distinguish the original reading list from later user additions.
- Expanded Isaac Asimov’s extended Foundation universe with Robot / Spacer, Empire, and Foundation titles.
- The author timeline now sorts author rows by earliest visible listed work rather than author birth year, so works with unknown author dates can still appear chronologically.
- Left-side labels are now right-aligned so connector lines meet the label edge cleanly.

## v7 notes

- Added author sort options: author birthdate, first listed publication, and a special birthdate sort that places Meccania by its 1918 publication date.
- Added dot/shape legends to the global timeline.
- Birth and death events now use different shapes from book/work dots.
- Magazine/editor band labels are placed after the coloured run with a background label chip, so the text remains readable.
- Author detail opens inline under the author timeline area and scrolls into view when an author is clicked.

## v8 notes

- Removed the separate Meccania sort mode.
- Meccania / Owen Gregory is now handled as a fixed exception in the normal author sorting logic: if the author has no birth date, the row is placed by Meccania's 1918 publication date.
- Author sort now only has two user-facing choices: author birthdate and first listed publication.

## v9 notes

- Author sort removes 2 options and sorts by author birthdate, and when missing author birthdate (eg. Meccania) then only that author sorts by first publication date as compared to other authors first publication date; the public control remains clean.
- In Author birthdate mode, authors with known birth years are sorted by birth year.
- If an author birth year is missing, the internal fallback is that author's earliest included publication year.
- The UI still shows only two sort modes: Author birthdate and First listed publication.

## v10 notes

- Author timeline no longer uses birth/death shapes; those are used only on the Global timeline.
- Added optional magazine context overlay on the Author timeline.
- Global timeline magazine bands now include editor tenures aligned underneath magazine lifetimes.
- Global timeline also adds editor start and exit events.
- Unknown-author ordering uses known-author birth order as the spine, then inserts unknown-date authors by earliest included publication year.

## v11 notes

- Fixed author click/detail panel not opening after v10 changes.
- Author detail now renders only in the inline detail slot to avoid duplicate mini-timeline IDs.

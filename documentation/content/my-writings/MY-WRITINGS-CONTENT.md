# My Writings — content reference

This is a **content** doc, not a technical one — there is no bespoke code
behind `docs/my-writings/` (it's plain Markdown rendered by the same
MkDocs Material build as the rest of the site). What's documented here is
the editorial material itself: what the three collections are, where the
source material came from, how it was converted from Word/PDF documents
into pages, and the conventions that govern how these pages may be edited
going forward. Companion file:
[`conversation-my-writings-content.md`](conversation-my-writings-content.md)
— the actual back-and-forth that produced the decisions below, quoting the
user directly throughout (this session ran without a context compaction,
so nothing here is paraphrased from a summary).

Lives under `documentation/content/` alongside
[`favorite-poems/FAVORITE-POEMS-CONTENT.md`](../favorite-poems/FAVORITE-POEMS-CONTENT.md)
— the umbrella for editorial/content work on this site, kept separate from
the per-feature technical docs elsewhere in `documentation/`
(`bookshelf-editor/`, `landing-page-notes/`) which cover code and site
mechanics instead. This is the second content initiative; `favorite-poems/`
was built first, in a separate, now-finished session — see that doc's own
Todo section for the handoff note that flagged this one as still owed.

## What this is

My own writing, as distinct from [Favourite
Poetry](../favorite-poems/FAVORITE-POEMS-CONTENT.md) (poems by other
poets I keep returning to). Built from the user's own document archive
under `convert/My writings/` — two design-school essays, one short story,
and three original poems.

## The three collections

| Collection | Path | Nav entry | Count |
|---|---|---|---|
| My Essays | `docs/my-writings/essays/` | "My Essays" (nested under "My Writings") | 2 essays |
| Miscellany | `docs/my-writings/miscellany/` | "Miscellany" (nested under "My Writings") | 1 short story |
| My Poems | `docs/my-writings/poems/` | "My Poems" (nested under "My Writings") | 3 poems |

`docs/my-writings/index.md` is the hub page for the section (also its nav
group's clickable index page, via the `section-index` MkDocs plugin — see
`documentation/landing-page-notes/LANDING-PAGE-NOTES.md` bug #8). Unlike
Favourite Poetry's hub (which only links out to its three collection
indexes), this hub lists every individual entry directly under its
subheading — an explicit correction, since each collection is short enough
that the extra click to a sub-index wasn't earning its keep: *"Since there
are very few entries presently under each heading, ... I would very much
like them to be directly linked from the my writings page as well under
the 3 subheadings."* The three collection-level index pages (`essays/index.md`,
`miscellany/index.md`, `poems/index.md`) are kept and maintained too, for
when any of the three grows past the point a flat list on the hub still
reads well.

**My Essays** (`essays/`) is design-school coursework: *A History of
Design* (2011, written for PG-II Product Design, presented to Prof.
Deepankar Bhattacharyya) and *Graphic Novels: An Underrated Medium* (2012,
a PG-III colloquium paper, MITID).

**Miscellany** (`miscellany/`) holds *Elevator Pitch* (2019), a short
flash-fiction piece — not a business pitch, despite the title; it's about
office elevators. Originally scoped as "Fiction," renamed after direct
correction: *"we had decided that the third category was Misc - Use
Miscellany - not My Fiction, since there is literally one short story."*

**My Poems** (`poems/`) holds *The Flu* (2023) and two pieces from a March
2023 poetry workshop with Rochelle Potkar, *Chopped Papaya* and *Choices*.
Same byline/line-break page convention as Favourite Poetry (see that doc),
plus a composition-date line — see "Editorial conventions" below.

## Source material

Everything originated in `convert/My writings/`:

| File | Became |
|---|---|
| `A history of Design/A History of design.docx` | `essays/a-history-of-design.md` |
| `Colloquium/Colloquium final.docx` | `essays/graphic-novels-an-underrated-medium.md` |
| `Elevator Pitch - Jesal Mehta.pdf` (and its companion `.txt`, used instead once the user pointed to it — text verified identical) | `miscellany/elevator-pitch.md` |
| `Poetry/The Flu.docx` | `poems/the-flu.md` |
| `Poetry/Poetry workshop with Rochelle Potkar.docx` (two poems in one file) | `poems/chopped-papaya.md`, `poems/choices.md` |

Not converted or published — see "Held back: Colloquium's images/slides"
below:

| File | Status |
|---|---|
| `Colloquium/Colloq.pptx` (22 slides) | Held back |
| `Colloquium/colloq images/` (comic-panel scans used as slide illustrations) | Held back |

## The content pipeline (docx/PDF → Markdown)

Unlike Favourite Poetry's custom tokenizing extractor (built and then lost
when its scratch working directory was cleaned up — see that doc's own
pipeline section), this pipeline is simple, still exists, and needs no
bespoke tooling to repeat:

1. **Pandoc**, already installed on the machine
   (`C:\Users\Jesal\AppData\Local\Pandoc\pandoc.exe`), converts each
   `.docx` straight to GitHub-flavored Markdown:
   `pandoc -f docx -t gfm --wrap=preserve <in>.docx -o <out>.md`. This was
   a deliberate upgrade partway through the session — an initial preview
   used a hand-rolled `document.xml` tag-strip (regex-stripping XML tags)
   to scope the work before committing to a conversion approach, and it
   visibly mangled curly quotes/em-dashes into `�` and dropped all
   italic/bold/superscript formatting. Pandoc preserves all of that
   correctly, including converting Word's superscript footnote markers
   into proper `<sup>` tags (then hand-converted to Markdown `[^1]`
   footnote syntax — see below).
2. Prose (the two essays, the short story) needed only light hand-cleanup
   after pandoc: stripping Word's auto-generated Table of Contents and
   `PAGEREF`/anchor field-code cruft from the Colloquium doc (redundant
   anyway — MkDocs Material's own `toc: permalink: true` renders a sidebar
   TOC), and demoting heading levels so each essay has exactly one `<h1>`.
3. Poems needed the opposite adjustment from prose: pandoc converts each
   Word paragraph (including each single line of verse, since these
   source documents used a hard line-break per line rather than one
   paragraph per line) into its own Markdown paragraph, which loses the
   tight within-stanza line grouping poetry needs. Each poem was
   hand-reformatted into the same convention Favourite Poetry uses —
   trailing double-space at the end of each verse line (renders as
   `<br>`), blank line between stanzas — by comparing against a plain-text
   extraction of the same source file for a byte-for-byte line check.
4. The PDF-only piece (*Elevator Pitch*) was read directly (this tool can
   read PDF text) rather than converted; once the user pointed out a
   companion `.txt` file existed with the same content, that was used
   as the copy-source instead (verified identical to the PDF's extracted
   text first).

No custom code was written for this pipeline — it's pandoc plus manual
editing, so there's nothing to "rebuild" the way Favourite Poetry's lost
extractor would need to be. Re-running it for a correction or a new
addition is just: re-run the one `pandoc` command, re-apply the same
hand-cleanup steps described above.

## Editorial conventions (apply these to any future edit)

- **Byline + date format.** Poems/fiction: `*Jesal Mehta, 2023*` (name and
  year on one italic line). Essays: two italic lines — `*Jesal Mehta —
  PG-II, Product Design, 2011*` (or PG-III/MITID for the Colloquium essay)
  then `*Presented to Prof. Deepankar Bhattacharyya*` / `*Presented at
  Colloquium*`.
- **Dates come from source-file metadata, not filesystem timestamps.**
  Every `.docx`'s `docProps/core.xml` (`dcterms:created`) and the PDF's
  `/CreationDate` were read directly and used as the composition date —
  filesystem `mtime` on these files only reflects when they were last
  copied/touched (both essays showed an identical 2017-05-28 filesystem
  date despite being written five years apart in 2011 and 2012, per their
  actual embedded creation timestamps) and would have been actively
  wrong. The user independently confirmed the two essay years from memory
  before the metadata check ran, and the metadata matched exactly.
- **Footnotes use real Markdown syntax.** `A History of Design`'s four
  citation markers became `[^1]`–`[^4]`, defined at the file's end, rather
  than kept as pandoc's raw `<sup>1</sup>` output — `markdown_extensions:
  extra` (already enabled in `mkdocs.yml`) bundles Python-Markdown's
  `footnotes` extension, so this needed no config change, just using the
  syntax already available.
- **Ordinal-suffix superscripts were flattened.** Pandoc renders Word's
  autocorrected ordinals (`2<sup>nd</sup> century`) literally; these
  aren't citations, just Word typography, so they were flattened to plain
  text (`2nd century`) rather than kept as scattered inline HTML.
- **`convert/` stays untracked**, same treatment as Favourite Poetry's
  `convert/Favourite poetry/` — source `.docx`/`.pdf` files never reach
  the deployed site or git history, only the converted Markdown does.

### Held back: Colloquium's images/slides

`Colloq.pptx` and `colloq images/` (scanned panels from copyrighted comics
— Watchmen, Death Note, Persepolis, and others — used as presentation
illustrations for the Graphic Novels essay) were explicitly not converted
or published, per direct instruction: *"hold on to the ppt and images,
we'll discuss that later."* Only the essay's own text is on the site.
Since `convert/` is untracked anyway, neither file has left the local
machine — nothing to undo if the eventual decision is "never publish
these," and nothing blocking if it's "publish some as fair-use
illustration."

### Nav structure: nested, not flat

Both this section and Favourite Poetry's three collections initially
landed as flat top-level `mkdocs.yml` nav entries (matching how Favourite
Poetry's three entries already looked at the time). Corrected twice:

1. My Writings' three children (Essays/Miscellany/Poems) were nested under
   one "My Writings" group, mirroring the existing "Interactive Projects"
   nested-nav pattern already in `mkdocs.yml` — *"I meant for all 3 to be
   subheadings under My Writings."*
2. Once nested, the sidebar showed "My Writings" nested under itself (the
   section header's first unlabeled child inherits that page's own title).
   Fixed by adding the `mkdocs-section-index` plugin rather than
   restructuring the nav further — see
   `documentation/landing-page-notes/LANDING-PAGE-NOTES.md` bug #8 for the
   mechanism, and the plugin needed installing into *two* separate local
   Python environments on this machine (`mkdocs` on `PATH` resolved to a
   different install than `py -3`) before `mkdocs build`/`serve` picked it
   up.
3. Once noticed, Favourite Poetry's three entries got the identical
   nested-group treatment retroactively, under a new "Favourite Poetry"
   parent (the title of `docs/favorite-poems/index.md`) — they'd been left
   flat purely because My Writings was added alongside them before this
   nesting pattern existed, not by original design.

## Changelog

- **2026-09-06, `98155ef`** — "Add My Writings section (essays, fiction,
  poems)". Initial build: two essays via pandoc, one short story, three
  poems (originally under a "My Fiction" nav label). Colloquium's
  pptx/images held back from the start.
- **2026-09-06, `6293165`** — "My Writings: rename Fiction to Miscellany,
  add dates, list entries on hub". Fiction → Miscellany rename
  (`git mv`); composition dates added from source-file metadata; hub page
  changed from linking only the three collection indexes to listing every
  entry directly.
- **2026-09-06, `e438ec6`** — "Nest My Writings' three subsections under
  one nav group". Flat top-level nav entries → nested group.
- **2026-09-06, `7e5c1f3`** — "Add mkdocs-section-index plugin, fix
  duplicate My Writings sidebar entry". Installed into both local Python
  environments; added to `requirements.txt`/`mkdocs.yml`.
- **2026-09-06, `2366de5`** — "Nest the three Favourite Poetry sections
  under one nav group". Retroactive fix applying the same nesting to the
  sibling Favourite Poetry section once the inconsistency was noticed.

## Todo / watch-out-for

- **Colloquium images/pptx decision** — deferred by direct instruction,
  see "Held back" above. Revisit when asked; options range from never
  publishing them to republishing a curated few as fair-use
  criticism/commentary illustrations.
- **`convert/My writings/` is still in the repo** (untracked), holding the
  original source files — same situation as `convert/Favourite poetry/`,
  see that doc's own Todo for the backup-before-deleting caveat. Nothing
  here has been asked to be deleted.
- **Cabinet-side linking** — per Favourite Poetry's own Todo, item 7 (
  adding/updating `cabinet-entries.tsv` rows in the Cabinet repo) waits
  until "everything is stable," explicitly including this section. Not
  started.
- **Markdown-lint warnings** (MD036 emphasis-as-heading, on the italic
  byline/date lines under each title) surface via IDE diagnostics on
  every page in this section — cosmetic only, doesn't affect MkDocs
  Material rendering, matches the same known-not-actioned warnings on
  Favourite Poetry's pages.

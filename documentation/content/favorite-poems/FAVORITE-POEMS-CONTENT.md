# Favourite Poetry — content reference

This is a **content** doc, not a technical one — there is no bespoke code
behind `docs/favorite-poems/` (it's plain Markdown rendered by the same
MkDocs Material build as the rest of the site). What's documented here is
the editorial material itself: what the three collections are, where the
source material came from, how it was converted from Word documents into
per-poem pages, and the conventions that govern how these pages may be
edited going forward. Companion file:
[`conversation-favorite-poems-content.md`](conversation-favorite-poems-content.md)
— the actual back-and-forth that produced the decisions below, in the
user's own words where it matters.

Lives under `documentation/content/` — the umbrella for editorial/content
work on this site (what got written and why), kept separate from the
per-feature technical docs elsewhere in `documentation/` (`bookshelf-editor/`,
`landing-page-notes/`) which cover code and site mechanics instead. Each
distinct content initiative gets its own subfolder here as it comes up
(this one, `favorite-poems/`, is the first); there's no shared top-level
doc for `documentation/content/` itself yet — add one if a second
subfolder's arrival calls for a real index rather than just another
folder.

## What this is

A personal poetry archive split into three collections, built from the
user's own document archive (workshop notes, a self-compiled bound
anthology, standalone favourite-poem files) rather than from any external
poetry database. Every poem's text comes from the user's own source
documents; only the `poetry.com` links pointing *away* from each poem were
independently sourced.

## The three collections

| Collection | Path | Nav entry | Count |
|---|---|---|---|
| Favourite Poems | `docs/favorite-poems/general/` | "Favourite Poems" | 33 poems |
| Long Poems | `docs/favorite-poems/long-poems/` | "Long Poems" | 7 poems |
| British Poetry Workshop | `docs/favorite-poems/workshop/` | "British Poetry Workshop" | 113 poems, 38 poets |

(Counts verified 2026-09-06 by listing `docs/favorite-poems/*/**.md`,
excluding each collection's own `index.md`.)

A fourth file, `docs/favorite-poems/index.md`, is a hub page linking to all
three — written in the user's own words, not in `mkdocs.yml`'s nav (each
collection's index is a direct top-level nav entry instead; see
`mkdocs.yml`'s `Favourite Poems` / `Long Poems` / `British Poetry Workshop`
rows). Per-poem subpages are deliberately excluded from the nav — only the
three collection indexes are linked from the site chrome, matching the
user's explicit correction: *"yes, I meant only the index, not all of
them."*

**Favourite Poems** (`general/`) is the personal anthology — poems the user
actually keeps coming back to. Its index (`general/index.md`) is split into
two groups by a `<br>`, both written and maintained in the user's own
prose; new entries are appended as bare bullets at the end of the second
group only, never touching the user's existing lines.

**Long Poems** (`long-poems/`) is the "discovered, want to read sometime"
bucket — split out from Favourite Poems specifically because these seven
(`Sohrab and Rustum`, `Rabbi Ben Ezra`, `The Pied Piper of Hamelin`, `The
Rime of the Ancient Mariner`, `The Waste Land`, both 1832 and 1842
`Lady of Shalott` texts) are long-form pieces the user wants to have read,
not favourites in the same sense as the shorter poems. `Ulysses` and `The
Lotos-eaters` stayed in Favourite Poems despite their length, by explicit
user instruction (*"Call them Long Poems - but keep Lotus eaters, Ulysses
in favourites"*) — length alone isn't the sorting key, personal attachment
is. `long-poems/index.md` is a bare title list with no prose at all, per
the no-invented-prose rule below.

**British Poetry Workshop** (`workshop/`) is an archive of a real course:
poems read for a British Poetry workshop at the India Study Center, May
2021, with Dr. Sridhar Rajeshwaran, Dr. Nilufer Bharucha, and Dr. Preeti
Shirodkar. Organized poet-by-poet (`## PoetName` headings) from Chaucer
through the opening of Eliot's *The Waste Land*, matching the order the
user's own source document — a bound anthology the user compiled,
laid out in folios, and had printed after the workshop ended — already
used.

## Source material

Everything originated in `Convert/Favourite poetry/` (still present in the
repo at time of writing — see Todo below):

| File | Became |
|---|---|
| `British Poetry v2.0.docx` | Bulk of the Workshop collection (107 of 113 poems), Heading1=poet / Heading2=poem structure |
| `British Poetry - addendum.docx` | 6 more Workshop poems, no paragraph styles at all — extracted by hardcoded paragraph-index ranges |
| `British Poetry syllabus.docx` | Not published directly — used to verify which poems were actually taught vs. bonus additions the user's own v2.0 compilation included |
| `Poetry to print.docx` | Bulk of Favourite Poems (the "true favourites" bucket) |
| `Poetry - Long verses.docx` | Bulk of Long Poems |
| `British Poetry - Sohrab and Rustum.docx`, `Ode - Shaughnessy.docx`, `The Rime of the Ancient Mariner.docx`, `The Waste Land.docx`, `Ulysses.docx` | Standalone long-poem/favourite files, each extracted individually |

## The content pipeline (docx → Markdown)

**This pipeline no longer exists on disk.** It was built as a set of
scratch Node.js scripts in a temp working directory
(`claude_poetry_txt/scripts/`, outside the repo), and that directory has
since been cleaned up by the OS. What follows is a description of how it
worked, reconstructed from the session record — if the source documents
ever need re-processing (a new addendum, a correction that needs
re-extraction), this pipeline would need to be rebuilt from scratch rather
than resumed. Consider committing a rebuilt version into `tools/` if that
becomes recurring work, so it isn't lost a second time.

Pandoc's default docx→Markdown conversion was tried first and rejected: it
converts one Word paragraph to one Markdown paragraph, which silently
merges manual line breaks (`<w:br/>`) within a paragraph into run-together
text — unacceptable for poetry, where line and stanza breaks are the
content. The custom pipeline instead:

1. Unzipped `word/document.xml` directly and regex-parsed `<w:p>`
   (paragraph) blocks, resolving hyperlinks via `word/_rels/document.xml.rels`.
2. Tokenized each paragraph's runs (`<w:t>`, `<w:br/>`, `<w:tab/>`) in
   document order, splitting one Word paragraph into multiple output
   "lines" wherever a manual line break occurred — the fix for the
   pandoc problem above.
3. Detected bold/italic/highlight run formatting and merged adjacent runs
   with identical formatting before wrapping in Markdown emphasis syntax,
   to avoid broken/mismatched `*`/`**` sequences at formatting-run
   boundaries.
4. Used a plain-text (link-stripped) version of each heading specifically
   for slug/folder-name generation, keeping the link-preserving version for
   the rendered heading itself — poet headings linked to
   poetryfoundation.org were otherwise polluting folder names with the
   entire URL.
5. Ran per-source-file build scripts on top of the shared extractor —
   one for the Heading1/Heading2 workshop structure, one for the
   unstructured addendum (hardcoded paragraph ranges), one for the
   Favourite Poems file (a boundary-detection function that walked
   author-block gaps), one for Long Verses (Heading2/Heading3 pairs), and
   a generic positional extractor (title / author / body by paragraph
   position) for the standalone single-poem files.

Bugs caught and fixed during this build (full detail in the conversation
log): dropped manual line breaks (the pandoc problem, initially reproduced
in the custom parser too, until fixed); slug pollution from embedded poet
links; broken emphasis markup at run boundaries; a misattributed poem
("A Soldier" filed under Herrick, corrected to Suckling per the syllabus);
a stray empty poet heading; a trailing colophon paragraph glued onto the
end of *The Waste Land*; and a genuine duplicate block inside the source
`Ulysses.docx` itself (not a parsing bug — the source document repeated its
three highlighted excerpts a second time after the poem's real ending).

## Editorial conventions (apply these to any future edit)

- **No invented prose.** Standing instruction, given directly: *"Refrain
  from adding your own text prose to pages. It has to be my voice and my
  words."* Content pages get only the user's own exact wording, or bare
  structural Markdown (links, headings, bullet lists) — never descriptive
  or narrative sentences written on the user's behalf. `long-poems/index.md`
  is the clearest example: a bare title list, nothing else.
- **Re-read before editing.** The user substantially rewrote several
  index/hub pages after their initial draft (*"Note that I have changed
  most of the on-page text that you started off with."*) — always read a
  page's current on-disk content immediately before editing it, never
  assume a prior turn's version still stands.
- **Cross-link convention** for poems appearing in more than one
  collection: a single bare Markdown link (no narrative sentence), placed
  as the first line after the italic author line, pointing at the poem's
  other appearance. On collection index pages, the annotation is
  `-- also a [favourite poem](...)` or `-- also read in the
  [workshop](...)`, appended to the existing bullet line rather than a new
  line.
- **Addendum footnote convention**: poems found while compiling the
  workshop set but not part of the original taught syllabus get a bare
  `\*` marker on their bullet line, resolved by one shared footnote at the
  very bottom of `workshop/index.md` (`---` then `\* I discovered these
  while compiling the main set.`) — plain-asterisk style, not formal
  `[^1]` footnote syntax, per the user's literal phrasing.
- **Syllabus is the source of truth for "taught vs. bonus."** When a poem
  in `British Poetry v2.0.docx` was flagged as possibly not actually
  covered in the workshop, the syllabus document (not the compiled
  anthology) was checked directly. Result: `Ozymandias` and `Kubla Khan`
  were genuinely taught and kept cross-linked in both collections;
  `Cologne`, `Daffodils`, `The World Is Too Much With Us`, and `Auguries of
  Innocence` were the v2.0-compiler's own bonus additions, never actually
  taught, and were dropped from the workshop collection entirely
  (general-favourites-only).
- **`poetry.com` sourcing**: every link was found via `WebSearch` scoped to
  the `poetry.com` domain, never guessed or constructed from a URL
  pattern. Where the specific poem wasn't catalogued, a poet-page link was
  used instead, clearly distinguishable in context. Where the poet has no
  presence on the site at all (James Wright), the link was omitted rather
  than pointing somewhere approximate.
- **Public-domain sourcing for text not already in the user's own
  documents**: used only where the poet's death date or publication date
  puts the work unambiguously in the public domain (verified per-poem, not
  assumed) — see the conversation log for the specific cases (Kipling,
  Byron, Wallace Stevens) and the workarounds needed when an automated
  content-safety layer refused to reproduce clearly public-domain text.

## Changelog

- **2026-09-05, `6a64d63`** — "Add Favourite Poetry section (workshop +
  general collections)". Initial two-collection build: 107 workshop poems
  from `British Poetry v2.0.docx` plus the standalone/Poetry-to-print
  favourites, cross-linked where they overlapped (Ulysses, Kubla Khan,
  Ozymandias, The Waste Land Part I).
- **2026-09-05/06, `9c665a0`** — "Add addendum poems, fix text/nav issues,
  split Long Poems, add more favourites". The 6 addendum poems folded into
  their poets' existing workshop folders with the asterisk/footnote
  convention; `Litany` and `Daffodils` text corrections; the Hamzanama
  `"#"` nav placeholder removed (unrelated pre-existing `mkdocs build
  --strict` breakage, fixed opportunistically); nav flattened to three
  direct top-level entries instead of one hub-page entry; narrative
  cross-link prose stripped down to bare links; the Long Poems collection
  split out of Favourite Poems (7 poems moved via `git mv`); 9 more
  favourite poems added (`If—`, `The Buddha at Kamakura`, `Inversnaid`,
  `Thirteen Ways of Looking at a Blackbird`, `Epitaph to a Dog`,
  `Leisure`, `Song, from Pippa Passes`, `A Budget of Paradoxes`, plus two
  poems cross-linked in from the workshop set).

## Todo / watch-out-for

- **Personal notes on poems** (deferred) — the user will flag specific
  poems for a personal note "as we go"; none have been written yet. No
  mechanism/placement has been designed for these — decide format when the
  first one is actually requested rather than guessing now.
- **Cabinet-side linking** (explicitly deferred) — direct instruction: *"6
  + 8 will be tackled next, and once everything is stable, 7 can be
  done."* Item 7 is adding/updating `cabinet-entries.tsv` rows in the
  Cabinet repo pointing at these Bookshelf pages, following the existing
  `scifi`/`asimov`/`christie` entry pattern. Do not start this until the
  user confirms "everything" (including My Writings, below) is stable.
- **The extraction pipeline is gone** (see above) — if any source docx
  needs re-processing, budget time to rebuild the tokenizing extractor
  from scratch; this doc plus the conversation log are the only surviving
  spec for how it worked.
- **`Convert/Favourite poetry/` is still in the repo**, holding the
  original `.docx` source files. The user's stated intent is to delete
  this folder once its content is fully processed — it is (all files
  listed above have been extracted) — but since the extraction scripts
  themselves are already gone, these `.docx` files are now the *only*
  remaining copy of the original source material. Confirm the user has
  their own backup before deleting, or hold off deleting until asked.
- **Markdown-lint warnings** (MD001 heading-increment, MD033 inline-HTML
  for `<mark>` tags in `Ulysses`, MD036 emphasis-as-heading, MD010
  hard-tabs) surface via IDE diagnostics on many poem pages. Cosmetic
  only — doesn't affect MkDocs Material rendering — and hasn't been asked
  to be fixed. Known, not actioned.
- **A parallel "My Writings" section already exists** (`docs/my-writings/`,
  commit `98155ef`, "Add My Writings section (essays, fiction, poems)") —
  built in a separate session that ran concurrently with (and finished
  just after) the work this doc covers, **not** part of the conversation
  this doc/its companion log record. It answers items 6+8 from the punch
  list above, but wasn't planned or reviewed in this thread. It deserves
  its own content-reference doc when picked up/verified, out of scope
  here. Its own source folder, `Convert/My writings/`, is also still
  present and unprocessed-vs-deleted by that other session's own account.
  **Resolved 2026-09-06** — see
  [`../my-writings/MY-WRITINGS-CONTENT.md`](../my-writings/MY-WRITINGS-CONTENT.md).
  That same later session also retroactively nested this section's own
  three nav entries (previously flat) under one "Favourite Poetry" group,
  matching the pattern it introduced for My Writings.

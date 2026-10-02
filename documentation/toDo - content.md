# ToDo — Content

Bookshelf's content and project tracking: what is on the landing page, what
is hidden, what every card/chip/ticker term means, and what happens next.
Created 2026-10-02 (Bookshelf `4662557`), taking over the detailed Bookshelf
sections that used to live in Cabinet's `toDo - content.md`.

**How the three levels fit together**

- **Cabinet's `toDo - content.md` / `toDo - website.md`** — the single
  scannable point of contact across all worlds. Bookshelf gets one short
  cluster there, each line pointing back here.
- **This file + `toDo - website.md`** — the detail for Bookshelf.
- **Each project's own docs** (`projects/*/documentation/`) — fine-tuning and
  future work that does not block launch. Not duplicated here; the registry
  just points at them.

**Registry rule:** every section, card, dataviz chip, ticker term and band
word on the landing page has a row below saying what it means and where it
came from. Anything whose origin or meaning is unknown is marked
**Unexplained** — confirm or remove it rather than leaving it to cause
confusion later. Most of the landing page's original wording came from the
static mock-up `___CabinetWorlds/BookshelfLanding/bookshelf-of-curiosities.html`
(V4.0, 2026-06-28) and was never separately explained.

**Status vocabulary:** live (`true`, clickable) · WIP (`wip`, visible but
dormant) · hidden (`false`, kept as a roadmap row) · idea (no TSV row yet).
WIP cards are kept for things close to done — a reminder and a promise, not
padding. Aim for well under a quarter of the page as WIP; not a hard limit
while there are only a few live cards.

## Sections

Source: `content/bookshelf-sections.tsv`.

| Section | Status | Visible cards | Notes |
|---|---|---|---|
| Author Explorations | live | Golden Age SF, Asimov, Christie (live) · Clarke (WIP) | |
| Empire, Adventure & The Great Game | hidden (2026-10-02) | — | Kipling hidden; Hamzanama moved to Book Data. Its Empire text band is now invisible too (see website todo). |
| Comics & Sequential Art | hidden | — | Comic Book History and Indrajal rows hidden with it. Cabinet's graphic-novels essay could seed it. |
| Book Data & Visualisation | live | My Reading Journey, Hamzanama (both WIP) | Kept on with only WIP cards: both are near-term. Has the "Books as Data" feature block. |
| Poetry | live (new 2026-10-02) | Favourite Poetry | Other people's poetry; the anthology + British Poetry Workshop archive. |
| Writings on Reading | hidden | — | Reserved for writing *about reading*. The authored writings that moved to Cabinet were on design, not reading, which is why they left. Has the (disabled) "private rituals of reading" band. |

## Cards

Source: `content/bookshelf-entries.tsv`.

| Card | Section | Status | What it is | What exists | Next |
|---|---|---|---|---|---|
| Golden Age Science Fiction | Author Explorations | live | Genre hub: author/global timelines, reading list, publications & editors | `projects/scifi/` | Publication pass — see `projects/scifi/documentation/ToDo.md`. |
| Isaac Asimov | Author Explorations | live | Foundation galaxy, in-universe timeline, publication × in-universe time | `projects/asimov/` | See `projects/asimov/documentation/Readme_4_todo_decisions.md`. |
| Agatha Christie | Author Explorations | live | Geography of murder — map/timeline of story settings | `projects/christie/` (`/christie/`) | Editorial review of approximate fictional-location positions. Merged with the former Geography of Murder card (`022dda1`). |
| Arthur C. Clarke | Author Explorations | WIP | Author page parallel to Asimov ("the poet of deep time") | Nothing yet | Near-term (2026-10-02). |
| My Reading Journey | Book Data & Visualisation | WIP | (1) Goodreads history as dataviz — year-by-year and combined; (2) book purchases over the last few years — gathering the data as well as visualising it | Nothing yet | Near-term (2026-10-02). Replaced the "Authors vs Books" card (`4662557`). |
| Mapping the Hamzanama | Book Data & Visualisation | WIP | Map of the Hamzanama's folios, stories, and the dispersal of the manuscript | Nothing yet | Near-term (2026-10-02). |
| Favourite Poetry | Poetry | live | Personal anthology, long poems, British Poetry Workshop archive | `docs/favorite-poems/` (MkDocs nav) | Collection-level framing and navigation — discoverability, not more poems. |
| Kipling, Kim & The Great Game | Empire… (hidden) | hidden | Essays/maps on the Raj, the Frontier, Kim | Nothing yet | Research-heavy. Unhide with its section when ready. |
| A Brief History of Comic Books | Comics (hidden) | hidden (WIP in TSV) | Pulp → Silver Age history | Related essay in Cabinet Writings | Pick one comics pilot before turning the section on. |
| Indrajal Comics | Comics (hidden) | hidden (WIP in TSV) | Catalogue/nostalgia for the Indrajal run | Nothing yet | Same as above. |

**Removed cards** (2026-10-02, `022dda1` / `4662557`) — recorded so they
don't come back by accident:

- *Geography of Murder* — duplicate of the Christie card.
- *Foundation Universe* ("10,000 years of Galactic history, laid flat") —
  the Asimov page already has the in-universe timeline and Foundation galaxy.
- *More Authors* ("Heinlein, Dick, Bradbury, Le Guin") — covered by the
  Golden Age SF hub.
- *Authors vs Books* ("Output, genre, influence — the shape of a writing
  life") — a placeholder from the original mock-up with no notes behind it;
  its slot became My Reading Journey. The name returns as an idea, with a
  real meaning — see *Ideas* below.
- *My Writings* — moved to Cabinet Writings (`117a2cc`).

## Ideas (no card yet)

| Idea | What it is | Notes |
|---|---|---|
| Authors vs Books — bibliography explorations | One page per favourite author whose bibliography is complex: novels, short stories, anthologies/collections, non-fiction, and other work — a quick, easy reference to what exists and how it fits together. | Added 2026-10-02. Not the mock-up's "shape of a writing life" placeholder. Could be a series (one page per author) and could share data with the author pages (Asimov already curates a bibliography). |

## Feature-block wording

Source: `content/bookshelf-blocks.tsv` (Admin Dash → Blocks tab) since
2026-10-02. This records what each piece of wording refers to.

**Ticker** (marquee above the first section):

| Term | Refers to | Status |
|---|---|---|
| Golden Age Sci-Fi, Isaac Asimov, Agatha Christie | live cards | OK |
| Arthur C. Clarke, Hamzanama | WIP cards | OK |
| Indrajal Comics, Comic Book History, Rudyard Kipling, The Great Game | hidden cards | Stale while hidden |
| Foundation Universe | removed card | **Stale — remove** |
| Story Maps | **Unexplained** — not in the mock-up; appeared with the V4 data split | Confirm or remove |
| Marginalia | From the mock-up; perhaps the Writings on Reading idea | **Unexplained** — confirm or remove |
| *(missing)* Favourite Poetry / Poetry, My Reading Journey | live/WIP cards | Consider adding |

**Text band** (big outline word "Empire" + topics Kipling, Kim, The Great
Game, The Himalayas, The Raj): belongs to the hidden Empire section and is
currently invisible. "The Himalayas" is not in the mock-up — **Unexplained**.

**Quote break**: Victor Hugo, *Les Misérables* — "A library implies an act of
faith…", behind-word READING. From the mock-up. Currently shown above Book
Data & Visualisation.

**"Books as Data" dataviz block** chips:

| Chip | Refers to | Status |
|---|---|---|
| Foundation Universe Timeline | removed card (covered by the Asimov page) | **Stale** — retarget to Asimov or remove |
| Christie Murder Map | the live Christie page | Duplicates a live card; OK as a teaser or remove |
| Authors vs Books | removed placeholder | **Stale — remove** |
| Sci-Fi Publication Graph | **Unexplained** (from the mock-up) — maybe the Golden Age SF publications view | Confirm or remove |
| Reading Geography | **Unexplained** (from the mock-up) | Confirm or remove |
| *(missing)* My Reading Journey, Mapping the Hamzanama | WIP cards | Consider adding |

**Writings band** ("On the pleasures, peculiarities & private rituals of
reading" / "Personal essays, dispatches, and occasional marginalia",
disabled): belongs to the hidden Writings on Reading section; fits its
future purpose, so keep as-is.

**Hero description** (`docs/index.html`): "…on science fiction, detective
fiction, empire, adventure, and the strange pleasure of books about books."
Mentions empire/adventure (hidden section) and not poetry — review alongside
the blocks.

## Content order

- [x] Favourite Poetry card live (`1880cc9`).
- [x] Duplicate cards merged/removed (`022dda1`).
- [x] Poetry section added; Empire hidden; Hamzanama moved to Book Data;
  Authors vs Books → My Reading Journey (`4662557`).
- [ ] Bring two of Clarke / My Reading Journey / Hamzanama to live.
- [ ] Resolve every **Unexplained** and **Stale** row in *Feature-block
  wording* above.
- [ ] **Ticker check** — whenever a card is added, hidden, removed or goes
  live, review the ticker words (entered by hand, not generated from cards)
  so they don't advertise hidden or removed work, and add terms for new
  cards.
- [ ] Review the Christie map's approximate/placeholder fictional-location
  positions in its next editorial pass.
- [ ] Asimov and Golden Age SF project passes — tracked in their own
  `projects/*/documentation/` todos.
- [ ] Favourite Poetry: collection-level framing and navigation.
- [ ] Later: graphic-novels essay (in Cabinet) gets more images; it can seed
  the Comics section, which stays non-priority until then.

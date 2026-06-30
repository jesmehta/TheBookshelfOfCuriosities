/*
  Single source of truth for the V4.0 landing page. bookshelf-gallery.js
  reads everything here and renders it — no card data and no content
  strings belong in bookshelf-gallery.js or index.md.

  Every top-level feature block (ticker, text band, quote break, dataviz,
  writings) has an `enabled` flag — set it to `false` to remove that
  block from the page entirely without deleting its content. Each
  section in `bookshelfSections` instead carries `status` (`true`/
  `false`, the shared cross-world field — see WORLD-SYSTEMS.md), same
  effect: `status: false` removes the section from the page entirely.
*/

// Scrolling marquee band, just above the first section. Edit `items` to
// change what scrolls; the renderer doubles the list automatically for a
// seamless loop, so you don't need to repeat entries yourself.
const bookshelfTicker = {
  enabled: true,
  items: [
    "Golden Age Sci-Fi",
    "Isaac Asimov",
    "Arthur C. Clarke",
    "Agatha Christie",
    "Indrajal Comics",
    "Foundation Universe",
    "Rudyard Kipling",
    "The Great Game",
    "Hamzanama",
    "Comic Book History",
    "Story Maps",
    "Marginalia"
  ]
};

// Full-bleed horizontal break: one big ghost-outline word plus a row of
// related topic terms. `beforeSection` pins it immediately above the
// named section — matched against a section's stable `id` in
// bookshelfSections below, not its display `title` (display titles
// change; ids shouldn't — see WORLD-SYSTEMS.md's "order-based
// rendering" for why this was a brittleness worth fixing).
//    EMPIRE and section ii

const bookshelfTextBand = {
  enabled: true,
  beforeSection: "empire-adventure-great-game",
  word: "Empire",
  topics: ["Kipling", "Kim", "The Great Game", "The Himalayas", "The Raj"]
};

// Centered pull-quote with a large ghost-outline word behind it as
// texture. Same `beforeSection` placement mechanism (matched against a
// section id) as the text band.
//    Quote

const bookshelfQuoteBreak = {
  enabled: true,
  beforeSection: "book-data-visualisation",
  bgWord: "READING",
  quote: "A library implies an act of faith which generations still in darkness hallow to those <em>who walk among the stars.</em>",
  attribution: "Victor Hugo · Les Misérables"
};

// Wide feature block introducing the "Book Data & Visualisation" section,
// rendered before that section's own card grid (see `feature: "dataviz"`
// on the matching entry in bookshelfSections below).
const bookshelfDataviz = {
  enabled: true,
  kicker: "Interactive · Data Portraits",
  title: "Books<br>as Data",
  desc: "Timelines, geographies, networks — when books become datasets, patterns emerge that pure reading misses.",
  chips: [
    "Foundation Universe Timeline",
    "Christie Murder Map",
    "Authors vs Books",
    "Sci-Fi Publication Graph",
    "Reading Geography"
  ]
};

// Single wide dormant band introducing the "Writings on Reading" section,
// rendered instead of a card grid (see `feature: "writings"` below).
const bookshelfWritings = {
  enabled: false,
  big: "On the pleasures,<br>peculiarities &amp;<br>private rituals of reading",
  sub: "Personal essays, dispatches, and occasional marginalia.",
  chip: "In preparation"
};

// Sections render in `order` (section numbering i, ii, iii… follows
// sorted order automatically — see bookshelf-gallery.js). Each card:
// `live:true` + a real `href` makes it a clickable, full-color card with
// a "Live ↗" badge; `live:false` (href can stay "" or "#") makes it a
// dormant placeholder — hatched overlay, no pointer events, a
// "soon-chip" instead of the live badge. `span` is one of
// c4/c5/c6/c7/c8/c12 (12-column grid).
//
// `id`/`title`/`order`/`status` on sections, and `subtitle`/`order`/
// `status`/`primarySection` on cards, match the shared cross-world
// schema documented in WORLD-SYSTEMS.md (added 2026-06-30; `name`
// renamed to `title`, `enabled` replaced outright by `status` on
// sections; `subtitle`/`order`/`status`/`primarySection` added
// alongside the existing `desc`/`live` on cards — `desc`/`live` are
// still what the renderer actually reads, the new fields are additive
// for cross-world consistency, not a behavior change). `status` on a
// card is derived from `live` (`true` -> `true`, `false` -> `"wip"`,
// since a dormant card still renders, just muted — there's currently no
// card-level fully-hidden state, only section-level).
const bookshelfSections = [
  {
    id: "author-explorations",
    title: "Author Explorations",
    order: 10,
    status: true,
    cards: [
      {
        id: "scifi",
        cat: "Section Hub · Anthology",
        title: "Golden Age<br>Science Fiction",
        subtitle: "The writers who imagined tomorrows we now partly inhabit — rockets, robots, galaxies, and the anxiety of minds too large for their bodies.",
        titleVariant: "inst",
        desc: "The writers who imagined tomorrows we now partly inhabit — rockets, robots, galaxies, and the anxiety of minds too large for their bodies.",
        tag: "Essays · Overviews · Data",
        href: "https://bookshelf.cabinetofcuriosities.in/scifi/",
        live: true,
        status: true,
        order: 10,
        primarySection: "author-explorations",
        ghost: "G",
        span: "c7"
      },
      {
        id: "asimov",
        cat: "Author · Sci-Fi",
        title: "Isaac Asimov",
        subtitle: "Foundation, Robots, and the Grand Unification — one man's attempt to write all of science fiction.",
        desc: "Foundation, Robots, and the Grand Unification — one man's attempt to write all of science fiction.",
        tag: "Author Page",
        href: "https://bookshelf.cabinetofcuriosities.in/asimov/",
        live: true,
        status: true,
        order: 20,
        primarySection: "author-explorations",
        ghost: "A",
        span: "c5"
      },
      {
        id: "clarke",
        cat: "Author · Sci-Fi",
        title: "Arthur C.<br>Clarke",
        subtitle: "The poet of deep time.",
        desc: "The poet of deep time.",
        tag: "Author Page",
        href: "",
        live: false,
        status: "wip",
        order: 30,
        primarySection: "author-explorations",
        ghost: "C",
        span: "c4"
      },
      {
        id: "christie",
        cat: "Author · Crime",
        title: "Agatha<br>Christie",
        subtitle: "The geography of murder.",
        desc: "The geography of murder.",
        tag: "Author Page · Map",
        href: "",
        live: false,
        status: "wip",
        order: 40,
        primarySection: "author-explorations",
        ghost: "Ch",
        span: "c4"
      },
      {
        id: "more-authors",
        cat: "Expanding",
        title: "More<br>Authors",
        subtitle: "Heinlein, Dick, Bradbury, Le Guin.",
        desc: "Heinlein, Dick, Bradbury, Le Guin.",
        tag: "Forthcoming",
        href: "",
        live: false,
        status: "wip",
        order: 50,
        primarySection: "author-explorations",
        ghost: "…",
        span: "c4"
      }
    ]
  },
  {
    id: "empire-adventure-great-game",
    title: "Empire, Adventure & The Great Game",
    order: 20,
    status: false,
    cards: [
      {
        id: "kipling",
        cat: "Author · Cluster",
        title: "Kipling, Kim &amp;<br>The Great Game",
        subtitle: "The Raj, the North-West Frontier, intelligence, identity — and the boy who belonged everywhere and nowhere.",
        desc: "The Raj, the North-West Frontier, intelligence, identity — and the boy who belonged everywhere and nowhere.",
        tag: "Essays · Maps · Context",
        href: "",
        live: false,
        status: "wip",
        order: 10,
        primarySection: "empire-adventure-great-game",
        ghost: "K",
        span: "c5"
      },
      {
        id: "hamzanama",
        cat: "Project · Mapping",
        title: "The Hamzanama<br>Mapping Project",
        subtitle: "Adventures of Hamza — the Mughal manuscript that kept a thousand illustrators busy. Tracing the folios, the stories, the migrations of a scattered book.",
        titleVariant: "inst",
        desc: "Adventures of Hamza — the Mughal manuscript that kept a thousand illustrators busy. Tracing the folios, the stories, the migrations of a scattered book.",
        tag: "Interactive Map · Research",
        href: "",
        live: false,
        status: "wip",
        order: 20,
        primarySection: "empire-adventure-great-game",
        ghost: "H",
        span: "c7"
      }
    ]
  },
  {
    id: "comics-sequential-art",
    title: "Comics & Sequential Art",
    order: 30,
    status: false,
    cards: [
      {
        id: "comic-book-history",
        cat: "History · Medium",
        title: "Comic Book<br>History",
        subtitle: "From pulp origins to the Silver Age — how a disreputable medium became the century's mythology.",
        desc: "From pulp origins to the Silver Age — how a disreputable medium became the century's mythology.",
        tag: "Essays · Timeline",
        href: "",
        live: false,
        status: "wip",
        order: 10,
        primarySection: "comics-sequential-art",
        ghost: "CB",
        span: "c6"
      },
      {
        id: "indrajal-comics",
        cat: "India · Nostalgia",
        title: "Indrajal<br>Comics",
        subtitle: "Phantom, Mandrake, Flash Gordon — the Hindustan Times' curious gift to Indian childhood.",
        desc: "Phantom, Mandrake, Flash Gordon — the Hindustan Times' curious gift to Indian childhood.",
        tag: "History · Catalogue",
        href: "",
        live: false,
        status: "wip",
        order: 20,
        primarySection: "comics-sequential-art",
        ghost: "IJ",
        span: "c6"
      }
    ]
  },
  {
    id: "book-data-visualisation",
    title: "Book Data & Visualisation",
    order: 40,
    status: true,
    feature: "dataviz",
    cards: [
      {
        id: "foundation-universe",
        cat: "Timeline · Dataviz",
        title: "Foundation<br>Universe",
        subtitle: "10,000 years of Galactic history, laid flat.",
        desc: "10,000 years of Galactic history, laid flat.",
        tag: "Interactive",
        href: "",
        live: false,
        status: "wip",
        order: 10,
        primarySection: "book-data-visualisation",
        ghost: "",
        span: "c4"
      },
      {
        id: "geography-of-murder",
        cat: "Map · Christie",
        title: "Geography<br>of Murder",
        subtitle: "Where Poirot and Marple solved their cases.",
        desc: "Where Poirot and Marple solved their cases.",
        tag: "Interactive Map",
        href: "agatha/",
        live: true,
        status: true,
        order: 20,
        primarySection: "book-data-visualisation",
        ghost: "",
        span: "c4"
      },
      {
        id: "authors-vs-books",
        cat: "Network · Authors",
        title: "Authors<br>vs Books",
        subtitle: "Output, genre, influence — the shape of a writing life.",
        desc: "Output, genre, influence — the shape of a writing life.",
        tag: "Dataviz",
        href: "",
        live: false,
        status: "wip",
        order: 30,
        primarySection: "book-data-visualisation",
        ghost: "",
        span: "c4"
      }
    ]
  },
  {
    id: "writings-on-reading",
    title: "Writings on Reading",
    order: 50,
    status: false,
    feature: "writings",
    cards: []
  }
];

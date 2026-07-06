/*
  Single source of truth for the V4.0 landing page. bookshelf-gallery.js
  reads everything here and renders it — no entry data and no content
  strings belong in bookshelf-gallery.js or index.md.

  Every top-level feature block (ticker, text band, quote break, dataviz,
  writings) has an `enabled` flag — set it to `false` to remove that
  block from the page entirely without deleting its content. Each
  section in `bookshelfSections` instead carries `status` (`true`/
  `false`, the shared cross-world field — see WORLD-SYSTEMS.md), same
  effect: `status: false` removes the section from the page entirely.

  Normalized schema: `bookshelfSections` contains only section/container
  metadata (`id`, `title`, `order`, `status`, optional `feature`);
  `bookshelfEntries` contains the rendered entry/card metadata. Entry
  `status` is explicit: `true` = live/active, `"wip"` = visible dormant
  styling, `false` = hidden. Do not derive it from a legacy `live` flag.
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

// Sections render in `order` (section numbering i, ii, iii... follows
// sorted order automatically; see bookshelf-gallery.js). Entries render
// within their matching `section` by `order`. `status: true` creates the
// same live clickable card as before; `status: "wip"` creates the same
// dormant placeholder card; `status: false` hides the entry entirely.
const bookshelfSections = [
  {
    id: "author-explorations",
    title: "Author Explorations",
    order: 10,
    status: true
  },
  {
    id: "empire-adventure-great-game",
    title: "Empire, Adventure & The Great Game",
    order: 20,
    status: true
  },
  {
    id: "comics-sequential-art",
    title: "Comics & Sequential Art",
    order: 30,
    status: false
  },
  {
    id: "book-data-visualisation",
    title: "Book Data & Visualisation",
    order: 40,
    status: true,
    feature: "dataviz"
  },
  {
    id: "writings-on-reading",
    title: "Writings on Reading",
    order: 50,
    status: false,
    feature: "writings"
  }
];

const bookshelfEntries = [
  {
    id: "scifi",
    title: "Golden Age<br>Science Fiction",
    subtitle: "The writers who imagined tomorrows we now partly inhabit — rockets, robots, galaxies, and the anxiety of minds too large for their bodies.",
    href: "https://bookshelf.cabinetofcuriosities.in/scifi/",
    section: "author-explorations",
    kind: "section-hub",
    kicker: "Section Hub · Anthology",
    displayTag: "Essays · Overviews · Data",
    tags: ["science-fiction", "golden-age", "authors", "anthology", "data"],
    location: "internal-html",
    status: true,
    order: 10,
    ghost: "G",
    span: "c7",
    titleVariant: "inst"
  },
  {
    id: "asimov",
    title: "Isaac Asimov",
    subtitle: "Foundation, Robots, and the Grand Unification — one man's attempt to write all of science fiction.",
    href: "https://bookshelf.cabinetofcuriosities.in/asimov/",
    section: "author-explorations",
    kind: "author-page",
    kicker: "Author · Sci-Fi",
    displayTag: "Author Page",
    tags: ["science-fiction", "author", "asimov", "foundation", "robots"],
    location: "internal-html",
    status: true,
    order: 20,
    ghost: "A",
    span: "c5"
  },
  {
    id: "clarke",
    title: "Arthur C.<br>Clarke",
    subtitle: "The poet of deep time.",
    href: "",
    section: "author-explorations",
    kind: "author-page",
    kicker: "Author · Sci-Fi",
    displayTag: "Author Page",
    tags: ["science-fiction", "author", "clarke", "deep-time"],
    location: "internal-html",
    status: "wip",
    order: 30,
    ghost: "C",
    span: "c4"
  },
  {
    id: "christie",
    title: "Agatha<br>Christie",
    subtitle: "The geography of murder.",
    href: "",
    section: "author-explorations",
    kind: "author-page",
    kicker: "Author · Crime",
    displayTag: "Author Page · Map",
    tags: ["crime", "author", "christie", "map"],
    location: "internal-md",
    status: "wip",
    order: 40,
    ghost: "Ch",
    span: "c4"
  },
  {
    id: "more-authors",
    title: "More<br>Authors",
    subtitle: "Heinlein, Dick, Bradbury, Le Guin.",
    href: "",
    section: "author-explorations",
    kind: "collection",
    kicker: "Expanding",
    displayTag: "Forthcoming",
    tags: ["authors", "science-fiction", "roadmap"],
    location: "internal-md",
    status: "wip",
    order: 50,
    ghost: "…",
    span: "c4"
  },
  {
    id: "kipling",
    title: "Kipling, Kim &amp;<br>The Great Game",
    subtitle: "The Raj, the North-West Frontier, intelligence, identity — and the boy who belonged everywhere and nowhere.",
    href: "",
    section: "empire-adventure-great-game",
    kind: "author-cluster",
    kicker: "Author · Cluster",
    displayTag: "Essays · Maps · Context",
    tags: ["kipling", "kim", "great-game", "empire", "maps"],
    location: "internal-md",
    status: "wip",
    order: 10,
    ghost: "K",
    span: "c5"
  },
  {
    id: "hamzanama",
    title: "The Hamzanama<br>Mapping Project",
    subtitle: "Adventures of Hamza — the Mughal manuscript that kept a thousand illustrators busy. Tracing the folios, the stories, the migrations of a scattered book.",
    href: "",
    section: "empire-adventure-great-game",
    kind: "mapping-project",
    kicker: "Project · Mapping",
    displayTag: "Interactive Map · Research",
    tags: ["hamzanama", "mughal", "manuscript", "mapping", "research"],
    location: "internal-html",
    status: "wip",
    order: 20,
    ghost: "H",
    span: "c7",
    titleVariant: "inst"
  },
  {
    id: "comic-book-history",
    title: "Comic Book<br>History",
    subtitle: "From pulp origins to the Silver Age — how a disreputable medium became the century's mythology.",
    href: "",
    section: "comics-sequential-art",
    kind: "history",
    kicker: "History · Medium",
    displayTag: "Essays · Timeline",
    tags: ["comics", "history", "pulp", "silver-age", "timeline"],
    location: "internal-md",
    status: "wip",
    order: 10,
    ghost: "CB",
    span: "c6"
  },
  {
    id: "indrajal-comics",
    title: "Indrajal<br>Comics",
    subtitle: "Phantom, Mandrake, Flash Gordon — the Hindustan Times' curious gift to Indian childhood.",
    href: "",
    section: "comics-sequential-art",
    kind: "catalogue",
    kicker: "India · Nostalgia",
    displayTag: "History · Catalogue",
    tags: ["comics", "indrajal", "india", "nostalgia", "catalogue"],
    location: "internal-md",
    status: "wip",
    order: 20,
    ghost: "IJ",
    span: "c6"
  },
  {
    id: "foundation-universe",
    title: "Foundation<br>Universe",
    subtitle: "10,000 years of Galactic history, laid flat.",
    href: "",
    section: "book-data-visualisation",
    kind: "timeline",
    kicker: "Timeline · Dataviz",
    displayTag: "Interactive",
    tags: ["foundation", "asimov", "timeline", "dataviz"],
    location: "internal-html",
    status: "wip",
    order: 10,
    ghost: "",
    span: "c4"
  },
  {
    id: "geography-of-murder",
    title: "Geography<br>of Murder",
    subtitle: "Where Poirot and Marple solved their cases.",
    href: "agatha/",
    section: "book-data-visualisation",
    kind: "map",
    kicker: "Map · Christie",
    displayTag: "Interactive Map",
    tags: ["christie", "crime", "map", "dataviz", "geography"],
    location: "internal-md",
    status: true,
    order: 20,
    ghost: "",
    span: "c4"
  },
  {
    id: "authors-vs-books",
    title: "Authors<br>vs Books",
    subtitle: "Output, genre, influence — the shape of a writing life.",
    href: "",
    section: "book-data-visualisation",
    kind: "network",
    kicker: "Network · Authors",
    displayTag: "Dataviz",
    tags: ["authors", "books", "network", "dataviz", "influence"],
    location: "internal-html",
    status: "wip",
    order: 30,
    ghost: "",
    span: "c4"
  }
];

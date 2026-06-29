/*
  Single source of truth for the V4.0 landing page. bookshelf-gallery.js
  reads everything here and renders it — no card data and no content
  strings belong in bookshelf-gallery.js or index.md.

  Every top-level block (ticker, text band, quote break, dataviz,
  writings, and each individual section) has an `enabled` flag. Set it to
  `false` to remove that block/section from the page entirely without
  deleting its content — nothing else needs to change.
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
// named section (must match a `name` in bookshelfSections exactly).
//    EMPIRE and section ii

const bookshelfTextBand = {
  enabled: true,
  beforeSection: "Empire, Adventure & The Great Game",
  word: "Empire",
  topics: ["Kipling", "Kim", "The Great Game", "The Himalayas", "The Raj"]
};

// Centered pull-quote with a large ghost-outline word behind it as
// texture. Same `beforeSection` placement mechanism as the text band.
//    Quote

const bookshelfQuoteBreak = {
  enabled: true,
  beforeSection: "Book Data & Visualisation",
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

// Sections render in array order (section numbering i, ii, iii… follows
// this order automatically). Each card: `live:true` + a real `href` makes
// it a clickable, full-color card with a "Live ↗" badge; `live:false`
// (href can stay "" or "#") makes it a dormant placeholder — hatched
// overlay, no pointer events, a "soon-chip" instead of the live badge.
// `span` is one of c4/c5/c6/c7/c8/c12 (12-column grid).
const bookshelfSections = [
  {
    name: "Author Explorations",
    enabled: true,
    cards: [
      {
        id: "scifi",
        cat: "Section Hub · Anthology",
        title: "Golden Age<br>Science Fiction",
        titleVariant: "inst",
        desc: "The writers who imagined tomorrows we now partly inhabit — rockets, robots, galaxies, and the anxiety of minds too large for their bodies.",
        tag: "Essays · Overviews · Data",
        href: "https://bookshelf.cabinetofcuriosities.in/scifi/",
        live: true,
        ghost: "G",
        span: "c7"
      },
      {
        id: "asimov",
        cat: "Author · Sci-Fi",
        title: "Isaac Asimov",
        desc: "Foundation, Robots, and the Grand Unification — one man's attempt to write all of science fiction.",
        tag: "Author Page",
        href: "https://bookshelf.cabinetofcuriosities.in/asimov/",
        live: true,
        ghost: "A",
        span: "c5"
      },
      {
        id: "clarke",
        cat: "Author · Sci-Fi",
        title: "Arthur C.<br>Clarke",
        desc: "The poet of deep time.",
        tag: "Author Page",
        href: "",
        live: false,
        ghost: "C",
        span: "c4"
      },
      {
        id: "christie",
        cat: "Author · Crime",
        title: "Agatha<br>Christie",
        desc: "The geography of murder.",
        tag: "Author Page · Map",
        href: "",
        live: false,
        ghost: "Ch",
        span: "c4"
      },
      {
        id: "more-authors",
        cat: "Expanding",
        title: "More<br>Authors",
        desc: "Heinlein, Dick, Bradbury, Le Guin.",
        tag: "Forthcoming",
        href: "",
        live: false,
        ghost: "…",
        span: "c4"
      }
    ]
  },
  {
    name: "Empire, Adventure & The Great Game",
    enabled: false,
    cards: [
      {
        id: "kipling",
        cat: "Author · Cluster",
        title: "Kipling, Kim &amp;<br>The Great Game",
        desc: "The Raj, the North-West Frontier, intelligence, identity — and the boy who belonged everywhere and nowhere.",
        tag: "Essays · Maps · Context",
        href: "",
        live: false,
        ghost: "K",
        span: "c5"
      },
      {
        id: "hamzanama",
        cat: "Project · Mapping",
        title: "The Hamzanama<br>Mapping Project",
        titleVariant: "inst",
        desc: "Adventures of Hamza — the Mughal manuscript that kept a thousand illustrators busy. Tracing the folios, the stories, the migrations of a scattered book.",
        tag: "Interactive Map · Research",
        href: "",
        live: false,
        ghost: "H",
        span: "c7"
      }
    ]
  },
  {
    name: "Comics & Sequential Art",
    enabled: false,
    cards: [
      {
        id: "comic-book-history",
        cat: "History · Medium",
        title: "Comic Book<br>History",
        desc: "From pulp origins to the Silver Age — how a disreputable medium became the century's mythology.",
        tag: "Essays · Timeline",
        href: "",
        live: false,
        ghost: "CB",
        span: "c6"
      },
      {
        id: "indrajal-comics",
        cat: "India · Nostalgia",
        title: "Indrajal<br>Comics",
        desc: "Phantom, Mandrake, Flash Gordon — the Hindustan Times' curious gift to Indian childhood.",
        tag: "History · Catalogue",
        href: "",
        live: false,
        ghost: "IJ",
        span: "c6"
      }
    ]
  },
  {
    name: "Book Data & Visualisation",
    enabled: true,
    feature: "dataviz",
    cards: [
      {
        id: "foundation-universe",
        cat: "Timeline · Dataviz",
        title: "Foundation<br>Universe",
        desc: "10,000 years of Galactic history, laid flat.",
        tag: "Interactive",
        href: "",
        live: false,
        ghost: "",
        span: "c4"
      },
      {
        id: "geography-of-murder",
        cat: "Map · Christie",
        title: "Geography<br>of Murder",
        desc: "Where Poirot and Marple solved their cases.",
        tag: "Interactive Map",
        href: "/agatha/",
        live: true,
        ghost: "",
        span: "c4"
      },
      {
        id: "authors-vs-books",
        cat: "Network · Authors",
        title: "Authors<br>vs Books",
        desc: "Output, genre, influence — the shape of a writing life.",
        tag: "Dataviz",
        href: "",
        live: false,
        ghost: "",
        span: "c4"
      }
    ]
  },
  {
    name: "Writings on Reading",
    enabled: false,
    feature: "writings",
    cards: []
  }
];

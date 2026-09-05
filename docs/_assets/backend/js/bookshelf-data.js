/*
  Hand-edited display/config blocks for the V4.0 landing page.
  Spreadsheet-friendly section and entry data lives in content/*.tsv and
  is generated into bookshelf-generated-content.js.

  Every top-level feature block (ticker, text band, quote break, dataviz,
  writings) has an `enabled` flag — set it to `false` to remove that
  block from the page entirely without deleting its content.
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
// named section — matched against a generated section's stable `id`, not
// its display `title`.
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
// on the matching generated section).
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
// rendered instead of a card grid (see `feature: "writings"` in generated
// sections).
const bookshelfWritings = {
  enabled: false,
  big: "On the pleasures,<br>peculiarities &amp;<br>private rituals of reading",
  sub: "Personal essays, dispatches, and occasional marginalia.",
  chip: "In preparation"
};

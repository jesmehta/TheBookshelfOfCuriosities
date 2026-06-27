const bookshelfProjects = [
  {
    id: "scifi",
    title: "The Golden Age of SciFi",
    subtitle: "Authors, magazines, books, and timelines from early science fiction.",
    link: "https://bookshelf.cabinetofcuriosities.in/scifi/",
    thumbnail: "images/scifi.jpg",
    alt: "Science fiction themed thumbnail for The Golden Age of SciFi",
    order: 1,
    weight: 10,
    label: "Timeline · Archive",
    tags: ["timeline", "dataviz", "archive"],
    frameMood: "pulp-cosmic"
  },
  {
    id: "asimov",
    title: "Isaac Asimov and the Foundation Series",
    subtitle: "A galaxy map, in-universe chronology, and bibliography timeline.",
    // Not yet live at the expected URL — set inactive until the asimov
    // project actually exists and is deployed (see docs/README.md V3 notes).
    link: "#",
    thumbnail: "images/asimov.jpg",
    alt: "Cosmic archive themed thumbnail for Isaac Asimov and Foundation",
    order: 2,
    weight: 8,
    label: "Cosmic Bibliography",
    tags: ["map", "timeline", "bibliography", "dataviz"],
    frameMood: "cosmic-archive"
  },
  {
    id: "hamzanama",
    title: "Mapping the Hamzanama",
    subtitle: "A work-in-progress literary map of journeys, episodes, places, and storytelling geographies.",
    link: "#",
    thumbnail: "images/hamzanama.jpg",
    alt: "Illustrated manuscript themed thumbnail for Mapping the Hamzanama",
    order: 3,
    weight: 6,
    label: "Literary Geography",
    tags: ["map", "literary-geography", "wip"],
    frameMood: "illuminated-manuscript"
  },

  // --- Dummy entries below: kept deliberately (trimmed from 5 to 3), now
  // doing double duty as a live demo of the typographic-fallback card
  // (no `thumbnail` field) alongside the photographic ones, instead of
  // being generic load-testing filler. See docs/README.md V3 notes.
  {
    id: "dummy-cartography",
    title: "Cartography of Nowhere",
    subtitle: "Placeholder exhibit — typographic card, low weight.",
    link: "#",
    alt: "Placeholder exhibit",
    order: 4,
    weight: 1,
    label: "Map · Conjecture",
    tags: ["map"],
    frameMood: "map-room"
  },
  {
    id: "dummy-bibliographic-drift",
    title: "Bibliographic Drift",
    subtitle: "Placeholder exhibit — typographic card, high weight.",
    link: "#",
    alt: "Placeholder exhibit",
    order: 5,
    weight: 10,
    label: "Archive · Bibliography",
    tags: ["bibliography", "archive"],
    frameMood: "paperback"
  },
  {
    id: "dummy-marginalia",
    title: "Marginalia and Ghosts",
    subtitle: "Placeholder exhibit — typographic card, mid weight.",
    link: "#",
    alt: "Placeholder exhibit",
    order: 6,
    weight: 4,
    label: "Essay · Marginalia",
    tags: ["essay"],
    frameMood: "cosmic-archive"
  }
];

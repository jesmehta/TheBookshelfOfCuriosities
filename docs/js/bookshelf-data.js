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
    tag: ["timeline", "dataviz", "archive"],
    frameMood: "pulp-cosmic"
  },
  {
    id: "asimov",
    title: "Isaac Asimov and the Foundation Series",
    subtitle: "A galaxy map, in-universe chronology, and bibliography timeline.",
    link: "https://bookshelf.cabinetofcuriosities.in/asimov/",
    thumbnail: "images/asimov.jpg",
    alt: "Cosmic archive themed thumbnail for Isaac Asimov and Foundation",
    order: 2,
    weight: 8,
    tag: ["map", "timeline", "bibliography", "dataviz"],
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
    tag: ["map", "literary-geography", "wip"],
    frameMood: "illuminated-manuscript"
  },

  // --- Dummy entries below: visual load-testing only, not real exhibits.
  // Remove once enough real projects exist to judge the wall by themselves.
  {
    id: "dummy-cartography",
    title: "Cartography of Nowhere",
    subtitle: "Placeholder exhibit for testing a low-weight, small frame.",
    link: "#",
    thumbnail: "images/scifi.jpg",
    alt: "Placeholder thumbnail",
    order: 4,
    weight: 1,
    tag: ["map"],
    frameMood: "map-room"
  },
  {
    id: "dummy-bibliographic-drift",
    title: "Bibliographic Drift",
    subtitle: "Placeholder exhibit for testing a high-weight, large frame.",
    link: "#",
    thumbnail: "images/asimov.jpg",
    alt: "Placeholder thumbnail",
    order: 5,
    weight: 10,
    tag: ["bibliography", "archive"],
    frameMood: "paperback"
  },
  {
    id: "dummy-marginalia",
    title: "Marginalia and Ghosts",
    subtitle: "Placeholder exhibit for testing a mid-weight portrait frame.",
    link: "#",
    thumbnail: "images/hamzanama.jpg",
    alt: "Placeholder thumbnail",
    order: 6,
    weight: 4,
    tag: ["essay"],
    frameMood: "cosmic-archive"
  },
  {
    id: "dummy-lost-libraries",
    title: "Index of Lost Libraries",
    subtitle: "Placeholder exhibit for testing a mid-high-weight landscape frame.",
    link: "#",
    thumbnail: "images/scifi.jpg",
    alt: "Placeholder thumbnail",
    order: 7,
    weight: 8,
    tag: ["archive", "dataviz"],
    frameMood: "pulp-cosmic"
  },
  {
    id: "dummy-night-margins",
    title: "The Night Margins",
    subtitle: "Placeholder exhibit for testing a small landscape frame.",
    link: "#",
    thumbnail: "images/asimov.jpg",
    alt: "Placeholder thumbnail",
    order: 8,
    weight: 2,
    tag: ["wip"],
    frameMood: "illuminated-manuscript"
  }
];
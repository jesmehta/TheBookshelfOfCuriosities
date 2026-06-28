/*
  Scroll-reveal: elements carrying class `.reveal` start hidden/offset
  (see `.reveal` / `.reveal.vis` in bookshelf.css) and fade/slide into
  place the first time they enter the viewport. Generic page behavior,
  independent of what bookshelf-gallery.js rendered — so it runs after
  gallery.js on DOMContentLoaded (script tag order in index.md matters:
  this file's tag must come after bookshelf-gallery.js's, so the section/
  card markup already exists in the DOM by the time this queries for
  `.reveal` elements).
*/
document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add("vis");
      });
    },
    { threshold: 0.07 }
  );

  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
});

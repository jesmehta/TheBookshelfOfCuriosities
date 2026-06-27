function createTagChips(tags) {
  if (!Array.isArray(tags)) return "";

  return tags
    .map(tag => `<span class="bookshelf-chip">${tag}</span>`)
    .join("");
}

function createThumbnail(project) {
  return `
    <img
      src="${project.thumbnail}"
      alt="${project.alt || project.title}"
      class="bookshelf-thumbnail"
      loading="lazy"
    >
  `;
}

/*
  Typographic fallback: a project with no `thumbnail` gets a large
  stroked initial instead of an <img>, reusing the same
  .bookshelf-image-wrap box (random aspect ratio + weight-based area
  scaling apply identically either way, since that box doesn't care what's
  inside it). Lets a project go on the wall before real art exists.
*/
function createThumbnailContent(project) {
  if (project.thumbnail) return createThumbnail(project);

  const initial = (project.label || project.title || "?").trim().charAt(0).toUpperCase();
  return `<span class="bookshelf-ghost-initial" aria-hidden="true">${initial}</span>`;
}

/*
  Frame shape: start from a square (1) and add/subtract one delta in a
  single step. Landscape (positive delta) is favoured over portrait
  (negative delta) so the wall reads mostly wide frames with the
  occasional tall one, like a hand-hung gallery rather than a uniform grid.
*/
function randomFrameRatio() {
  const isLandscape = Math.random() < 0.7;
  const delta = isLandscape
    ? 0.18 + Math.random() * 0.32 // 1.18 – 1.50
    : -(0.05 + Math.random() * 0.2); // 0.75 – 0.95
  return (1 + delta).toFixed(2);
}

/*
  Frame size within its grid cell, by AREA not width: weight 10 is the
  biggest visual area (fills the cell at aspect 1), weight 1 is about a
  quarter of that area but stays clearly visible. Mapping weight to width
  alone makes portrait frames look bigger than landscape ones at the same
  weight, since area = width^2 / aspect — a portrait (aspect < 1) gets
  taller for the same width. Solving width = areaScale * sqrt(aspect)
  keeps width^2/aspect == areaScale^2 for any aspect, so equal weight
  really does mean equal area. Exposed as a CSS custom property so both
  the frame width and its spotlight glow (bookshelf.css,
  .bookshelf-card-inner::before) scale together.
*/
function frameWidthFraction(weight, aspect) {
  const w = Math.min(10, Math.max(1, Number(weight) || 1));
  const minAreaScale = 0.5;
  const maxAreaScale = 1;
  const areaScale = minAreaScale + ((w - 1) / 9) * (maxAreaScale - minAreaScale);
  const width = areaScale * Math.sqrt(aspect);
  return Math.min(1, Math.max(0.32, width)).toFixed(2);
}

function createGalleryCard(project) {
  const isInactive = !project.link || project.link === "#";
  const linkTarget = isInactive ? "#" : project.link;
  const inactiveClass = isInactive ? "is-inactive" : "";
  const frameClass = project.frameMood ? `frame-${project.frameMood}` : "frame-default";
  const aspect = Number(randomFrameRatio());
  const frameScale = frameWidthFraction(project.weight, aspect);

  return `
    <a
      class="bookshelf-card ${frameClass} ${inactiveClass}"
      href="${linkTarget}"
      ${isInactive ? 'aria-disabled="true" tabindex="-1"' : ""}
    >
      <article class="bookshelf-card-inner" style="--frame-scale: ${frameScale}">
        <div class="bookshelf-frame">
          <div class="bookshelf-image-wrap" style="aspect-ratio: ${aspect}">
            ${createThumbnailContent(project)}
          </div>
        </div>

        <div class="bookshelf-label">
          <p class="bookshelf-tag">${project.label || ""}</p>
          <h2>${project.title}</h2>
          <p>${project.subtitle}</p>

          <div class="bookshelf-chips">
            ${createTagChips(project.tags)}
          </div>

          ${isInactive ? '<span class="bookshelf-status">Not yet on view</span>' : ""}
        </div>
      </article>
    </a>
  `;
}

function renderBookshelfGallery() {
  const gallery = document.getElementById("bookshelf-gallery");

  if (!gallery || !Array.isArray(bookshelfProjects)) return;

  const sortedProjects = [...bookshelfProjects].sort((a, b) => {
    return a.order - b.order;
  });

  gallery.innerHTML = sortedProjects.map(createGalleryCard).join("");
}

document.addEventListener("DOMContentLoaded", renderBookshelfGallery);

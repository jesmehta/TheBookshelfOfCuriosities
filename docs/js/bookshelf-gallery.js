function createContentChips(types) {
  if (!Array.isArray(types)) return "";

  return types
    .map(type => `<span class="bookshelf-chip">${type}</span>`)
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

function createGalleryCard(project) {
  const isInactive = !project.link || project.link === "#";
  const linkTarget = isInactive ? "#" : project.link;
  const inactiveClass = isInactive ? "is-inactive" : "";
  const frameClass = project.frameMood ? `frame-${project.frameMood}` : "frame-default";

  return `
    <a
      class="bookshelf-card ${frameClass} ${inactiveClass}"
      href="${linkTarget}"
      ${isInactive ? 'aria-disabled="true" tabindex="-1"' : ""}
    >
      <article class="bookshelf-card-inner">
        <div class="bookshelf-frame">
          <div class="bookshelf-image-wrap">
            ${createThumbnail(project)}
          </div>
        </div>

        <div class="bookshelf-label">
          <h2>${project.title}</h2>
          <p>${project.subtitle}</p>

          <div class="bookshelf-chips">
            ${createContentChips(project.contentType)}
          </div>

          ${isInactive ? '<span class="bookshelf-status">Not live yet</span>' : ""}
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
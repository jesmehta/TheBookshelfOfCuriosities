/*
  Render engine for the V4.0 landing page. Reads generated sections,
  entries and blocks from bookshelf-generated-content.js (built from
  content/bookshelf-{sections,entries,blocks}.tsv), then renders into the
  mount points left empty in index.html. No content strings or entry data
  live in this file.
*/

function toRoman(n) {
  const numerals = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"];
  return numerals[n - 1] || String(n);
}

const blocksById = new Map(bookshelfBlocks.map(block => [block.id, block]));

function createTickerMarkup(block) {
  const items = block.items
    .map(item => `<span class="ticker-item"><b>✦</b>${item}</span>`)
    .join("");

  // Doubled so the 50s linear loop has no visible seam.
  return `
    <div class="ticker-outer" aria-hidden="true">
      <div class="ticker-track">${items}${items}</div>
    </div>
  `;
}

// Sorted-by-order view of bookshelfSections, computed once — every
// renderer function below reads this instead of the raw array, so
// section numbering/placement is driven by `order`, not array position
// (array position and `order` currently agree, since the data file was
// written in order, but `order` is now the authoritative signal — see
// WORLD-SYSTEMS.md's "order-based rendering").
const orderedSections = [...bookshelfSections].sort((a, b) => a.order - b.order);
const orderedEntries = [...bookshelfEntries].sort((a, b) => a.order - b.order);

function createHeroIndexMarkup() {
  return orderedSections
    .filter(section => section.status !== false)
    .map((section, i) => `<span>${toRoman(i + 1)} — ${section.title}</span>`)
    .join("");
}

function createSecHeadMarkup(num, name) {
  return `
    <div class="sec-head reveal">
      <span class="sec-num">${num}.</span>
      <span class="sec-name">${name}</span>
      <div class="sec-rule"></div>
    </div>
  `;
}

function createTextBandMarkup(block) {
  const topics = block.items
    .map(topic => `<span class="text-band-item">${topic}</span>`)
    .join("");

  return `
    <div class="text-band reveal" aria-hidden="true">
      <span class="text-band-big">${block.title}</span>
      <div class="text-band-items">${topics}</div>
    </div>
  `;
}

function createQuoteBreakMarkup(block) {
  return `
    <div class="type-break reveal">
      <div class="type-break-bg" aria-hidden="true"><span>${block.title}</span></div>
      <div class="type-break-content">
        <p class="type-break-q">&ldquo;${block.text}&rdquo;</p>
        <span class="type-break-attr">${block.attribution}</span>
      </div>
    </div>
  `;
}

// section-intro: the wide "Books as Data"-style block above a section's cards.
function createSectionIntroMarkup(block) {
  const chips = block.items
    .map(chip => `<span class="chip">${chip}</span>`)
    .join("");

  return `
    <div class="dv-block reveal">
      <p class="dv-kicker">${block.kicker}</p>
      <h2 class="dv-title">${block.title}</h2>
      <p class="dv-desc">${block.text}</p>
      <div class="dv-chips">${chips}</div>
    </div>
  `;
}

// section-note: the dormant writings-style band below a section's cards;
// its first item is the chip label.
function createSectionNoteMarkup(block) {
  return `
    <div class="writings-card card-dormant reveal">
      <div>
        <p class="writings-big">${block.title}</p>
        <p class="writings-sub">${block.text}</p>
      </div>
      <span class="soon-chip" style="align-self:flex-start;">${block.items[0] || ""}</span>
    </div>
  `;
}

const orderedBlockRenderers = {
  ticker: createTickerMarkup,
  band: createTextBandMarkup,
  quote: createQuoteBreakMarkup
};

// The section's `feature` block, if it names one of `type` that is on.
function sectionFeature(section, type) {
  const block = section.feature ? blocksById.get(section.feature) : null;
  return block && block.type === type && block.status === true ? block : null;
}

function createEntryMarkup(entry, delayIndex) {
  const delay = (delayIndex * 0.04).toFixed(2);
  const isLive = entry.status === true;
  const tag = isLive ? "a" : "div";
  const hrefAttr = isLive ? ` href="${entry.href}"` : "";
  const stateClass = isLive ? "" : " card-dormant";
  const titleClass = entry.titleVariant === "inst" ? "card-title card-title-inst" : "card-title";
  const ghostMarkup = entry.ghost ? `<div class="card-ghost" aria-hidden="true">${entry.ghost}</div>` : "";
  const badgeMarkup = isLive
    ? '<span class="badge-live">Live ↗</span>'
    : '<span class="soon-chip">In preparation</span>';
  const arrowMarkup = isLive
    ? '<span class="card-arrow">↗</span>'
    : '<span class="card-arrow" style="opacity:.25">—</span>';

  return `
    <${tag}${hrefAttr} class="card ${entry.span}${stateClass} reveal" style="transition-delay:${delay}s">
      ${ghostMarkup}
      <div class="card-inner">
        ${badgeMarkup}
        <p class="card-cat">${entry.kicker}</p>
        <h2 class="${titleClass}">${entry.title}</h2>
        <p class="card-body-text">${entry.subtitle}</p>
        <div class="card-foot">
          <span class="card-tag">${entry.displayTag}</span>
          ${arrowMarkup}
        </div>
      </div>
    </${tag}>
  `;
}

function createSectionMarkup(section, num) {
  let html = createSecHeadMarkup(num, section.title);

  const intro = sectionFeature(section, "section-intro");
  if (intro) html += createSectionIntroMarkup(intro);

  const sectionEntries = orderedEntries.filter(entry =>
    entry.section === section.id && entry.status !== false
  );

  if (sectionEntries.length) {
    const entries = sectionEntries.map((entry, i) => createEntryMarkup(entry, i)).join("");
    html += `<div class="grid">${entries}</div>`;
  }

  const note = sectionFeature(section, "section-note");
  if (note) html += createSectionNoteMarkup(note);

  return html;
}

function renderSections() {
  const mount = document.getElementById("bookshelf-sections");
  if (!mount) return;

  // Sections and ordered blocks share one `order` number line. On a tie the
  // block comes first, so a block given a section's own order sits above it.
  const items = [
    ...orderedSections
      .filter(section => section.status !== false)
      .map(section => ({ order: section.order, rank: 1, section })),
    ...bookshelfBlocks
      .filter(block => block.status === true && orderedBlockRenderers[block.type])
      .map(block => ({ order: block.order, rank: 0, block }))
  ].sort((a, b) => a.order - b.order || a.rank - b.rank);

  let html = "";
  let num = 0;

  items.forEach(item => {
    if (item.block) {
      html += orderedBlockRenderers[item.block.type](item.block);
      return;
    }
    num += 1;
    html += createSectionMarkup(item.section, toRoman(num));
  });

  mount.innerHTML = html;
}

function renderBookshelfLanding() {
  const heroIndexMount = document.getElementById("bookshelf-hero-index");
  if (heroIndexMount) heroIndexMount.innerHTML = createHeroIndexMarkup();

  renderSections();
}

document.addEventListener("DOMContentLoaded", renderBookshelfLanding);

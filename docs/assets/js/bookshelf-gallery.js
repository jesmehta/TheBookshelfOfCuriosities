/*
  Render engine for the V4.0 landing page. Reads every block defined in
  bookshelf-data.js and renders it into the mount points left empty in
  index.md. No content strings or card data live in this file — only
  rendering logic, per the design system's "only file to edit is the data
  file" rule.
*/

function toRoman(n) {
  const numerals = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"];
  return numerals[n - 1] || String(n);
}

function createTickerMarkup() {
  if (!bookshelfTicker.enabled) return "";

  const items = bookshelfTicker.items
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

function createTextBandMarkup() {
  if (!bookshelfTextBand.enabled) return "";

  const topics = bookshelfTextBand.topics
    .map(topic => `<span class="text-band-item">${topic}</span>`)
    .join("");

  return `
    <div class="text-band reveal" aria-hidden="true">
      <span class="text-band-big">${bookshelfTextBand.word}</span>
      <div class="text-band-items">${topics}</div>
    </div>
  `;
}

function createQuoteBreakMarkup() {
  if (!bookshelfQuoteBreak.enabled) return "";

  return `
    <div class="type-break reveal">
      <div class="type-break-bg" aria-hidden="true"><span>${bookshelfQuoteBreak.bgWord}</span></div>
      <div class="type-break-content">
        <p class="type-break-q">&ldquo;${bookshelfQuoteBreak.quote}&rdquo;</p>
        <span class="type-break-attr">${bookshelfQuoteBreak.attribution}</span>
      </div>
    </div>
  `;
}

function createDatavizMarkup() {
  if (!bookshelfDataviz.enabled) return "";

  const chips = bookshelfDataviz.chips
    .map(chip => `<span class="chip">${chip}</span>`)
    .join("");

  return `
    <div class="dv-block reveal">
      <p class="dv-kicker">${bookshelfDataviz.kicker}</p>
      <h2 class="dv-title">${bookshelfDataviz.title}</h2>
      <p class="dv-desc">${bookshelfDataviz.desc}</p>
      <div class="dv-chips">${chips}</div>
    </div>
  `;
}

function createWritingsMarkup() {
  if (!bookshelfWritings.enabled) return "";

  return `
    <div class="writings-card card-dormant reveal">
      <div>
        <p class="writings-big">${bookshelfWritings.big}</p>
        <p class="writings-sub">${bookshelfWritings.sub}</p>
      </div>
      <span class="soon-chip" style="align-self:flex-start;">${bookshelfWritings.chip}</span>
    </div>
  `;
}

function createCardMarkup(card, delayIndex) {
  const delay = (delayIndex * 0.04).toFixed(2);
  const tag = card.live ? "a" : "div";
  const hrefAttr = card.live ? ` href="${card.href}"` : "";
  const stateClass = card.live ? "" : " card-dormant";
  const titleClass = card.titleVariant === "inst" ? "card-title card-title-inst" : "card-title";
  const ghostMarkup = card.ghost ? `<div class="card-ghost" aria-hidden="true">${card.ghost}</div>` : "";
  const badgeMarkup = card.live
    ? '<span class="badge-live">Live ↗</span>'
    : '<span class="soon-chip">In preparation</span>';
  const arrowMarkup = card.live
    ? '<span class="card-arrow">↗</span>'
    : '<span class="card-arrow" style="opacity:.25">—</span>';

  return `
    <${tag}${hrefAttr} class="card ${card.span}${stateClass} reveal" style="transition-delay:${delay}s">
      ${ghostMarkup}
      <div class="card-inner">
        ${badgeMarkup}
        <p class="card-cat">${card.cat}</p>
        <h2 class="${titleClass}">${card.title}</h2>
        <p class="card-body-text">${card.desc}</p>
        <div class="card-foot">
          <span class="card-tag">${card.tag}</span>
          ${arrowMarkup}
        </div>
      </div>
    </${tag}>
  `;
}

function createSectionMarkup(section, num) {
  let html = createSecHeadMarkup(num, section.title);

  if (section.feature === "dataviz") {
    html += createDatavizMarkup();
  }

  if (section.cards && section.cards.length) {
    const orderedCards = [...section.cards].sort((a, b) => a.order - b.order);
    const cards = orderedCards.map((card, i) => createCardMarkup(card, i)).join("");
    html += `<div class="grid">${cards}</div>`;
  }

  if (section.feature === "writings") {
    html += createWritingsMarkup();
  }

  return html;
}

function renderSections() {
  const mount = document.getElementById("bookshelf-sections");
  if (!mount) return;

  let html = "";
  let num = 0;

  orderedSections.forEach(section => {
    if (section.status === false) return;

    if (bookshelfTextBand.enabled && bookshelfTextBand.beforeSection === section.id) {
      html += createTextBandMarkup();
    }
    if (bookshelfQuoteBreak.enabled && bookshelfQuoteBreak.beforeSection === section.id) {
      html += createQuoteBreakMarkup();
    }

    num += 1;
    html += createSectionMarkup(section, toRoman(num));
  });

  mount.innerHTML = html;
}

function renderBookshelfLanding() {
  const tickerMount = document.getElementById("bookshelf-ticker");
  if (tickerMount) tickerMount.innerHTML = createTickerMarkup();

  const heroIndexMount = document.getElementById("bookshelf-hero-index");
  if (heroIndexMount) heroIndexMount.innerHTML = createHeroIndexMarkup();

  renderSections();
}

document.addEventListener("DOMContentLoaded", renderBookshelfLanding);

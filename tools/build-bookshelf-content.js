const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const sectionsPath = path.join(root, "content", "bookshelf-sections.tsv");
const entriesPath = path.join(root, "content", "bookshelf-entries.tsv");
const outputPath = path.join(root, "docs", "_assets", "backend", "js", "bookshelf-generated-content.js");

function readTsv(filePath) {
  const raw = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
  const lines = raw.split(/\r?\n/).filter(line => line.length > 0);
  if (!lines.length) return [];

  const headers = lines[0].split("\t");
  return lines.slice(1).map((line, lineIndex) => {
    const cells = line.split("\t");
    if (cells.length !== headers.length) {
      throw new Error(
        `${path.relative(root, filePath)} line ${lineIndex + 2}: expected ${headers.length} cells, got ${cells.length}`
      );
    }

    return Object.fromEntries(headers.map((header, index) => [header, cells[index]]));
  });
}

function parseStatus(value, context) {
  const normalized = value.trim().toLowerCase();
  if (normalized === "true") return true;
  if (normalized === "false") return false;
  if (normalized === "wip") return "wip";
  throw new Error(`${context}: status must be true, wip, or false (case-insensitive)`);
}

function parseOrder(value, context) {
  const order = Number(value);
  if (!Number.isFinite(order)) {
    throw new Error(`${context}: order must be numeric`);
  }
  return order;
}

function parseTags(value) {
  if (!value) return [];
  return value.split(";").map(tag => tag.trim()).filter(Boolean);
}

function prettifyDisplayText(value) {
  return value
    .replace(/\s\/\s/g, " \u00b7 ")
    .replace(/\.{3}/g, "\u2026");
}

function buildSections() {
  return readTsv(sectionsPath).map(row => {
    const section = {
      id: row.id,
      title: prettifyDisplayText(row.title),
      order: parseOrder(row.order, `section ${row.id}`),
      status: parseStatus(row.status, `section ${row.id}`)
    };

    if (row.feature) section.feature = row.feature;
    return section;
  });
}

function buildEntries() {
  return readTsv(entriesPath).map(row => {
    const entry = {
      id: row.id,
      title: prettifyDisplayText(row.title),
      subtitle: prettifyDisplayText(row.subtitle),
      href: row.href,
      section: row.section,
      kind: row.kind,
      kicker: prettifyDisplayText(row.kicker),
      displayTag: prettifyDisplayText(row.displayTag),
      tags: parseTags(row.tags),
      location: row.location,
      status: parseStatus(row.status, `entry ${row.id}`),
      order: parseOrder(row.order, `entry ${row.id}`),
      ghost: prettifyDisplayText(row.ghost),
      span: row.span
    };

    if (row.titleVariant) entry.titleVariant = row.titleVariant;
    return entry;
  });
}

function serializeConst(name, value) {
  return `const ${name} = ${JSON.stringify(value, null, 2)};\n`;
}

const sections = buildSections();
const entries = buildEntries();

const output = `// AUTO-GENERATED FILE. Do not edit directly.
// Edit content/bookshelf-sections.tsv and content/bookshelf-entries.tsv, then run:
// node tools/build-bookshelf-content.js

${serializeConst("bookshelfSections", sections)}
${serializeConst("bookshelfEntries", entries)}`;

fs.writeFileSync(outputPath, output, "utf8");
console.log(`Generated ${path.relative(root, outputPath)}`);

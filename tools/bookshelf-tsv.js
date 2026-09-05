// Bookshelf -- shared TSV parse/serialize/validate logic for
// content/bookshelf-sections.tsv and content/bookshelf-entries.tsv, used
// by both build-bookshelf-content.js (CLI build) and bookshelf-editor.js
// (the local admin server), so the two can't quietly diverge. Modeled on
// CabinetOfCuriosities/tools/cabinet-tsv.js and form-follows-fx's
// fffx-tsv.js, adapted for Bookshelf's own schema.
//
// Plain tab/newline splitter, not a CSV-quote-aware state machine -- and
// deliberately no escaping on write, either. Bookshelf's cells contain
// literal `<br>` and literal `"` quote characters as real content (not
// TSV/CSV escaping), and build-bookshelf-content.js parses with a naive
// line.split("\t"). Serializing any other way here would silently
// mangle real data on the next save.

const SECTIONS_COLS = ["id", "title", "order", "status", "feature"];
const ENTRIES_COLS = ["id", "title", "subtitle", "href", "section", "kind", "kicker", "displayTag", "tags", "location", "status", "order", "ghost", "span", "titleVariant"];

const STATUS_VALUES = ["true", "false", "wip"];
const SPAN_VALUES = ["c4", "c5", "c6", "c7", "c8", "c12"];

// ---------------------------------------------------------------------------
// parse / serialize

function parseTsv(raw, cols, contextLabel) {
  const lines = raw.replace(/^﻿/, "").split(/\r?\n/).filter(line => line.length > 0);
  if (!lines.length) throw new Error(`${contextLabel}: file is empty`);

  const headers = lines[0].split("\t");
  for (const col of cols) {
    if (!headers.includes(col)) throw new Error(`${contextLabel}: missing required column "${col}"`);
  }

  return lines.slice(1).map((line, index) => {
    const context = `${contextLabel} line ${index + 2}`;
    const cells = line.split("\t");
    if (cells.length !== headers.length) {
      throw new Error(`${context}: expected ${headers.length} cells, got ${cells.length}`);
    }
    const raw = Object.fromEntries(headers.map((h, i) => [h, cells[i]]));
    // Preserve the schema's own column order regardless of the source
    // file's header order, and guarantee every schema column exists.
    return Object.fromEntries(cols.map(c => [c, raw[c] !== undefined ? raw[c] : ""]));
  });
}

function serializeTsv(rows, cols) {
  const lines = [cols.join("\t")];
  rows.forEach(row => {
    lines.push(cols.map(c => (row[c] ?? "").toString()).join("\t"));
  });
  return lines.join("\n") + "\n";
}

function readSections(raw, contextLabel) {
  return parseTsv(raw, SECTIONS_COLS, contextLabel);
}
function writeSections(rows) {
  return serializeTsv(rows, SECTIONS_COLS);
}
function readEntries(raw, contextLabel) {
  return parseTsv(raw, ENTRIES_COLS, contextLabel);
}
function writeEntries(rows) {
  return serializeTsv(rows, ENTRIES_COLS);
}

// ---------------------------------------------------------------------------
// field-level helpers (shared with build-bookshelf-content.js's JSON-shape
// transform, so "is this numeric/well-formed" can't drift between the
// build script and the editor's validation)

function isBlank(value) {
  return value === undefined || value === null || String(value).trim() === "";
}

function parseStatus(value, context) {
  const normalized = (value || "").trim().toLowerCase();
  if (normalized === "true") return true;
  if (normalized === "false") return false;
  if (normalized === "wip") return "wip";
  throw new Error(`${context}: status must be true, wip, or false (case-insensitive)`);
}

// ---------------------------------------------------------------------------
// validation
//
// Two shapes on purpose: find*Problems() collects every problem (for the
// editor UI, which wants to flag every bad row at once, not stop at the
// first); validate*() throws on the first one (for the editor's write
// path). id/title/section-reference are flagged here even though
// build-bookshelf-content.js itself never throws on a blank one -- same
// helpful-editor-UX reasoning as FFFX's fffx-tsv.js: a blank id or an
// entry pointing at a nonexistent section silently breaks the rendered
// page even though the build script tolerates it happily.

function findSectionProblems(rows) {
  const problems = [];
  const seenIds = new Map();

  rows.forEach((row, index) => {
    const label = row.id || `(row ${index + 1})`;
    if (isBlank(row.id)) problems.push({ index, id: label, field: "id", message: "id is required" });
    else if (seenIds.has(row.id)) {
      problems.push({ index, id: label, field: "id", message: `duplicate section id "${row.id}" (also row ${seenIds.get(row.id) + 1})` });
    } else seenIds.set(row.id, index);

    if (isBlank(row.title)) problems.push({ index, id: label, field: "title", message: "title is required" });
    if (isBlank(row.order) || !Number.isFinite(Number(row.order))) problems.push({ index, id: label, field: "order", message: "order must be numeric" });
    if (!STATUS_VALUES.includes((row.status || "").trim().toLowerCase())) problems.push({ index, id: label, field: "status", message: "status must be true, wip, or false" });
  });

  return problems;
}

function findEntryProblems(rows, sectionIds) {
  const problems = [];
  const seenIds = new Map();
  const validSectionIds = sectionIds instanceof Set ? sectionIds : new Set(sectionIds);

  rows.forEach((row, index) => {
    const label = row.id || `(row ${index + 1})`;
    if (isBlank(row.id)) problems.push({ index, id: label, field: "id", message: "id is required" });
    else if (seenIds.has(row.id)) {
      problems.push({ index, id: label, field: "id", message: `duplicate entry id "${row.id}" (also row ${seenIds.get(row.id) + 1})` });
    } else seenIds.set(row.id, index);

    if (isBlank(row.section)) problems.push({ index, id: label, field: "section", message: "section is required" });
    else if (!validSectionIds.has(row.section)) problems.push({ index, id: label, field: "section", message: `section "${row.section}" does not match any section id` });

    if (isBlank(row.title)) problems.push({ index, id: label, field: "title", message: "title is required" });
    if (isBlank(row.order) || !Number.isFinite(Number(row.order))) problems.push({ index, id: label, field: "order", message: "order must be numeric" });
    if (!STATUS_VALUES.includes((row.status || "").trim().toLowerCase())) problems.push({ index, id: label, field: "status", message: "status must be true, wip, or false" });
    if (!isBlank(row.span) && !SPAN_VALUES.includes(row.span.trim())) problems.push({ index, id: label, field: "span", message: `span must be one of ${SPAN_VALUES.join(", ")}` });
  });

  return problems;
}

function validateSections(rows) {
  const problems = findSectionProblems(rows);
  if (problems.length) throw new Error(`section ${problems[0].id}: ${problems[0].message}`);
}

function validateEntries(rows, sectionIds) {
  const problems = findEntryProblems(rows, sectionIds);
  if (problems.length) throw new Error(`entry ${problems[0].id}: ${problems[0].message}`);
}

module.exports = {
  SECTIONS_COLS, ENTRIES_COLS, STATUS_VALUES, SPAN_VALUES,
  parseTsv, serializeTsv,
  readSections, writeSections, readEntries, writeEntries,
  parseStatus,
  findSectionProblems, findEntryProblems, validateSections, validateEntries,
};

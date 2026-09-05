# Conversation log: Bookshelf Admin Dash

Companion to [`BOOKSHELF-EDITOR.md`](BOOKSHELF-EDITOR.md) (mechanism,
routes, files, update workflow) — same relationship
`conversation-fffx-editor.md` has to `FFFX-EDITOR.md` in the sibling
`form-follows-fx` repo, and `conversation-cabinet-editor.md` has to
`CABINET-EDITOR.md` in `CabinetOfCuriosities`.

Recorded from the same live transcript as
`form-follows-fx/documentation/fffx-editor/conversation-fffx-editor.md` —
this repo's Admin Dash was planned and decided in one combined
conversation covering both fffx and Bookshelf together, then built
second, after fffx's copy. The shared architectural reasoning (single
page vs. a Cabinet-style split, shared engine vs. per-repo copies, the
final one-page call) is repeated here in full, quoted the same way,
rather than only cross-referenced — these are separate git repos, so a
relative link across them wouldn't resolve for a reader of either one on
its own. Direct quotes are verbatim, not reconstructed. No code,
commands, or diffs here — those are in git history and in
`BOOKSHELF-EDITOR.md`'s own changelog.

## "give me a status summary of fffx and bookshelf"

The thread opened with a status check covering both repos together, not
a build request for either one specifically:

> **It has been a while since I touched FFFX and Bookshelf. Cabinet
> itself has moved ahead by leaps and bounds in the meantime.
> - give me a status summary of fffx and bookshelf
> - a plan for both - although they are already live and kicking quite
> well
> - I believe i need TSV editors for both
> - similar to cabinet, but not as much complexity - can the rebuild
> scripts etc be tied to buttons on an admin page that is part of the tsv
> editor or a separate admin page if needed
>
> But firt just the status**

The status pass read this repo's git log, `tools/build-bookshelf-content.js`,
and `content/bookshelf-sections.tsv`/`bookshelf-entries.tsv`'s actual
headers directly, alongside the equivalent fffx files — confirming
Bookshelf already had a working TSV → generated-JS pipeline but no
editor UI at all, same gap as fffx, unlike Cabinet's
`cabinet-tsv.js`/`cabinet-editor.js`/`cabinet-editor-ui/` +
`admin-controls.js` pair.

## "can there be a single admin page"

The status reply had repeated back Cabinet's own reason for splitting its
editor server from its admin-controls dashboard (avoiding re-implementing
two already-existing servers' TSV logic a second time). That got
questioned directly:

> **But can there be a single admin page that doe the build-rebuild as
> well as have the TSV section and entries editor on separate tabes etc
> ?**

Checked against the actual reason for Cabinet's split, not just its
existence: Cabinet split because `now-editor.js` and `cabinet-editor.js`
already existed as separate legacy servers before `admin-controls.js` was
added on top. Neither fffx nor Bookshelf has any such pre-existing
server to avoid duplicating, so the reason for the split doesn't
transfer to either repo — a single unified server with tabs was
recommended for both.

## "Tell me about this as well" — the shared-engine-vs-copy tradeoff

A prior turn had flagged, but not resolved, a real open question: given
how closely Cabinet/Bookshelf/fffx's `entries` schemas converge, was a
shared editor engine with per-repo config more justified than three
separate copies? Asked directly to expand on it rather than just decide:

> **Tell me about this as well**

Answered by actually re-deriving the schema overlap from each repo's real
TSV headers, not from memory: 10 of 15 entry columns identical across all
three (`id, title, subtitle, href, section, kind, status, order, tags,
location`), Cabinet and fffx near-twins beyond that — but **Bookshelf
diverging furthest of the three**, with presentation-specific fields
(`kicker`, `displayTag`, `ghost`, `span`, `titleVariant`) that have no
equivalent in either sibling schema, and no `weight` field at all where
both siblings have one. Sections schemas diverge even more — Cabinet's
carries 18 columns of `squarify()`-computed geometry neither other world
has an analogue for, and Bookshelf's own `sections.feature` field has no
equivalent either. Recommendation: a shared *entries* engine might be
justified for the two closer schemas, but forcing Bookshelf's genuinely
different shape into that same mold would cost more than it saved.

## "each repo... its own separate TSV editors"

> **i think i want each repo to have its own separate TSV editors. They
> can be based off one another, but I dont need to hold them identical.
> Also, since its 3 different repo folders on my local, managing thier
> local paths will be another issue, i guess ?**

This settled the shared-engine question in favor of three independent,
freely-diverging copies — directly benefiting Bookshelf specifically,
since it's the schema with the most to lose from being forced to match
the other two. The local-paths concern turned out to be a non-issue once
traced through: Cabinet's own editor already resolves its root via
`path.resolve(__dirname, "..")`, relative to the script's own location,
not a hardcoded absolute path — copying that pattern means this repo's
editor is self-contained regardless of where on disk it sits. The one
real cross-repo consideration flagged back: distinct default ports (this
repo ended up with `7858`, fffx `6858`, Cabinet's three at
`5757`/`5858`/`5959`), so more than one editor could run at once without
colliding.

## "final call" — one page or two

> **final call on - one page with admin + editro pages ? Pros and cons
> ?**

A fuller pros/cons table was given for both shapes, landing on a
recommendation for one page specifically because neither fffx nor
Bookshelf has the legacy-server reason Cabinet's split was actually built
to solve.

> **Yes, go with one page**

Locked in the architecture for both repos: one server per repo, three
tabs (Sections / Entries / Build), distinct ports, no shared engine.

## Adapting for Bookshelf's own schema and its literal-content risk

Once the plan was approved, FFFX's copy was built first — closer to
Cabinet's schema, with no TSV-content quirks of its own, so it validated
the pattern with fewer variables in play. Bookshelf's copy followed, and
needed real adaptation, not just a renamed copy: `kicker`/`displayTag`/
`ghost`/`span`/`titleVariant` in place of `weight`/`thumbnail`/
`sourceFolder`, a `<select>` for `span` built from `WORLD-SYSTEMS.md`'s
documented `c4`–`c12` values (all six of which actually appear in the
real data) instead of free text, and a `location` option list reflecting
what this repo's data actually uses (`internal-html`/`internal-md`) — not
copy-pasted from fffx's own `external`/`internal-md` list.

The one schema-specific risk that got a dedicated check, flagged before
any code was trusted: this repo's real TSV cells carry literal `<br>`
and literal `"` characters as actual content — confirmed directly in the
`scifi` row (`title` is literally `Golden Age<br>Science Fiction`,
`subtitle` is wrapped in literal `"` characters), not something
`build-bookshelf-content.js`'s parser escapes or expects escaped (it's a
plain `line.split("\t")`, no quote-awareness at all). This meant
`bookshelf-tsv.js`'s serializer had to do a plain tab-join with **zero
escaping of any kind**, matching the build script's own assumption
exactly — a well-intentioned CSV-style quoting layer, the kind that
might seem like an obvious improvement on a naive tab-splitter, would
have silently corrupted this real data on the very next save.

## Build and verify

Bookshelf's copy was verified end-to-end against the real content files,
with the round-trip check this schema specifically demanded: fetched the
`scifi` row (the one row confirmed to carry both a literal `<br>` and
literal `"` quotes) via `/api/state`, `PUT` its existing values back
completely unchanged, and confirmed a zero `git diff` — the exact check
fffx's copy didn't need, since fffx's data has no equivalent quirk.
"Rebuild content" matched running `node tools/build-bookshelf-content.js`
directly from the CLI, byte-for-byte. "mkdocs check" correctly surfaced
one real, pre-existing `--strict` failure — a bare `#` in `nav:` that
doesn't resolve to any documentation file — unrelated to this work and
left as-is.

## Naming and commit close

The close of this thread covered both repos at once:

> **Call the the xyz - Admin Dash, not Ledger. And yes, please, document
> and commit.**

*(the message repeated the naming instruction a second time in the same
turn, quoted here once; this repo's UI title was renamed from "Ledger"
to "Admin Dash" alongside fffx's, `BOOKSHELF-EDITOR.md` was written per
the four-tier documentation standard, and this repo's work was committed
separately from fffx's, since they're independent git repos.)*

## Changelog

### 2026-09-05 — recovered/written

This conversation log itself was not written in the same pass as
`conversation-fffx-editor.md` — fffx's reorg and documentation work
continued in a later session before this repo's own conversation log was
requested and added. Same real transcript throughout; no reconstruction.

# Notes: custom landing page inside MkDocs Material

Portable lessons from building this site's landing page (a fully custom,
JS-rendered front page living inside an otherwise-normal MkDocs Material
site). Written to be lifted into a different repo — a future "Cabinet" or
"fffx" site doing the same thing. Project-specific decisions/changelog
live in `README.md`; this file is the reusable part.

## The pattern

One Markdown page (`index.md`) becomes a mount-point shell, not real
content:

- Front-matter `hide: [toc, navigation]` removes Material's sidebar/TOC
  on that page only.
- The page body is one wrapper element (here `<section class="bookshelf-landing">`)
  containing static brand chrome (hero text, footer) plus a few empty
  `<div id="...">` mount points, and `<script src="...">` tags at the
  bottom.
- One JS file is the single source of content data (here
  `bookshelf-data.js`) — every string, every card, every toggle lives
  there, nothing in the Markdown or in other JS files.
- One JS "render engine" file reads that data on `DOMContentLoaded` and
  fills the mount points with generated markup.
- All CSS lives in one stylesheet, every rule scoped under the wrapper
  class (`.bookshelf-landing .foo { ... }`, never bare `.foo { ... }`).
  This is what lets the custom page coexist with Material's own styles
  without clashing, on this page or any other.

Why bother with mount points instead of writing the HTML directly in
Markdown: it makes the one editable surface for content changes a plain
JS data file, not a wall of HTML — and it means `enabled`-style toggles
are just booleans, not commenting out chunks of markup.

## Bugs hit, root cause, fix

### 1. Material's own CSS silently wins image sizing
`.md-typeset img { height: auto; max-width: 100% }` is in Material's base
styles. It has *class + type* specificity, which beats a plain
`.my-thumbnail { height: 100% }` class selector regardless of source
order — so a custom image-crop/cover treatment can silently not apply,
with no error, just wrong-looking output. **Fix**: match Material's own
ancestry in the selector, e.g. `.md-typeset .my-thumbnail { ... }`, which
ties specificity and reliably wins.

### 2. Header/tab bar — three attempts before it actually worked
Hiding Material's header bar on one page only is harder than it looks,
because `.md-header` is a *sibling* of the content container, not an
ancestor — front-matter's `hide: navigation` only hides the sidebar, not
the header.

- **Attempt 1**: `body:has(.bookshelf-landing) .md-header { display: none }`.
  `:has()` support gaps and/or other causes meant this alone wasn't
  reliable.
- **Attempt 2**: paired it with a JS-set `body` class + `!important`
  (in case something sets an inline style on the header). Still left a
  bar visible — confirmed under real `mkdocs serve`, not a caching
  artifact.
- **Attempt 3 (the one that worked)**: stopped guessing Material's class
  names entirely. A JS routine walks up the DOM from the custom wrapper
  element to `<body>`, and at every level hides all *siblings* of each
  ancestor on that path:
  ```js
  let node = document.querySelector(".my-landing-wrapper");
  while (node && node !== document.body) {
    const parent = node.parentElement;
    if (parent) {
      Array.prototype.forEach.call(parent.children, sibling => {
        if (sibling !== node) sibling.style.display = "none";
      });
    }
    node = parent;
  }
  ```
  This hides *whatever* Material puts up there — header, tabs bar,
  anything — with zero dependency on knowing its name. Requirement: every
  one of your own elements (canvases, cursor divs, etc.) must live
  *inside* the wrapper, or this hides your own markup too (harmless for
  `<script>` tags specifically — `display:none` doesn't stop a script
  from executing — but anything visual needs to be nested correctly).
- **The part even attempt 3 missed at first**: hiding the header
  *element* doesn't remove space Material *reserves* for it. Some
  ancestor's `padding-top`/`margin-top` (or a `calc()` against the
  `--md-header-height` custom property) can leave a blank gap even with
  the header itself fully hidden. Fix both: zero literal `padding-top`/
  `margin-top` on each ancestor in the walk-up loop (not on your own
  wrapper if it has its own deliberate negative margin for a full-bleed
  background — don't clobber that), and zero `--md-header-height` on the
  body class as a second net in case the gap is variable-driven rather
  than a literal value.

### 3. Compound vs. descendant selectors on the same element
If a render function adds two classes to one element (e.g.
`class="card frame-cosmic"`), any CSS rule needing both must be a
**compound selector**, no whitespace: `.card.frame-cosmic`. Writing
`.frame-cosmic .card` is a descendant selector — it looks for `.card`
*inside* an ancestor with `.frame-cosmic`, which doesn't exist when
they're the same element, so the rule silently never matches. This is an
easy mistake to make once and then copy-paste into every similar rule —
audit all of them at once when you find the first instance.

### 4. Don't put logic-bearing `<script>` content inline in Markdown
An inline `<script>` block embedded directly in a Markdown file's raw
HTML is parsed by the Markdown processor before the browser ever sees it.
Even if it "should" pass through untouched, it's an unnecessary risk
surface (HTML-block boundary rules, extensions like `smarty` rewriting
quotes in text nodes, etc.) for something that has a strictly safer
alternative: put the logic in an external `.js` file and reference it
with `<script src="...">`. The `src` attribute is trivial markup; the
logic itself never touches the Markdown pipeline at all.

### 5. p5.js / physics motion bugs that look like "nothing's happening"
Two specific traps when porting a particle/motion effect:
- **Invisible by under-tuning, not by failure**: very low alpha (under
  ~60/255) combined with very small radii (1–2px) on a dark background
  can render "successfully" while being functionally invisible at normal
  viewing distance. If something "isn't showing up," check the actual
  alpha/size math before assuming the script failed to load.
- **Velocity decay with no sustaining force**: a damping multiplier
  applied every frame (e.g. `vx *= 0.982`) with only a *one-time* random
  velocity set at creation will decay to a near-stop within a few
  seconds (the multiplier compounds fast — 0.982^150 ≈ 0.05). Looks like
  "it appeared then died." Fix: add a small *continuous* force each
  frame (not just at init) so velocity settles into a steady non-zero
  value instead of decaying toward zero.
- Both traps showed up porting one reference effect, and were ultimately
  resolved by abandoning physics-based drift entirely in favour of a
  noise-driven state machine (explicit headings/states instead of
  velocity/damping) — sometimes the more robust fix is a different
  motion model, not more tuning of the existing one.

### 6. A docs-folder `README.md` can silently conflict with `index.md`
MkDocs warns and excludes `README.md` from the build if both `README.md`
and `index.md` exist in the same directory (it tries to use `README.md`
as a fallback index page when there's no `index.md`, and they conflict
when both exist). Harmless warning, not a bug, but confusing the first
time you see it. Simplest fix, used in this repo: keep all project
documentation (README, design system, implementation notes) at the
**repo root**, not inside `docs/` — `docs/` should hold only what MkDocs
is meant to build.

### 7. A `[data-md-color-primary="custom"]` override that only patches the header bar is not a theme

`theme.palette: { primary: custom, accent: <name> }` plus an `extra_css`
block setting `--md-primary-fg-color`/`--md-accent-fg-color` *looks*
like a complete theme override — it changes the header bar colour, so a
quick glance at the one page you're testing (usually the landing page,
often with its own header hidden anyway) looks fine. It isn't complete:
Material's body background, default text colour, and code-block colours
are controlled by a *different* set of variables
(`--md-default-bg-color`, `--md-default-fg-color` and its `--light`/
`--lighter`/`--lightest` steps, `--md-code-bg-color`/`--md-code-fg-color`,
`--md-typeset-a-color`), which stay on Material's defaults — light-theme
white-on-black — until you override those too. With no `scheme: slate`
set either, this is doubly invisible: there's no actual content page to
render the mismatch on yet, only the landing page (which hides its own
header) and the homepage shell. The bug is latent, not absent — it
surfaces the moment a real Markdown content page gets added. Checklist
for a *complete* dark-theme override, not a partial one: set
`theme.palette.scheme: slate` for an actual dark baseline, then override
at minimum `--md-default-bg-color`, `--md-default-fg-color` (+ light/
lighter/lightest), `--md-primary-fg-color` (+ light/dark), `--md-primary-
bg-color`, `--md-accent-fg-color`, `--md-code-bg-color`/
`--md-code-fg-color`, and `--md-typeset-a-color` — targeting
`[data-md-color-scheme="slate"]` (matches Material's own internal
selector, so specificity is unambiguous) rather than `:root` or the
primary-colour attribute alone. Also worth a one-time check on
`theme.font` (does it actually match the font(s) your custom CSS loads
via `@import`, or is it still pointing at Material's installation
default?) and `theme.favicon` (a `material/<name>` icon slug resolves
fine for `theme.icon.logo` — it gets inlined as SVG — but `theme.favicon`
doesn't go through that resolution at all; it needs an actual file path
and will silently emit a broken `<link rel="icon">` otherwise).

## Deploy pipeline notes (apply to any new MkDocs + static-subproject repo)

- Prefer GitHub's own `actions/configure-pages` → `actions/upload-pages-artifact`
  → `actions/deploy-pages` over `peaceiris/actions-gh-pages`. The latter
  needs `GITHUB_TOKEN` write access (GitHub defaults new repos/orgs to
  read-only token permissions, so this can fail silently with no docs/code
  changes) and is based on an aging Node runtime GitHub has been
  retiring. The official actions deploy via the Pages API directly
  (OIDC, no pushed branch) and show up in the repo's deployment history.
  One manual one-time step this requires: Settings → Pages → Build and
  deployment → Source → "GitHub Actions" (not "Deploy from a branch").
- If the repo also has standalone static sub-projects (plain HTML/CSS/JS,
  no MkDocs involvement, meant to live at `/subproject/` under the same
  custom domain) — `mkdocs build` only ever outputs `docs/`'s contents.
  Add an explicit copy step in the CI workflow after the build:
  ```yaml
  - name: Copy static interactive projects
    run: |
      for proj in scifi asimov; do
        if [ -d "$proj" ]; then
          cp -r "$proj" "public/$proj"
        fi
      done
  ```
  The `if [ -d ]` guard means pre-listing a project before it exists is
  harmless — it's just skipped until the folder shows up, so adding a new
  sub-project later is often just "create the folder," no workflow edit.
- This pattern (one repo, one custom domain, several independent static
  projects at subpaths) is the simplest way to get path-based routing
  under one domain without extra infrastructure. The tradeoff: splitting
  each project into its own repo would mean giving up subpaths for
  subdomains (or adding a reverse-proxy layer) — only worth it if
  subdomains are acceptable for the new site.

## Starter checklist for a new site

1. `mkdocs.yml` with `theme: material`, a `nav:` entry for the landing
   page, `extra_css: [stylesheets/<name>.css]`.
2. `docs/index.md`: front-matter `hide: [toc, navigation]`, one wrapper
   element, mount-point divs, script tags at the bottom (data file →
   render engine → any feature-specific files, in that dependency order).
3. `docs/js/<name>-data.js`: every content block as a data structure with
   an `enabled` flag.
4. `docs/js/<name>-gallery.js` (or similar): pure rendering, reads the
   data file, writes into the mount points.
5. `docs/stylesheets/<name>.css`: every rule scoped under the wrapper
   class; header-hide block (the DOM-walk JS + the `:has()`/`!important`
   CSS as a fallback layer) ported from this project's
   `bookshelf-cursor.js`/`bookshelf.css` rather than re-derived from
   scratch.
6. `.github/workflows/deploy.yml`: copy this project's version (official
   Pages actions, plus the static-subproject copy loop if needed) rather
   than starting from a tutorial template — those tend to default to the
   older `peaceiris` pattern.
7. Keep all project documentation (`README.md`, a design-system doc, a
   notes file like this one) at the **repo root**, not inside `docs/` —
   see bug #6 above for why a docs-folder `README.md` is worth avoiding.

# The Bookshelf of Curiosities

Repo-level notes: structure, deployment pipeline, and how to add a new standalone project. For landing-page design decisions, see `docs/README.md`. For the SciFi project specifically, see `scifi/README.md`.

## Structure

- `docs/` — MkDocs Material source. `index.md` is the custom landing page; other Markdown pages get the normal Material theme/sidebar.
- `mkdocs.yml`, `requirements.txt` — MkDocs config and its Python dependencies.
- `scifi/` — a standalone static HTML/CSS/JS project (no build step), served at `/scifi/`. Independent of MkDocs; mkdocs never touches it.
- `CNAME` — custom domain (`bookshelf.cabinetofcuriosities.in`) for GitHub Pages.
- `.github/workflows/deploy.yml` — the deploy pipeline (see below).

## Deploy pipeline

`deploy.yml` runs on every push to `main`, as two jobs:

1. **`build`** — checks out the repo, installs Python deps, runs `mkdocs build --site-dir public` (this generates `public/` fresh inside the CI runner — it's never committed to git, never exists in your local checkout, and is discarded after the run), then copies any standalone static project folders (see below) into `public/`, then uploads `public/` as the Pages artifact.
2. **`deploy`** — publishes that artifact via `actions/deploy-pages`.

There is only one live version of the site. `public/` is not a second copy that can drift out of sync — it's regenerated entirely from the current state of `main` on every push, so there's no manual sync step between "the repo" and "the live site."

### Why `actions/deploy-pages` instead of a `gh-pages` branch

The workflow originally used `peaceiris/actions-gh-pages@v3`, copied from another working repo. It started failing here with no docs/code changes — most likely because GitHub now defaults `GITHUB_TOKEN` to read-only, which that action needs write access to push a `gh-pages` branch; it's also based on an aging Node runtime GitHub has been retiring. Migrated to GitHub's own first-party Pages actions (`configure-pages` → `upload-pages-artifact` → `deploy-pages`), which deploy via the Pages API directly using OIDC (`id-token: write`) instead of a pushed branch — no `gh-pages` branch exists or is needed anymore.

This requires one one-time, per-repo manual step that isn't in the YAML: **Settings → Pages → Build and deployment → Source → "GitHub Actions"** (instead of "Deploy from a branch").

### Adding a new standalone static project

Projects like `scifi/` (plain HTML/CSS/JS, no build step, edited and committed directly, no mkdocs involvement) are published by an explicit allow-list in the `Copy static interactive projects` step in `deploy.yml`:

```yaml
- name: Copy static interactive projects
  run: |
    for proj in scifi asimov; do
      if [ -d "$proj" ]; then
        cp -r "$proj" "public/$proj"
      fi
    done
```

Each name in the list is guarded by `if [ -d "$proj" ]`, so listing a project before it exists is harmless — it's just skipped until the folder shows up. `asimov` is already in the list pre-emptively for this reason.

To add a new one:
1. Create the project's folder at the **repo root** (sibling of `docs/`, `scifi/`), self-contained (its own `index.html`, assets, data).
2. Add its folder name to the `for proj in ...` list in `deploy.yml` (skip this step if it's already pre-listed, e.g. `asimov`).
3. Push to `main` — it'll be live at `/<folder-name>/`, served standalone (no MkDocs theme/sidebar — mkdocs never processes these folders, they're copied byte-for-byte).

This keeps everything under one custom domain with path-based routing (`bookshelf.cabinetofcuriosities.in/scifi/`, etc.) without extra infrastructure. The tradeoff: all these projects live in one repo rather than each having its own. Splitting them into separate repos would mean giving up path-based subpaths for subdomains (or adding a reverse-proxy layer) — not pursued here since subpath routing under one domain was the goal.

# Backend & Deploy — As-Built Notes

Repo-wide/deploy-pipeline work with no single owning page or tool. This
repo doesn't have its own `DOCUMENTATION-GUIDE.md` — the convention this
folder follows is borrowed directly from Cabinet's
`documentation/DOCUMENTATION-GUIDE.md` (and ported to fffx's own
`BACKEND-AND-DEPLOY.md` the same way): repo-wide work with no single
owning page lives in `backend-and-deploy/`, appended to as new sections
rather than split into one-topic files.

## Cloudflare Web Analytics (2026-09-24)

Rollout of Cabinet's own beacon (`CabinetOfCuriosities/documentation/backend-and-deploy/cloudflare-web-analytics-setup.md`, `#135`) to this sibling world, same two-part pattern: `mkdocs.yml` gained `theme.custom_dir: overrides`, and a new `overrides/main.html` extends Material's `base.html`, injecting the beacon into the `extrahead` block so every MkDocs-generated page gets it from one place; the standalone `docs/index.html` landing page (not MkDocs-templated, so the override doesn't reach it) got the same script tag added directly, before `</body>`.

**Token decision**: reuses Cabinet's own token (`16664b6ab6d449a799db2dbcfb97c6ce`) rather than registering bookshelf.cabinetofcuriosities.in as a separate Cloudflare Web Analytics property — direct decision, 2026-09-24: this is a personal site, one combined dashboard across Cabinet/Bookshelf/fffx (and the externally-assembled repos, `#136`) was judged simpler than juggling eight separate properties. The beacon still had to be added by hand to this repo either way — Cloudflare doesn't auto-inject across subdomains just because they share a zone/proxy.

**Verification**: local `mkdocs build` — clean build, beacon present in 159 of the built output's HTML files including `index.html` and `favorite-poems/index.html`. Live-site confirmation (beacon firing, data reaching the Cloudflare dashboard) not yet done from this session.

**Known limitation, surfaced by direct question 2026-09-24**: Cloudflare's "Top Paths" dashboard table should still separate this site's traffic from Cabinet's/fffx's in practice, since almost every page here has a distinct path (`/favorite-poems/...`, etc.). The one soft spot is the homepage itself — Cabinet's, this site's, and fffx's root all report as `/`, and whether the dashboard distinguishes them by hostname when one token spans multiple hostnames (vs. collapsing all three into one `/` row) hasn't been confirmed. See Cabinet's own `cloudflare-web-analytics-setup.md` for the full writeup.

## Changelog

### 2026-09-24 — Cloudflare Web Analytics beacon added

See "Cloudflare Web Analytics" above.

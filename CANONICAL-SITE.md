# ★ CANONICAL USS WEBSITE — EDIT THIS ONE ★

**This `uss-astro/` directory is the NEW, current version of the USS website (usstech.net).**
Built 2026-07-24. This is the site that should be deployed to production.

- **Stack:** Astro 6 + @astrojs/sitemap, no other framework deps
- **Source pages:** `src/pages/*.astro` (14 pages)
- **Layouts/components:** `src/layouts/Page.astro`, `src/components/Nav.astro`, `Footer.astro`
- **Static assets:** `public/assets/` (images, js incl. ai-concierge)
- **Build:** `npm run build` → output in `dist/` (deploy `dist/`, NOT repo root)
- **Dev:** `npm run dev` (Node >= 22.12 required)

## ⚠️ DO NOT EDIT THESE (legacy versions, kept for reference only):
- `/Website_Final/*.html` (repo root static HTML) — OLD static redesign, July 25
- `/Website_Final/website_spa/` — old Vite SPA experiment
- Git branches `main` / `gh-pages` — older snapshots used by stale deploy pipelines

## Deploy note
As of 2026-07-31 this directory was previously git-ignored (never pushed).
Netlify was serving an OLD static HTML version from the repo root instead.
Netlify must be configured with **base directory `uss-astro`, build command `npm run build`, publish directory `uss-astro/dist`** (or deploy `dist/` contents to the static host).

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Ultimate Security Solutions (usstech.net) — veteran-owned security integrator website. Static HTML/CSS/JS site deployed to Netlify, with a product catalog ordering system and Stripe checkout integration. The company sells LTS (Lifetime Security) surveillance equipment and offers commercial security/IT infrastructure services.

## Build & Deploy

- **No build step.** The root site is plain HTML/CSS/JS — Netlify publishes the repo root directly.
- **Netlify Functions** (in `netlify/functions/`) run server-side Node.js for Stripe checkout and SMS.
- **Local dev:** `npx netlify dev` (requires Netlify CLI and `STRIPE_SECRET_KEY` env var for checkout).
- **Deploy:** Push to git — Netlify auto-deploys. No CI pipeline beyond Netlify's built-in.
- **Subprojects** (each has their own build):
  - `website_spa/` — Vite + Tailwind SPA (separate package.json)
  - `uss-astro/` — Astro site (separate package.json)
  - `lts-dual-catalog/` — Vite + Tailwind catalog app (separate package.json)

## Architecture

### Root Site (the main site)

All pages are standalone HTML files sharing `styles.css` and a consistent nav structure. There is no templating system — each page includes its own inline content and scripts.

**Key pages:**
| Page | Purpose |
|------|---------|
| `index.html` | Homepage with hero, services, stats |
| `ordering_system.html` | Product catalog with filtering, cart, and Stripe checkout |
| `system-design.html` | USS Suite app marketing page |
| `about.html` | Capabilities/services |
| `partners.html` | Partner logos and info |
| `reviews.html` | Customer reviews |
| `service_area.html` | Service coverage map |
| `contact.html` | Contact form |
| `accomplishments.html` | Portfolio/project gallery |
| `portal.html` | Client portal |
| `capture.html` | Lead capture |
| `admin.html` | Admin panel |

### Product Catalog System

- **`products.js`** — Large (~1.3MB) file containing the entire LTS product catalog as a JS array. Each product has `series_id`, `name`, `description`, `image`, `facets` (category/filters), `variants` (SKU + price), and `specs`.
- `ordering_system.html` loads `products.js` directly and renders product cards client-side with category filtering and search.
- **Stripe integration:** Cart submits to `netlify/functions/create-checkout.js` → creates a Stripe Checkout session. Webhook handler in `stripe-webhook.js`.
- `create-checkout.js` parses `products.js` server-side to validate SKUs and prices.

### Styling

- Single `styles.css` with CSS custom properties for theming (navy/black base, gold/yellow accent).
- Design tokens in `:root`: `--color-accent: #fbbf24`, `--font-main: 'Inter'`, glassmorphism panels.
- `assets/js/circuit-board.js` provides the animated circuit-board background effect.
- Scroll animations use IntersectionObserver (`.animate-in` → `.visible`).

### JS Modules (assets/js/)

Each is a standalone script loaded by specific pages — no module bundling:
- `main.js` — Global nav, scroll effects, intersection observer animations
- `circuit-board.js` — Canvas-based circuit trace animation
- `quote-service.js` — Quote request form handler
- `feedback.js` — User feedback collection
- `ai-concierge.js` / `ai-concierge.v2.js` — AI chatbot widget
- `*_data.js` — Static data files for partners, portfolio, reviews, promos

## Key Data Files

- `products.js` — The product catalog (DO NOT edit without understanding the parsing in `create-checkout.js`)
- `metadata.json` — Site metadata
- `comments.json` — Stored user comments
- `pricing_spreadsheet.csv` — Pricing reference data
- `image_map.json` — SKU-to-image URL mapping

## Environment Variables (for Netlify Functions)

- `STRIPE_SECRET_KEY` — Stripe API key for checkout
- `STRIPE_WEBHOOK_SECRET` — For webhook signature verification

## Conventions

- Navigation is copy-pasted across all HTML pages — changes to nav must be applied to every page.
- Product images are loaded from external CDN URLs (securityhardwarestore.com, ltsecurityinc.com) — not local assets.
- The site uses Font Awesome 6.4.0 from CDN for icons.
- Each HTML page includes structured data (JSON-LD) for SEO.

## What to Avoid

- Don't break the `products.js` format — the serverless functions parse it with string slicing (`indexOf('[')` to `lastIndexOf(']')`), not a proper module import.
- Don't add a build step to the root site — it's intentionally build-free for Netlify.
- Don't edit `products.js` wholesale without checking the `lts-catalog-tool/` and `lts-dual-catalog/` subprojects that also depend on this data.
- The `.vibecheck/` directory contains auto-generated protocol files — don't manually edit truthpack data.

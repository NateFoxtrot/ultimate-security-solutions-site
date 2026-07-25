# HANDOFF PROMPT — USS Website Finalization

## Mission

Finish modernizing the Ultimate Security Solutions website (usstech.net). A previous agent did a solid structural pass, but the owner rejected two things: (1) it used the owner's real job photos everywhere instead of GENERATED/stock imagery, and (2) the typography and layout changes were too subtle — he wants an unmistakably different, premium look. Your job: swap ALL imagery (except the portfolio/accomplishments page) to AI-generated or stock photos, push the typography and layout much further, and create the portfolio page.

## Project Facts (read carefully — do not rediscover)

- **Root**: `/home/nate_foxtrot/PROJECTS/SOFTWARE/Website_Final` — static HTML/CSS/JS, NO build step. Netlify publishes repo root. Never touch `products.js`, `ordering_system.html` internals, `netlify/functions/`, or add a bundler.
- **Preview server**: `python3 -m http.server 8081` from the project root (one may already be running; check `ss -ltn | grep 8081`). Port 8080 is taken by another app.
- **CSP** (`netlify.toml`): `img-src 'self'` + a few CDNs. ALL images must be local files under `assets/images/`. No hotlinking.
- **Browser caching bites**: after editing CSS/HTML, bump the version query (`styles.css?v=5`, `styles-modern.css?v=5`) in every page or the owner will see stale pages and think nothing changed. There are ~15 root HTML files + 4 in `Commercial/`.
- **Design system**: `styles-modern.css` (`.m-` prefixed components: m-hero, m-pagebanner, m-cards, m-feature-band, m-steps, m-checkgrid, m-chips, m-suite, m-stats, m-quotes, m-cta, m-footer, m-ba before/after slider) loaded AFTER `styles.css`. Animations via `.animate-in` + `assets/js/main.js`; counters/sliders via `assets/js/modern.js`. Fonts already imported in `styles.css`: Sora, Inter, JetBrains Mono, Montserrat.
- **Nav** is copy-pasted across pages but was standardized (logo + wordmark, gold underline states). If you change nav markup, change it on ALL pages — `/tmp/standardize_nav.py` from the prior session shows the canonical markup (regenerate if gone).
- **Legacy duplicate pages** in `about/`, `contact/` etc. directories are stale — ignore them; only edit root `.html` files and `Commercial/*.html`.

## Imagery: what exists and how to generate more

**AI generation is LOCAL and works** — no API keys needed:
- Checkpoint: `marketing/Fooocus/models/checkpoints/juggernautXL_v8Rundiffusion.safetensors` (SDXL, 6.7GB, already downloaded)
- Ready venv: `.venv-img/bin/python` (diffusers 0.39 + torch 2.10 cu128, CUDA confirmed on the RTX 4060)
- Working example script: `scripts-img2img.py` (SDXL img2img with `StableDiffusionXLImg2ImgPipeline.from_single_file`, `enable_model_cpu_offload()`, strength 0.45, 30 steps — ~30s/image). Adapt it for txt2img (`StableDiffusionXLPipeline`) for new scenes. Generate at 1024px, save quality-85 JPEG under `assets/images/stock/` or a new `assets/images/gen/` folder.
- **ALWAYS visually verify generated images** (ReadMediaFile) before wiring them in — SDXL mangles hands/text ~30% of the time. Regenerate with a different seed when it does.

**Owner-requested GENERATED scenes** (photorealistic, dark commercial/industrial lighting, no visible brand logos, no readable text):
- Structured Cabling: technician in hard hat on a scissor lift pulling blue CAT6 cable in a warehouse
- Smart Hands: professional technician holding a network cable tester in a server/network room; AND a technician in full PPE on a lift installing a PTZ camera
- Access Control: commercial glass door, card reader mounted beside it, door ajar showing crash bar and mag-lock on the top frame
- Equipment Sales: flat-lay or product-style arrangement of CCTV cameras, NVR, card readers, network switch
- DIY section: business owner unboxing a security camera at a desk
- Capabilities page banner: wide collage (use ImageMagick `montage`) blending: CCTV install, server room, cable organization, tech with tester
- Anything else currently using a `assets/images/work/` real photo OUTSIDE the portfolio page

**Stock fallback** (if a scene won't generate cleanly): Unsplash CDN direct download works (`https://images.unsplash.com/photo-XXXX?q=80&w=1600&auto=format&fit=crop`) but their search API is blocked — Wikimedia Commons API works for finding subjects (see prior session pattern). Existing verified stock is in `assets/images/stock/` (server-room, network-cabling, network-switch, cctv-camera, cctv-types collage, access-control, smart-hands, field-technician, kc-skyline, kc-skyline-night [REAL Kansas City], office-building, handshake, warehouse, retail-store, capabilities-banner, equipment-collage, dome-bullet, ptz-camera).

**Portfolio page (`accomplishments.html`) is the ONLY place real photos belong**: `assets/images/work/` (15 named job photos) + before/after rack cleanups (`messyrack{2,3,4}.jpg` → `messyrack{2,3,4}-after.jpg`, already AI-generated, drag slider in modern.js). Source folder for more: `/home/nate_foxtrot/Pictures/AllPhotos` — ONLY descriptively-named files; `messy*` names are before/after candidates. Owner said a portfolio page still needs to be GENERATED/built out properly — current Recent Work + Before/After sections are a start; make it a full, polished gallery page.

## Owner's taste (this is the bar)

- "Text is too plain" — wants a distinctive display font with real personality for headlines (pair with a clean body font). Commit to it: load via Google Fonts in `styles.css` `@import`, set on `--font-header`, bump cache version.
- "Layout is mostly the same" — vary section compositions aggressively per production template standards (think Linear/Verkada/Stripe-tier): full-bleed image bands, overlapping cards, asymmetric grids, horizontal scrollers, stat strips that break the grid. Not every section should be image-left/text-right.
- "More functional, impressive, closer to a real professional company" — hover states, micro-interactions, sticky polish, consistent spacing rhythm.
- Nav he liked: keep the glass bar style, just make sure it never overflows (media queries exist at 1400/1250px).

## Content constraints (from the owner, must keep)

- HQ is **Independence, MO** (not Kansas City) — serving the KC metro. Already fixed in footer/about; keep it.
- Field Nation links: company `https://app.fieldnation.com/company/profile/505896`, personal `https://app.fieldnation.com/p/869346`.
- MSP/field-services copy must include: cellular systems, Starlink, EAS, self-checkout, commercial AV, telecom, POTS, VoIP (already woven into index.html + msp.html).
- USS Suite has its own page (`system-design.html`, rebuilt from `~/PROJECTS/SOFTWARE/Project_Phoenix/marketing/` — copy from PLAY_STORE_LISTING.md, screenshots in `assets/images/uss-suite/`). Homepage has a dedicated section. Keep both; the about page only has a CTA band to it.
- Service area page: banner is the REAL KC skyline (`kc-skyline-night.jpg`). Don't regress it.
- Contact form fields/handlers and Leaflet map on service_area are sacred — preserve exactly.

## Definition of done

1. Every non-portfolio page section uses generated or stock imagery (zero `assets/images/work/` references outside `accomplishments.html`).
2. Portfolio/accomplishments page fully built out with real work photos + before/after sliders.
3. Visibly new display typography + clearly differentiated section layouts — side-by-side with the old site it should be unrecognizable.
4. All 15+ pages serve 200 on the preview server, no missing-asset references, nav identical everywhere, cache versions bumped.
5. Screenshot-verify every page top-to-bottom (force `.animate-in` visible first, or lazy images/sections appear blank in full-page captures).
6. Do NOT git commit — the owner reviews on the preview server first and will ask for the deploy.

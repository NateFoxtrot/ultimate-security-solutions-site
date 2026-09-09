// Generates src/pages/services/*.astro from MSP_Blitz published SEO pages.
// Usage: node scripts/gen-service-pages.mjs
import { readFileSync, writeFileSync, readdirSync, unlinkSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = '/home/nate_foxtrot/PROJECTS/SOFTWARE/Website_Final';
const SRC_PAGES = join(ROOT, 'src', 'pages', 'services');
const MANIFEST = join(SRC_PAGES, '.exported.json');
const BLITZ_PAGES = '/home/nate_foxtrot/PROJECTS/SOFTWARE/MSP_Blitz/data/seo_pages.json';

const CATALOG = [
  ['IP Camera System Installation', 1200, 'system (4-8 cameras)'],
  ['Access Control System', 1800, 'door (reader + electric strike)'],
  ['Low-Voltage Network Cabling', 150, 'drop (Cat6, terminated & tested)'],
  ['Burglar Alarm System', 950, 'system'],
  ['Structured Cabling / MDF-IDF Buildout', 2500, 'closet'],
  ['Business Wi-Fi Deployment', 1400, 'AP (incl. survey)'],
  ['Site Survey / Security Consulting', 500, 'visit'],
];

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function pageAstro(p) {
  const kw = [...((p.keywords?.primary) || []), ...((p.keywords?.secondary) || [])].join(', ');
  const sections = (p.sections || []).map(s => `
    <section class="section">
        <div class="container">
            <h2 class="section-title anim">${esc(s.h2)}</h2>
            <p class="anim" style="color:var(--muted); line-height:1.8; max-width:820px;">${esc(s.body)}</p>
        </div>
    </section>`).join('\n');
  const faqs = (p.faqs || []).map(f => `
        <div style="border-bottom:1px solid var(--border); padding:14px 0;">
            <h3 style="font-size:1rem; margin-bottom:0.4rem;">${esc(f.q)}</h3>
            <p style="color:var(--muted); font-size:0.9rem; line-height:1.7;">${esc(f.a)}</p>
        </div>`).join('\n');
  const pricing = CATALOG.map(([n, price, unit]) => `
            <div class="card" style="border:1px solid var(--border); border-radius:var(--radius); padding:1.2rem;">
                <h3 style="font-size:0.95rem;">${esc(n)}</h3>
                <p style="color:var(--accent); font-weight:700; margin:0.4rem 0;">from $${price} <span style="font-weight:400; color:var(--muted); font-size:0.8rem;">/ ${esc(unit)}</span></p>
            </div>`).join('\n');
  return `---
import Page from '../../layouts/Page.astro';
---

<Page title="${esc(p.title)}" description="${esc(p.description)}">
    <div class="container" style="text-align:center; padding:7rem 2rem 3rem;">
        <h1>${esc(p.hero?.h1 || p.title)}</h1>
        <p style="color:var(--muted); font-size:1.1rem; max-width:760px; margin:1rem auto 0;">${esc(p.hero?.sub || p.description)}</p>
        <div style="margin-top:2rem; display:flex; gap:1rem; justify-content:center; flex-wrap:wrap;">
            <a class="btn btn-primary" href="/ordering-system">Get a Quote / Order</a>
            <a class="btn btn-secondary" href="tel:8167872061">Call 816-787-2061</a>
        </div>
    </div>
${sections}
    <section class="section section-dark">
        <div class="container">
            <h2 class="section-title anim">PRICING — STARTING POINTS</h2>
            <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(230px,1fr)); gap:1rem; margin-top:1.5rem;">
${pricing}
            </div>
        </div>
    </section>
${(p.faqs || []).length ? `    <section class="section">
        <div class="container">
            <h2 class="section-title anim">FAQ</h2>
${faqs}
        </div>
    </section>` : ''}
    <section class="section">
        <div class="container" style="text-align:center;">
            <p style="color:var(--muted); font-size:0.85rem;">Ultimate Security Solutions LLC — Kansas City, MO · Licensed · Bonded · $1M Insured</p>
        </div>
    </section>
</Page>
`;
}

const published = JSON.parse(readFileSync(BLITZ_PAGES, 'utf-8')).filter(p => p.published && p.slug);
if (!existsSync(SRC_PAGES)) mkdirSync(SRC_PAGES, { recursive: true });

let manifest = {};
try { manifest = JSON.parse(readFileSync(MANIFEST, 'utf-8')); } catch { /* fresh */ }

// remove stale exports (slug exists in manifest but no longer published)
for (const old of Object.keys(manifest)) {
  if (!published.some(p => p.slug === old)) {
    const f = join(SRC_PAGES, manifest[old]);
    if (existsSync(f)) unlinkSync(f);
    delete manifest[old];
  }
}

for (const p of published) {
  const fname = manifest[p.slug] || (p.slug + '.astro');
  writeFileSync(join(SRC_PAGES, fname), pageAstro(p));
  manifest[p.slug] = fname;
}
writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));
console.log(`Generated ${Object.keys(manifest).length} service page(s): ${Object.keys(manifest).join(', ')}`);

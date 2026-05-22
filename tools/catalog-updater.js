/**
 * catalog-updater.js — LTS Catalog Dry-Run Updater
 * ===============================================
 * Reads products.js, scrapes LTS source URLs, generates a safe diff.
 *
 * Modes:
 *   --dry-run  (default)  Report changes, no writes
 *   --apply               Apply changes to products.js (requires --confirm)
 *   --source=<url>        LTS product page to scrape (repeatable)
 *
 * Usage:
 *   node tools/catalog-updater.js --dry-run
 *   node tools/catalog-updater.js --dry-run --source=https://ltsecurityinc.com/collections/ip-cameras
 *   node tools/catalog-updater.js --apply --confirm --source=https://ltsecurityinc.com/collections/ip-cameras
 *
 * Integration points:
 *   - LTS source URLs configured in SOURCES array below
 *   - Puppeteer scraper (conditionally loaded) for dynamic pages
 *   - Static fetch for simple product pages
 *   - Output: diff.json (dry-run) or updated products.js (apply)
 */

const fs = require('fs');
const path = require('path');

// ── Configuration ──────────────────────────────────────────────────
const PRODUCTS_PATH = path.join(__dirname, '../products.js');
const DIFF_OUTPUT = path.join(__dirname, '../data/catalog-diff.json');
const BACKUP_DIR = path.join(__dirname, '../data/backups');

// LTS source URLs for scraping (add more as needed)
const SOURCES = [
  'https://ltsecurityinc.com/collections/ip-cameras',
  'https://ltsecurityinc.com/collections/nvrs',
  'https://ltsecurityinc.com/collections/accessories',
];

// ── CLI Argument Parsing ───────────────────────────────────────────
const args = process.argv.slice(2);
const flags = {
  dryRun: !args.includes('--apply'),
  confirm: args.includes('--confirm'),
  sources: args
    .filter(a => a.startsWith('--source='))
    .map(a => a.split('=')[1]),
};

// ── Product Utilities ──────────────────────────────────────────────
function loadProducts() {
  const content = fs.readFileSync(PRODUCTS_PATH, 'utf8');
  const jsonStr = content.substring(
    content.indexOf('['),
    content.lastIndexOf(']') + 1
  );
  return { raw: content, data: JSON.parse(jsonStr) };
}

function extractSkus(products) {
  const skus = new Set();
  for (const p of products) {
    if (p.variants) {
      for (const v of p.variants) {
        if (v.sku) skus.add(v.sku.toUpperCase());
      }
    }
  }
  return skus;
}

// ── Scraper Integration Point ──────────────────────────────────────
// Replace with real scraper implementation when credentials available.
async function fetchProductPage(url) {
  // Gate: only fetch if puppeteer is available (opt-in dependency)
  let puppeteer;
  try {
    puppeteer = require('puppeteer');
  } catch {
    console.log(`  [SKIP] Puppeteer not installed — cannot scrape: ${url}`);
    return [];
  }

  console.log(`  [FETCH] ${url}`);
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  try {
    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    );
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    // Extract product cards — adjust selectors for each LTS source
    const products = await page.evaluate(() => {
      const cards = document.querySelectorAll('.product-card, .product-item, [data-product]');
      const results = [];
      cards.forEach(card => {
        const name = card.querySelector('.product-title, .product-name, h3')?.innerText?.trim();
        const sku = card.querySelector('.product-sku, [data-sku]')?.innerText?.trim()
          || card.getAttribute('data-sku');
        const price = card.querySelector('.product-price, .price')?.innerText?.trim();
        const img = card.querySelector('img')?.src;
        if (name || sku) {
          results.push({ name, sku: sku?.toUpperCase(), price, image: img });
        }
      });
      return results;
    });

    console.log(`    → Found ${products.length} products`);
    return products;
  } finally {
    await browser.close();
  }
}

// ── Diff Generator ─────────────────────────────────────────────────
function computeDiff(existingSkus, scrapedProducts) {
  const diff = { added: [], updated: [], unchanged: [], removed: [] };

  const scrapedSkus = new Set(scrapedProducts.map(p => p.sku).filter(Boolean));

  for (const sp of scrapedProducts) {
    if (!sp.sku) continue;
    if (existingSkus.has(sp.sku)) {
      diff.unchanged.push(sp);
    } else {
      diff.added.push(sp);
    }
  }

  // Report SKUs in catalog but not on source (may need removal)
  for (const sku of existingSkus) {
    if (!scrapedSkus.has(sku)) {
      diff.removed.push(sku);
    }
  }

  return diff;
}

// ── Backup & Apply ─────────────────────────────────────────────────
function backupProducts() {
  if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(BACKUP_DIR, `products-${ts}.js`);
  fs.copyFileSync(PRODUCTS_PATH, backupPath);
  console.log(`  Backup: ${backupPath}`);
  return backupPath;
}

function applyDiff(diff, scrapedProducts, existingProducts) {
  backupProducts();

  const updated = JSON.parse(JSON.stringify(existingProducts));

  for (const sp of scrapedProducts) {
    if (!sp.sku) continue;
    const existing = updated.find(p =>
      p.variants?.some(v => v.sku?.toUpperCase() === sp.sku)
    );

    if (existing) {
      // Update price if available
      if (sp.price && existing.variants) {
        const variant = existing.variants.find(v => v.sku?.toUpperCase() === sp.sku);
        if (variant) {
          const parsedPrice = parseFloat(sp.price.replace(/[^0-9.]/g, ''));
          if (!isNaN(parsedPrice)) {
            variant.price = parsedPrice;
          }
        }
      }
    } else {
      // Add new product scaffolding
      updated.push({
        series_id: sp.sku || `UNKNOWN-${Date.now()}`,
        name: sp.name || 'Unknown Product',
        description: '',
        image: sp.image || '',
        facets: {},
        variants: [{ sku: sp.sku, price: sp.price ? parseFloat(sp.price.replace(/[^0-9.]/g, '')) || 0 : 0 }],
        specs: {},
      });
    }
  }

  // Write updated products.js
  const newContent = `const products = ${JSON.stringify(updated, null, 2)};\n`;
  fs.writeFileSync(PRODUCTS_PATH, newContent);
  console.log(`  Updated products.js (${updated.length} products)`);
}

// ── Main ───────────────────────────────────────────────────────────
async function main() {
  console.log('=== LTS Catalog Updater ===');
  console.log(`Mode: ${flags.dryRun ? 'DRY-RUN' : 'APPLY'}`);
  console.log('');

  // Load existing catalog
  console.log('[1/3] Loading existing catalog...');
  const { data: existingProducts } = loadProducts();
  const existingSkus = extractSkus(existingProducts);
  console.log(`  ${existingProducts.length} products, ${existingSkus.size} SKUs`);

  // Scrape sources
  const sourceUrls = flags.sources.length > 0 ? flags.sources : SOURCES;
  console.log(`\n[2/3] Scraping ${sourceUrls.length} source(s)...`);
  const allScraped = [];
  for (const url of sourceUrls) {
    const products = await fetchProductPage(url);
    allScraped.push(...products);
  }
  console.log(`  Total scraped: ${allScraped.length} products`);

  // Compute diff
  console.log('\n[3/3] Computing diff...');
  const diff = computeDiff(existingSkus, allScraped);

  console.log(`\n─── Diff Summary ───`);
  console.log(`  Added:     ${diff.added.length}`);
  console.log(`  Unchanged: ${diff.unchanged.length}`);
  console.log(`  Removed:   ${diff.removed.length}`);

  if (diff.added.length > 0) {
    console.log('\n  New products:');
    diff.added.forEach(p => console.log(`    + ${p.sku} — ${p.name}`));
  }
  if (diff.removed.length > 0) {
    console.log('\n  Not found on source (first 10):');
    diff.removed.slice(0, 10).forEach(s => console.log(`    - ${s}`));
  }

  // Save diff report
  if (!fs.existsSync(path.dirname(DIFF_OUTPUT))) {
    fs.mkdirSync(path.dirname(DIFF_OUTPUT), { recursive: true });
  }
  fs.writeFileSync(DIFF_OUTPUT, JSON.stringify(diff, null, 2));
  console.log(`\n  Diff saved: ${DIFF_OUTPUT}`);

  if (flags.dryRun) {
    console.log('\n=== DRY-RUN COMPLETE ===');
    console.log('No changes applied. Use --apply --confirm to update products.js.');
  } else if (flags.confirm) {
    console.log('\n  Applying changes...');
    applyDiff(diff, allScraped, existingProducts);
    console.log('=== APPLY COMPLETE ===');
  } else {
    console.log('\n  --apply requires --confirm for safety.');
  }
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});

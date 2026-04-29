const fs = require('fs');
const path = require('path');

const PRODUCTS_PATH = path.join(__dirname, '../../products.js');
const CACHE_TTL_MS = 5 * 60 * 1000;
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 24;
const MAX_LIMIT = 100;

let cache = null;

function loadAndIndex() {
  const stat = fs.statSync(PRODUCTS_PATH);
  if (cache && cache.mtime === stat.mtimeMs && Date.now() - cache.loadedAt < CACHE_TTL_MS) {
    return cache;
  }

  const raw = fs.readFileSync(PRODUCTS_PATH, 'utf8');
  const jsonStr = raw.substring(raw.indexOf('['), raw.lastIndexOf(']') + 1);
  const products = JSON.parse(jsonStr);

  const indexed = products.map(p => ({
    ...p,
    _searchKey: buildSearchKey(p),
    _catKey: buildCatKey(p),
  }));

  cache = { products: indexed, mtime: stat.mtimeMs, loadedAt: Date.now() };
  return cache;
}

function buildSearchKey(p) {
  const name = (p.name || '').toLowerCase();
  const firstSku = p.variants && p.variants[0] ? p.variants[0].sku : '';
  const sid = (p.series_id || '').toLowerCase();
  return `${name} ${firstSku} ${sid}`.toLowerCase();
}

function buildCatKey(p) {
  const parts = [];
  if (p.facets) {
    if (p.facets.category) parts.push(p.facets.category);
    if (p.facets.camera_series) parts.push(p.facets.camera_series);
  }
  parts.push(p.name || '');
  return parts.join(' ').toLowerCase();
}

function filterByCategory(products, cat) {
  if (!cat) return products;
  const term = cat.toLowerCase();
  return products.filter(p => p._catKey.includes(term));
}

function filterBySearch(products, q) {
  if (!q) return products;
  const term = q.toLowerCase();
  return products.filter(p => p._searchKey.includes(term));
}

function slimProduct(p) {
  const variant = p.variants?.[0] || { price: 0, sku: 'N/A' };
  return {
    series_id: p.series_id,
    name: p.name,
    description: p.description,
    image: p.image,
    facets: p.facets,
    variant: { sku: variant.sku, price: variant.price },
    variants_count: p.variants?.length || 1,
    price_range: priceRange(p),
  };
}

function fullProduct(p) {
  const { _searchKey, _catKey, ...rest } = p;
  return rest;
}

function priceRange(p) {
  if (!p.variants || p.variants.length === 0) return null;
  const prices = p.variants.map(v => v.price).filter(n => n != null);
  if (prices.length === 0) return null;
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max ? `$${min.toFixed(2)}` : `$${min.toFixed(2)} - $${max.toFixed(2)}`;
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function cacheHeaders() {
  return { 'Cache-Control': 'public, max-age=60, s-maxage=300' };
}

function jsonBody(data, statusCode = 200) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(), ...cacheHeaders() },
    body: JSON.stringify(data),
  };
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders(), body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return jsonBody({ error: 'Method Not Allowed' }, 405);
  }

  try {
    const params = event.queryStringParameters || {};
    const cat = params.cat || '';
    const q = params.q || '';
    const page = Math.max(1, parseInt(params.page, 10) || DEFAULT_PAGE);
    const rawLimit = parseInt(params.limit, 10) || DEFAULT_LIMIT;
    const limit = Math.min(Math.max(1, rawLimit), MAX_LIMIT);
    const detail = params.detail === 'true';

    const { products: all } = loadAndIndex();

    let filtered = filterByCategory(all, cat);
    filtered = filterBySearch(filtered, q);

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(page, totalPages);
    const offset = (safePage - 1) * limit;
    const slice = filtered.slice(offset, offset + limit);
    const items = detail ? slice.map(fullProduct) : slice.map(slimProduct);

    return jsonBody({
      products: items,
      pagination: {
        page: safePage,
        limit,
        total,
        totalPages,
        hasMore: safePage < totalPages,
      },
    });
  } catch (err) {
    console.error('catalog-api error:', err);
    return jsonBody({ error: 'Internal Server Error' }, 500);
  }
};

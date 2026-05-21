const fs = require('fs');
const pdf = require('pdf-parse');

const SCRAPED_DATA = './data/scraped-data.json';
const PDF_PATH = './data/lts-pricing.pdf';
const OUTPUT = './data/final-catalog.json';

const normalizeSku = (sku) => sku ? sku.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() : '';

module.exports.buildCatalog = async () => {
  if (!fs.existsSync(SCRAPED_DATA)) {
    console.error("❌ Scraped data missing. Run scraper first.");
    return;
  }
  if (!fs.existsSync(PDF_PATH)) {
    console.error("⚠️ PDF missing at ./data/lts-pricing.pdf. Creating catalog without pricing.");
  }

  let priceMap = new Map();
  if (fs.existsSync(PDF_PATH)) {
    const dataBuffer = fs.readFileSync(PDF_PATH);
    const pdfData = await pdf(dataBuffer);
    const lines = pdfData.text.split('\n');
    lines.forEach(line => {
      // Regex detects SKU (5+ alphanumeric) followed eventually by Price
      const match = line.match(/([A-Z0-9-]{5,20})\s+.*?(\$?\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/);
      if (match) {
        priceMap.set(normalizeSku(match[1]), match[2]);
      }
    });
  }

  const webData = JSON.parse(fs.readFileSync(SCRAPED_DATA));
  const catalog = webData.images.map(item => {
    const detectedSku = item.alt.split(' ')[0]; 
    return {
      id: normalizeSku(detectedSku),
      name: item.alt,
      sku: detectedSku,
      price: priceMap.get(normalizeSku(detectedSku)) || "Request Quote",
      image: item.localPath
    };
  });

  fs.writeFileSync(OUTPUT, JSON.stringify(catalog, null, 2));
  console.log(`✅ Catalog built with ${catalog.length} items.`);
};

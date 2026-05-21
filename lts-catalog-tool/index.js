const { scrapeSite } = require('./src/scraper');
const { buildCatalog } = require('./src/catalog');
const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

console.log("==========================================");
console.log("   LTS EQUIPMENT CATALOG BUILDER v1.0    ");
console.log("==========================================");

rl.question('Enter Target Website URL to Scrape: ', async (url) => {
  if (!url) { console.log("URL required."); process.exit(1); }
  
  try {
    await scrapeSite(url);
    console.log("Processing PDF and building catalog...");
    await buildCatalog();
    console.log("\n🚀 All tasks finished. Check /data folder.");
  } catch (e) {
    console.error("Runtime Error:", e);
  } finally {
    rl.close();
    process.exit(0);
  }
});

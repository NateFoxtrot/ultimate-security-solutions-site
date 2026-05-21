const { scrapeSite } = require('./src/scraper');
const { buildCatalogs } = require('./src/catalog');
const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

console.log("\n==========================================");
console.log("   LTS DUAL CATALOG SUITE (Debug Mode)   ");
console.log("==========================================\n");

rl.question('🔗 Enter Target URL: ', async (url) => {
  if (!url) { console.log("URL required."); process.exit(1); }
  try {
    await scrapeSite(url);
    await buildCatalogs();
    console.log("\n✅ SUCCESS: Check the /data folder.");
  } catch (e) {
    console.error("\n❌ ERROR:", e);
  } finally {
    rl.close();
  }
});

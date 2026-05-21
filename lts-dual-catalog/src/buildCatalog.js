const fs = require('fs');
const path = require('path');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

const DATA_DIR = path.join(__dirname, 'data');
const OUTPUT_FILE = path.join(__dirname, 'src/components/services/catalogData.json');
pdfjsLib.GlobalWorkerOptions.workerSrc = ''; 

async function processCatalog() {
  if (!fs.existsSync(DATA_DIR)) return console.error("❌ No data folder");
  const files = fs.readdirSync(DATA_DIR).filter(f => f.toLowerCase().endsWith('.pdf'));

  console.log(`🏭 Processing ${files.length} catalogs...`);
  let fullCatalog = [];

  for (const file of files) {
    const dataBuffer = fs.readFileSync(path.join(DATA_DIR, file));
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(dataBuffer), verbosity: 0,
      standardFontDataUrl: path.join(__dirname, 'node_modules/pdfjs-dist/standard_fonts/')
    });

    try {
      const doc = await loadingTask.promise;
      console.log(`   📄 Parsing ${file}...`);
      
      let currentCategory = "General";

      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const textContent = await page.getTextContent();
        
        // 1. Coordinates & Sorting
        const items = textContent.items.map(item => ({
          str: item.str, x: item.transform[4], y: item.transform[5]
        })).sort((a, b) => b.y - a.y);

        // 2. Row Grouping
        const rows = [];
        let currentRow = { y: -9999, items: [] };
        items.forEach(item => {
          if (Math.abs(item.y - currentRow.y) < 5) currentRow.items.push(item);
          else {
            if (currentRow.items.length > 0) rows.push(currentRow);
            currentRow = { y: item.y, items: [item] };
          }
        });
        if (currentRow.items.length > 0) rows.push(currentRow);

        // 3. Logic
        rows.forEach(row => {
          row.items.sort((a, b) => a.x - b.x);
          const rowText = row.items.map(i => i.str.trim()).filter(s => s.length > 0 && s !== "HTTPS").join(" ");

          // --- FIX 1: HEADER LOGIC ---
          // Explicitly EXCLUDE "UBNT" from being a category header
          const isHeader = /^[A-Z\s\&\-\/]{4,60}$/.test(rowText) 
                           && !/[0-9]/.test(rowText)
                           && !rowText.includes("UBNT"); 

          if (isHeader) {
            currentCategory = rowText;
            return;
          }

          // --- FIX 2: SKU LOGIC ---
          // Added 'UBNT' to valid prefixes.
          // Relaxed the "must have number" rule ONLY for UBNT items, 
          // but kept it strictly for LX/LT items to avoid "LTS" false positives.
          const skuMatch = rowText.match(/\b((?:UBNT-[A-Z0-9\-]+)|(?:LX|LT|CMIP|PT)[A-Z0-9\-\.]*\d[A-Z0-9\-\.]*)\b/);
          
          if (skuMatch) {
            const sku = skuMatch[1];
            const priceMatch = rowText.match(/(Call\s*for\s*Price|\$[0-9,]+(?:\.[0-9]{2})?(?:\s*\/\s*\$[0-9,]+(?:\.[0-9]{2})?)?)/i);
            const price = priceMatch ? priceMatch[1] : "Call for Price";
            
            // Cleanup
            const cleanDesc = rowText.replace(sku, "").replace(price, "").trim().replace(/^\-\s*/, "");

            fullCatalog.push({
              id: `${sku}-${Math.random().toString(36).substr(2, 5)}`,
              category: currentCategory, // Now correctly inherits previous category instead of "UBNT..."
              sku: sku,
              price: price,
              description: cleanDesc || "No description available",
              source: file
            });
          }
        });
      }
    } catch (e) { console.error(`   ❌ Error ${file}:`, e.message); }
  }

  // Save
  const unique = fullCatalog.filter((v,i,a)=>a.findIndex(t=>(t.sku===v.sku))===i);
  const outDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(unique, null, 2));
  
  console.log(`✅ Fixed! Saved ${unique.length} items.`);
}
processCatalog();

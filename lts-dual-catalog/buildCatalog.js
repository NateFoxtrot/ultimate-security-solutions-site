const fs = require('fs');
const path = require('path');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

const DATA_DIR = path.join(__dirname, 'data');
const OUTPUT_FILE = path.join(__dirname, 'src/components/services/catalogData.json');
pdfjsLib.GlobalWorkerOptions.workerSrc = ''; 

// --- SMART FIELD PARSER ---
// classifying text lines into specific spec categories based on keywords/units
function classifySpec(text) {
  const t = text.toLowerCase();
  if (t.includes('mm') && /\d/.test(t)) return 'lens';
  if (t.includes('mp') || t.includes('resolution') || /\d{3,4}x\d{3,4}/.test(t)) return 'maxRes';
  if (t.includes('lux')) return 'minIllum';
  if (t.includes('cmos') || t.includes('scan') || t.includes('ccd')) return 'sensor';
  if (t.includes('wdr') || t.includes('matrix') || t.includes('colorvu')) return 'features';
  if (t.includes('audio') || t.includes('mic') || t.includes('speaker')) return 'audio';
  if (t.includes('alarm')) return 'alarm';
  if (t.includes('sd') || t.includes('storage') || t.includes('gb') || t.includes('tb')) return 'storage';
  if (t.includes('ip6') || t.includes('ik1') || t.includes('nema')) return 'protection';
  if (t.includes('poe') || t.includes('12v') || t.includes('24v') || t.includes('ac') || t.includes('dc')) return 'power';
  return 'other'; // Catch-all for description or generic text
}

async function processCatalog() {
  if (!fs.existsSync(DATA_DIR)) return console.error("❌ No data folder");
  const files = fs.readdirSync(DATA_DIR).filter(f => f.toLowerCase().endsWith('.pdf'));

  console.log(`🏭 Block Parsing ${files.length} catalogs...`);
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
      
      let globalCategory = "General";

      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const textContent = await page.getTextContent();
        
        // 1. Get Rows (Standard Coordinate Sort)
        const items = textContent.items.map(item => ({
          str: item.str, x: item.transform[4], y: item.transform[5]
        })).sort((a, b) => b.y - a.y);

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

        // 2. FLATTEN ROWS TO STRINGS
        const textRows = rows.map(r => {
          r.items.sort((a, b) => a.x - b.x);
          return r.items.map(i => i.str.trim()).filter(s => s.length > 0 && s !== "HTTPS").join(" ");
        });

        // 3. VERTICAL BLOCK ANALYSIS
        for (let r = 0; r < textRows.length; r++) {
          const rowText = textRows[r];

          // A. Global Category Header (e.g., "IP SAN")
          // Uppercase, no numbers, distinct from UBNT products
          if (/^[A-Z\s\&\-\/]{4,60}$/.test(rowText) && !/[0-9]/.test(rowText) && !rowText.includes("UBNT")) {
            globalCategory = rowText;
            continue;
          }

          // B. SKU DETECTED (The Anchor)
          const skuMatch = rowText.match(/\b((?:UBNT-[A-Z0-9\-]+)|(?:LX|LT|CMIP|PT)[A-Z0-9\-\.]*\d[A-Z0-9\-\.]*)\b/);
          
          if (skuMatch) {
            const sku = skuMatch[1];

            // --- STEP 1: GET MODEL TYPE (Look Up) ---
            // The user says "At the very top of the entry above the SKU is the Model Type"
            // We check the previous row. If it's the Global Category or empty, we default to Global Category.
            let modelType = globalCategory;
            if (r > 0) {
              const prevRow = textRows[r-1];
              // Ensure prev row isn't another SKU or a Price (sanity check)
              if (!prevRow.includes("$") && !prevRow.match(/LX|LT|CMIP|PT/)) {
                modelType = prevRow;
              }
            }

            // --- STEP 2: GET SPECS (Look Down) ---
            // Collect lines until we hit the next SKU or a blank gap
            let rawSpecs = [];
            // Look ahead up to 12 lines (as per user field count)
            for (let k = 1; k <= 14; k++) {
              if (r + k >= textRows.length) break;
              const nextLine = textRows[r + k];
              
              // Stop if we hit a new Header or new SKU
              if (/^[A-Z\s\&\-\/]{4,60}$/.test(nextLine) && !/[0-9]/.test(nextLine) && !nextLine.includes("UBNT")) break;
              if (nextLine.match(/\b((?:UBNT-[A-Z0-9\-]+)|(?:LX|LT|CMIP|PT)[A-Z0-9\-\.]*\d[A-Z0-9\-\.]*)\b/)) break;
              
              rawSpecs.push(nextLine);
            }

            // --- STEP 3: PARSE FIELDS ---
            // Field 1 is ALWAYS Price (per user context)
            const priceLine = rawSpecs[0] || "Call for Price";
            // Extract pure price string
            const priceMatch = priceLine.match(/(Call\s*for\s*Price|\$[0-9,]+(?:\.[0-9]{2})?(?:\s*\/\s*\$[0-9,]+(?:\.[0-9]{2})?)?)/i);
            const price = priceMatch ? priceMatch[1] : "Call for Price";

            // Map remaining lines to fields based on keywords
            let productObj = {
              id: `${sku}-${Math.random().toString(36).substr(2, 5)}`,
              category: globalCategory,
              modelType: modelType, // "Turret", "Bullet", etc.
              sku: sku,
              price: price,
              // Default fields to null
              maxRes: null, lens: null, minIllum: null, sensor: null, features: null,
              audio: null, alarm: null, storage: null, protection: null, power: null
            };

            // Analyze lines 1 to End (Skip Price line)
            for (let j = 1; j < rawSpecs.length; j++) {
              const specLine = rawSpecs[j];
              const fieldType = classifySpec(specLine);
              
              // Assign to field (if empty) or append (if multiple features)
              if (fieldType !== 'other') {
                if (!productObj[fieldType]) productObj[fieldType] = specLine;
                else productObj[fieldType] += `, ${specLine}`;
              }
            }

            fullCatalog.push(productObj);
          }
        }
      }
    } catch (e) { console.error(`   ❌ Error ${file}:`, e.message); }
  }

  // Deduplicate
  const unique = fullCatalog.filter((v,i,a)=>a.findIndex(t=>(t.sku===v.sku))===i);
  
  // Save
  const outDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(unique, null, 2));
  
  console.log(`✅ Database Rebuilt! Saved ${unique.length} Products with Deep Specs.`);
}
processCatalog();

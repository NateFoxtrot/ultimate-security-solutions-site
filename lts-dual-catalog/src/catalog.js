const fs = require('fs');
const path = require('path');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

async function parsePDF(filePath) {
  try {
    console.log(`\n📄 Processing: ${filePath}`);
    const buffer = fs.readFileSync(filePath);
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(buffer),
      verbosity: 0
    });
    const doc = await loadingTask.promise;
    
    // Grab text from page 1
    const page = await doc.getPage(1);
    const textContent = await page.getTextContent();
    const text = textContent.items.map(i => i.str).join(' ');
    
    console.log(`✅ Loaded ${doc.numPages} pages.`);
    console.log(`📝 Preview: ${text.substring(0, 150)}...`);
  } catch (err) {
    console.error(`❌ Error on ${filePath}:`, err.message);
  }
}

// MAIN LOGIC: Scan the 'data' folder
const dataDir = path.join(__dirname, '../data');

if (fs.existsSync(dataDir)) {
  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.pdf'));
  console.log(`📂 Found ${files.length} PDFs in /data`);
  
  // Loop through every PDF found
  files.forEach(file => {
    parsePDF(path.join(dataDir, file));
  });
} else {
  console.log("❌ Could not find the 'data' folder.");
}

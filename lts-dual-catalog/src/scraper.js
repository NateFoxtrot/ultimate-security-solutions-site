const puppeteer = require('puppeteer');
const fs = require('fs');
const axios = require('axios');
const sharp = require('sharp');
const slugify = require('slugify');

const MSP_KEYWORDS = ['Smart Hands', 'Structured Cabling', 'Demarc Extension', 'Rack & Stack', 'Cutover', 'Deliverables'];

const processImage = async (url, filename) => {
  try {
    const response = await axios({ url, responseType: 'arraybuffer' });
    await sharp(Buffer.from(response.data)).webp({ quality: 80 }).toFile(`images/${filename}.webp`);
    return `images/${filename}.webp`;
  } catch (error) { return null; }
};

module.exports.scrapeSite = async (targetUrl) => {
  console.log(`\n🔎 Connecting to: ${targetUrl}...`);
  // Launch with settings that work better in some Linux environments
  const browser = await puppeteer.launch({ 
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });
  
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');

  try {
    await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 30000 });
  } catch (e) {
    console.error(`❌ Could not load page: ${e.message}`);
    await browser.close();
    return;
  }

  const pageData = await page.evaluate((keywords) => {
    const bodyText = document.body.innerText;
    const detectedKeywords = keywords.filter(k => bodyText.includes(k));
    const images = Array.from(document.querySelectorAll('img')).map(img => ({
      src: img.src, alt: img.alt || 'no-alt-text'
    }));
    return { title: document.title, detectedKeywords, rawImages: images };
  }, MSP_KEYWORDS);

  console.log(`   Found ${pageData.rawImages.length} images.`);
  
  const processedImages = [];
  for (const img of pageData.rawImages) {
    if (img.src && img.src.startsWith('http')) {
      const name = slugify(img.alt, { lower: true, strict: true }) || 'img';
      const localPath = await processImage(img.src, `${name}-${Date.now()}`);
      if (localPath) processedImages.push({ ...img, localPath, skuHint: img.alt.split(' ')[0] });
    }
  }

  const output = { url: targetUrl, ...pageData, images: processedImages };
  fs.writeFileSync('data/scraped-data.json', JSON.stringify(output, null, 2));
  console.log('✅ Scrape Data Saved.');
  await browser.close();
};

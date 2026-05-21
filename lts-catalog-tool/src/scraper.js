const puppeteer = require('puppeteer');
const fs = require('fs');
const axios = require('axios');
const sharp = require('sharp');
const slugify = require('slugify');

// Configuration
const MSP_KEYWORDS = ['Smart Hands', 'Structured Cabling', 'Demarc Extension', 'Rack & Stack', 'Cutover', 'Deliverables'];

// Helper: Download and optimize to WebP
const processImage = async (url, filename) => {
  try {
    const response = await axios({ url, responseType: 'arraybuffer' });
    await sharp(Buffer.from(response.data))
      .webp({ quality: 80 })
      .toFile(`images/${filename}.webp`);
    return `images/${filename}.webp`;
  } catch (error) {
    console.error(`Error processing ${url}:`, error.message);
    return null;
  }
};

module.exports.scrapeSite = async (targetUrl) => {
  console.log(`Starting scrape for: ${targetUrl}`);
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');

  await page.goto(targetUrl, { waitUntil: 'networkidle2' });

  const pageData = await page.evaluate((keywords) => {
    const bodyText = document.body.innerText;
    const detectedKeywords = keywords.filter(k => bodyText.includes(k));
    const images = Array.from(document.querySelectorAll('img')).map(img => ({
      src: img.src,
      alt: img.alt || 'no-alt-text'
    }));
    return { title: document.title, detectedKeywords, rawImages: images };
  }, MSP_KEYWORDS);

  const processedImages = [];
  for (const img of pageData.rawImages) {
    if (img.src && !img.src.startsWith('data:')) {
      const name = slugify(img.alt, { lower: true, strict: true }) || 'image';
      const camelName = `${name}-${Date.now()}`;
      const localPath = await processImage(img.src, camelName);
      if (localPath) processedImages.push({ ...img, localPath });
    }
  }

  const output = { url: targetUrl, ...pageData, images: processedImages };
  fs.writeFileSync('data/scraped-data.json', JSON.stringify(output, null, 2));
  console.log('✅ Scrape Complete. Data saved.');
  await browser.close();
  return output;
};

const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    try {
        const browser = await puppeteer.connect({
            browserURL: 'http://localhost:9222',
            defaultViewport: null
        });

        const pages = await browser.pages();
        const ltsPages = pages.filter(p => p.url().includes('ltsecurityinc.com'));

        if (ltsPages.length === 0) {
            console.error('No LTS pages found in open tabs.');
            process.exit(1);
        }

        for (let i = 0; i < ltsPages.length; i++) {
            const page = ltsPages[i];
            console.log(`Scraping page ${i+1}: ${page.url()}`);
            const content = await page.content();
            const filename = `lts_page_${i+1}.html`;
            fs.writeFileSync(filename, content);
            console.log(`✅ Saved to ${filename}`);
        }

        await browser.disconnect();
    } catch (err) {
        console.error('Error connecting to browser:', err.message);
        process.exit(1);
    }
})();

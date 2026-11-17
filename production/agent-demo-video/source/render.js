const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const mode = process.argv[2] || 'stills';
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 720, height: 424 }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.resolve('index.html') + '?t=0');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  if (mode === 'stills') {
    const times = (process.argv[3] || '0.3,1.2,2.1,2.5,3.0,3.8,4.5').split(',').map(Number);
    for (const t of times) { await page.evaluate((t) => window.render(t), t); await page.screenshot({ path: `stills/t${t.toFixed(2)}.png` }); }
  } else {
    const fps = 30, L = await page.evaluate(() => window.LENGTH), N = Math.round(L * fps);
    for (let i = 0; i < N; i++) { await page.evaluate((t) => window.render(t), i / fps); await page.screenshot({ path: `frames/f${String(i).padStart(5, '0')}.png` }); }
  }
  await browser.close();
})();

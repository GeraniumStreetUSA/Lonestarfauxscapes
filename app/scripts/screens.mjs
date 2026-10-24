// Homepage screenshots for review, in QA mode (no motion).
//
//   node scripts/screens.mjs [baseUrl]      default http://localhost:5180
//
// Writes to .screens/ (gitignored): first viewport and full page at 1440x900
// and 390x844, plus the estimator with the run set to 180 ft (the corner
// wrap). Playwright comes from the repo root's node_modules.

import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(here, '..');
const require = createRequire(path.join(appRoot, '..', 'package.json'));
const { chromium } = require('playwright');

const base = process.argv[2] ?? 'http://localhost:5180';
const outDir = path.join(appRoot, '.screens');

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
];

async function ready(page) {
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.fonts.ready);
  // Lazy images below the fold: scroll the page once so they all load, then
  // wait for every image, so the full-page shot is complete.
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.8);
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
    await Promise.all(
      Array.from(document.images).map((img) =>
        img.complete && img.naturalWidth > 0
          ? null
          : new Promise((r) => {
              img.addEventListener('load', r, { once: true });
              img.addEventListener('error', r, { once: true });
              setTimeout(r, 4000);
            }),
      ),
    );
  });
}

async function main() {
  await mkdir(outDir, { recursive: true });
  const browser = await chromium.launch();

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: vp.deviceScaleFactor ?? 1,
      isMobile: vp.isMobile ?? false,
      hasTouch: vp.hasTouch ?? false,
    });
    const page = await context.newPage();
    await page.goto(`${base}/?qa=1`);
    await ready(page);

    await page.screenshot({ path: path.join(outDir, `${vp.name}-first-viewport.png`) });
    await page.screenshot({ path: path.join(outDir, `${vp.name}-full.png`), fullPage: true });

    // The corner wrap: type 180 into the run field and commit with Enter.
    const run = page.getByLabel('Run length (ft)', { exact: true }).and(page.locator('input[type="number"]'));
    await run.fill('180');
    await run.press('Enter');
    await page.locator('#estimate').scrollIntoViewIfNeeded();
    await page.evaluate(() => document.getElementById('estimate')?.scrollIntoView({ block: 'start' }));
    await page.waitForTimeout(150);
    await page.screenshot({ path: path.join(outDir, `${vp.name}-run-180.png`) });
    await page.locator('#estimate').screenshot({ path: path.join(outDir, `${vp.name}-estimator-run-180.png`) });

    await context.close();
    console.log(`${vp.name}: done`);
  }

  await browser.close();
  console.log(`screens -> ${path.relative(process.cwd(), outDir) || outDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

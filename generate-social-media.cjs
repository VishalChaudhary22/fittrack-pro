const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const htmlPath = path.resolve(__dirname, 'social-media-graphics.html');
  const outDir = __dirname;

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 2400, height: 2000 });
  await page.goto('file://' + htmlPath, { waitUntil: 'networkidle' });

  // Screenshot square
  const square = await page.$('#square');
  await square.screenshot({ path: path.join(outDir, 'social_media_post_1080x1080.png') });
  console.log('Saved: social_media_post_1080x1080.png');

  // Screenshot story
  const story = await page.$('#story');
  await story.screenshot({ path: path.join(outDir, 'social_media_story_1080x1920.png') });
  console.log('Saved: social_media_story_1080x1920.png');

  // Screenshot banner
  const banner = await page.$('#banner');
  await banner.screenshot({ path: path.join(outDir, 'social_media_banner_1200x627.png') });
  console.log('Saved: social_media_banner_1200x627.png');

  await browser.close();
})();

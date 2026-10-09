// Renders the site's image slots from the 3D scenes via headless Chromium.
// Usage: npm run dev (in another terminal), then: node scripts/render-images.mjs [shot ...]
// Requires playwright-core and a Chromium (CHROME_PATH). Output: public/images/<file>.jpg
import fs from "node:fs";
import path from "node:path";

const { chromium } = await import(process.env.PLAYWRIGHT_CORE ?? "playwright-core");
const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const OUT = process.env.OUT_DIR ?? path.join(process.cwd(), "public/images");

export const JOBS = {
  hero: { file: "hero-jet-dusk.jpg", w: 2400, h: 1350 },
  jets: { file: "private-jet-exterior.jpg", w: 2400, h: 1350 },
  corporate: { file: "corporate-travel.jpg", w: 2000, h: 1500 },
  bespoke: { file: "bespoke-travel.jpg", w: 2400, h: 1350 },
  vip: { file: "vip-event.jpg", w: 2400, h: 1350 },
  group: { file: "group-travel.jpg", w: 2000, h: 1500 },
  apron: { file: "apron-night.jpg", w: 2400, h: 1350 },
  about: { file: "about-skyline.jpg", w: 2400, h: 1350 },
  cta: { file: "cta-aircraft.jpg", w: 2400, h: 1350 },
  helicopter: { file: "helicopter-scenic.jpg", w: 2400, h: 1350 },
  wedding: { file: "destination-wedding.jpg", w: 2000, h: 1600 },
  interior: { file: "cabin-interior.jpg", w: 2400, h: 1350 },
  private: { file: "private-journeys.jpg", w: 2000, h: 1500 },
};

const only = process.argv.slice(2);
const scale = Number(process.env.SCALE ?? 1);
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH, args: ["--no-sandbox", "--ignore-gpu-blocklist"] });
fs.mkdirSync(OUT, { recursive: true });
for (const [shot, job] of Object.entries(JOBS)) {
  if (only.length && !only.includes(shot)) continue;
  const w = Math.round(job.w * scale), h = Math.round(job.h * scale);
  const page = await browser.newPage({ viewport: { width: Math.min(w, 3000), height: Math.min(h, 2000) } });
  page.on("pageerror", (e) => console.error(shot, "pageerror", e.message));
  page.on("console", (m) => { if (m.type() === "error") console.error(shot, m.text()); });
  const t0 = Date.now();
  await page.goto(`${BASE}/studio?shot=${shot}&w=${w}&h=${h}`, { waitUntil: "load" });
  await page.waitForFunction(() => window.__ready || window.__error, null, { timeout: 600000 });
  const err = await page.evaluate(() => window.__error);
  if (err) { console.error(shot, err); await page.close(); continue; }
  const data = await page.evaluate(() => window.__capture(0.88));
  const file = path.join(OUT, job.file);
  fs.writeFileSync(file, Buffer.from(data.split(",")[1], "base64"));
  console.log(`${shot} -> ${path.relative(process.cwd(), file)} (${w}x${h}, ${((Date.now() - t0) / 1000).toFixed(1)}s)`);
  await page.close();
}
await browser.close();

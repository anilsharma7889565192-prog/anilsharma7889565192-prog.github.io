// Renders the home-page scroll journey from the project's own 3D engine, then encodes it with ffmpeg.
// Usage: npm run dev (other terminal), then: node scripts/render-journey.mjs
// Output: public/media/journey.mp4, journey.webm and journey-poster.jpg
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const { chromium } = await import(process.env.PLAYWRIGHT_CORE ?? "playwright-core");
const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const OUT = path.join(process.cwd(), "public/media");
const W = Number(process.env.W ?? 1280), H = Number(process.env.H ?? 720), FRAMES = Number(process.env.FRAMES ?? 144), FPS = 24;
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "journey-"));
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH, args: ["--no-sandbox", "--ignore-gpu-blocklist"] });
const page = await browser.newPage({ viewport: { width: W, height: H } });
page.on("pageerror", (e) => console.error("pageerror", e.message));
await page.goto(`${BASE}/studio?shot=journey&w=${W}&h=${H}`, { waitUntil: "load" });
await page.waitForFunction(() => window.__ready || window.__error, null, { timeout: 600000 });
const err = await page.evaluate(() => window.__error);
if (err) throw new Error(err);
for (let i = 0; i < FRAMES; i++) {
  const data = await page.evaluate((p) => window.__frame(p, 0.92), i / (FRAMES - 1));
  fs.writeFileSync(path.join(tmp, `f${String(i).padStart(4, "0")}.jpg`), Buffer.from(data.split(",")[1], "base64"));
  if (i % 12 === 0) console.log(`frame ${i}/${FRAMES}`);
}
await browser.close();
fs.copyFileSync(path.join(tmp, "f0000.jpg"), path.join(OUT, "journey-poster.jpg"));
const r = spawnSync("ffmpeg", ["-y", "-framerate", String(FPS), "-i", path.join(tmp, "f%04d.jpg"), "-c:v", "libx264", "-preset", "slow", "-crf", "26", "-g", "3", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", path.join(OUT, "journey.mp4")], { stdio: "inherit" });
if (r.status !== 0) throw new Error("ffmpeg failed");
const w = spawnSync("ffmpeg", ["-y", "-loglevel", "error", "-i", path.join(OUT, "journey.mp4"), "-c:v", "libvpx-vp9", "-crf", "34", "-b:v", "0", "-g", "3", "-row-mt", "1", "-an", path.join(OUT, "journey.webm")], { stdio: "inherit" });
if (w.status !== 0) throw new Error("ffmpeg webm failed");
fs.rmSync(tmp, { recursive: true, force: true });
console.log("done:", fs.statSync(path.join(OUT, "journey.mp4")).size, "bytes");

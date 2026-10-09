// Precomputes land dots for the dot-matrix globe from Natural Earth (public domain) via world-atlas.
// Run: node scripts/build-globe.mjs  -> src/three/data/land-dots.json
import fs from "node:fs";
import { feature } from "topojson-client";

const topo = JSON.parse(fs.readFileSync(new URL("../node_modules/world-atlas/land-110m.json", import.meta.url)));
const land = feature(topo, topo.objects.land);
const polys = [];
for (const f of land.features) {
  const g = f.geometry;
  const list = g.type === "Polygon" ? [g.coordinates] : g.coordinates;
  for (const p of list) {
    const ring = p[0];
    let minX = 180, maxX = -180, minY = 90, maxY = -90;
    for (const [x, y] of ring) { minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y); }
    polys.push({ rings: p, bbox: [minX, minY, maxX, maxY] });
  }
}
const inRing = (x, y, ring) => {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
};
const isLand = (lon, lat) => polys.some((p) => lon >= p.bbox[0] && lon <= p.bbox[2] && lat >= p.bbox[1] && lat <= p.bbox[3] && inRing(lon, lat, p.rings[0]) && !p.rings.slice(1).some((h) => inRing(lon, lat, h)));

const N = 42000, out = [];
const golden = Math.PI * (3 - Math.sqrt(5));
for (let i = 0; i < N; i++) {
  const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = golden * i;
  const lat = (Math.asin(y) * 180) / Math.PI;
  let lon = ((Math.atan2(Math.sin(th) * r, Math.cos(th) * r) * 180) / Math.PI);
  if (lat < -60) continue; // skip Antarctica for a cleaner silhouette
  if (isLand(lon, lat)) out.push(Math.round(lat * 10), Math.round(lon * 10));
}
fs.mkdirSync(new URL("../src/three/data/", import.meta.url), { recursive: true });
fs.writeFileSync(new URL("../src/three/data/land-dots.json", import.meta.url), JSON.stringify(out));
console.log(`${out.length / 2} land dots`);

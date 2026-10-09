import * as THREE from "three";

/** Deterministic PRNG so renders are reproducible. */
export function rng(seed = 1) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 2D gradient noise (Perlin-style) in [-1, 1]. */
export function makeNoise2D(seed = 7) {
  const r = rng(seed);
  const perm = new Uint8Array(512);
  const p = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
  const grad = (h: number, x: number, y: number) => {
    const g = h & 7;
    const u = g < 4 ? x : y;
    const v = g < 4 ? y : x;
    return (g & 1 ? -u : u) + (g & 2 ? -2 * v : 2 * v);
  };
  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
  return (x: number, y: number) => {
    const X = Math.floor(x) & 255, Y = Math.floor(y) & 255;
    x -= Math.floor(x); y -= Math.floor(y);
    const u = fade(x), v = fade(y);
    const a = perm[X] + Y, b = perm[X + 1] + Y;
    const l1 = THREE.MathUtils.lerp(grad(perm[a], x, y), grad(perm[b], x - 1, y), u);
    const l2 = THREE.MathUtils.lerp(grad(perm[a + 1], x, y - 1), grad(perm[b + 1], x - 1, y - 1), u);
    return THREE.MathUtils.lerp(l1, l2, v) * 0.5;
  };
}

export function fbm2(noise: (x: number, y: number) => number, x: number, y: number, oct = 5, lac = 2, gain = 0.5) {
  let a = 0.5, f = 1, s = 0;
  for (let i = 0; i < oct; i++) { s += a * noise(x * f, y * f); f *= lac; a *= gain; }
  return s;
}

export function canvas(w: number, h: number) {
  const c = typeof OffscreenCanvas !== "undefined" ? new OffscreenCanvas(w, h) : Object.assign(document.createElement("canvas"), { width: w, height: h });
  const ctx = c.getContext("2d") as CanvasRenderingContext2D;
  return { c, ctx };
}

export function canvasTexture(c: HTMLCanvasElement | OffscreenCanvas, srgb = true, repeat = false) {
  const t = new THREE.CanvasTexture(c as HTMLCanvasElement);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 8;
  t.needsUpdate = true;
  return t;
}

/** Soft radial gradient used for glows and contact shadows. */
export function radialTexture(inner = "rgba(0,0,0,1)", outer = "rgba(0,0,0,0)", size = 256, stop = 0) {
  const { c, ctx } = canvas(size, size);
  const g = ctx.createRadialGradient(size / 2, size / 2, size * stop * 0.5, size / 2, size / 2, size / 2);
  g.addColorStop(0, inner);
  g.addColorStop(1, outer);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return canvasTexture(c, false);
}

export const lin = (hex: string) => new THREE.Color(hex);
export const smooth = (a: number, b: number, x: number) => {
  const t = THREE.MathUtils.clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

/** Average normals of coincident seam vertices so wrapped surfaces shade without a visible seam. */
export function weldSeamNormals(geo: THREE.BufferGeometry, ringSize: number, rings: number) {
  const n = geo.attributes.normal as THREE.BufferAttribute;
  const v = new THREE.Vector3(), w = new THREE.Vector3();
  for (let i = 0; i < rings; i++) {
    const a = i * (ringSize + 1), b = a + ringSize;
    v.fromBufferAttribute(n, a); w.fromBufferAttribute(n, b);
    v.add(w).normalize();
    n.setXYZ(a, v.x, v.y, v.z); n.setXYZ(b, v.x, v.y, v.z);
  }
  n.needsUpdate = true;
}

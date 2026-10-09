import * as THREE from "three";
import { weldSeamNormals } from "../core/util";

/** Closed tube surface: fn(t, theta) gives a point; t runs along the body, theta around it. UV = (theta/2π, t). */
export function tube(rings: number, segs: number, fn: (t: number, th: number) => THREE.Vector3, tMap: (i: number) => number = (i) => i / rings) {
  const pos: number[] = [], uv: number[] = [], idx: number[] = [];
  for (let i = 0; i <= rings; i++) {
    const t = tMap(i);
    for (let j = 0; j <= segs; j++) {
      const th = (j / segs) * Math.PI * 2;
      const p = fn(t, th);
      pos.push(p.x, p.y, p.z);
      uv.push(j / segs, t);
    }
  }
  for (let i = 0; i < rings; i++) for (let j = 0; j < segs; j++) {
    const a = i * (segs + 1) + j, b = a + segs + 1;
    idx.push(a, b, a + 1, b, b + 1, a + 1);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  weldSeamNormals(g, segs, rings + 1);
  return g;
}

/** NACA-style 4-digit airfoil loop (TE upper -> LE -> TE lower), unit chord. */
export function airfoil(k: number, camber: number, thick: number, p = 0.4): [number, number][] {
  const pts: [number, number][] = [];
  const yt = (x: number) => 5 * thick * (0.2969 * Math.sqrt(x) - 0.126 * x - 0.3516 * x * x + 0.2843 * x ** 3 - 0.1036 * x ** 4);
  const yc = (x: number) => (camber === 0 ? 0 : x < p ? (camber / (p * p)) * (2 * p * x - x * x) : (camber / ((1 - p) ** 2)) * (1 - 2 * p + 2 * p * x - x * x));
  for (let i = 0; i <= k; i++) { const x = (1 - Math.cos((1 - i / k) * Math.PI)) / 2; pts.push([x, yc(x) + yt(x)]); }
  for (let i = 1; i < k; i++) { const x = (1 - Math.cos((i / k) * Math.PI)) / 2; pts.push([x, yc(x) - yt(x)]); }
  return pts;
}

export type Section = { o: THREE.Vector3; chord: number; thick: number; camber?: number; t: THREE.Vector3; c?: THREE.Vector3 };

/** Loft airfoil sections into a surface (with a fan cap on the last section). */
export function loft(sections: Section[], k = 28, capStart = false) {
  const pos: number[] = [], idx: number[] = [];
  const loops = sections.map((s) => {
    const c = s.c ?? new THREE.Vector3(-1, 0, 0);
    return airfoil(k, s.camber ?? 0, s.thick).map(([x, y]) => s.o.clone().addScaledVector(c, x * s.chord).addScaledVector(s.t, y * s.chord));
  });
  const n = loops[0].length;
  loops.forEach((l) => l.forEach((p) => pos.push(p.x, p.y, p.z)));
  for (let i = 0; i < loops.length - 1; i++) for (let j = 0; j < n; j++) {
    const a = i * n + j, b = i * n + ((j + 1) % n), c = a + n, d = b + n;
    idx.push(a, c, b, b, c, d);
  }
  const cap = (li: number, flip: boolean) => {
    const l = loops[li];
    const ctr = l.reduce((acc, p) => acc.add(p), new THREE.Vector3()).multiplyScalar(1 / n);
    const ci = pos.length / 3;
    pos.push(ctr.x, ctr.y, ctr.z);
    for (let j = 0; j < n; j++) {
      const a = li * n + j, b = li * n + ((j + 1) % n);
      if (flip) idx.push(ci, a, b); else idx.push(ci, b, a);
    }
  };
  cap(loops.length - 1, false);
  if (capStart) cap(0, true);
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

/** Revolve a (radius, axial) profile around the X axis; axial grows towards +X. */
export function revolveX(profile: [number, number][], segs = 48) {
  const g = new THREE.LatheGeometry(profile.map(([r, h]) => new THREE.Vector2(Math.max(r, 1e-4), h)), segs);
  g.rotateZ(-Math.PI / 2);
  return g;
}

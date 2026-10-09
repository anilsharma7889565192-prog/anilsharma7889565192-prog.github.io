import * as THREE from "three";
import { rng } from "./util";

/** Rows of small emissive airfield lights; values > 1 drive the bloom. */
export function lightRow(points: THREE.Vector3[], color: string, intensity = 6, size = 0.09) {
  const geo = new THREE.SphereGeometry(size, 10, 8);
  const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensity), fog: false });
  const mesh = new THREE.InstancedMesh(geo, mat, points.length);
  const m = new THREE.Matrix4();
  points.forEach((p, i) => { m.makeTranslation(p.x, p.y, p.z); mesh.setMatrixAt(i, m); });
  mesh.frustumCulled = false;
  return mesh;
}

export function line(from: THREE.Vector3, to: THREE.Vector3, step: number, y = 0.12) {
  const pts: THREE.Vector3[] = [];
  const len = from.distanceTo(to);
  for (let d = 0; d <= len; d += step) pts.push(from.clone().lerp(to, d / len).setY(y));
  return pts;
}

/** Halo sprites that read as glow even where bloom is subtle (distance, fog). */
export function halos(points: THREE.Vector3[], color: string, scale = 1.2, opacity = 0.5) {
  const size = 64;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.2, "rgba(255,255,255,0.35)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  const geo = new THREE.BufferGeometry().setFromPoints(points);
  const mat = new THREE.PointsMaterial({ map: tex, color: new THREE.Color(color), size: scale, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true, fog: false });
  const pts = new THREE.Points(geo, mat);
  pts.layers.set(1); // visible to the main camera only, not to mirror reflections
  return pts;
}

/** Distant skyline / hangar silhouettes with sparse lit windows. */
export function skyline(opts: { z: number; x0: number; x1: number; seed?: number; color?: string; maxH?: number; lit?: string; density?: number }) {
  const r = rng(opts.seed ?? 5);
  const group = new THREE.Group();
  const body = new THREE.MeshStandardMaterial({ color: opts.color ?? "#10141c", roughness: 0.9, metalness: 0 });
  const windows: THREE.Vector3[] = [];
  let x = opts.x0;
  while (x < opts.x1) {
    const w = 8 + r() * 30, h = 4 + r() * (opts.maxH ?? 22), d = 10 + r() * 20;
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), body);
    m.position.set(x + w / 2, h / 2, opts.z - r() * 40);
    group.add(m);
    const rows = Math.floor(h / 3.2);
    for (let i = 0; i < rows; i++) for (let j = 0; j < w / 3; j++) {
      if (r() < (opts.density ?? 0.18)) windows.push(new THREE.Vector3(x + 1.5 + j * 3, 2 + i * 3.2, m.position.z + d / 2 + 0.05));
    }
    x += w + r() * 6;
  }
  if (windows.length) group.add(lightRow(windows, opts.lit ?? "#ffcf8a", 2.2, 0.35));
  return group;
}

/** Apron floodlight mast with a warm lamp head. */
export function floodMast(pos: THREE.Vector3, height = 22, color = "#ffd29a") {
  const g = new THREE.Group();
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.28, height, 8), new THREE.MeshStandardMaterial({ color: "#1a1d23", roughness: 0.6, metalness: 0.4 }));
  pole.position.y = height / 2;
  g.add(pole);
  const lamps: THREE.Vector3[] = [];
  for (let i = -1; i <= 1; i++) lamps.push(new THREE.Vector3(i * 0.7, height + 0.4, 0));
  g.add(lightRow(lamps, color, 9, 0.32));
  g.add(halos(lamps, color, 9, 0.35));
  g.position.copy(pos);
  return g;
}

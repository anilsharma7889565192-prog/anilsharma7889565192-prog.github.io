import * as THREE from "three";
import { canvas, canvasTexture, rng } from "../core/util";
import { halos, lightRow } from "../core/lights";

/** Contemporary private-aviation terminal: glazed facade, cantilevered roof, warm interior. No signage. */
export function createTerminal(opts: { width?: number; glow?: number; seed?: number } = {}) {
  const W = opts.width ?? 48, H = 7.2, D = 18;
  const group = new THREE.Group();
  const r = rng(opts.seed ?? 4);

  // Facade texture: warm interior seen through glazing, mullions, furniture silhouettes.
  const { c, ctx } = canvas(2048, 384);
  const g = ctx.createLinearGradient(0, 0, 0, 384);
  g.addColorStop(0, "#ffe2b8"); g.addColorStop(0.18, "#f0b77a"); g.addColorStop(0.62, "#9a6a45"); g.addColorStop(0.74, "#3a2a22"); g.addColorStop(1, "#24201d");
  ctx.fillStyle = g; ctx.fillRect(0, 0, 2048, 384);
  // ceiling downlights
  for (let i = 0; i < 46; i++) { const x = 20 + i * 44.5; const rg = ctx.createRadialGradient(x, 26, 0, x, 26, 40); rg.addColorStop(0, "rgba(255,248,230,1)"); rg.addColorStop(1, "rgba(255,240,210,0)"); ctx.fillStyle = rg; ctx.fillRect(x - 40, 0, 80, 80); }
  // back wall warm panels
  for (let i = 0; i < 9; i++) { ctx.fillStyle = `rgba(255,${200 + r() * 30},${150 + r() * 40},0.25)`; ctx.fillRect(i * 230 + 30, 120, 160, 110); }
  // furniture silhouettes
  ctx.fillStyle = "rgba(25,18,14,0.85)";
  for (let i = 0; i < 14; i++) { const x = r() * 1950, w = 60 + r() * 120, h = 26 + r() * 30; ctx.fillRect(x, 300 - h, w, h); }
  for (let i = 0; i < 6; i++) { const x = r() * 2000; ctx.beginPath(); ctx.ellipse(x, 250, 18, 46, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillRect(x - 6, 270, 12, 30); }
  // mullions + transom
  ctx.fillStyle = "#14161a";
  for (let i = 0; i <= 20; i++) ctx.fillRect(i * 102.4 - 3, 0, 6, 384);
  ctx.fillRect(0, 86, 2048, 4);
  const facadeTex = canvasTexture(c);
  const glass = new THREE.MeshBasicMaterial({ map: facadeTex, color: new THREE.Color(1, 1, 1).multiplyScalar(opts.glow ?? 0.9) });
  const facade = new THREE.Mesh(new THREE.PlaneGeometry(W, H), glass);
  facade.position.set(0, H / 2, D / 2);
  group.add(facade);

  const stone = new THREE.MeshStandardMaterial({ color: "#5e5a55", roughness: 0.8 });
  const dark = new THREE.MeshStandardMaterial({ color: "#121418", roughness: 0.7, metalness: 0.2 });
  const box = (w: number, h: number, d: number, m: THREE.Material, x: number, y: number, z: number) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
    mesh.position.set(x, y, z); mesh.castShadow = true; mesh.receiveShadow = true; group.add(mesh); return mesh;
  };
  box(W, H, D - 0.2, dark, 0, H / 2, -0.1);
  box(3.5, H + 0.4, D + 0.6, stone, -W / 2 - 1.75, (H + 0.4) / 2, 0);
  box(3.5, H + 0.4, D + 0.6, stone, W / 2 + 1.75, (H + 0.4) / 2, 0);
  // cantilevered roof
  const roof = box(W + 12, 0.7, D + 8, new THREE.MeshStandardMaterial({ color: "#d8d4cc", roughness: 0.6 }), 0, H + 0.6, 3);
  roof.castShadow = true;
  // soffit downlights
  const dl: THREE.Vector3[] = [];
  for (let i = 0; i < 18; i++) for (let j = 0; j < 2; j++) dl.push(new THREE.Vector3(-W / 2 - 2 + i * ((W + 4) / 17), H + 0.22, D / 2 + 1.4 + j * 2.2));
  group.add(lightRow(dl, "#fff0d6", 10, 0.11));
  group.add(halos(dl, "#ffe3b8", 1.6, 0.35));
  // slim canopy columns
  for (let i = 0; i < 7; i++) box(0.35, H + 0.2, 0.35, dark, -W / 2 + 2 + i * ((W - 4) / 6), (H + 0.2) / 2, D / 2 + 5.2);
  // second volume (hangar) behind
  box(W * 0.9, H * 1.9, D * 1.4, new THREE.MeshStandardMaterial({ color: "#191c22", roughness: 0.85 }), W * 0.15, H * 0.95, -D * 1.3);

  const warm = new THREE.PointLight("#ffbf80", 220, 60, 1.6);
  warm.position.set(0, 4, D / 2 + 6);
  group.add(warm);
  return { group, frontZ: D / 2, width: W };
}

import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { canvas, canvasTexture, makeNoise2D, fbm2 } from "../core/util";
import { tube } from "../models/surface";
import type { SceneContext, SceneSetup } from "../core/stage";

const CY = 0.62, R = 1.3, X0 = -5.2, X1 = 4.4;
const wallZ = (y: number) => Math.sqrt(Math.max(0, R * R - (y - CY) ** 2));

function leatherTex(base: string, quilt = false) {
  const S = 512;
  const { c, ctx } = canvas(S, S);
  const n = makeNoise2D(4);
  const img = ctx.createImageData(S, S);
  const b = new THREE.Color(base);
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const v = 1 + fbm2(n, x / 9, y / 9, 3) * 0.06;
    const i = (y * S + x) * 4;
    img.data[i] = Math.min(255, b.r * 255 * v); img.data[i + 1] = Math.min(255, b.g * 255 * v); img.data[i + 2] = Math.min(255, b.b * 255 * v); img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  if (quilt) { ctx.strokeStyle = "rgba(90,70,50,0.25)"; ctx.lineWidth = 2; for (let y = 32; y < S; y += 64) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(S, y); ctx.stroke(); } }
  const t = canvasTexture(c, true, true);
  return t;
}

function walnutTex() {
  const W = 1024, H = 256;
  const { c, ctx } = canvas(W, H);
  const n = makeNoise2D(9);
  const img = ctx.createImageData(W, H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const g = Math.sin((y + fbm2(n, x / 160, y / 30, 4) * 60) * 0.35) * 0.5 + 0.5;
    const v = 0.55 + g * 0.25 + fbm2(n, x / 20, y / 6, 2) * 0.08;
    const i = (y * W + x) * 4;
    img.data[i] = 92 * v + 20; img.data[i + 1] = 58 * v + 10; img.data[i + 2] = 36 * v + 6; img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return canvasTexture(c, true, true);
}

function windowView() {
  const { c, ctx } = canvas(256, 384);
  const g = ctx.createLinearGradient(0, 0, 0, 384);
  g.addColorStop(0, "#3b5a8f"); g.addColorStop(0.45, "#c9a3a0"); g.addColorStop(0.62, "#ffcf98"); g.addColorStop(0.66, "#f4d7c0"); g.addColorStop(1, "#b6b2c6");
  ctx.fillStyle = g; ctx.fillRect(0, 0, 256, 384);
  return canvasTexture(c);
}

function cookie() {
  // projected window light pattern (bright rounded windows on black)
  const { c, ctx } = canvas(1024, 512);
  ctx.fillStyle = "#000"; ctx.fillRect(0, 0, 1024, 512);
  ctx.filter = "blur(6px)";
  ctx.fillStyle = "#fff";
  for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.roundRect(40 + i * 165, 150, 95, 190, 44); ctx.fill(); }
  ctx.filter = "none";
  const t = canvasTexture(c);
  return t;
}

type Mats = { leather: THREE.Material; leatherDark: THREE.Material; walnut: THREE.Material; trim: THREE.Material };

function seat(m: Mats) {
  const g = new THREE.Group();
  const rb = (w: number, h: number, d: number, r: number) => new RoundedBoxGeometry(d, h, w, 4, r);
  const add = (geo: THREE.BufferGeometry, mat: THREE.Material, x: number, y: number, z: number, rz = 0) => {
    const mesh = new THREE.Mesh(geo, mat); mesh.position.set(x, y, z); mesh.rotation.z = rz; mesh.castShadow = true; mesh.receiveShadow = true; g.add(mesh); return mesh;
  };
  add(new THREE.CylinderGeometry(0.2, 0.26, 0.18, 24), m.trim, 0, 0.09, 0);
  add(rb(0.5, 0.2, 0.5, 0.05), m.leatherDark, 0, 0.27, 0);
  add(rb(0.6, 0.17, 0.62, 0.07), m.leather, 0.02, 0.45, 0);
  add(rb(0.58, 0.66, 0.16, 0.075), m.leather, -0.3, 0.83, 0, 0.2);
  add(rb(0.42, 0.17, 0.12, 0.06), m.leather, -0.37, 1.2, 0, 0.2);
  for (const z of [-0.33, 0.33]) add(rb(0.11, 0.17, 0.58, 0.05), m.leather, 0.0, 0.6, z);
  return g;
}

function flute() {
  const glass = new THREE.MeshPhysicalMaterial({ color: "#ffffff", roughness: 0.03, transmission: 1, thickness: 0.004, ior: 1.5, transparent: true, opacity: 1 });
  const wine = new THREE.MeshPhysicalMaterial({ color: "#e9c27a", roughness: 0.1, transmission: 0.6, thickness: 0.03, ior: 1.33 });
  const g = new THREE.Group();
  const prof = [[0.0, 0], [0.032, 0.002], [0.028, 0.006], [0.004, 0.012], [0.004, 0.1], [0.018, 0.13], [0.026, 0.19], [0.027, 0.24], [0.026, 0.245]].map(([x, y]) => new THREE.Vector2(x, y));
  g.add(new THREE.Mesh(new THREE.LatheGeometry(prof, 32), glass));
  const liq = [[0, 0.115], [0.016, 0.135], [0.023, 0.18], [0.024, 0.205], [0, 0.205]].map(([x, y]) => new THREE.Vector2(x, y));
  g.add(new THREE.Mesh(new THREE.LatheGeometry(liq, 32), wine));
  return g;
}

export function createCabinScene(ctx: SceneContext, shot: "interior" | "private"): SceneSetup {
  RectAreaLightUniformsLib.init();
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#120e0b");
  const pmrem = new THREE.PMREMGenerator(ctx.renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.3;
  pmrem.dispose();

  const leather = new THREE.MeshPhysicalMaterial({ map: leatherTex("#e8dfcd"), roughness: 0.55, sheen: 0.4, sheenColor: new THREE.Color("#fff3df"), sheenRoughness: 0.6 });
  (leather.map as THREE.Texture).repeat.set(2, 2);
  const leatherDark = new THREE.MeshPhysicalMaterial({ map: leatherTex("#6b5644"), roughness: 0.6 });
  const wt = walnutTex();
  const walnut = new THREE.MeshPhysicalMaterial({ map: wt, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.08 });
  const trim = new THREE.MeshStandardMaterial({ color: "#c9ab72", roughness: 0.22, metalness: 1 });
  const m: Mats = { leather, leatherDark, walnut, trim };

  // Shell: sidewalls and ceiling (inside of a tube)
  const shellTex = (() => {
    const W = 1024, H = 1024; const { c, ctx: x } = canvas(W, H);
    const TAU = Math.PI * 2;
    const X = (th: number) => (th / TAU) * W;
    x.fillStyle = "#e6ddcd"; x.fillRect(0, 0, W, H);
    x.fillStyle = "#f6f2ea"; x.fillRect(X(TAU - 0.38), 0, X(0.38) + (W - X(TAU - 0.38)), H); x.fillRect(0, 0, X(0.38), H);
    x.fillStyle = "#a8927a"; // lower sidewall leather
    x.fillRect(X(1.62), 0, X(TAU - 1.62) - X(1.62), H);
    // lengthwise panel joints (u = around, v = along the cabin)
    x.strokeStyle = "rgba(110,92,74,0.35)"; x.lineWidth = 2;
    for (const th of [0.38, 1.0, 1.62, TAU - 1.62, TAU - 1.0, TAU - 0.38]) { x.beginPath(); x.moveTo(X(th), 0); x.lineTo(X(th), H); x.stroke(); }
    const t = canvasTexture(c); t.flipY = false; return t;
  })();
  const shell = tube(60, 96, (t, th) => new THREE.Vector3(X0 + t * (X1 - X0), CY + R * Math.cos(th), R * Math.sin(th)));
  // x runs forward here, so the tube's front faces already point inwards
  const shellMesh = new THREE.Mesh(shell, new THREE.MeshStandardMaterial({ map: shellTex, roughness: 0.8 }));
  shellMesh.receiveShadow = true;
  scene.add(shellMesh);

  // Floor
  const carpet = (() => {
    const S = 512; const { c, ctx: x } = canvas(S, S);
    const n = makeNoise2D(2); const img = x.createImageData(S, S);
    for (let yy = 0; yy < S; yy++) for (let xx = 0; xx < S; xx++) {
      const v = 0.85 + fbm2(n, xx / 4, yy / 4, 2) * 0.15 + (Math.sin(xx * 0.2) * Math.sin(yy * 0.2) > 0.6 ? 0.04 : 0);
      const i = (yy * S + xx) * 4; img.data[i] = 84 * v; img.data[i + 1] = 74 * v; img.data[i + 2] = 66 * v; img.data[i + 3] = 255;
    }
    x.putImageData(img, 0, 0); const t = canvasTexture(c, true, true); t.repeat.set(10, 3); return t;
  })();
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(X1 - X0, 2.4), new THREE.MeshStandardMaterial({ map: carpet, roughness: 1 }));
  floor.rotation.x = -Math.PI / 2; floor.position.set((X0 + X1) / 2, 0.001, 0); floor.receiveShadow = true;
  scene.add(floor);

  // Side ledges with walnut tops and champagne trim
  for (const s of [1, -1]) {
    const zIn = s * 1.0, zOut = s * 1.26;
    const body = new THREE.Mesh(new THREE.BoxGeometry(X1 - X0 - 1.0, 0.6, Math.abs(zOut - zIn)), new THREE.MeshStandardMaterial({ color: "#8f7a63", roughness: 0.6 }));
    body.position.set((X0 + X1) / 2 - 0.3, 0.3, (zIn + zOut) / 2); body.receiveShadow = true; scene.add(body);
    const top = new THREE.Mesh(new THREE.BoxGeometry(X1 - X0 - 1.0, 0.03, Math.abs(zOut - zIn) + 0.04), walnut);
    top.position.set(body.position.x, 0.615, body.position.z); top.receiveShadow = true; scene.add(top);
    const tr = new THREE.Mesh(new THREE.BoxGeometry(X1 - X0 - 1.0, 0.012, 0.012), trim);
    tr.position.set(body.position.x, 0.6, zIn - s * 0.02); scene.add(tr);
  }

  // Windows: sky view, bezel, half-lowered shade
  const view = windowView();
  const viewMat = new THREE.MeshBasicMaterial({ map: view, color: new THREE.Color(1, 1, 1).multiplyScalar(1.6) });
  const bezelMat = new THREE.MeshStandardMaterial({ color: "#e6dccb", roughness: 0.55 });
  const shadeMat = new THREE.MeshStandardMaterial({ color: "#efe6d6", roughness: 0.9 });
  const wy = 1.0;
  for (const s of [1, -1]) for (const wx of [-3.9, -2.3, -0.7, 0.9, 2.5]) {
    const z = s * (wallZ(wy) - 0.035);
    const nrm = new THREE.Vector3(0, -(wy - CY), -s * wallZ(wy)).normalize();
    const holder = new THREE.Group();
    holder.position.set(wx, wy, z);
    holder.lookAt(holder.position.clone().add(nrm));
    const win = new THREE.Mesh(new THREE.CircleGeometry(1, 40), viewMat); win.scale.set(0.2, 0.27, 1); holder.add(win);
    const bez = new THREE.Mesh(new THREE.TorusGeometry(1, 0.06, 10, 48), bezelMat); bez.scale.set(0.215, 0.285, 0.15); bez.position.z = 0.01; holder.add(bez);
    const sh = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.2), shadeMat); sh.position.set(0, 0.2, 0.012); holder.add(sh);
    scene.add(holder);
  }

  // Seating: club four forward, club pair + divan aft
  const place = (x: number, z: number, facing: 1 | -1) => { const st = seat(m); st.position.set(x, 0, z); st.rotation.y = facing > 0 ? 0 : Math.PI; scene.add(st); };
  for (const s of [1, -1]) { place(1.65, s * 0.6, -1); place(-0.15, s * 0.6, 1); }
  place(-2.3, -0.6, -1); place(-4.0, -0.6, 1);
  // divan along the right wall, aft
  const div = new THREE.Mesh(new RoundedBoxGeometry(1.9, 0.2, 0.62, 4, 0.07), leather); div.position.set(-3.15, 0.45, 0.7); div.castShadow = div.receiveShadow = true; scene.add(div);
  const divB = new THREE.Mesh(new RoundedBoxGeometry(1.9, 0.5, 0.16, 4, 0.07), leather); divB.position.set(-3.15, 0.72, 0.98); divB.castShadow = true; scene.add(divB);
  const divBase = new THREE.Mesh(new RoundedBoxGeometry(1.86, 0.36, 0.56, 4, 0.04), leatherDark); divBase.position.set(-3.15, 0.18, 0.72); scene.add(divBase);

  // Tables
  for (const [tx, tz] of [[0.75, 0.66], [0.75, -0.66], [-3.15, -0.68]]) {
    const top = new THREE.Mesh(new RoundedBoxGeometry(0.78, 0.035, 0.56, 4, 0.015), walnut);
    top.position.set(tx, 0.7, tz); top.castShadow = top.receiveShadow = true; scene.add(top);
    const edge = new THREE.Mesh(new THREE.BoxGeometry(0.79, 0.008, 0.57), trim); edge.position.set(tx, 0.68, tz); scene.add(edge);
    const ped = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.12, 0.66, 20), trim); ped.position.set(tx, 0.34, tz); scene.add(ped);
  }
  for (const [fx, fz] of [[0.62, 0.55], [0.86, 0.72]]) { const f = flute(); f.position.set(fx, 0.718, fz); scene.add(f); }
  const folder = new THREE.Mesh(new RoundedBoxGeometry(0.3, 0.012, 0.22, 2, 0.004), leatherDark); folder.position.set(0.9, 0.724, -0.62); folder.rotation.y = 0.2; scene.add(folder);

  // Forward bulkhead with walnut veneer and a dark display
  const bh = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.0, 2.6), walnut); bh.position.set(X1 - 0.1, 1.0, 0); scene.add(bh);
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.56), new THREE.MeshPhysicalMaterial({ color: "#07080a", roughness: 0.05, clearcoat: 1 }));
  scr.position.set(X1 - 0.15, 1.25, 0); scr.rotation.y = -Math.PI / 2; scene.add(scr);
  const door = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 1.75), new THREE.MeshStandardMaterial({ color: "#3a2a1d", roughness: 0.4 })); door.position.set(X1 - 0.15, 0.9, 0.0); door.rotation.y = -Math.PI / 2; door.visible = false; scene.add(door);

  // Lighting: ceiling coves, downlights, low sun through the right-hand windows
  for (const s of [1, -1]) {
    const y = CY + R * Math.cos(0.5), z = s * R * Math.sin(0.5) * 0.93;
    const strip = new THREE.Mesh(new THREE.BoxGeometry(X1 - X0 - 0.6, 0.008, 0.016), new THREE.MeshBasicMaterial({ color: new THREE.Color("#ffd8a6").multiplyScalar(1.8) }));
    strip.position.set((X0 + X1) / 2, y, z); scene.add(strip);
    const ra = new THREE.RectAreaLight("#ffdcb0", 2.2, X1 - X0 - 0.6, 0.14);
    ra.position.set((X0 + X1) / 2, y - 0.02, z * 0.95);
    ra.lookAt(ra.position.x, 0, z * 0.2);
    scene.add(ra);
  }
  const dl: THREE.Vector3[] = [];
  for (let x = X0 + 0.8; x < X1 - 0.4; x += 1.1) dl.push(new THREE.Vector3(x, CY + R - 0.01, 0));
  for (const p of dl) { const d = new THREE.Mesh(new THREE.CircleGeometry(0.035, 16), new THREE.MeshBasicMaterial({ color: new THREE.Color("#fff2dc").multiplyScalar(6) })); d.position.copy(p); d.rotation.x = Math.PI / 2; scene.add(d); }
  for (const x of [-3.6, -1.4, 0.8, 2.9]) { const p = new THREE.PointLight("#ffe0b8", 0.55, 5, 2); p.position.set(x, 1.7, 0); scene.add(p); }

  const sun = new THREE.SpotLight("#ffb978", 160, 30, 0.42, 0.25, 1.2);
  sun.position.set(-0.6, 3.6, 8.5);
  sun.target.position.set(0.2, 0.3, -0.6);
  sun.map = cookie();
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.bias = -0.0002;
  shellMesh.castShadow = false;
  scene.add(sun, sun.target);
  scene.add(new THREE.HemisphereLight("#fff4e6", "#8a7660", 0.22));

  const camera = new THREE.PerspectiveCamera(56, ctx.aspect, 0.02, 60);
  if (shot === "interior") { camera.position.set(-4.85, 1.36, -0.05); camera.lookAt(3.5, 0.95, 0.05); camera.fov = 56; }
  else { camera.position.set(-1.25, 1.05, -0.2); camera.lookAt(0.95, 0.72, 0.62); camera.fov = 44; }
  camera.updateProjectionMatrix();

  return {
    scene, camera, exposure: 0.9, toneMapping: THREE.ACESFilmicToneMapping, warmup: 2,
    post: { bloom: 0.12, bloomRadius: 0.3, threshold: 1.8, vignette: 0.36, grain: 0.03 },
    resize: (w, h) => { camera.aspect = w / h; camera.updateProjectionMatrix(); },
  };
}

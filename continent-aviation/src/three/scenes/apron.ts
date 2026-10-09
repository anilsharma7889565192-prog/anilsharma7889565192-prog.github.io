import * as THREE from "three";
import { createSky, skyEnvironment, SKY, type SkyPreset } from "../core/sky";
import { createApron, createMarkings, contactShadow, type Pool } from "../core/ground";
import { floodMast, halos, line, lightRow, skyline } from "../core/lights";
import { animateJetLights, createJet, JET_CATEGORIES, LIVERIES, type Jet } from "../models/jet";
import { createTerminal } from "../models/terminal";
import type { SceneContext, SceneSetup } from "../core/stage";

type V3 = [number, number, number];
type JetDef = { cat: keyof typeof JET_CATEGORIES; livery: keyof typeof LIVERIES; pos: [number, number]; rot: number; stairs?: boolean; glow?: number; taxi?: boolean };
type Cam = { pos: V3; target: V3; fov: number };
export type ApronShotDef = {
  sky: keyof typeof SKY; sky2?: Partial<SkyPreset>; exposure: number;
  jets: JetDef[]; terminal?: { pos: [number, number]; rot: number; glow?: number };
  cam: Cam; camPortrait?: Cam; floods?: [number, number][];
  /** Live only: horizontal lens shift (mm) on wide screens to keep the subject clear of left-aligned text. */
  liveShift?: number; fog: number; ground?: string; key?: number; fill?: number; bloom?: number;
  sunLight?: V3;
  /** Warm floodlight from the camera side (multiplier, 0 disables). */
  feature?: number;
};

export const APRON_SHOTS: Record<string, ApronShotDef> = {
  hero: {
    sky: "dusk", sky2: { sunDir: [-0.35, 0.015, -0.94], cloudCover: 0.52 }, exposure: 1.0,
    jets: [{ cat: "supermid", livery: "navy", pos: [0, 0], rot: -0.2, glow: 1.6 }],
    cam: { pos: [21, 1.55, 15.5], target: [-1.5, 2.9, -1.0], fov: 30 },
    camPortrait: { pos: [30, 2.2, 22], target: [-3, 2.4, -1.5], fov: 44 },
    floods: [[-90, -70], [60, -120], [-140, 10]], fog: 0.0045, key: 1.2, fill: 0.5, liveShift: -8,
  },
  jets: {
    sky: "blue", sky2: { sunDir: [0.25, -0.01, -0.97], stars: 0.12, glowStrength: 0.85 }, exposure: 1.1,
    jets: [{ cat: "supermid", livery: "pearl", pos: [0, 0], rot: -2.27, glow: 0.9 }],
    cam: { pos: [1, 1.8, 31], target: [0, 2.6, 0], fov: 31 }, liveShift: -6,
    floods: [[-70, -40], [75, -60]], fog: 0.004, key: 0.6, fill: 0.7,
  },
  corporate: {
    sky: "dusk", sky2: { sunDir: [0.3, 0.02, -0.95], glowStrength: 0.9 }, exposure: 1.1,
    jets: [{ cat: "supermid", livery: "graphite", pos: [0, 0], rot: Math.PI - 0.55, stairs: true, glow: 0.8 }],
    cam: { pos: [-15, 1.7, 9.5], target: [-3.5, 2.1, -1.2], fov: 36 },
    floods: [[50, -70], [-20, -90]], fog: 0.004, key: 1.0, fill: 0.55,
  },
  bespoke: {
    sky: "blue", sky2: { stars: 0.1 }, exposure: 0.95,
    jets: [{ cat: "supermid", livery: "navy", pos: [4, 4], rot: Math.PI - 0.15, stairs: true, glow: 0.9 }],
    terminal: { pos: [-6, -30], rot: 0.12, glow: 0.75 },
    cam: { pos: [-15, 2.0, 24], target: [0, 3.2, -6], fov: 40 },
    floods: [[-48, -12], [46, -24]], fog: 0.002, key: 0.4, fill: 0.6, bloom: 0.4,
  },
  vip: {
    sky: "dusk", sky2: { sunDir: [-0.62, 0.02, -0.78] }, exposure: 0.95,
    jets: [{ cat: "large", livery: "pearl", pos: [2, 14], rot: Math.PI + 0.5, glow: 0.7 }],
    terminal: { pos: [-4, -28], rot: -0.05, glow: 0.85 },
    cam: { pos: [-30, 3.0, 36], target: [-1, 3.8, -8], fov: 38 },
    floods: [[48, -36], [-64, -16]], fog: 0.002, key: 0.6, fill: 0.6, bloom: 0.4,
  },
  group: {
    sky: "blue", sky2: { sunDir: [-0.4, -0.03, -0.92], stars: 0.2, glowStrength: 0.5 }, exposure: 1.1,
    jets: [
      { cat: "large", livery: "pearl", pos: [-44, -34], rot: -1.75, glow: 0.8 },
      { cat: "supermid", livery: "graphite", pos: [-12, -14], rot: -1.75, glow: 0.8 },
      { cat: "midsize", livery: "pearl", pos: [16, 4], rot: -1.75, glow: 0.8 },
    ],
    cam: { pos: [40, 2.4, 40], target: [-10, 3.2, -10], fov: 36 },
    floods: [[-12, -34], [26, -28], [-60, -10]], fog: 0.003, key: 0.35, fill: 0.55, bloom: 0.6,
  },
  apron: {
    sky: "night", exposure: 1.25,
    jets: [{ cat: "supermid", livery: "pearl", pos: [0, 0], rot: -0.35, glow: 0.9, taxi: true }],
    cam: { pos: [3, 2.0, 34], target: [-4.5, 2.8, 0], fov: 30 },
    floods: [[-30, -26], [44, -44], [-80, -40]], fog: 0.004, key: 0.2, fill: 0.35, bloom: 0.7,
  },
};

export function createApronScene(ctx: SceneContext, shotName: string): SceneSetup {
  const def = APRON_SHOTS[shotName] ?? APRON_SHOTS.hero;
  const preset: SkyPreset = { ...SKY[def.sky], ...def.sky2 };
  const live = ctx.quality === "live";
  const scene = new THREE.Scene();
  const horizonCol = new THREE.Color(preset.horizon).lerp(new THREE.Color(preset.mid), 0.75).multiplyScalar(0.4);
  scene.fog = new THREE.FogExp2(horizonCol, def.fog * 0.25);

  const sky = createSky(preset);
  scene.add(sky);
  scene.environment = skyEnvironment(ctx.renderer, preset);
  scene.environmentIntensity = 1.0;

  // Key light from the sun side, cool fill from the sky
  const sunDir = new THREE.Vector3(...preset.sunDir).normalize();
  const key = new THREE.DirectionalLight(new THREE.Color(preset.glow).lerp(new THREE.Color("#ffffff"), 0.35), def.key ?? 1);
  key.position.copy(sunDir.clone().setY(Math.max(0.12, sunDir.y + 0.15)).multiplyScalar(80));
  key.castShadow = !live;
  key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -30, right: 30, top: 30, bottom: -30, near: 1, far: 220 });
  key.shadow.bias = -0.0004;
  scene.add(key);
  if (def.feature !== 0) {
    const f = new THREE.SpotLight("#ffd9a8", (def.feature ?? 1) * 2600, 160, 0.34, 0.8, 1.6);
    const cp = new THREE.Vector3(...def.cam.pos), tg = new THREE.Vector3(...def.cam.target);
    const side = new THREE.Vector3().subVectors(cp, tg).normalize();
    f.position.copy(tg).addScaledVector(side, 55).add(new THREE.Vector3(-side.z * 25, 26, side.x * 25));
    f.target.position.copy(tg);
    f.castShadow = !live;
    f.shadow.mapSize.set(2048, 2048);
    f.shadow.bias = -0.0003;
    scene.add(f, f.target);
  }
  scene.add(new THREE.HemisphereLight(new THREE.Color(preset.mid), new THREE.Color("#1a1612"), def.fill ?? 0.5));

  // Ground
  const pools: Pool[] = [];
  for (const [fx, fz] of def.floods ?? []) pools.push({ pos: new THREE.Vector3(fx, 0, fz), color: new THREE.Color("#ffcf96").multiplyScalar(0.55), radius: 18 });
  if (def.terminal) pools.push({ pos: new THREE.Vector3(def.terminal.pos[0], 0, def.terminal.pos[1] + 14), color: new THREE.Color("#ffbe7a").multiplyScalar(0.9), radius: 20 });
  const jets: Jet[] = [];
  const doorPools: THREE.Vector3[] = [];

  for (const j of def.jets) {
    const jet = createJet({ ...JET_CATEGORIES[j.cat], livery: LIVERIES[j.livery], stairs: j.stairs, cabinGlow: j.glow ?? 0, taxiLight: j.taxi });
    jet.group.position.x = j.pos[0];
    jet.group.position.z = j.pos[1];
    jet.group.rotation.y = j.rot;
    scene.add(jet.group);
    jet.group.updateMatrixWorld(true);
    const L = JET_CATEGORIES[j.cat].length, S = JET_CATEGORIES[j.cat].span;
    const sh = contactShadow(L * 1.15, S * 0.75, 0.75);
    sh.position.x = j.pos[0]; sh.position.z = j.pos[1]; sh.rotation.z = j.rot;
    scene.add(sh);
    if (jet.doorLocal) {
      const d = jet.group.localToWorld(jet.doorLocal.clone());
      doorPools.push(d);
      pools.push({ pos: d, color: new THREE.Color("#ffc584").multiplyScalar(0.8), radius: 2.6 });
    }
    if (j.taxi) {
      const ahead = jet.group.localToWorld(new THREE.Vector3(L * 0.36 + 12, -jet.lift, 0));
      pools.push({ pos: ahead.setY(0), color: new THREE.Color("#fff1d8").multiplyScalar(0.7), radius: 7 });
    }
    jets.push(jet);
  }

  const ground = createApron({
    resolution: live ? 768 : 2048, base: def.ground ?? (def.sky === "night" ? "#18191d" : "#1e1f23"),
    fogColor: horizonCol, fogDensity: def.fog * 0.6, pools, blur: live ? 0.004 : 0.0035, reflectivity: 0.5,
  });
  scene.add(ground);

  // Lead-in lines under each jet
  const lines: THREE.Vector2[][] = [];
  for (const j of def.jets) {
    const a = j.rot, cx = j.pos[0], cz = j.pos[1];
    const dir = new THREE.Vector2(Math.cos(a), -Math.sin(a));
    const pts: THREE.Vector2[] = [];
    for (let k = -1; k <= 4; k++) pts.push(new THREE.Vector2(cx + dir.x * k * 14, cz + dir.y * k * 14));
    lines.push(pts);
  }
  lines.push([new THREE.Vector2(-400, -55), new THREE.Vector2(400, -55)]);
  scene.add(createMarkings(lines, "#7d6a33", 0.16));

  // Taxiway edge lights (blue) and distant runway lights
  scene.add(lightRow([...line(new THREE.Vector3(-400, 0, -48), new THREE.Vector3(400, 0, -48), 30), ...line(new THREE.Vector3(-400, 0, -62), new THREE.Vector3(400, 0, -62), 30)], "#2f6bff", 5, 0.12));
  scene.add(lightRow([...line(new THREE.Vector3(-1200, 0, -260), new THREE.Vector3(1200, 0, -260), 30), ...line(new THREE.Vector3(-1200, 0, -305), new THREE.Vector3(1200, 0, -305), 30)], "#fff1d6", 7, 0.25));
  scene.add(halos(line(new THREE.Vector3(-1200, 0, -260), new THREE.Vector3(1200, 0, -260), 30), "#ffe6c0", 6, 0.35));
  scene.add(halos([...line(new THREE.Vector3(-400, 0, -48), new THREE.Vector3(400, 0, -48), 30)], "#3c78ff", 2.2, 0.45));

  for (const [fx, fz] of def.floods ?? []) scene.add(floodMast(new THREE.Vector3(fx, 0, fz)));
  scene.add(skyline({ z: -900, x0: -1400, x1: 1400, seed: 3, maxH: 26, density: def.sky === "night" ? 0.22 : 0.12 }));
  scene.add(skyline({ z: -620, x0: -900, x1: 900, seed: 9, maxH: 12, color: "#0c0f15", density: 0.06 }));

  if (def.terminal) {
    const t = createTerminal({ glow: def.terminal.glow });
    t.group.position.set(def.terminal.pos[0], 0, def.terminal.pos[1]);
    t.group.rotation.y = def.terminal.rot;
    scene.add(t.group);
  }

  const camera = new THREE.PerspectiveCamera(def.cam.fov, ctx.aspect, 0.3, 6000);
  camera.layers.enable(1);
  const base = { pos: new THREE.Vector3(), target: new THREE.Vector3(), fov: def.cam.fov };
  const frame = (aspect: number) => {
    const c = aspect < 0.9 && def.camPortrait ? def.camPortrait : def.cam;
    base.pos.set(...c.pos); base.target.set(...c.target); base.fov = c.fov;
    camera.aspect = aspect;
    const wide = live && aspect > 1.15 && def.liveShift ? Math.min(1, (aspect - 1.15) / 0.5) : 0;
    camera.fov = c.fov * (1 + 0.16 * wide);
    camera.filmOffset = (def.liveShift ?? 0) * wide;
    camera.updateProjectionMatrix();
  };
  frame(ctx.aspect);

  const tmp = new THREE.Vector3();
  return {
    scene, camera, exposure: preset.exposure * def.exposure, toneMapping: THREE.ACESFilmicToneMapping,
    post: { bloom: def.bloom ?? 0.55, bloomRadius: 0.6, threshold: 0.95, vignette: 0.34 },
    resize: (w, h) => frame(w / h),
    update: (t, _dt, input) => {
      (sky.material as THREE.ShaderMaterial).uniforms.time.value = t;
      jets.forEach((j) => animateJetLights(j, t + j.group.position.x * 0.01));
      // Slow cinematic drift, pointer parallax and scroll dolly (live only)
      const orbit = live ? Math.sin(t * 0.05) * 0.035 + input.pointer.x * 0.03 : 0;
      const dolly = live ? input.scroll * 0.22 : 0;
      tmp.copy(base.pos).sub(base.target);
      tmp.applyAxisAngle(THREE.Object3D.DEFAULT_UP, orbit);
      tmp.multiplyScalar(1 - dolly);
      camera.position.copy(base.target).add(tmp);
      camera.position.y = base.pos.y + (live ? input.pointer.y * 0.25 - input.scroll * 0.5 : 0);
      camera.lookAt(base.target);
    },
    dispose: () => {
      jets.forEach((j) => j.dispose());
      (scene.environment as THREE.Texture | null)?.dispose();
      ground.dispose();
    },
  };
}

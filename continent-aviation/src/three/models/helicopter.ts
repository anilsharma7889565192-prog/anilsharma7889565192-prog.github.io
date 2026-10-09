import * as THREE from "three";
import { canvas, canvasTexture, smooth } from "../core/util";
import { loft, tube, type Section } from "./surface";
import { mats } from "./materials";

/** Generic, unbranded light twin-engine helicopter. Nose +X, skids rest on y = 0. */
export type HeliLivery = { base: string; lower: string; stripe: string };
export const HELI_LIVERIES: Record<string, HeliLivery> = {
  obsidian: { base: "#15181d", lower: "#0d0f12", stripe: "#a9aeb6" },
  ivory: { base: "#efede7", lower: "#2a2f38", stripe: "#9a9fa8" },
};

const XN = 3.1, XB = -7.6, LEN = XN - XB;

function section(x: number) {
  if (x > 1.9) { const u = (XN - x) / 1.2; return { w: 0.8 * Math.pow(1 - Math.pow(1 - u, 2), 0.5), h: 0.86 * Math.pow(1 - Math.pow(1 - u, 2.2), 0.55), cy: 1.27 + 0.18 * smooth(0, 1, u), n: 2.4 }; }
  if (x > -0.9) return { w: 0.8, h: 0.88, cy: 1.45, n: 2.6 };
  if (x > -2.3) { const u = smooth(0, 1, (-0.9 - x) / 1.4); return { w: THREE.MathUtils.lerp(0.8, 0.3, u), h: THREE.MathUtils.lerp(0.88, 0.33, u), cy: THREE.MathUtils.lerp(1.45, 1.96, u), n: THREE.MathUtils.lerp(2.6, 2.0, u) }; }
  const u = (-2.3 - x) / 5.3;
  const r = THREE.MathUtils.lerp(0.3, 0.17, u);
  return { w: r, h: r * 1.05, cy: 1.96 + 0.1 * u, n: 2 };
}

const se = (v: number, e: number) => Math.sign(v) * Math.pow(Math.abs(v), e);

function paint(L: HeliLivery) {
  const W = 2048, H = 2048, TAU = Math.PI * 2;
  const col = canvas(W, H), rough = canvas(W, H), metal = canvas(W, H);
  const X = (th: number) => (th / TAU) * W, Y = (x: number) => ((XN - x) / LEN) * H;
  col.ctx.fillStyle = L.base; col.ctx.fillRect(0, 0, W, H);
  rough.ctx.fillStyle = "rgb(70,70,70)"; rough.ctx.fillRect(0, 0, W, H);
  metal.ctx.fillStyle = "#000"; metal.ctx.fillRect(0, 0, W, H);
  col.ctx.fillStyle = L.lower; col.ctx.fillRect(X(Math.PI * 0.66), 0, X(Math.PI * 1.34) - X(Math.PI * 0.66), H);
  col.ctx.fillStyle = L.stripe;
  for (const a of [0.6, 1.4]) col.ctx.fillRect(X(Math.PI * a) - 6, Y(2.6), 12, Y(-7.4) - Y(2.6));
  const glass = (pts: [number, number][]) => {
    for (const c of [col.ctx, rough.ctx, metal.ctx]) {
      c.beginPath(); pts.forEach(([th, x], i) => (i ? c.lineTo(X(th), Y(x)) : c.moveTo(X(th), Y(x)))); c.closePath();
      c.fillStyle = c === col.ctx ? "#1b232e" : c === rough.ctx ? "rgb(6,6,6)" : "rgb(170,170,170)"; c.fill();
      if (c === col.ctx) { c.lineWidth = 6; c.strokeStyle = "#3a3f46"; c.stroke(); }
    }
  };
  const PI = Math.PI;
  for (const s of [1, -1]) {
    const th = (a: number) => (s > 0 ? a * PI : TAU - a * PI);
    glass([[th(0.02), 2.98], [th(0.44), 2.78], [th(0.47), 1.75], [th(0.02), 1.62]]); // windshield
    glass([[th(0.48), 2.72], [th(0.64), 2.55], [th(0.62), 2.0], [th(0.5), 1.85]]); // chin window
    glass([[th(0.2), 1.45], [th(0.48), 1.45], [th(0.48), 0.72], [th(0.2), 0.78]]); // cockpit door window
    glass([[th(0.2), 0.55], [th(0.48), 0.55], [th(0.48), -0.55], [th(0.2), -0.55]]); // cabin window
    col.ctx.strokeStyle = "rgba(0,0,0,0.4)"; col.ctx.lineWidth = 4;
    col.ctx.strokeRect(X(th(0.16)), Y(0.62), X(th(0.86)) - X(th(0.16)), Y(-0.64) - Y(0.62));
  }
  const m = canvasTexture(col.c), r = canvasTexture(rough.c, false), mt = canvasTexture(metal.c, false);
  m.flipY = r.flipY = mt.flipY = false;
  return { map: m, roughnessMap: r, metalnessMap: mt };
}

export type Helicopter = { group: THREE.Group; rotor: THREE.Group; tailRotor: THREE.Group; blur: THREE.Mesh; update: (t: number, dt: number) => void; dispose: () => void };

export function createHelicopter(opts: { livery?: HeliLivery; rotorBlur?: boolean; rpm?: number } = {}): Helicopter {
  const L = opts.livery ?? HELI_LIVERIES.obsidian;
  const group = new THREE.Group();
  const disp: { dispose: () => void }[] = [];
  const add = (m: THREE.Object3D) => { m.traverse((o) => { if ((o as THREE.Mesh).isMesh) { o.castShadow = true; o.receiveShadow = true; } }); group.add(m); return m; };
  const tex = paint(L);
  const skin = new THREE.MeshPhysicalMaterial({ ...tex, roughness: 1, metalness: 1, clearcoat: 1, clearcoatRoughness: 0.08 });
  const plain = new THREE.MeshPhysicalMaterial({ color: L.base, roughness: 0.3, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.08 });
  disp.push(skin, plain, tex.map, tex.roughnessMap, tex.metalnessMap);

  const body = tube(180, 72, (t, th) => {
    const x = XN - t * LEN;
    const s = t >= 0.999 ? { w: 0, h: 0, cy: 2.06, n: 2 } : section(x);
    return new THREE.Vector3(x, s.cy + s.h * se(Math.cos(th), 2 / s.n), s.w * se(Math.sin(th), 2 / s.n));
  });
  add(new THREE.Mesh(body, skin));

  // Engine cowling
  const cowl = tube(60, 40, (t, th) => {
    const x = 0.9 - t * 3.3;
    const u = t;
    const k = u < 0.18 ? Math.pow(1 - Math.pow(1 - u / 0.18, 2), 0.5) : u > 0.82 ? 1 - 0.55 * smooth(0.82, 1, u) : 1;
    const w = 0.56 * k, h = 0.34 * k;
    return new THREE.Vector3(x, 2.3 + h * se(Math.cos(th), 0.75), w * se(Math.sin(th), 0.75));
  });
  add(new THREE.Mesh(cowl, plain));
  const exhaustMat = mats.darkMetal();
  disp.push(exhaustMat);
  for (const z of [0.33, -0.33]) {
    const ex = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.3, 16), exhaustMat);
    ex.rotation.z = Math.PI / 2; ex.position.set(-2.35, 2.42, z);
    add(ex);
  }

  // Main rotor
  const rotor = new THREE.Group();
  rotor.position.set(-0.35, 2.82, 0);
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.14, 0.42, 16), mats.strut());
  mast.position.y = 0.15; rotor.add(mast);
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.14, 24), mats.darkMetal());
  hub.position.y = 0.38; rotor.add(hub);
  const bladeMat = new THREE.MeshStandardMaterial({ color: "#2b2e33", roughness: 0.45, metalness: 0.3 });
  disp.push(bladeMat);
  const span = 5.45;
  const secs: Section[] = [];
  for (let i = 0; i <= 10; i++) {
    const e = i / 10;
    const rr = THREE.MathUtils.lerp(0.35, span, e);
    const back = e > 0.9 ? (e - 0.9) * 4 * 0.2 : 0;
    secs.push({ o: new THREE.Vector3(0.12 - back, 0.38 - e * e * 0.12, rr), chord: e > 0.9 ? 0.34 - (e - 0.9) * 1.2 : 0.34, thick: 0.1, t: new THREE.Vector3(0, 1, 0) });
  }
  const bladeGeo = loft(secs, 18);
  const blades = new THREE.Group();
  for (let k = 0; k < 4; k++) { const b = new THREE.Mesh(bladeGeo, bladeMat); b.rotation.y = (k * Math.PI) / 2; b.castShadow = true; blades.add(b); }
  rotor.add(blades);
  // Motion-blur disc for stills / fast rotation
  const discMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, side: THREE.DoubleSide,
    uniforms: { opacity: { value: opts.rotorBlur ? 0.3 : 0 } },
    vertexShader: `varying vec2 vP; void main(){ vP = position.xy; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
    fragmentShader: `uniform float opacity; varying vec2 vP; void main(){ float r = length(vP)/${span.toFixed(2)}; float a = atan(vP.y, vP.x);
      float streak = 0.55 + 0.45 * pow(abs(sin(a * 2.0)), 6.0);
      float fall = smoothstep(1.0, 0.94, r) * smoothstep(0.05, 0.12, r);
      gl_FragColor = vec4(vec3(0.08, 0.09, 0.1), opacity * streak * fall * (0.5 + 0.5 * r)); }`,
  });
  const blur = new THREE.Mesh(new THREE.CircleGeometry(span, 96), discMat);
  blur.rotation.x = -Math.PI / 2; blur.position.y = 0.36;
  rotor.add(blur);
  if (opts.rotorBlur) bladeMat.transparent = true, bladeMat.opacity = 0.55;
  group.add(rotor);

  // Tail fin, stabiliser, tail rotor
  const fin: Section[] = [];
  for (let i = 0; i <= 6; i++) { const e = i / 6; fin.push({ o: new THREE.Vector3(-6.75 - e * 0.85, 1.96 + e * 1.3, 0), chord: THREE.MathUtils.lerp(1.05, 0.62, e), thick: 0.13, t: new THREE.Vector3(0, 0, 1) }); }
  add(new THREE.Mesh(loft(fin, 18), plain));
  const ventral: Section[] = [0, 1].map((e) => ({ o: new THREE.Vector3(-7.0 - e * 0.25, 1.95 - e * 0.55, 0), chord: THREE.MathUtils.lerp(0.7, 0.35, e), thick: 0.12, t: new THREE.Vector3(0, 0, 1) }));
  add(new THREE.Mesh(loft(ventral, 14), plain));
  const stab: Section[] = [0, 1].map((e) => ({ o: new THREE.Vector3(-5.2, 2.05, e * 1.3), chord: 0.55, thick: 0.12, t: new THREE.Vector3(0, 1, 0) }));
  const stabGeo = loft(stab, 14, true);
  add(new THREE.Mesh(stabGeo, plain));
  const stabL = new THREE.Mesh(stabGeo, plain); stabL.scale.z = -1; add(stabL);
  for (const z of [1.3, -1.3]) {
    const ep: Section[] = [0, 1].map((e) => ({ o: new THREE.Vector3(-5.15 - e * 0.15, 1.82 + e * 0.5, z), chord: 0.5, thick: 0.1, t: new THREE.Vector3(0, 0, 1) }));
    add(new THREE.Mesh(loft(ep, 12, true), plain));
  }
  const tailRotor = new THREE.Group();
  tailRotor.position.set(-7.35, 2.85, -0.2);
  const trBlade = new THREE.Mesh(new THREE.BoxGeometry(0.16, 1.9, 0.03), bladeMat);
  tailRotor.add(trBlade, new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.12, 12).rotateX(Math.PI / 2), mats.darkMetal()));
  const trBlur = new THREE.Mesh(new THREE.CircleGeometry(0.95, 48), new THREE.MeshBasicMaterial({ color: "#111", transparent: true, opacity: opts.rotorBlur ? 0.22 : 0, depthWrite: false, side: THREE.DoubleSide }));
  tailRotor.add(trBlur);
  group.add(tailRotor);

  // Skids
  const skidMat = mats.strut();
  disp.push(skidMat);
  for (const z of [1.05, -1.05]) {
    const skid = new THREE.CatmullRomCurve3([new THREE.Vector3(-1.75, 0.06, z), new THREE.Vector3(1.5, 0.06, z), new THREE.Vector3(2.0, 0.13, z), new THREE.Vector3(2.22, 0.36, z)]);
    add(new THREE.Mesh(new THREE.TubeGeometry(skid, 48, 0.045, 10), skidMat));
    for (const x of [1.15, -0.95]) {
      const cross = new THREE.CatmullRomCurve3([new THREE.Vector3(x, 0.06, z), new THREE.Vector3(x, 0.42, z * 0.97), new THREE.Vector3(x, 0.64, z * 0.55)]);
      add(new THREE.Mesh(new THREE.TubeGeometry(cross, 16, 0.05, 10), skidMat));
    }
  }

  // Lights
  const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), mats.emissive("#ff3b26", 16));
  beacon.position.set(-7.7, 3.28, 0);
  const belly = beacon.clone(); belly.position.set(-0.4, 0.55, 0);
  const navR = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), mats.emissive("#ff2a1f", 12)); navR.position.set(-5.2, 2.32, -1.31);
  const navG = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), mats.emissive("#2bff7a", 9)); navG.position.set(-5.2, 2.32, 1.31);
  group.add(beacon, belly, navR, navG);

  const rpm = opts.rpm ?? 5.2;
  return {
    group, rotor: blades as unknown as THREE.Group, tailRotor, blur,
    update: (t) => {
      blades.rotation.y = -t * rpm;
      tailRotor.rotation.z = t * rpm * 5.6;
      const b = Math.max(0, Math.sin(t * Math.PI * 1.6)) ** 6;
      beacon.scale.setScalar(0.4 + b * 1.3); belly.scale.setScalar(0.4 + b * 1.3);
    },
    dispose: () => disp.forEach((d) => d.dispose()),
  };
}

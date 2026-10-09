import * as THREE from "three";
import { canvas, canvasTexture, smooth } from "../core/util";
import { loft, revolveX, tube, type Section } from "./surface";
import { mats } from "./materials";

/**
 * Generic, unbranded business jet. Proportions are parametric so one model covers
 * light, midsize, super-midsize and large-cabin categories. No operator livery or logos.
 */
export type Livery = { base: string; belly: string; stripe: string; accent?: string };

export const LIVERIES: Record<string, Livery> = {
  graphite: { base: "#f2f1ed", belly: "#3b3f46", stripe: "#a9adb3" },
  navy: { base: "#f2f1ed", belly: "#1a2538", stripe: "#9aa3b1" },
  pearl: { base: "#f4f3ef", belly: "#d7d8da", stripe: "#8f949b" },
  midnight: { base: "#1b2433", belly: "#121822", stripe: "#b7bcc4" },
};

export type JetParams = {
  length: number; radius: number; span: number; windows: number; engine: number; fin: number;
  clearance: number; livery?: Livery; stairs?: boolean; cabinGlow?: number; navLights?: boolean; gearDown?: boolean; taxiLight?: boolean;
};

export const JET_CATEGORIES: Record<string, JetParams> = {
  light: { length: 15.6, radius: 0.92, span: 15.4, windows: 5, engine: 0.82, fin: 2.4, clearance: 0.7 },
  midsize: { length: 18.8, radius: 1.06, span: 18.0, windows: 6, engine: 0.92, fin: 2.8, clearance: 0.8 },
  supermid: { length: 21.0, radius: 1.2, span: 19.6, windows: 7, engine: 1.0, fin: 3.1, clearance: 0.86 },
  large: { length: 29.0, radius: 1.42, span: 28.6, windows: 11, engine: 1.25, fin: 4.1, clearance: 0.98 },
};

const TN = 0.27; // nose fraction
const TT = 0.655; // tail cone start
const KY = 1.05;

function profile(p: JetParams) {
  const R = p.radius;
  const r = (t: number) => {
    if (t < TN) { const u = t / TN; return R * Math.pow(1 - Math.pow(1 - u, 1.7), 0.68); }
    if (t < TT) return R;
    const u = (t - TT) / (1 - TT);
    return R * (1 - 0.86 * Math.pow(u, 1.45));
  };
  const c = (t: number) => (t < TN ? -(R - r(t)) * 0.42 : t > TT ? (R - r(t)) * 0.82 : 0);
  const x = (t: number) => p.length / 2 - t * p.length;
  return { r, c, x };
}

function paintTextures(p: JetParams, L: Livery) {
  const W = 2048, H = 2048;
  const col = canvas(W, H), rough = canvas(W, H), emi = canvas(W, H), metal = canvas(W, H);
  const TAU = Math.PI * 2;
  const X = (th: number) => (th / TAU) * W;
  const Y = (t: number) => t * H;
  const { ctx } = col;
  ctx.fillStyle = L.base; ctx.fillRect(0, 0, W, H);
  rough.ctx.fillStyle = "rgb(78,78,78)"; rough.ctx.fillRect(0, 0, W, H);
  emi.ctx.fillStyle = "#000"; emi.ctx.fillRect(0, 0, W, H);
  metal.ctx.fillStyle = "#000"; metal.ctx.fillRect(0, 0, W, H);

  // Cheatline: belly colour below a line that sweeps under the nose and rises towards the tail.
  const lineTh = (t: number) => Math.PI * (0.6 + 0.05 * (1 - smooth(0.0, 0.16, t)) - 0.13 * smooth(0.55, 0.97, t));
  const band = (offA: number, offB: number, fill: string, roughFill: string) => {
    for (const side of [1, -1]) {
      ctx.beginPath(); rough.ctx.beginPath();
      const pts: [number, number][] = [];
      for (let i = 0; i <= 200; i++) { const t = i / 200; const th = lineTh(t) + offA; pts.push([X(side > 0 ? th : TAU - th), Y(t)]); }
      for (let i = 200; i >= 0; i--) { const t = i / 200; const th = lineTh(t) + offB; pts.push([X(side > 0 ? th : TAU - th), Y(t)]); }
      for (const c2 of [ctx, rough.ctx]) { c2.moveTo(...pts[0]); pts.forEach((q) => c2.lineTo(...q)); c2.closePath(); }
      ctx.fillStyle = fill; ctx.fill();
      rough.ctx.fillStyle = roughFill; rough.ctx.fill();
    }
  };
  // Belly (from line down to bottom centre)
  band(0, Math.PI - lineTh(0.5) + 0.5, L.belly, "rgb(92,92,92)");
  ctx.fillStyle = L.belly;
  ctx.fillRect(X(Math.PI * 0.86), 0, X(Math.PI * 1.14) - X(Math.PI * 0.86), H);
  band(-0.075, -0.048, L.stripe, "rgb(70,70,70)");

  // Panel lines
  ctx.strokeStyle = "rgba(0,0,0,0.07)"; ctx.lineWidth = 2;
  for (const t of [TN + 0.005, 0.42, TT, 0.8]) { ctx.beginPath(); ctx.moveTo(0, Y(t)); ctx.lineTo(W, Y(t)); ctx.stroke(); }

  // Cabin windows (large ovals) both sides
  const winTh = Math.acos(0.22);
  const t0 = 0.285, t1 = TT - 0.045;
  const wl = 0.42 / p.length, wh = 0.56 / p.radius;
  for (let i = 0; i < p.windows; i++) {
    const t = p.windows === 1 ? t0 : t0 + ((t1 - t0) * i) / (p.windows - 1);
    for (const th of [winTh, TAU - winTh]) {
      const draw = (c2: CanvasRenderingContext2D, fill: string) => {
        c2.beginPath();
        c2.ellipse(X(th), Y(t), (wh / TAU) * W * 0.5, wl * H * 0.5, 0, 0, TAU);
        c2.fillStyle = fill; c2.fill();
      };
      ctx.lineWidth = 6; ctx.strokeStyle = "rgba(0,0,0,0.18)";
      draw(ctx, "#1a212c"); ctx.stroke();
      draw(rough.ctx, "rgb(10,10,10)");
      draw(metal.ctx, "rgb(150,150,150)");
      draw(emi.ctx, "#fff");
    }
  }

  // Windshield: wrap-around panels on the nose shoulder (trapezoids in theta/t space)
  const quad = (pts: [number, number][]) => {
    for (const c2 of [ctx, rough.ctx, metal.ctx]) {
      c2.beginPath();
      pts.forEach(([th, t], i) => (i ? c2.lineTo(X(th), Y(t)) : c2.moveTo(X(th), Y(t))));
      c2.closePath();
      c2.fillStyle = c2 === ctx ? "#202a36" : c2 === rough.ctx ? "rgb(6,6,6)" : "rgb(170,170,170)";
      c2.fill();
      if (c2 === ctx) { c2.lineWidth = 7; c2.strokeStyle = "#5d6168"; c2.stroke(); }
    }
  };
  const PI = Math.PI, tf = 0.126, tb = 0.192;
  for (const sgn of [1, -1]) {
    const th = (a: number) => (sgn > 0 ? a * PI : TAU - a * PI);
    // front panel: lower edge forward, upper edge set back
    quad([[th(0.015), tf + 0.006], [th(0.2), tf], [th(0.19), tb - 0.012], [th(0.015), tb - 0.004]]);
    // side panel wraps down the side of the nose
    quad([[th(0.215), tf + 0.002], [th(0.43), tf + 0.02], [th(0.39), tb + 0.004], [th(0.205), tb - 0.01]]);
  }

  // Forward left passenger door outline
  const dth0 = TAU - Math.acos(-0.58), dth1 = TAU - Math.acos(0.66);
  const dt = 0.25, dw = 0.92 / p.length;
  ctx.strokeStyle = "rgba(0,0,0,0.35)"; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.roundRect(X(dth0), Y(dt - dw / 2), X(dth1) - X(dth0), dw * H, 18); ctx.stroke();

  const map = canvasTexture(col.c); map.flipY = false;
  const roughnessMap = canvasTexture(rough.c, false); roughnessMap.flipY = false;
  const emissiveMap = canvasTexture(emi.c); emissiveMap.flipY = false;
  const metalnessMap = canvasTexture(metal.c, false); metalnessMap.flipY = false;
  return { map, roughnessMap, emissiveMap, metalnessMap };
}

export type Jet = {
  group: THREE.Group;
  lights: { strobes: THREE.Object3D[]; beacons: THREE.Object3D[] };
  /** Height of the fuselage axis above the ground. */
  lift: number;
  /** Foot of the airstair, in the jet's local space. */
  doorLocal?: THREE.Vector3;
  dispose: () => void;
};

export function createJet(params: JetParams): Jet {
  const p = { navLights: true, gearDown: true, cabinGlow: 0, ...params };
  const L = p.livery ?? LIVERIES.graphite;
  const R = p.radius;
  const { r, c, x } = profile(p);
  const group = new THREE.Group();
  const disposables: { dispose: () => void }[] = [];
  const add = (m: THREE.Mesh, cast = true) => { m.castShadow = cast; m.receiveShadow = true; group.add(m); disposables.push(m.geometry); return m; };

  // ---- Fuselage
  const tex = paintTextures(p, L);
  const skin = new THREE.MeshPhysicalMaterial({ ...tex, roughness: 1, metalness: 1, clearcoat: 0.85, clearcoatRoughness: 0.1, emissive: new THREE.Color("#ffc68a"), emissiveIntensity: p.cabinGlow });
  disposables.push(skin, tex.map, tex.roughnessMap, tex.emissiveMap, tex.metalnessMap);
  // 55 of 220 rings on the nose, denser towards the tip
  const tMap = (i: number) => { const u = i / 220; return u < 0.25 ? Math.pow(u / 0.25, 1.6) * TN : TN + ((u - 0.25) / 0.75) * (1 - TN); };
  const fus = tube(220, 96, (t, th) => {
    const rr = t >= 0.999 ? 0 : r(t);
    return new THREE.Vector3(x(t), c(t) + rr * KY * Math.cos(th), rr * Math.sin(th));
  }, (i) => Math.min(1, tMap(i)));
  add(new THREE.Mesh(fus, skin));

  const top = (t: number) => c(t) + r(t) * KY;
  const bottom = (t: number) => c(t) - r(t) * KY;
  const xt = (xx: number) => (p.length / 2 - xx) / p.length; // x -> t

  // ---- Wings
  const wingMat = mats.paint(L.base === "#1b2433" ? "#cfd2d6" : "#e9eaec");
  wingMat.roughness = 0.36;
  disposables.push(wingMat);
  const b = p.span / 2 - R * 0.6;
  const cr = p.length * 0.215, ct = p.length * 0.062;
  const sweep = THREE.MathUtils.degToRad(29), dih = THREE.MathUtils.degToRad(3.2);
  const xLE = p.length * 0.075, yRoot = -R * 0.62;
  const s = new THREE.Vector3(0, Math.sin(dih), Math.cos(dih));
  const tAx = new THREE.Vector3(0, Math.cos(dih), -Math.sin(dih));
  const wingSecs: Section[] = [];
  for (let i = 0; i <= 14; i++) {
    const e = i / 14;
    const ch = THREE.MathUtils.lerp(cr, ct, Math.pow(e, 0.85));
    const o = new THREE.Vector3(xLE - e * b * Math.tan(sweep), yRoot, R * 0.35).addScaledVector(s, e * b);
    wingSecs.push({ o, chord: ch, thick: THREE.MathUtils.lerp(0.13, 0.09, e), camber: 0.02, t: tAx.clone() });
  }
  // blended winglet
  const tip = wingSecs[wingSecs.length - 1];
  const rb = 0.42 * (p.span / 20), cant = THREE.MathUtils.degToRad(12);
  const B = 7;
  let last = tip;
  for (let k = 1; k <= B; k++) {
    const ph = (k / B) * (Math.PI / 2 - cant);
    const sk = s.clone().multiplyScalar(Math.cos(ph)).addScaledVector(tAx, Math.sin(ph));
    const tk = tAx.clone().multiplyScalar(Math.cos(ph)).addScaledVector(s, -Math.sin(ph));
    const o = tip.o.clone().addScaledVector(s, Math.sin(ph) * rb).addScaledVector(tAx, (1 - Math.cos(ph)) * rb);
    o.x -= ph * rb * 0.9;
    last = { o, chord: ct * (1 - 0.1 * (k / B)), thick: 0.09, camber: 0.0, t: tk };
    wingSecs.push(last);
    if (k === B) {
      const hw = p.span * 0.078;
      for (let m = 1; m <= 5; m++) {
        const e = m / 5;
        const oo = last.o.clone().addScaledVector(sk, e * hw);
        oo.x -= e * hw * Math.tan(THREE.MathUtils.degToRad(42));
        wingSecs.push({ o: oo, chord: ct * THREE.MathUtils.lerp(0.9, 0.42, e), thick: 0.08, camber: 0, t: tk.clone() });
      }
    }
  }
  const wingGeo = loft(wingSecs, 30);
  const wingR = add(new THREE.Mesh(wingGeo, wingMat));
  const wingL = new THREE.Mesh(wingGeo, wingMat); wingL.scale.z = -1; wingL.castShadow = true; group.add(wingL);
  void wingR;
  const wingTip = wingSecs[14].o.clone();
  const wingletTop = wingSecs[wingSecs.length - 1].o.clone();

  // Wing-to-body fairing
  const fair = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 16), skin.clone());
  (fair.material as THREE.MeshPhysicalMaterial).map = null;
  (fair.material as THREE.MeshPhysicalMaterial).roughnessMap = null;
  (fair.material as THREE.MeshPhysicalMaterial).metalnessMap = null;
  (fair.material as THREE.MeshPhysicalMaterial).metalness = 0;
  (fair.material as THREE.MeshPhysicalMaterial).emissiveIntensity = 0;
  (fair.material as THREE.MeshPhysicalMaterial).color = new THREE.Color(L.belly);
  (fair.material as THREE.MeshPhysicalMaterial).roughness = 0.36;
  fair.scale.set(cr * 0.62, R * 0.42, R * 0.92);
  fair.position.set(xLE - cr * 0.45, -R * 0.68, 0);
  add(fair);

  // ---- Vertical fin + T-tail
  const finMat = skin.clone();
  finMat.map = null; finMat.roughnessMap = null; finMat.metalnessMap = null; finMat.metalness = 0; finMat.emissiveIntensity = 0; finMat.color = new THREE.Color(L.base); finMat.roughness = 0.3;
  disposables.push(finMat);
  const finRootX = -p.length * 0.255, finRootChord = p.length * 0.205, finTipChord = p.length * 0.105;
  const finSweep = THREE.MathUtils.degToRad(47);
  const finRootY = top(xt(finRootX - finRootChord * 0.5)) - 0.35;
  const finSecs: Section[] = [];
  for (let i = 0; i <= 8; i++) {
    const e = i / 8;
    const h = e * (p.fin + 0.35);
    finSecs.push({ o: new THREE.Vector3(finRootX - h * Math.tan(finSweep), finRootY + h, 0), chord: THREE.MathUtils.lerp(finRootChord, finTipChord, e), thick: 0.11, t: new THREE.Vector3(0, 0, 1) });
  }
  add(new THREE.Mesh(loft(finSecs, 26), finMat));
  const finTop = finSecs[finSecs.length - 1];
  const hsSpan = p.span * 0.19, hsRoot = p.length * 0.12, hsTip = p.length * 0.055, hsSweep = THREE.MathUtils.degToRad(33), hsDih = THREE.MathUtils.degToRad(2);
  const hs = new THREE.Vector3(0, Math.sin(hsDih), Math.cos(hsDih));
  const hsSecs: Section[] = [];
  for (let i = 0; i <= 8; i++) {
    const e = i / 8;
    const o = new THREE.Vector3(finTop.o.x - finTipChord * 0.12 - e * hsSpan * Math.tan(hsSweep), finTop.o.y - 0.05, 0).addScaledVector(hs, e * hsSpan);
    hsSecs.push({ o, chord: THREE.MathUtils.lerp(hsRoot, hsTip, e), thick: 0.1, t: new THREE.Vector3(0, Math.cos(hsDih), -Math.sin(hsDih)) });
  }
  const hsGeo = loft(hsSecs, 24);
  add(new THREE.Mesh(hsGeo, wingMat));
  const hsL = new THREE.Mesh(hsGeo, wingMat); hsL.scale.z = -1; hsL.castShadow = true; group.add(hsL);
  const bullet = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 12), finMat);
  bullet.scale.set(finTipChord * 0.75, 0.16 * p.engine, 0.2 * p.engine);
  bullet.position.set(finTop.o.x - finTipChord * 0.45, finTop.o.y - 0.02, 0);
  add(bullet);

  // ---- Engines (rear fuselage mounted)
  const Ln = p.length * 0.165 * p.engine, Rn = 0.56 * p.engine * (p.length / 21) ** 0.4;
  const nacFrontX = -p.length * 0.17;
  const outer: [number, number][] = [
    [0.7 * Rn, 0], [0.8 * Rn, 0.1 * Ln], [0.96 * Rn, 0.5 * Ln], [Rn, 0.72 * Ln], [0.97 * Rn, 0.9 * Ln], [0.92 * Rn, 0.975 * Ln],
  ];
  const lip: [number, number][] = [[0.92 * Rn, 0.975 * Ln], [0.87 * Rn, 1.0 * Ln], [0.8 * Rn, 0.995 * Ln], [0.77 * Rn, 0.96 * Ln], [0.76 * Rn, 0.86 * Ln]];
  const nacGeo = revolveX(outer, 48), lipGeo = revolveX(lip, 48);
  const fanGeo = new THREE.CircleGeometry(0.76 * Rn, 40); fanGeo.rotateY(Math.PI / 2);
  const spinGeo = revolveX([[0.0, 0.18 * Rn], [0.16 * Rn, 0.05 * Rn], [0.2 * Rn, 0]], 24);
  const coneGeo = revolveX([[0.0, -0.32 * Ln], [0.22 * Rn, -0.12 * Ln], [0.42 * Rn, 0.02 * Ln], [0.58 * Rn, 0.08 * Ln]], 32);
  const nacMat = finMat.clone(), lipMat = mats.polished(), fanMat = mats.darkMetal(), cone = mats.darkMetal();
  nacMat.side = lipMat.side = cone.side = THREE.DoubleSide;
  disposables.push(nacMat);
  disposables.push(lipMat, fanMat, cone);
  const tN = xt(nacFrontX - Ln * 0.5);
  for (const side of [1, -1]) {
    const ng = new THREE.Group();
    ng.add(new THREE.Mesh(nacGeo, nacMat), new THREE.Mesh(lipGeo, lipMat));
    const fan = new THREE.Mesh(fanGeo, fanMat); fan.position.x = 0.86 * Ln; ng.add(fan);
    const sp = new THREE.Mesh(spinGeo, cone); sp.position.x = 0.86 * Ln; ng.add(sp);
    ng.add(new THREE.Mesh(coneGeo, cone));
    ng.children.forEach((m) => { m.castShadow = true; });
    const zc = side * (r(tN) + Rn * 1.05 + 0.18 * p.engine);
    ng.position.set(nacFrontX - Ln, c(tN) + r(tN) * 0.38, zc);
    ng.rotation.y = -side * 0.015;
    group.add(ng);
    // pylon
    const pz0 = side * (r(tN) * 0.7), pz1 = zc - side * Rn * 0.7;
    const pyl: Section[] = [0, 1].map((e) => ({
      o: new THREE.Vector3(nacFrontX - Ln * 0.22, ng.position.y + 0.02, THREE.MathUtils.lerp(pz0, pz1, e)),
      chord: Ln * 0.62, thick: 0.14, t: new THREE.Vector3(0, 1, 0),
    }));
    add(new THREE.Mesh(loft(pyl, 16, true), finMat));
  }
  disposables.push(nacGeo, lipGeo, fanGeo, spinGeo, coneGeo);

  // ---- Landing gear
  const groundY = bottom(0.4) - p.clearance;
  const lift = -groundY;
  if (p.gearDown) {
    const rubber = mats.rubber(), strut = mats.strut(), hub = mats.darkMetal();
    disposables.push(rubber, strut, hub);
    const wheel = (rw: number, wd: number) => {
      const g = new THREE.Group();
      const tyre = new THREE.Mesh(new THREE.TorusGeometry(rw * 0.72, rw * 0.3, 14, 32), rubber);
      tyre.scale.z = wd / (rw * 0.6);
      const h = new THREE.Mesh(new THREE.CylinderGeometry(rw * 0.5, rw * 0.5, wd * 0.9, 24), hub);
      h.rotation.x = Math.PI / 2;
      g.add(tyre, h);
      g.children.forEach((m) => { m.castShadow = true; });
      return g;
    };
    const rwM = 0.36 * (p.length / 21) ** 0.6, rwN = rwM * 0.72;
    const mainX = xLE - cr * 0.62, track = R * 1.55;
    for (const side of [1, -1]) {
      for (const dz of [-0.17, 0.17]) {
        const w = wheel(rwM, 0.22); w.position.set(mainX, groundY + rwM, side * track + dz * rwM * 2.2); group.add(w);
      }
      const sTop = yRoot - 0.05;
      const st = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.085, sTop - (groundY + rwM), 10), strut);
      st.position.set(mainX, (sTop + groundY + rwM) / 2, side * track);
      add(st);
    }
    const noseX = p.length * 0.36;
    for (const dz of [-1, 1]) { const w = wheel(rwN, 0.16); w.position.set(noseX, groundY + rwN, dz * rwN * 0.55); group.add(w); }
    const nTop = bottom(xt(noseX)) + 0.25;
    const ns = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, nTop - (groundY + rwN), 10), strut);
    ns.position.set(noseX, (nTop + groundY + rwN) / 2, 0);
    add(ns);
    if (p.taxiLight) {
      const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), mats.emissive("#fff3dd", 40));
      lamp.position.set(noseX + 0.08, groundY + rwN * 2.6, 0);
      group.add(lamp);
      const coneG = new THREE.ConeGeometry(4.5, 26, 32, 1, true);
      coneG.translate(0, -13, 0);
      coneG.rotateZ(Math.PI / 2 - 0.07);
      const beamMat = new THREE.ShaderMaterial({
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
        uniforms: { col: { value: new THREE.Color("#ffe9c9") } },
        vertexShader: `varying vec3 vP; varying vec3 vN; varying vec3 vV; void main(){ vP = position; vN = normalize(normalMatrix*normal); vec4 mv = modelViewMatrix*vec4(position,1.0); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }`,
        fragmentShader: `uniform vec3 col; varying vec3 vP; varying vec3 vN; varying vec3 vV; void main(){ float d = clamp(vP.x/26.0, 0.0, 1.0); float edge = pow(abs(dot(vN, vV)), 1.5); gl_FragColor = vec4(col * 0.11 * (1.0-d) * (1.0-d) * edge, 1.0); }`,
      });
      const beam = new THREE.Mesh(coneG, beamMat);
      beam.position.copy(lamp.position);
      group.add(beam);
    }
  }

  // ---- Nav lights, beacons, strobes
  const strobes: THREE.Object3D[] = [], beacons: THREE.Object3D[] = [];
  if (p.navLights) {
    const navR = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 8), mats.emissive("#ff2a1f", 14));
    const navG = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 8), mats.emissive("#2bff7a", 10));
    navG.position.copy(wingTip).add(new THREE.Vector3(-0.1, 0.05, 0.05));
    navR.position.copy(navG.position).setZ(-navG.position.z);
    group.add(navR, navG);
    for (const z of [1, -1]) {
      const st = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8), mats.emissive("#ffffff", 30));
      st.position.set(wingletTop.x - 0.3, wingletTop.y - 0.2, z * wingletTop.z);
      st.visible = false; strobes.push(st); group.add(st);
    }
    const tail = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8), mats.emissive("#ffffff", 8));
    tail.position.set(x(1) - 0.05, c(0.995), 0);
    group.add(tail);
    for (const [bx, by] of [[0.0, top(0.5) + 0.04], [-p.length * 0.02, bottom(0.5) - 0.04]]) {
      const be = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), mats.emissive("#ff3b26", 18));
      be.position.set(bx, by, 0); beacons.push(be); group.add(be);
    }
  }

  // ---- Airstair (forward left door open)
  let doorLocal: THREE.Vector3 | undefined;
  if (p.stairs) {
    const dt = 0.25, dx = x(dt);
    const sillY = -R * 0.58, topY = R * 0.66;
    const glowMat = mats.emissive("#ffc48a", 1.3);
    const dw = 0.9 / p.length;
    const th0 = Math.PI * 2 - Math.acos(sillY / (R * KY)), th1 = Math.PI * 2 - Math.acos(topY / (R * KY));
    const og = tube(6, 10, (u, th) => {
      const tt = dt - dw / 2 + u * dw;
      const a = th0 + (th1 - th0) * (th / (Math.PI * 2));
      return new THREE.Vector3(x(tt), c(tt) + r(tt) * 1.006 * KY * Math.cos(a), r(tt) * 1.006 * Math.sin(a));
    });
    const opening = new THREE.Mesh(og, glowMat);
    (opening.material as THREE.Material).side = THREE.DoubleSide;
    group.add(opening);
    const zs = -R * Math.sqrt(1 - (sillY / (R * KY)) ** 2);
    const steps = 6, depth = 1.85, rise = sillY - groundY;
    const stepMat = new THREE.MeshStandardMaterial({ color: "#c9c6bf", roughness: 0.5, metalness: 0.3 });
    const side = new THREE.MeshStandardMaterial({ color: L.base, roughness: 0.35 });
    disposables.push(stepMat, side);
    const riserMat = new THREE.MeshStandardMaterial({ color: "#2b2d31", roughness: 0.8 });
    disposables.push(riserMat);
    for (let i = 0; i < steps; i++) {
      const y = sillY - (i + 0.5) * (rise / steps), z = zs - (i + 0.5) * (depth / steps);
      const st = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.05, depth / steps + 0.02), stepMat);
      st.position.set(dx, y - 0.02, z);
      add(st);
      const rs = new THREE.Mesh(new THREE.BoxGeometry(0.8, rise / steps, 0.03), riserMat);
      rs.position.set(dx, y + rise / steps / 2 - 0.02, z + depth / steps / 2);
      add(rs);
    }
    const ang = Math.atan2(rise, depth), len = Math.hypot(rise, depth);
    for (const ox of [-0.44, 0.44]) {
      const str = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.42, len), side);
      str.position.set(dx + ox, sillY - rise / 2, zs - depth / 2);
      str.rotation.x = -ang;
      add(str);
      const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, len * 0.9, 8), mats.strut());
      rail.rotation.x = Math.PI / 2 - ang;
      rail.position.set(dx + ox, sillY - rise / 2 + 0.95, zs - depth / 2);
      add(rail);
    }
    const pl = new THREE.PointLight("#ffc78a", 3, 9, 1.6);
    pl.position.set(dx, sillY + 0.5, zs - 0.9);
    group.add(pl);
    doorLocal = new THREE.Vector3(dx, groundY, zs - depth);
  }

  group.position.y = lift;
  return {
    group, lift, doorLocal,
    lights: { strobes, beacons },
    dispose: () => disposables.forEach((d) => d.dispose()),
  };
}

/** Animate strobes/beacons. */
export function animateJetLights(jet: Jet, t: number) {
  const s = (t % 1.3) < 0.06;
  jet.lights.strobes.forEach((o) => (o.visible = s));
  const b = Math.max(0, Math.sin(t * Math.PI * 1.6)) ** 6;
  jet.lights.beacons.forEach((o) => ((o as THREE.Mesh).scale.setScalar(0.4 + b * 1.2)));
}

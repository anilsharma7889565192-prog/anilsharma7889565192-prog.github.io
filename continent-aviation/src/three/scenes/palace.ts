import * as THREE from "three";
import { Reflector } from "three/examples/jsm/objects/Reflector.js";
import { createSky, skyEnvironment, SKY, type SkyPreset } from "../core/sky";
import { canvas, canvasTexture, fbm2, makeNoise2D, rng } from "../core/util";
import { halos, lightRow } from "../core/lights";
import type { SceneContext, SceneSetup } from "../core/stage";

const PPM = 14; // facade texture pixels per metre

/** Facade with rows of arched openings; returns colour + emissive maps sized to the face. */
function facade(w: number, h: number, floors: number, arch: number, seed: number, litChance = 0.42) {
  const W = Math.min(4096, Math.round(w * PPM)), H = Math.min(2048, Math.round(h * PPM));
  const col = canvas(W, H), emi = canvas(W, H);
  const r = rng(seed);
  const n = makeNoise2D(seed);
  const img = col.ctx.createImageData(W, H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const v = 0.9 + fbm2(n, x / 60, y / 60, 3) * 0.12 + (r() - 0.5) * 0.04;
    const i = (y * W + x) * 4;
    img.data[i] = 236 * v; img.data[i + 1] = 222 * v; img.data[i + 2] = 196 * v; img.data[i + 3] = 255;
  }
  col.ctx.putImageData(img, 0, 0);
  emi.ctx.fillStyle = "#000"; emi.ctx.fillRect(0, 0, W, H);
  const fh = H / floors;
  for (let f = 0; f < floors; f++) {
    const y0 = f * fh;
    // cornice band
    col.ctx.fillStyle = "rgba(255,248,232,0.6)"; col.ctx.fillRect(0, y0, W, fh * 0.06);
    col.ctx.fillStyle = "rgba(70,55,40,0.35)"; col.ctx.fillRect(0, y0 + fh * 0.06, W, fh * 0.025);
    const count = Math.max(1, Math.floor(w / arch));
    const pitch = W / count;
    for (let k = 0; k < count; k++) {
      const cx = pitch * (k + 0.5), aw = pitch * 0.52, ah = fh * 0.62, top = y0 + fh * 0.2;
      const path = (c2: CanvasRenderingContext2D) => {
        c2.beginPath();
        c2.moveTo(cx - aw / 2, top + ah);
        c2.lineTo(cx - aw / 2, top + aw / 2);
        c2.quadraticCurveTo(cx - aw / 2, top, cx, top - aw * 0.12);
        c2.quadraticCurveTo(cx + aw / 2, top, cx + aw / 2, top + aw / 2);
        c2.lineTo(cx + aw / 2, top + ah);
        c2.closePath();
      };
      path(col.ctx); col.ctx.fillStyle = "#3a2a1e"; col.ctx.fill();
      col.ctx.strokeStyle = "rgba(255,250,236,0.55)"; col.ctx.lineWidth = 2; col.ctx.stroke();
      if (r() < litChance) {
        const g = emi.ctx.createLinearGradient(0, top, 0, top + ah);
        const b = 0.55 + r() * 0.45;
        g.addColorStop(0, `rgba(255,${190 + r() * 40},${110 + r() * 40},${b})`);
        g.addColorStop(1, `rgba(255,150,70,${b * 0.6})`);
        path(emi.ctx); emi.ctx.fillStyle = g; emi.ctx.fill();
      }
    }
  }
  const map = canvasTexture(col.c), emissiveMap = canvasTexture(emi.c);
  return { map, emissiveMap };
}

function block(w: number, h: number, d: number, floors: number, arch: number, seed: number) {
  const front = facade(w, h, floors, arch, seed), side = facade(d, h, floors, arch, seed + 1, 0.3);
  const top = new THREE.MeshStandardMaterial({ color: "#d9cbb0", roughness: 0.9 });
  const m = (f: { map: THREE.Texture; emissiveMap: THREE.Texture }) => new THREE.MeshStandardMaterial({ ...f, roughness: 0.85, emissive: new THREE.Color("#ffffff"), emissiveIntensity: 1.6 });
  const fm = m(front), sm = m(side);
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), [sm, sm, top, top, fm, fm]);
  mesh.position.y = h / 2;
  const g = new THREE.Group();
  g.add(mesh);
  // parapet
  const par = new THREE.Mesh(new THREE.BoxGeometry(w + 0.6, 0.9, d + 0.6), top);
  par.position.y = h + 0.45;
  g.add(par);
  return g;
}

/** Domed open pavilion (chhatri). */
function chhatri(scale = 1, mats: { stone: THREE.Material }) {
  const g = new THREE.Group();
  const col = new THREE.CylinderGeometry(0.16, 0.18, 2.6, 8);
  for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { const c = new THREE.Mesh(col, mats.stone); c.position.set(x * 0.95, 1.3, z * 0.95); g.add(c); }
  const slab = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.25, 2.6), mats.stone); slab.position.y = 2.7; g.add(slab);
  const dome = new THREE.Mesh(new THREE.LatheGeometry([[0, 0], [1.3, 0], [1.35, 0.4], [1.2, 0.95], [0.8, 1.4], [0.3, 1.75], [0.08, 2.1], [0, 2.2]].map(([x, y]) => new THREE.Vector2(x, y)), 20), mats.stone);
  dome.position.y = 2.82; g.add(dome);
  g.scale.setScalar(scale);
  return g;
}

export function createPalaceScene(ctx: SceneContext): SceneSetup {
  const preset: SkyPreset = { ...SKY.golden, sunDir: [-0.85, 0.035, -0.5], zenith: "#1b2a4d", mid: "#4c5f86", horizon: "#f0a46c", glow: "#ff9a52", cloudLit: "#ffb98a", cloudShade: "#5a5a78", cloudCover: 0.52, cloudOpacity: 0.65, band: 0.16 };
  const scene = new THREE.Scene();
  const haze = new THREE.Color(preset.horizon).lerp(new THREE.Color(preset.mid), 0.5).multiplyScalar(0.8);
  scene.fog = new THREE.FogExp2(haze, 0.0007);
  const sky = createSky(preset);
  scene.add(sky);
  scene.environment = skyEnvironment(ctx.renderer, preset);

  const sun = new THREE.DirectionalLight(new THREE.Color("#ffb070"), 2.4);
  sun.position.set(-400, 60, 150);
  scene.add(sun);
  scene.add(new THREE.HemisphereLight(new THREE.Color("#8ea0c4"), new THREE.Color("#4a3a2a"), 0.9));

  const stone = new THREE.MeshStandardMaterial({ color: "#eadfc8", roughness: 0.8 });
  const palace = new THREE.Group();
  palace.position.set(0, 0, -260);
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(150, 4, 62), stone); plinth.position.y = 2; palace.add(plinth);
  for (let i = 0; i < 5; i++) { const st = new THREE.Mesh(new THREE.BoxGeometry(46 - i * 2, 0.5, 2.2), stone); st.position.set(0, 0.25 + i * 0.5, 31 + (5 - i) * 1.1); palace.add(st); }
  const A = block(132, 13, 52, 3, 6.5, 11); A.position.y = 4; palace.add(A);
  const B = block(64, 10, 32, 2, 6, 12); B.position.set(0, 17.9, -4); palace.add(B);
  const C = block(26, 7, 18, 1, 6.5, 13); C.position.set(0, 28.8, -6); palace.add(C);
  for (const x of [-60, 60]) { const T = block(14, 25, 14, 4, 7, 14 + x); T.position.set(x, 4, 20); palace.add(T); }
  // domes and chhatris
  const onion = new THREE.LatheGeometry([[0, 0], [5.2, 0], [5.6, 1.6], [5.2, 3.6], [3.8, 5.6], [1.6, 7.2], [0.5, 8.4], [0.3, 9.6], [0, 10.4]].map(([x, y]) => new THREE.Vector2(x, y)), 32);
  const dome = new THREE.Mesh(onion, stone); dome.position.set(0, 36.6, -6); palace.add(dome);
  for (const x of [-60, 60]) { const d = new THREE.Mesh(onion, stone); d.scale.setScalar(0.62); d.position.set(x, 29.9, 20); palace.add(d); }
  const ch: [number, number, number, number][] = [];
  for (let i = -5; i <= 5; i++) if (Math.abs(i) > 1) ch.push([i * 11, 17.9, 25.4, 1]);
  for (const x of [-30, -15, 15, 30]) ch.push([x, 28.8, 11.5, 0.9]);
  for (const x of [-10, 10]) ch.push([x, 36.7, 2.5, 0.8]);
  for (const [x, y, z, s] of ch) { const c = chhatri(s, { stone }); c.position.set(x, y, z); palace.add(c); }
  // wedding string lights along the parapets and towers
  const bulbs: THREE.Vector3[] = [];
  const edge = (x0: number, x1: number, y: number, z: number, step = 1.1, sag = 0.5) => {
    for (let x = x0; x <= x1; x += step) { const u = ((x - x0) % 6.6) / 6.6; bulbs.push(new THREE.Vector3(x, y - Math.sin(u * Math.PI) * sag, z)); }
  };
  edge(-66, 66, 17.6, 26.6); edge(-32, 32, 28.4, 12.6); edge(-13, 13, 36.2, 3.4);
  for (const x of [-60, 60]) for (let y = 5; y < 29; y += 0.9) { bulbs.push(new THREE.Vector3(x - 7.1, y, 27.1), new THREE.Vector3(x + 7.1, y, 27.1)); }
  palace.add(lightRow(bulbs, "#ffc070", 7, 0.13));
  palace.add(halos(bulbs, "#ffb35c", 1.4, 0.45));
  scene.add(palace);

  // distant hills: two silhouette layers
  for (const [z, amp, colr, sd] of [[-1500, 230, "#3c3a35", 5], [-2600, 380, "#4a4a4c", 9]] as const) {
    const n = makeNoise2D(sd);
    const g = new THREE.PlaneGeometry(9000, 1, 360, 1);
    const hp = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < hp.count; i++) {
      const x = hp.getX(i);
      const top = (fbm2(n, x * 0.0014, 0.3, 5) * 0.5 + 0.5) * amp + 25;
      hp.setY(i, hp.getY(i) > 0 ? top : -5);
    }
    g.computeVertexNormals();
    const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color: colr, roughness: 1 }));
    m.position.set(0, 0, z);
    scene.add(m);
  }

  // lake
  const water = new Reflector(new THREE.PlaneGeometry(8000, 8000), {
    textureWidth: ctx.quality === "live" ? 768 : 2048, textureHeight: ctx.quality === "live" ? 768 : 1600, clipBias: 0.002,
    shader: {
      uniforms: { color: { value: null }, tDiffuse: { value: null }, textureMatrix: { value: null }, time: { value: 0 }, fogColor: { value: haze } },
      vertexShader: `uniform mat4 textureMatrix; varying vec4 vUv; varying vec3 vW; void main(){ vUv = textureMatrix * vec4(position,1.0); vW = (modelMatrix*vec4(position,1.0)).xyz; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
      fragmentShader: /* glsl */ `uniform sampler2D tDiffuse; uniform float time; uniform vec3 fogColor; varying vec4 vUv; varying vec3 vW;
        float hash(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }
        void main(){
          float d = length(vW - cameraPosition);
          float k = 1.0 / (1.0 + d * 0.01);
          vec2 w = vec2(sin(vW.x*0.35 + time*0.8 + sin(vW.z*0.5)) * 0.35, sin(vW.z*1.4 + time*0.6 + vW.x*0.25) + 0.6*sin(vW.z*3.1 + vW.x*0.7)) * 0.009 * k;
          vec3 r = texture2D(tDiffuse, vUv.xy/vUv.w + w).rgb;
          vec3 V = normalize(cameraPosition - vW); float fres = 0.12 + 0.88*pow(1.0 - clamp(V.y,0.0,1.0), 4.0);
          vec3 col = mix(vec3(0.015, 0.02, 0.03), r * 0.8, fres);
          col = mix(col, fogColor, 1.0 - exp(-d * 0.0004));
          gl_FragColor = vec4(col, 1.0); }`,
    },
  });
  water.rotation.x = -Math.PI / 2;
  water.position.y = 0.05;
  scene.add(water);

  // floating diyas in the foreground
  const rr = rng(8);
  const diyas: THREE.Vector3[] = [];
  for (let i = 0; i < 120; i++) diyas.push(new THREE.Vector3(-150 + (rr() - 0.3) * 90, 0.12, -30 - rr() * 150));
  scene.add(lightRow(diyas, "#ffb24d", 9, 0.07));
  scene.add(halos(diyas, "#ffa53c", 0.9, 0.55));

  const camera = new THREE.PerspectiveCamera(22, ctx.aspect, 0.5, 20000);
  camera.layers.enable(1);
  camera.position.set(-170, 3.6, 10);
  const target = new THREE.Vector3(-14, 15, -262);
  camera.lookAt(target);

  return {
    scene, camera, exposure: 0.95, toneMapping: THREE.ACESFilmicToneMapping,
    post: { bloom: 0.55, bloomRadius: 0.6, threshold: 0.95, vignette: 0.32 },
    resize: (w, h) => { camera.aspect = w / h; camera.updateProjectionMatrix(); },
    update: (t) => {
      (sky.material as THREE.ShaderMaterial).uniforms.time.value = t;
      (water.material as THREE.ShaderMaterial).uniforms.time.value = t;
    },
  };
}

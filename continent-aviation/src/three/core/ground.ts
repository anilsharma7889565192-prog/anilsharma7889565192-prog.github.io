import * as THREE from "three";
import { Reflector } from "three/examples/jsm/objects/Reflector.js";
import { canvas, canvasTexture, makeNoise2D, fbm2, rng } from "./util";

/** Procedural concrete apron tile (10 m), RGB = albedo detail, A = wetness. */
function concreteTexture(size = 1024) {
  const { c, ctx } = canvas(size, size);
  const img = ctx.createImageData(size, size);
  const n = makeNoise2D(11);
  const r = rng(3);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = x / size, v = y / size;
      const large = fbm2(n, u * 4, v * 4, 4);
      const fine = (r() - 0.5) * 0.12;
      const stain = Math.max(0, fbm2(n, u * 2 + 9, v * 2 + 3, 3)) * 0.5;
      let g = 0.52 + large * 0.18 + fine - stain * 0.25;
      // expansion joints at tile edges
      const ex = Math.min(u, 1 - u), ey = Math.min(v, 1 - v);
      if (ex < 0.0025 || ey < 0.0025) g *= 0.45;
      const wet = Math.min(1, Math.max(0, 0.55 + fbm2(n, u * 3 + 20, v * 3 + 5, 4) * 1.4));
      const i = (y * size + x) * 4;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = Math.max(0, Math.min(255, g * 255));
      img.data[i + 3] = wet * 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvasTexture(c, false, true);
}

export type Pool = { pos: THREE.Vector3; color: THREE.Color; radius: number };

const shader = {
  uniforms: {
    color: { value: null as THREE.Color | null },
    tDiffuse: { value: null as THREE.Texture | null },
    textureMatrix: { value: null as THREE.Matrix4 | null },
    tConcrete: { value: null as THREE.Texture | null },
    baseColor: { value: new THREE.Color("#2a2c31") },
    reflectivity: { value: 1.0 },
    blur: { value: 0.0025 },
    fogColor: { value: new THREE.Color("#000") },
    fogDensity: { value: 0.004 },
    poolPos: { value: Array.from({ length: 8 }, () => new THREE.Vector3(0, -999, 0)) },
    poolCol: { value: Array.from({ length: 8 }, () => new THREE.Color(0, 0, 0)) },
    poolRad: { value: new Array(8).fill(1) },
  },
  vertexShader: /* glsl */ `
    uniform mat4 textureMatrix;
    varying vec4 vUv;
    varying vec3 vWorld;
    void main() {
      vUv = textureMatrix * vec4(position, 1.0);
      vWorld = (modelMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,
  fragmentShader: /* glsl */ `
    uniform vec3 color, baseColor, fogColor;
    uniform sampler2D tDiffuse, tConcrete;
    uniform float reflectivity, blur, fogDensity;
    uniform vec3 poolPos[8]; uniform vec3 poolCol[8]; uniform float poolRad[8];
    varying vec4 vUv;
    varying vec3 vWorld;
    void main() {
      vec4 tex = texture2D(tConcrete, vWorld.xz * 0.1);
      vec4 tex2 = texture2D(tConcrete, vWorld.xz * 0.013 + 0.37);
      float wet = clamp(tex.a * 0.6 + tex2.a * 0.7 - 0.25, 0.0, 1.0);
      vec2 uv = vUv.xy / vUv.w;
      vec2 dist = (vec2(tex.r, tex2.r) - 0.5) * 0.006 * (1.0 - wet);
      float b = blur * (1.6 - wet);
      vec3 refl = vec3(0.0);
      const vec2 PD[12] = vec2[](vec2(-0.326,-0.406), vec2(-0.840,-0.074), vec2(-0.696,0.457), vec2(-0.203,0.621), vec2(0.962,-0.195), vec2(0.473,-0.480),
        vec2(0.519,0.767), vec2(0.185,-0.893), vec2(0.507,0.064), vec2(0.896,0.412), vec2(-0.322,-0.933), vec2(-0.792,-0.598));
      float ang = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) * 6.2831;
      float rad = 0.35 + 0.65 * fract(sin(dot(gl_FragCoord.xy, vec2(39.3468, 11.135))) * 24634.6345);
      mat2 rot = mat2(cos(ang), -sin(ang), sin(ang), cos(ang)) * rad;
      refl += texture2D(tDiffuse, uv + dist).rgb * 2.0;
      for (int i = 0; i < 12; i++) {
        vec2 o = rot * PD[i] * (0.4 + 0.6 * fract(float(i) * 0.618 + rad));
        refl += texture2D(tDiffuse, uv + dist + o * vec2(b * 0.7, b * 3.4)).rgb;
      }
      refl /= 14.0;
      vec3 V = normalize(cameraPosition - vWorld);
      float fres = 0.05 + 0.95 * pow(1.0 - clamp(V.y, 0.0, 1.0), 4.0);
      vec3 base = baseColor * (0.55 + tex.rgb * 0.9) * (0.75 + tex2.rgb * 0.5);
      vec3 light = vec3(0.0);
      for (int i = 0; i < 8; i++) {
        vec2 dd = vWorld.xz - poolPos[i].xz;
        light += poolCol[i] * exp(-dot(dd, dd) / (poolRad[i] * poolRad[i]));
      }
      base *= (1.0 + light * 2.0);
      base += light * 0.08;
      vec3 col = base * (1.0 - wet * 0.35) + refl * fres * reflectivity * mix(0.35, 1.0, wet);
      float d = length(vWorld - cameraPosition);
      float f = 1.0 - exp(-pow(d * fogDensity, 1.6));
      col = mix(col, fogColor, f);
      gl_FragColor = vec4(col, 1.0);
    }`,
};

export function createApron(opts: { size?: number; resolution?: number; base?: string; reflectivity?: number; fogColor?: THREE.Color; fogDensity?: number; pools?: Pool[]; blur?: number }) {
  const size = opts.size ?? 3000;
  const res = opts.resolution ?? 1024;
  const geo = new THREE.PlaneGeometry(size, size);
  const mirror = new Reflector(geo, { textureWidth: res, textureHeight: Math.round(res * 0.6), clipBias: 0.003, shader, multisample: 0 });
  mirror.rotation.x = -Math.PI / 2;
  const u = (mirror.material as THREE.ShaderMaterial).uniforms;
  u.tConcrete.value = concreteTexture();
  if (opts.base) u.baseColor.value = new THREE.Color(opts.base);
  u.reflectivity.value = opts.reflectivity ?? 1;
  u.blur.value = opts.blur ?? 0.0025;
  if (opts.fogColor) u.fogColor.value = opts.fogColor;
  u.fogDensity.value = opts.fogDensity ?? 0.004;
  (opts.pools ?? []).slice(0, 8).forEach((p, i) => {
    u.poolPos.value[i] = p.pos;
    u.poolCol.value[i] = p.color;
    u.poolRad.value[i] = p.radius;
  });
  return mirror;
}

/** Painted ground markings (taxi lead-in lines etc). */
export function createMarkings(paths: THREE.Vector2[][], color = "#8a7330", width = 0.18) {
  const group = new THREE.Group();
  const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.85, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });
  for (const path of paths) {
    const curve = new THREE.CatmullRomCurve3(path.map((p) => new THREE.Vector3(p.x, 0, p.y)));
    const pts = curve.getSpacedPoints(Math.max(8, Math.round(curve.getLength() / 0.5)));
    const pos: number[] = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1];
      const d = b.clone().sub(a).normalize();
      const n = new THREE.Vector3(-d.z, 0, d.x).multiplyScalar(width / 2);
      const a1 = a.clone().add(n), a2 = a.clone().sub(n), b1 = b.clone().add(n), b2 = b.clone().sub(n);
      pos.push(a1.x, 0.012, a1.z, a2.x, 0.012, a2.z, b1.x, 0.012, b1.z, b1.x, 0.012, b1.z, a2.x, 0.012, a2.z, b2.x, 0.012, b2.z);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    group.add(new THREE.Mesh(g, mat));
  }
  return group;
}

/** Blurred dark ellipse under an object to ground it. */
export function contactShadow(w: number, d: number, opacity = 0.7) {
  const { c, ctx } = canvas(256, 256);
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, "rgba(0,0,0,1)");
  g.addColorStop(0.45, "rgba(0,0,0,0.55)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  const tex = canvasTexture(c, false);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity, depthWrite: false, color: "#000" }));
  m.rotation.x = -Math.PI / 2;
  m.position.y = 0.02;
  m.renderOrder = 2;
  return m;
}

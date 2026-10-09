import * as THREE from "three";
import { Reflector } from "three/examples/jsm/objects/Reflector.js";
import { createSky, skyEnvironment, SKY, type SkyPreset } from "../core/sky";
import { fbm2, makeNoise2D, rng, smooth } from "../core/util";
import { createHelicopter, HELI_LIVERIES } from "../models/helicopter";
import type { SceneContext, SceneSetup } from "../core/stage";

/** Rolling forested hills with a winding lake, golden-hour haze. */
function terrain(size: number, seg: number, seed = 21) {
  const n = makeNoise2D(seed), n2 = makeNoise2D(seed + 5);
  const g = new THREE.PlaneGeometry(size, size, seg, seg);
  g.rotateX(-Math.PI / 2);
  const pos = g.attributes.position as THREE.BufferAttribute;
  const colors = new Float32Array(pos.count * 3);
  const lush = new THREE.Color("#22381c"), olive = new THREE.Color("#5b6236"), dry = new THREE.Color("#8b7a4c"), rock = new THREE.Color("#6a6056"), shore = new THREE.Color("#7a6e52");
  const height = (x: number, z: number) => {
    const ridge = 1 - Math.abs(fbm2(n, x * 0.0011, z * 0.0011, 5) * 2);
    let h = Math.pow(Math.max(0, ridge), 2.2) * 330 + fbm2(n2, x * 0.004, z * 0.004, 4) * 40;
    // valley carved along a meandering line -> lake
    const vx = x - Math.sin(z * 0.0021) * 260 - Math.sin(z * 0.0007) * 420;
    const valley = Math.exp(-(vx * vx) / (2 * 230 * 230));
    h = h * (1 - valley * 0.95) - valley * 40;
    return h + 18;
  };
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i);
    const y = height(x, z);
    pos.setY(i, y);
  }
  g.computeVertexNormals();
  const nrm = g.attributes.normal as THREE.BufferAttribute;
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i), slope = 1 - nrm.getY(i);
    c.copy(lush).lerp(olive, smooth(60, 180, y)).lerp(dry, smooth(170, 300, y) * 0.7).lerp(rock, smooth(0.25, 0.5, slope));
    if (y < 8) c.lerp(shore, smooth(8, 0, y));
    const v = 0.85 + n(pos.getX(i) * 0.02, pos.getZ(i) * 0.02) * 0.3;
    colors[i * 3] = c.r * v; colors[i * 3 + 1] = c.g * v; colors[i * 3 + 2] = c.b * v;
  }
  g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return { geo: g, height };
}

function forest(height: (x: number, z: number) => number, center: THREE.Vector3, radius: number, count: number, seed = 3) {
  const r = rng(seed);
  // broadleaf canopy: a lumpy squashed icosahedron
  const geo = new THREE.IcosahedronGeometry(1, 2);
  const gp = geo.attributes.position as THREE.BufferAttribute;
  const nz = makeNoise2D(seed + 1);
  for (let i = 0; i < gp.count; i++) {
    const v = new THREE.Vector3().fromBufferAttribute(gp, i);
    const k = 1 + nz(v.x * 2.1 + v.z, v.y * 2.3) * 0.35;
    gp.setXYZ(i, v.x * k, Math.max(-0.3, v.y) * k * 0.75 + 0.55, v.z * k);
  }
  geo.computeVertexNormals();
  const mat = new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 1 });
  const mesh = new THREE.InstancedMesh(geo, mat, count);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3();
  const col = new THREE.Color();
  let k = 0;
  for (let tries = 0; k < count && tries < count * 4; tries++) {
    const a = r() * Math.PI * 2, d = Math.sqrt(r()) * radius;
    const x = center.x + Math.cos(a) * d, z = center.z + Math.sin(a) * d;
    const y = height(x, z);
    if (y < 10 || y > 240) continue;
    const hgt = 3.5 + r() * 4.5;
    s.set(hgt * (0.8 + r() * 0.4), hgt, hgt * (0.8 + r() * 0.4));
    p.set(x, y - 1.5, z);
    q.setFromEuler(new THREE.Euler((r() - 0.5) * 0.12, r() * 6.28, (r() - 0.5) * 0.12));
    m.compose(p, q, s);
    mesh.setMatrixAt(k, m);
    mesh.setColorAt(k, col.setHSL(0.21 + r() * 0.09, 0.42, 0.06 + r() * 0.06));
    k++;
  }
  mesh.count = k;
  return mesh;
}

export function createScenicScene(ctx: SceneContext): SceneSetup {
  const preset: SkyPreset = { ...SKY.golden, sunDir: [0.62, 0.1, 0.78], cloudOpacity: 0.45 };
  const live = ctx.quality === "live";
  const scene = new THREE.Scene();
  const haze = new THREE.Color(preset.horizon).lerp(new THREE.Color(preset.mid), 0.62);
  scene.fog = new THREE.FogExp2(haze, 0.00042);
  const sky = createSky(preset);
  scene.add(sky);
  scene.environment = skyEnvironment(ctx.renderer, preset);

  const sunDir = new THREE.Vector3(...preset.sunDir).normalize();
  const sun = new THREE.DirectionalLight(new THREE.Color("#ffc285"), 3.6);
  sun.position.copy(sunDir).multiplyScalar(400);
  scene.add(sun);
  scene.add(new THREE.HemisphereLight(new THREE.Color("#9fb3d1"), new THREE.Color("#3a3324"), 0.8));

  const t = terrain(9000, live ? 260 : 700);
  const land = new THREE.Mesh(t.geo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, metalness: 0 }));
  scene.add(land);
  scene.add(forest(t.height, new THREE.Vector3(60, 0, -420), 1100, live ? 9000 : 140000));

  const water = new Reflector(new THREE.PlaneGeometry(9000, 9000), {
    textureWidth: live ? 512 : 1600, textureHeight: live ? 512 : 1000, clipBias: 0.003,
    shader: {
      uniforms: { color: { value: null }, tDiffuse: { value: null }, textureMatrix: { value: null }, time: { value: 0 }, fogColor: { value: haze } },
      vertexShader: `uniform mat4 textureMatrix; varying vec4 vUv; varying vec3 vW; void main(){ vUv = textureMatrix * vec4(position,1.0); vW = (modelMatrix*vec4(position,1.0)).xyz; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
      fragmentShader: /* glsl */ `uniform sampler2D tDiffuse; uniform float time; uniform vec3 fogColor; varying vec4 vUv; varying vec3 vW;
        void main(){ vec2 w = vec2(sin(vW.x*0.05 + time*0.6 + sin(vW.z*0.03)), cos(vW.z*0.07 + time*0.5)) * 0.004;
          vec3 r = texture2D(tDiffuse, vUv.xy/vUv.w + w).rgb;
          vec3 V = normalize(cameraPosition - vW); float fres = 0.08 + 0.92*pow(1.0 - clamp(V.y,0.0,1.0), 5.0);
          vec3 deep = vec3(0.015, 0.03, 0.035);
          vec3 col = mix(deep, r, fres);
          float d = length(vW - cameraPosition); col = mix(col, fogColor, 1.0 - exp(-pow(d*0.00032, 1.0)));
          gl_FragColor = vec4(col, 1.0); }`,
    },
  });
  water.rotation.x = -Math.PI / 2;
  water.position.y = 2;
  scene.add(water);

  const heli = createHelicopter({ livery: HELI_LIVERIES.ivory, rotorBlur: !live });
  heli.group.position.set(40, 165, -40);
  heli.group.rotation.set(0.04, 3.55, -0.1, "YXZ");
  scene.add(heli.group);

  const camera = new THREE.PerspectiveCamera(32, ctx.aspect, 1, 20000);
  const base = new THREE.Vector3(52, 172, -18);
  const target = new THREE.Vector3(34, 167.5, -44);
  camera.position.copy(base);
  camera.lookAt(target);

  return {
    scene, camera, exposure: 1.0, toneMapping: THREE.ACESFilmicToneMapping,
    post: { bloom: 0.35, bloomRadius: 0.6, threshold: 1.0, vignette: 0.3 },
    resize: (w, h) => {
      camera.aspect = w / h; camera.fov = w / h < 0.9 ? 50 : 32;
      camera.filmOffset = live && w / h > 1.15 ? -7 * Math.min(1, (w / h - 1.15) / 0.5) : 0;
      camera.updateProjectionMatrix();
    },
    update: (time, _dt, input) => {
      (sky.material as THREE.ShaderMaterial).uniforms.time.value = time;
      (water.material as THREE.ShaderMaterial).uniforms.time.value = time;
      heli.update(time, 0);
      if (live) {
        heli.group.position.y = 165 + Math.sin(time * 0.6) * 0.6;
        camera.position.copy(base).add(new THREE.Vector3(input.pointer.x * 3, input.pointer.y * 1.5 - input.scroll * 4, 0));
        camera.lookAt(target);
      }
    },
    dispose: () => heli.dispose(),
  };
}

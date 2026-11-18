import * as THREE from "three";
import type { SceneContext, SceneSetup } from "../core/stage";

/**
 * Photoreal Earth at night, centred on India: NASA "City Lights" for the glow and NASA "Blue Marble" for land and
 * ocean tone (both public domain), a blue atmosphere, and the sun glinting over the limb. Slow, gentle sway.
 */
const toVec = (lat: number, lon: number, r = 1) => {
  const phi = THREE.MathUtils.degToRad(90 - lat), th = THREE.MathUtils.degToRad(lon + 180);
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(th), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(th));
};

const load = (url: string, renderer: THREE.WebGLRenderer) =>
  new Promise<THREE.Texture>((resolve, reject) => {
    new THREE.TextureLoader().load(url, (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      resolve(t);
    }, undefined, reject);
  });

function flareTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;
  const rg = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  rg.addColorStop(0, "rgba(255,255,255,1)");
  rg.addColorStop(0.05, "rgba(255,252,240,0.95)");
  rg.addColorStop(0.16, "rgba(255,236,190,0.35)");
  rg.addColorStop(0.5, "rgba(255,214,150,0.06)");
  rg.addColorStop(1, "rgba(255,200,120,0)");
  g.fillStyle = rg; g.fillRect(0, 0, 256, 256);
  // thin horizontal streak
  const sg = g.createLinearGradient(0, 0, 256, 0);
  sg.addColorStop(0, "rgba(255,240,210,0)"); sg.addColorStop(0.5, "rgba(255,255,255,0.35)"); sg.addColorStop(1, "rgba(255,240,210,0)");
  g.fillStyle = sg; g.fillRect(0, 127, 256, 2);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export async function createGlobeScene(ctx: SceneContext): Promise<SceneSetup> {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(ctx.params?.bg ?? "#02040a");
  const [day, night] = await Promise.all([load("/images/earth/day.jpg", ctx.renderer), load("/images/earth/night.jpg", ctx.renderer)]);

  const sunDir = new THREE.Vector3(0.74, 0.5, -0.46).normalize();
  const globe = new THREE.Group();
  scene.add(globe);

  const earth = new THREE.Mesh(
    new THREE.SphereGeometry(1, 160, 110),
    new THREE.ShaderMaterial({
      uniforms: { dayMap: { value: day }, nightMap: { value: night }, sunDir: { value: sunDir } },
      vertexShader: /* glsl */ `
        varying vec2 vUv; varying vec3 vN; varying vec3 vW;
        void main(){ vUv = uv; vN = normalize(mat3(modelMatrix) * normal); vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
      fragmentShader: /* glsl */ `
        uniform sampler2D dayMap, nightMap; uniform vec3 sunDir; varying vec2 vUv; varying vec3 vN; varying vec3 vW;
        void main(){
          vec3 N = normalize(vN); vec3 V = normalize(cameraPosition - vW); vec3 S = normalize(sunDir);
          float ndl = dot(N, S);
          vec3 d = texture2D(dayMap, vUv).rgb;
          float L = smoothstep(0.035, 0.55, dot(texture2D(nightMap, vUv).rgb, vec3(0.3333)));
          float ocean = clamp((d.b - d.r * 1.25) * 2.4, 0.0, 1.0);
          float dayAmt = smoothstep(-0.08, 0.34, ndl);
          vec3 lit = d * (0.18 + 1.05 * max(ndl, 0.0));
          vec3 nightBase = mix(vec3(0.012, 0.017, 0.026), vec3(0.008, 0.034, 0.075), ocean) + d * 0.028;
          vec3 warm = mix(vec3(1.0, 0.55, 0.16), vec3(1.0, 0.88, 0.60), smoothstep(0.22, 0.85, L));
          vec3 city = warm * pow(L, 0.72) * 3.1;
          vec3 col = mix(nightBase + city, lit + city * 0.12, dayAmt);
          float fres = pow(1.0 - max(dot(N, V), 0.0), 3.0);
          float sunSide = smoothstep(-0.4, 0.55, ndl);
          col += mix(vec3(0.03, 0.08, 0.22), vec3(0.30, 0.58, 1.0), sunSide) * fres * 1.15;
          vec3 H = normalize(S + V);
          col += vec3(1.0, 0.94, 0.82) * pow(max(dot(N, H), 0.0), 70.0) * ocean * dayAmt * 0.9;
          gl_FragColor = vec4(col, 1.0);
        }`,
    }),
  );
  globe.add(earth);

  // Atmosphere glow: a camera-facing disc behind the planet, so it only shows outside the silhouette and fades smoothly
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 3.4), new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { sun: { value: new THREE.Vector2(sunDir.x, sunDir.y).normalize() } },
    vertexShader: `varying vec2 vP; void main(){ vP = (uv - 0.5) * 3.4; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `uniform vec2 sun; varying vec2 vP;
      void main(){ float r = length(vP); float a = pow(clamp((1.17 - r) / 0.17, 0.0, 1.0), 2.0) * step(0.985, r);
        float s = 0.3 + 0.7 * (dot(normalize(vP), sun) * 0.5 + 0.5);
        gl_FragColor = vec4(vec3(0.20, 0.46, 1.0) * a * s * 0.7, 1.0); }`,
  }));
  glow.renderOrder = 1;
  scene.add(glow);

  // The sun, just behind the limb
  const flare = new THREE.Sprite(new THREE.SpriteMaterial({ map: flareTexture(), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
  flare.position.set(sunDir.x, sunDir.y, 0).normalize().multiplyScalar(1.0);
  flare.scale.setScalar(0.7);
  scene.add(flare);

  // Stars
  const n = 1800, pos = new Float32Array(n * 3), col = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const v = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize().multiplyScalar(40);
    pos.set([v.x, v.y, v.z], i * 3);
    const b = 0.35 + Math.pow(Math.random(), 3) * 0.65;
    col.set([b, b * 0.96, b * (0.9 + Math.random() * 0.1)], i * 3);
  }
  const sg = new THREE.BufferGeometry();
  sg.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  sg.setAttribute("color", new THREE.BufferAttribute(col, 3));
  scene.add(new THREE.Points(sg, new THREE.PointsMaterial({ size: 0.11, vertexColors: true, sizeAttenuation: true, transparent: true, depthWrite: false })));

  // Orient the Middle East and India toward the camera, tilted a little
  const facing = toVec(24, 62, 1);
  const baseQ = new THREE.Quaternion().setFromUnitVectors(facing, new THREE.Vector3(0, 0, 1));
  globe.quaternion.copy(baseQ);

  const camera = new THREE.PerspectiveCamera(30, ctx.aspect, 0.1, 200);
  camera.position.set(0, 0.2, 5.1);
  camera.lookAt(0, 0.05, 0);
  const live = ctx.quality === "live";
  const yAxis = new THREE.Vector3(0, 1, 0);

  return {
    scene, camera, toneMapping: THREE.NoToneMapping, exposure: 1,
    post: { bloom: 0.5, bloomRadius: 0.45, threshold: 0.7, vignette: 0.1, grain: 0 },
    resize: (w, h) => { camera.aspect = w / h; camera.position.z = w / h < 1 ? 6.2 : 5.1; camera.updateProjectionMatrix(); },
    update: (t, _dt, input) => {
      const sway = live ? Math.sin(t * 0.1) * 0.3 + input.pointer.x * 0.12 : 0;
      globe.quaternion.copy(baseQ).premultiply(new THREE.Quaternion().setFromAxisAngle(yAxis, sway));
    },
    dispose: () => { day.dispose(); night.dispose(); },
  };
}

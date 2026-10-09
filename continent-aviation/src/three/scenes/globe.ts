import * as THREE from "three";
import dots from "../data/land-dots.json";
import type { SceneContext, SceneSetup } from "../core/stage";

/** Dot-matrix globe centred on India with slow, illustrative gold arcs between Indian cities. */
const CITIES: Record<string, [number, number]> = {
  delhi: [28.6, 77.2], mumbai: [19.1, 72.9], bengaluru: [12.97, 77.6], hyderabad: [17.4, 78.5], kolkata: [22.6, 88.4],
  goa: [15.5, 73.8], udaipur: [24.6, 73.7], jaipur: [26.9, 75.8], chennai: [13.1, 80.3], kochi: [9.9, 76.3],
};
const ROUTES: [string, string][] = [["delhi", "mumbai"], ["mumbai", "goa"], ["delhi", "udaipur"], ["bengaluru", "hyderabad"], ["delhi", "kolkata"], ["mumbai", "bengaluru"], ["jaipur", "kolkata"], ["chennai", "delhi"], ["kochi", "mumbai"]];

const toVec = (lat: number, lon: number, r = 1) => {
  const phi = THREE.MathUtils.degToRad(90 - lat), th = THREE.MathUtils.degToRad(lon + 180);
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(th), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(th));
};

export function createGlobeScene(ctx: SceneContext): SceneSetup {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(ctx.params?.bg ?? "#101a2a");
  const globe = new THREE.Group();
  scene.add(globe);

  // Ocean sphere (subtle) + atmosphere rim
  globe.add(new THREE.Mesh(new THREE.SphereGeometry(0.995, 64, 48), new THREE.MeshBasicMaterial({ color: "#0b1322" })));
  const rim = new THREE.Mesh(new THREE.SphereGeometry(1.045, 64, 48), new THREE.ShaderMaterial({
    transparent: true, side: THREE.BackSide, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `varying vec3 vN; varying vec3 vV; void main(){ vN = normalize(normalMatrix*normal); vec4 mv = modelViewMatrix*vec4(position,1.0); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }`,
    fragmentShader: `varying vec3 vN; varying vec3 vV; void main(){ float f = pow(1.0 - abs(dot(vN, vV)), 5.0); gl_FragColor = vec4(vec3(0.78, 0.66, 0.42) * f * 0.22, 1.0); }`,
  }));
  scene.add(rim);

  // Land dots
  const arr = dots as number[];
  const pos = new Float32Array((arr.length / 2) * 3);
  const india = new Float32Array(arr.length / 2);
  for (let i = 0; i < arr.length; i += 2) {
    const lat = arr[i] / 10, lon = arr[i + 1] / 10;
    const v = toVec(lat, lon, 1.0);
    pos.set([v.x, v.y, v.z], (i / 2) * 3);
    india[i / 2] = lat > 6 && lat < 36 && lon > 68 && lon < 97.5 ? 1 : 0;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setAttribute("india", new THREE.BufferAttribute(india, 1));
  const pr = Math.min(window.devicePixelRatio || 1, 2);
  const dotMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: { size: { value: 2.6 * pr }, cIn: { value: new THREE.Color("#c8a96b") }, cOut: { value: new THREE.Color("#5f6b80") } },
    vertexShader: `attribute float india; uniform float size; varying float vI; varying float vFace;
      void main(){ vI = india; vec4 mv = modelViewMatrix*vec4(position,1.0); vec3 n = normalize(normalMatrix*position); vFace = dot(n, normalize(-mv.xyz));
        gl_PointSize = size * (india > 0.5 ? 1.15 : 1.0); gl_Position = projectionMatrix*mv; }`,
    fragmentShader: `uniform vec3 cIn, cOut; varying float vI; varying float vFace;
      void main(){ vec2 c = gl_PointCoord - 0.5; float d = length(c); if (d > 0.5 || vFace < 0.0) discard;
        float a = smoothstep(0.5, 0.3, d) * smoothstep(0.0, 0.35, vFace);
        gl_FragColor = vec4(mix(cOut, cIn, vI), a * mix(0.55, 1.0, vI)); }`,
  });
  globe.add(new THREE.Points(g, dotMat));

  // Arcs with travelling light
  const arcs: { mat: THREE.ShaderMaterial; offset: number }[] = [];
  ROUTES.forEach(([a, b], i) => {
    const A = toVec(...CITIES[a], 1.0), B = toVec(...CITIES[b], 1.0);
    const mid = A.clone().add(B).multiplyScalar(0.5);
    const lift = 1 + A.distanceTo(B) * 0.55;
    mid.normalize().multiplyScalar(lift);
    const curve = new THREE.QuadraticBezierCurve3(A, mid, B);
    const geo = new THREE.TubeGeometry(curve, 64, 0.0035, 6, false);
    const mat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { t: { value: 0 }, col: { value: new THREE.Color("#e2c48a") } },
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
      fragmentShader: `uniform float t; uniform vec3 col; varying vec2 vUv;
        void main(){ float head = fract(t); float d = vUv.x - head; float trail = d < 0.0 && d > -0.35 ? pow(1.0 + d / 0.35, 3.0) : 0.0;
          float base = 0.18; gl_FragColor = vec4(col * (base + trail * 2.2), 1.0); }`,
    });
    globe.add(new THREE.Mesh(geo, mat));
    arcs.push({ mat, offset: i * 0.37 });
  });
  // City markers
  const cityPts = Object.values(CITIES).map(([la, lo]) => toVec(la, lo, 1.003));
  const cg = new THREE.BufferGeometry().setFromPoints(cityPts);
  globe.add(new THREE.Points(cg, new THREE.PointsMaterial({ color: new THREE.Color("#f3dfb0").multiplyScalar(1.6), size: 0.022, transparent: true, depthWrite: false })));

  // Orient India towards the camera, tilted slightly
  const facing = toVec(21, 79, 1);
  const q = new THREE.Quaternion().setFromUnitVectors(facing, new THREE.Vector3(0, 0, 1));
  globe.quaternion.copy(q);
  const baseQ = q.clone();

  const camera = new THREE.PerspectiveCamera(30, ctx.aspect, 0.1, 100);
  camera.position.set(0, 0.3, 5.3);
  camera.lookAt(0, 0.08, 0);
  const live = ctx.quality === "live";
  const yAxis = new THREE.Vector3(0, 1, 0);

  return {
    scene, camera, toneMapping: THREE.NoToneMapping, exposure: 1,
    post: { bloom: 0.45, bloomRadius: 0.4, threshold: 0.6, vignette: 0, grain: 0 },
    resize: (w, h) => { camera.aspect = w / h; camera.position.z = w / h < 1 ? 6.4 : 5.3; camera.updateProjectionMatrix(); },
    update: (t, _dt, input) => {
      const sway = live ? Math.sin(t * 0.12) * 0.35 + input.pointer.x * 0.15 : 0;
      globe.quaternion.copy(baseQ).premultiply(new THREE.Quaternion().setFromAxisAngle(yAxis, sway));
      arcs.forEach((a) => (a.mat.uniforms.t.value = t * 0.22 + a.offset));
    },
  };
}

import * as THREE from "three";
import { createSky, skyEnvironment, SKY, type SkyPreset } from "../core/sky";
import { canvas, canvasTexture } from "../core/util";
import { animateJetLights, createJet, JET_CATEGORIES, LIVERIES } from "../models/jet";
import type { SceneContext, SceneSetup } from "../core/stage";

/** A sea of cloud tops lit by a low sun; a single shader plane with domain-warped fbm. */
function cloudSea(preset: SkyPreset, y: number) {
  const mat = new THREE.ShaderMaterial({
    fog: false,
    uniforms: {
      sunDir: { value: new THREE.Vector3(...preset.sunDir).normalize() },
      lit: { value: new THREE.Color(preset.cloudLit) }, shade: { value: new THREE.Color(preset.cloudShade) },
      horizon: { value: new THREE.Color(preset.horizon) }, glow: { value: new THREE.Color(preset.glow) },
      time: { value: 0 },
    },
    vertexShader: `varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
    fragmentShader: /* glsl */ `
      uniform vec3 sunDir, lit, shade, horizon, glow; uniform float time; varying vec3 vW;
      float hash(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }
      float noise(vec2 p){ vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.0-2.0*f);
        return mix(mix(hash(i),hash(i+vec2(1,0)),u.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x), u.y); }
      float fbm(vec2 p){ float s=0.0, a=0.5; for(int i=0;i<7;i++){ s+=a*noise(p); p=p*2.02+vec2(3.1,1.7); a*=0.5; } return s; }
      float h(vec2 p){ vec2 q = vec2(fbm(p*0.5), fbm(p*0.5+5.2)); return fbm(p*0.8 + q*2.2 + vec2(time*0.004, 0.0)); }
      void main(){
        vec2 p = vW.xz * 0.0016;
        float e = 0.012;
        float c = h(p), cx = h(p + vec2(e,0.0)), cz = h(p + vec2(0.0,e));
        vec3 n = normalize(vec3((c - cx) * 9.0, 1.0, (c - cz) * 9.0));
        vec3 s = normalize(sunDir);
        vec3 L = normalize(vec3(s.x, 0.35, s.z));
        float dif = clamp(dot(n, L), 0.0, 1.0);
        float puff = smoothstep(0.38, 0.72, c);
        vec3 deep = vec3(0.16, 0.18, 0.3), mids = vec3(0.42, 0.42, 0.58), lit2 = lit * 1.15;
        vec3 col = mix(deep, mids, puff);
        col = mix(col, lit2, pow(dif, 1.6) * (0.25 + 0.75 * puff));
        vec3 V = normalize(vW - cameraPosition);
        float az = max(dot(normalize(V.xz), normalize(s.xz)), 0.0);
        col += glow * pow(az, 6.0) * 0.45 * puff * dif;
        float d = length(vW.xz - cameraPosition.xz);
        float f = 1.0 - exp(-pow(d * 0.00012, 1.25));
        vec3 hz = mix(mix(horizon, mids * 1.1, 0.5), glow, pow(az, 3.0) * 0.7);
        col = mix(col, hz, clamp(f, 0.0, 1.0));
        gl_FragColor = vec4(col, 1.0);
      }`,
  });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(40000, 40000, 1, 1), mat);
  m.rotation.x = -Math.PI / 2;
  m.position.y = y;
  return m;
}

/** Dark cabin-window surround that fills the view, with a rounded opening of fixed proportions. */
function windowFrame(aspect: number) {
  const H = 1024, W = Math.round(1024 * aspect);
  const { c, ctx } = canvas(W, H);
  const g = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, W * 0.6);
  g.addColorStop(0, "rgb(96,80,66)"); g.addColorStop(1, "rgb(22,18,16)");
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const hh = H * 0.9, hw = hh * 0.74, x0 = (W - hw) / 2, y0 = (H - hh) / 2, rad = hw * 0.42;
  // cut the opening, then a partly lowered shade inside it
  ctx.save(); ctx.beginPath(); ctx.roundRect(x0, y0, hw, hh, rad); ctx.clip();
  ctx.globalCompositeOperation = "destination-out";
  ctx.fillRect(x0, y0, hw, hh);
  ctx.globalCompositeOperation = "source-over";
  const sg = ctx.createLinearGradient(0, y0, 0, y0 + hh * 0.12);
  sg.addColorStop(0, "rgba(214,202,184,1)"); sg.addColorStop(1, "rgba(236,226,210,1)");
  ctx.fillStyle = sg; ctx.fillRect(x0, y0, hw, hh * 0.12);
  ctx.fillStyle = "rgba(120,104,88,1)"; ctx.fillRect(x0, y0 + hh * 0.12 - 4, hw, 4);
  ctx.restore();
  ctx.strokeStyle = "rgba(210,190,160,0.35)"; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.roundRect(x0 - 3, y0 - 3, hw + 6, hh + 6, rad + 3); ctx.stroke();
  const tex = canvasTexture(c);
  return new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthTest: false, depthWrite: false, color: new THREE.Color(0.55, 0.5, 0.46) }));
}

export function createAloftScene(ctx: SceneContext, shot: "about" | "cta"): SceneSetup {
  const preset: SkyPreset = { ...SKY.aloft, ...(shot === "cta" ? { sunDir: [-0.78, 0.03, 0.62] as [number, number, number], sunSize: 0.0012, glowStrength: 0.8 } : {}) };
  const scene = new THREE.Scene();
  const sky = createSky(preset);
  scene.add(sky);
  const sea = cloudSea(preset, -380);
  scene.add(sea);
  scene.environment = skyEnvironment(ctx.renderer, preset, (s) => s.add(cloudSea(preset, -380)));

  const sun = new THREE.DirectionalLight(new THREE.Color(preset.glow).lerp(new THREE.Color("#fff"), 0.4), 2.2);
  sun.position.copy(new THREE.Vector3(...preset.sunDir).normalize().multiplyScalar(100)).setY(14);
  scene.add(sun);
  scene.add(new THREE.HemisphereLight(new THREE.Color(preset.mid), new THREE.Color(preset.cloudShade), 0.7));

  const jet = createJet({ ...JET_CATEGORIES.supermid, livery: LIVERIES.pearl, gearDown: false, cabinGlow: 0.55 });
  jet.group.position.set(0, 0, 0);
  scene.add(jet.group);

  const camera = new THREE.PerspectiveCamera(30, ctx.aspect, 0.05, 50000);
  let fitFrame = () => {};
  scene.add(camera);
  if (shot === "about") {
    // air-to-air: jet heading left, gentle bank, seen from slightly above and behind on its right
    jet.group.rotation.set(0.05, Math.PI - 0.38, -0.06, "YXZ");
    camera.position.set(-20, 3.2, 31);
    camera.lookAt(-6.5, 0.4, 0);
    camera.fov = 30;
  } else {
    // through a right-side cabin window, looking out along the wing towards the low sun
    jet.group.rotation.set(0, 0, 0);
    const R = JET_CATEGORIES.supermid.radius;
    camera.position.set(0.6, R * 0.3, R * 1.02);
    camera.lookAt(new THREE.Vector3(-3.5, -1.4, 10));
    camera.fov = 52;
    const frame = windowFrame(ctx.aspect);
    frame.position.set(0, 0, -0.35);
    frame.renderOrder = 10;
    camera.add(frame);
    fitFrame = () => {
      const vh = 2 * 0.35 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      frame.scale.set(vh * camera.aspect * 1.02, vh * 1.02, 1);
    };
  }
  camera.updateProjectionMatrix();
  fitFrame();

  return {
    scene, camera, exposure: shot === "cta" ? 0.8 : 0.95, toneMapping: THREE.ACESFilmicToneMapping,
    post: { bloom: 0.4, bloomRadius: 0.7, threshold: 0.9, vignette: 0.3 },
    resize: (w, h) => { camera.aspect = w / h; camera.updateProjectionMatrix(); fitFrame(); },
    update: (t) => {
      (sky.material as THREE.ShaderMaterial).uniforms.time.value = t;
      (sea.material as THREE.ShaderMaterial).uniforms.time.value = t;
      animateJetLights(jet, t);
    },
    dispose: () => jet.dispose(),
  };
}

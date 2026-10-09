import * as THREE from "three";

export type SkyPreset = {
  zenith: string; mid: string; horizon: string; below: string;
  glow: string; sun: string; sunDir: [number, number, number]; sunSize: number; glowStrength: number;
  cloudLit: string; cloudShade: string; cloudCover: number; cloudOpacity: number; stars: number;
  exposure: number;
  /** Height of the horizon-to-mid transition (default 0.11). */
  band?: number;
};

export const SKY: Record<string, SkyPreset> = {
  dusk: {
    zenith: "#050b18", mid: "#121d35", horizon: "#b8683e", below: "#1d1a1d",
    glow: "#ff8a45", sun: "#ffd2a0", sunDir: [-0.82, 0.02, -0.57], sunSize: 0.0012, glowStrength: 0.7,
    cloudLit: "#e08b55", cloudShade: "#1b2034", cloudCover: 0.5, cloudOpacity: 0.8, stars: 0.0, exposure: 1.0,
  },
  blue: {
    zenith: "#071022", mid: "#14223f", horizon: "#5d6a8c", below: "#1d2234",
    glow: "#e3875a", sun: "#ffb47a", sunDir: [-0.9, -0.02, -0.42], sunSize: 0.0, glowStrength: 0.5,
    cloudLit: "#9c7a83", cloudShade: "#1b2238", cloudCover: 0.56, cloudOpacity: 0.6, stars: 0.6, exposure: 1.0,
  },
  night: {
    zenith: "#03060d", mid: "#08101e", horizon: "#1d2536", below: "#0b0e15",
    glow: "#6c5b5a", sun: "#000000", sunDir: [-0.8, -0.2, -0.5], sunSize: 0.0, glowStrength: 0.15,
    cloudLit: "#2a2f40", cloudShade: "#0a0e18", cloudCover: 0.6, cloudOpacity: 0.5, stars: 1.0, exposure: 1.0,
  },
  golden: {
    zenith: "#2c4772", mid: "#6f86a6", horizon: "#f2b77a", below: "#7a6150",
    glow: "#ffb066", sun: "#fff0d4", sunDir: [-0.75, 0.09, -0.65], sunSize: 0.0018, glowStrength: 1.1,
    cloudLit: "#ffd2a0", cloudShade: "#6a6e86", cloudCover: 0.55, cloudOpacity: 0.7, stars: 0.0, exposure: 1.0,
  },
  aloft: {
    zenith: "#08122a", mid: "#1f3560", horizon: "#e2946a", below: "#2a2f45",
    glow: "#ff9550", sun: "#ffe2b8", sunDir: [-0.86, 0.02, -0.5], sunSize: 0.0015, glowStrength: 0.9,
    cloudLit: "#ffc89a", cloudShade: "#4a5278", cloudCover: 0.7, cloudOpacity: 0.0, stars: 0.0, exposure: 1.0, band: 0.19,
  },
};

const vert = /* glsl */ `
varying vec3 vDir;
void main() {
  vDir = normalize(position);
  vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  gl_Position = p.xyww;
}`;

const frag = /* glsl */ `
uniform vec3 zenith, mid, horizon, below, glow, sunCol, cloudLit, cloudShade;
uniform vec3 sunDir;
uniform float sunSize, glowStrength, cloudCover, cloudOpacity, stars, time, band;
varying vec3 vDir;
float hash(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }
float noise(vec2 p){ vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),u.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x), u.y); }
float fbm(vec2 p){ float s=0.0, a=0.5; for(int i=0;i<6;i++){ s+=a*noise(p); p=p*2.03+vec2(1.7,9.2); a*=0.5; } return s; }
void main() {
  vec3 d = normalize(vDir);
  float h = d.y;
  vec3 col = mix(horizon, mid, smoothstep(0.0, band, h));
  col = mix(col, zenith, smoothstep(0.08, 0.6, h));
  col = mix(col, below, smoothstep(0.0, -0.06, h));
  vec3 s = normalize(sunDir);
  float sd = max(dot(d, s), 0.0);
  float az = max(dot(normalize(d.xz + 1e-5), normalize(s.xz + 1e-5)), 0.0);
  // warm band hugging the horizon towards the sun
  col += glow * glowStrength * pow(az, 5.0) * exp(-abs(h) * 16.0) * 0.9;
  col += glow * glowStrength * pow(sd, 24.0) * 0.6;
  col += glow * glowStrength * pow(sd, 120.0) * 2.0;
  if (sunSize > 0.0) col += sunCol * 6.0 * smoothstep(1.0 - sunSize, 1.0 - sunSize * 0.55, sd);
  // stretched stratus clouds
  if (h > 0.0 && cloudOpacity > 0.0) {
    vec2 uv = d.xz / (h + 0.09);
    uv = vec2(uv.x * 0.55, uv.y * 1.6) * 1.3 + vec2(time * 0.004, 0.0);
    float n = fbm(uv);
    float c = smoothstep(cloudCover, cloudCover + 0.32, n);
    c *= smoothstep(0.0, 0.06, h) * (1.0 - smoothstep(0.35, 0.8, h));
    float lit = pow(az, 2.0) * exp(-h * 3.5);
    vec3 cc = mix(cloudShade, cloudLit, clamp(lit * 1.2 + (n - cloudCover) * 0.6, 0.0, 1.0));
    col = mix(col, cc, c * cloudOpacity);
  }
  if (stars > 0.0 && h > 0.05) {
    vec2 g = d.xz / (h + 0.5) * 220.0;
    float st = step(0.9965, hash(floor(g))) * smoothstep(0.08, 0.5, h);
    col += vec3(0.8, 0.85, 1.0) * st * stars * 0.6;
  }
  gl_FragColor = vec4(col, 1.0);
}`;

export function createSky(preset: SkyPreset) {
  const c = (h: string) => new THREE.Color(h);
  const mat = new THREE.ShaderMaterial({
    vertexShader: vert,
    fragmentShader: frag,
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: {
      zenith: { value: c(preset.zenith) }, mid: { value: c(preset.mid) }, horizon: { value: c(preset.horizon) }, below: { value: c(preset.below) },
      glow: { value: c(preset.glow) }, sunCol: { value: c(preset.sun) }, cloudLit: { value: c(preset.cloudLit) }, cloudShade: { value: c(preset.cloudShade) },
      sunDir: { value: new THREE.Vector3(...preset.sunDir).normalize() }, sunSize: { value: preset.sunSize }, glowStrength: { value: preset.glowStrength },
      cloudCover: { value: preset.cloudCover }, band: { value: preset.band ?? 0.11 }, cloudOpacity: { value: preset.cloudOpacity }, stars: { value: preset.stars }, time: { value: 0 },
    },
  });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(5000, 64, 32), mat);
  mesh.renderOrder = -10;
  mesh.frustumCulled = false;
  mesh.onBeforeRender = (_r, _s, cam) => mesh.position.copy(cam.position);
  return mesh;
}

/** Environment map that matches the sky, for reflections on paint and glass. */
export function skyEnvironment(renderer: THREE.WebGLRenderer, preset: SkyPreset, extra?: (s: THREE.Scene) => void) {
  const scene = new THREE.Scene();
  const sky = createSky({ ...preset, sunSize: preset.sunSize * 3 });
  sky.onBeforeRender = () => {};
  scene.add(sky);
  extra?.(scene);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const rt = pmrem.fromScene(scene, 0, 0.1, 6000);
  pmrem.dispose();
  return rt.texture;
}

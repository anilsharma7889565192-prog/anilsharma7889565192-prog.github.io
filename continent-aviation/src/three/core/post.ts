import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";

/** Display-space finish: vignette, film grain, gentle filmic grade. */
const FinishShader = {
  uniforms: { tDiffuse: { value: null }, time: { value: 0 }, vignette: { value: 0.32 }, grain: { value: 0.035 }, lift: { value: new THREE.Vector3(0.008, 0.01, 0.018) } },
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse; uniform float time, vignette, grain; uniform vec3 lift; varying vec2 vUv;
    float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
    void main(){
      vec3 c = texture2D(tDiffuse, vUv).rgb;
      vec2 q = vUv - 0.5;
      float v = 1.0 - dot(q * vec2(1.1, 1.35), q * vec2(1.1, 1.35)) * vignette * 2.2;
      c *= clamp(v, 0.0, 1.0);
      c = c + lift * (1.0 - c);
      float g = h(vUv * 1000.0 + fract(time)) - 0.5;
      c += g * grain * (0.35 + 0.65 * (1.0 - dot(c, vec3(0.333))));
      gl_FragColor = vec4(c, 1.0);
    }`,
};

export type PostOptions = { bloom?: number; bloomRadius?: number; threshold?: number; samples?: number; vignette?: number; grain?: number };

export function createComposer(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera, w: number, h: number, o: PostOptions = {}) {
  const rt = new THREE.WebGLRenderTarget(w, h, { type: THREE.HalfFloatType, samples: o.samples ?? 4 });
  const composer = new EffectComposer(renderer, rt);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(w, h), o.bloom ?? 0.55, o.bloomRadius ?? 0.55, o.threshold ?? 1.0);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());
  const finish = new ShaderPass(FinishShader);
  finish.uniforms.vignette.value = o.vignette ?? 0.32;
  finish.uniforms.grain.value = o.grain ?? 0.035;
  composer.addPass(finish);
  return { composer, bloom, finish };
}

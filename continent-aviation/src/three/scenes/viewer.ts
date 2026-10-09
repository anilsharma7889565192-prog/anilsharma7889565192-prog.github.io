import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { createApron, contactShadow } from "../core/ground";
import { createJet, JET_CATEGORIES, LIVERIES, type Jet } from "../models/jet";
import type { SceneContext, SceneSetup } from "../core/stage";

export type Category = keyof typeof JET_CATEGORIES;

/** Studio turntable for comparing generic aircraft categories. Drag rotates; idle auto-rotates. */
export function createViewerScene(ctx: SceneContext): SceneSetup {
  const scene = new THREE.Scene();
  const bg = new THREE.Color(ctx.params?.bg ?? "#0c1320");
  scene.background = bg;
  const pmrem = new THREE.PMREMGenerator(ctx.renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.32;
  pmrem.dispose();

  const key = new THREE.DirectionalLight("#fff4e4", 0.9);
  key.position.set(18, 26, 14);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  Object.assign(key.shadow.camera, { left: -22, right: 22, top: 22, bottom: -22, near: 1, far: 90 });
  scene.add(key);
  const rim = new THREE.DirectionalLight("#c8a96b", 1.6);
  rim.position.set(-20, 8, -18);
  scene.add(rim);
  scene.add(new THREE.HemisphereLight("#6c7fa3", "#0b0f18", 0.6));

  const floor = createApron({ size: 400, resolution: ctx.quality === "live" ? 640 : 1400, base: "#0d121c", reflectivity: 0.55, fogColor: new THREE.Color("#1c2940"), fogDensity: 0.016, blur: 0.004 });
  scene.add(floor);

  // soft studio backdrop
  const dome = new THREE.Mesh(new THREE.SphereGeometry(600, 32, 16), new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { top: { value: new THREE.Color("#070b13") }, hor: { value: new THREE.Color("#1c2940") } },
    vertexShader: `varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
    fragmentShader: `uniform vec3 top, hor; varying vec3 vP; void main(){ gl_FragColor = vec4(mix(hor, top, smoothstep(-0.02, 0.45, vP.y)), 1.0); }`,
  }));
  scene.add(dome);
  const turntable = new THREE.Group();
  scene.add(turntable);
  let jet: Jet | null = null;
  let shadow: THREE.Mesh | null = null;
  let current: Category = (ctx.params?.category as Category) ?? "supermid";
  let pop = 1;
  const build = (c: Category) => {
    if (jet) { turntable.remove(jet.group); jet.dispose(); }
    if (shadow) turntable.remove(shadow);
    jet = createJet({ ...JET_CATEGORIES[c], livery: LIVERIES.pearl, cabinGlow: 0.12, navLights: true });
    jet.group.position.x = -JET_CATEGORIES[c].length * 0.02;
    turntable.add(jet.group);
    shadow = contactShadow(JET_CATEGORIES[c].length * 1.1, JET_CATEGORIES[c].span * 0.7, 0.8);
    turntable.add(shadow);
    current = c;
    pop = 0;
  };
  build(current);

  const camera = new THREE.PerspectiveCamera(30, ctx.aspect, 0.5, 2000);
  const live = ctx.quality === "live";
  let yaw = -0.7, vel = 0, lastDrag = 0, idle = 0;
  const frame = () => {
    const L = JET_CATEGORIES[current].length;
    const dist = (L * 1.22 + 6) * (camera.aspect < 1 ? 1.75 : 1);
    camera.position.set(0, 3 + L * 0.1, dist);
    camera.lookAt(0, 1.4 + L * 0.03, 0);
  };
  frame();

  return {
    scene, camera, exposure: 1.0, toneMapping: THREE.ACESFilmicToneMapping,
    post: { bloom: 0.25, bloomRadius: 0.5, threshold: 1.6, vignette: 0.25, grain: 0.02 },
    resize: (w, h) => { camera.aspect = w / h; camera.updateProjectionMatrix(); frame(); },
    api: {
      setCategory: (c: string) => { if (c in JET_CATEGORIES && c !== current) { build(c as Category); frame(); } },
    },
    update: (t, dt, input) => {
      if (input.drag.active) {
        const d = input.drag.dx - lastDrag;
        vel = d * 0.006;
        yaw += vel;
        idle = 0;
      } else {
        vel *= Math.pow(0.04, dt);
        yaw += vel;
        idle += dt;
        if (live && idle > 1.5) yaw += dt * 0.18;
      }
      lastDrag = input.drag.dx;
      turntable.rotation.y = yaw;
      pop = Math.min(1, pop + dt * 2.2);
      const e = 1 - Math.pow(1 - pop, 3);
      turntable.scale.setScalar(0.94 + 0.06 * e);
      if (!live) turntable.rotation.y = -0.7;
      void t;
    },
  };
}

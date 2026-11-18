import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { animateJetLights, createJet, JET_CATEGORIES } from "../models/jet";
import type { SceneContext, SceneSetup } from "../core/stage";

/**
 * Bright daylight jet for compositing (the home-page fly-by). No ground, no sky: the background is a
 * flat colour passed as ?bg=, so the same frame can be rendered on black and white and matted to alpha.
 * Params: bg (hex), yaw (deg off head-on), pitch (deg, camera below the jet), dist (m), cat.
 */
export function createFlyerScene(ctx: SceneContext): SceneSetup {
  const q = ctx.params ?? {};
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(q.bg ?? "#ffffff");
  const pmrem = new THREE.PMREMGenerator(ctx.renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.03).texture;
  scene.environmentIntensity = 0.75;
  pmrem.dispose();

  const sun = new THREE.DirectionalLight("#fff3e0", 4.4);
  sun.position.set(22, 34, 10);
  scene.add(sun);
  scene.add(new THREE.HemisphereLight("#bfe3ff", "#5b86a8", 0.7));
  const fill = new THREE.DirectionalLight("#9fd2ff", 0.8);
  fill.position.set(-16, 4, 22);
  scene.add(fill);

  const cat = (q.cat as keyof typeof JET_CATEGORIES) ?? "supermid";
  const jet = createJet({
    ...JET_CATEGORIES[cat],
    livery: { base: "#ffffff", belly: "#79b8e6", stripe: "#0B6FB3" },
    cabinGlow: 0, navLights: true, gearDown: false,
  });
  scene.add(jet.group);

  const L = JET_CATEGORIES[cat].length;
  const yaw = THREE.MathUtils.degToRad(Number(q.yaw ?? 10));
  const pitch = THREE.MathUtils.degToRad(Number(q.pitch ?? 5));
  const dist = Number(q.dist ?? L * 0.92);
  const camera = new THREE.PerspectiveCamera(30, ctx.aspect, 0.5, 400);
  // The nose points along +x; sit in front of it, slightly off-axis and below, so it flies at the viewer.
  const target = new THREE.Vector3(L * 0.1, 1.0, 0);
  camera.position.set(
    target.x + Math.cos(yaw) * Math.cos(pitch) * dist,
    target.y - Math.sin(pitch) * dist,
    Math.sin(yaw) * Math.cos(pitch) * dist,
  );
  camera.lookAt(target);

  return {
    scene, camera, exposure: Number(q.exposure ?? 1.15), toneMapping: THREE.ACESFilmicToneMapping,
    post: { bloom: 0, vignette: 0, grain: 0 },
    resize: (w, h) => { camera.aspect = w / h; camera.updateProjectionMatrix(); },
    update: (t) => animateJetLights(jet, t),
    dispose: () => jet.dispose(),
  };
}

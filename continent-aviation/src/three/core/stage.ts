import * as THREE from "three";
import { createComposer, type PostOptions } from "./post";

export type Input = { pointer: { x: number; y: number }; scroll: number; drag: { dx: number; dy: number; active: boolean } };
export type SceneContext = { renderer: THREE.WebGLRenderer; quality: "live" | "still"; aspect: number; params?: Record<string, string> };
export type SceneSetup = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  exposure?: number;
  toneMapping?: THREE.ToneMapping;
  post?: PostOptions;
  update?: (t: number, dt: number, input: Input) => void;
  resize?: (w: number, h: number) => void;
  dispose?: () => void;
  /** Number of warm-up frames before a still is captured (temporal effects settle). */
  warmup?: number;
  /** Optional scene-specific commands callable from the UI. */
  api?: Record<string, (arg: string) => void>;
};
export type SceneFactory = (ctx: SceneContext) => SceneSetup | Promise<SceneSetup>;

export type StageOptions = { quality: "live" | "still"; pixelRatio?: number; samples?: number; onFirstFrame?: () => void; fixedTime?: number };

/** Owns a renderer + composer for one canvas; runs a render loop only while visible. */
export class Stage {
  renderer: THREE.WebGLRenderer;
  setup!: SceneSetup;
  input: Input = { pointer: { x: 0, y: 0 }, scroll: 0, drag: { dx: 0, dy: 0, active: false } };
  private smoothInput: Input = { pointer: { x: 0, y: 0 }, scroll: 0, drag: { dx: 0, dy: 0, active: false } };
  private composer!: ReturnType<typeof createComposer>;
  private raf = 0;
  private running = false;
  private timer = new THREE.Timer();
  private elapsed = 0;
  private firstFrame = false;
  private frameTimes: number[] = [];
  onSlow?: () => void;

  constructor(public canvas: HTMLCanvasElement, private opts: StageOptions) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: "high-performance", preserveDrawingBuffer: opts.quality === "still" });
    this.renderer.setPixelRatio(opts.pixelRatio ?? 1);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.AgXToneMapping;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
  }

  async load(factory: SceneFactory, params?: Record<string, string>) {
    const { width, height } = this.size();
    this.setup = await factory({ renderer: this.renderer, quality: this.opts.quality, aspect: width / height, params });
    if (this.setup.toneMapping !== undefined) this.renderer.toneMapping = this.setup.toneMapping;
    this.renderer.toneMappingExposure = this.setup.exposure ?? 1;
    this.renderer.setSize(width, height, false);
    const pr = this.renderer.getPixelRatio();
    this.composer = createComposer(this.renderer, this.setup.scene, this.setup.camera, width * pr, height * pr, { samples: this.opts.samples ?? 4, ...this.setup.post });
    this.composer.composer.setPixelRatio(pr);
    this.composer.composer.setSize(width, height);
    this.setup.resize?.(width, height);
    this.renderer.compile(this.setup.scene, this.setup.camera);
  }

  size() {
    const r = this.canvas.getBoundingClientRect();
    return { width: Math.max(1, Math.round(r.width || this.canvas.width)), height: Math.max(1, Math.round(r.height || this.canvas.height)) };
  }

  resize() {
    if (!this.setup) return;
    const { width, height } = this.size();
    this.renderer.setSize(width, height, false);
    this.composer.composer.setSize(width, height);
    this.composer.bloom.resolution.set(width, height);
    this.setup.resize?.(width, height);
    if (!this.running) this.renderFrame(0);
  }

  renderFrame(dt: number) {
    const s = this.smoothInput, i = this.input;
    const k = 1 - Math.exp(-dt * 3);
    s.pointer.x += (i.pointer.x - s.pointer.x) * k;
    s.pointer.y += (i.pointer.y - s.pointer.y) * k;
    s.scroll += (i.scroll - s.scroll) * (1 - Math.exp(-dt * 6));
    s.drag = i.drag;
    const t = this.opts.fixedTime ?? this.elapsed;
    this.setup.update?.(t, dt, s);
    this.composer.finish.uniforms.time.value = t;
    this.composer.composer.render(dt);
    if (!this.firstFrame) { this.firstFrame = true; this.opts.onFirstFrame?.(); }
  }

  start() {
    if (this.running || !this.setup) return;
    this.running = true;
    this.timer.reset();
    const loop = (now?: number) => {
      if (!this.running) return;
      this.timer.update(now);
      const dt = Math.min(this.timer.getDelta(), 0.1);
      this.elapsed += dt;
      const t0 = performance.now();
      this.renderFrame(dt);
      this.trackPerf(performance.now() - t0, dt);
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  /** If frames are consistently slow, reduce resolution once, then report. */
  private trackPerf(_cpu: number, dt: number) {
    this.frameTimes.push(dt);
    if (this.frameTimes.length < 90) return;
    const avg = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
    this.frameTimes = [];
    if (avg > 1 / 28) {
      const pr = this.renderer.getPixelRatio();
      if (pr > 0.75) { this.renderer.setPixelRatio(pr * 0.75); this.composer.composer.setPixelRatio(pr * 0.75); this.resize(); }
      else this.onSlow?.();
    }
  }

  /** Render warm-up frames and return a data URL (offline stills). */
  capture(type = "image/jpeg", quality = 0.9) {
    const n = this.setup.warmup ?? 3;
    for (let i = 0; i < n; i++) { this.elapsed += 1 / 30; this.renderFrame(1 / 30); }
    return this.canvas.toDataURL(type, quality);
  }

  dispose() {
    this.stop();
    this.setup?.dispose?.();
    this.composer?.composer.dispose();
    this.renderer.dispose();
  }
}

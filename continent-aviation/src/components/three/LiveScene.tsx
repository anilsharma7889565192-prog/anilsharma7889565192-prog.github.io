"use client";

import { useEffect, useRef, useState } from "react";
import type { Stage } from "@/three/core/stage";

type Props = {
  shot: string;
  className?: string;
  /** Enable drag-to-rotate (pointer events on the canvas). */
  interactive?: boolean;
  /** Extra scene parameters, e.g. background colour. */
  params?: Record<string, string>;
  /** Receives scene commands once ready (e.g. setCategory). */
  onApi?: (api: Record<string, (arg: string) => void>) => void;
  /** Render one frame and stop (no animation loop). */
  still?: boolean;
};

function canRun() {
  if (typeof window === "undefined") return false;
  const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
  if (nav.connection?.saveData) return false;
  if (nav.deviceMemory !== undefined && nav.deviceMemory < 2) return false;
  try {
    const c = document.createElement("canvas");
    return !!c.getContext("webgl2");
  } catch {
    return false;
  }
}

/**
 * Real-time 3D layer. Sits above a static poster (the pre-rendered still of the same shot):
 * it loads after the page is idle, fades in on its first frame, pauses off-screen,
 * honours reduced motion, and quietly gives up on slow devices so the poster remains.
 */
export function LiveScene({ shot, className = "", interactive, params, onApi, still }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const onApiRef = useRef(onApi);
  onApiRef.current = onApi;
  const paramsKey = JSON.stringify(params ?? {});

  useEffect(() => {
    if (!canRun()) { setFailed(true); return; }
    const canvas = canvasRef.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let stage: Stage | null = null;
    let disposed = false;
    let visible = false;
    const cleanups: (() => void)[] = [];

    const boot = async () => {
      try {
        const [{ Stage }, { loadShot }] = await Promise.all([import("@/three/core/stage"), import("@/three/scenes")]);
        if (disposed) return;
        const mobile = window.matchMedia("(max-width: 767px)").matches;
        stage = new Stage(canvas, {
          quality: "live",
          pixelRatio: Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.5),
          samples: mobile ? 2 : 4,
          onFirstFrame: () => !disposed && setReady(true),
        });
        stage.onSlow = () => { stage?.stop(); setFailed(true); };
        await stage.load(await loadShot(shot), JSON.parse(paramsKey));
        if (disposed) { stage.dispose(); return; }
        if (stage.setup.api) onApiRef.current?.(stage.setup.api);
        stage.renderFrame(1 / 60);
        if (!reduce && !still && visible) stage.start();
      } catch (e) {
        console.warn("[3d] scene unavailable:", (e as Error).message);
        setFailed(true);
      }
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!stage?.setup || reduce || still) return;
      if (visible) stage.start(); else stage.stop();
    }, { rootMargin: "120px" });
    io.observe(canvas);
    cleanups.push(() => io.disconnect());

    const ro = new ResizeObserver(() => stage?.setup && stage.resize());
    ro.observe(canvas);
    cleanups.push(() => ro.disconnect());

    const onVis = () => { if (!stage?.setup || reduce || still) return; if (document.hidden) stage.stop(); else if (visible) stage.start(); };
    document.addEventListener("visibilitychange", onVis);
    cleanups.push(() => document.removeEventListener("visibilitychange", onVis));

    const onPointer = (e: PointerEvent) => {
      if (!stage) return;
      stage.input.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      stage.input.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    cleanups.push(() => window.removeEventListener("pointermove", onPointer));

    const onScroll = () => {
      if (!stage) return;
      const r = canvas.getBoundingClientRect();
      stage.input.scroll = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    cleanups.push(() => window.removeEventListener("scroll", onScroll));

    if (interactive) {
      let startX = 0, base = 0;
      const down = (e: PointerEvent) => { if (!stage) return; canvas.setPointerCapture(e.pointerId); startX = e.clientX; base = stage.input.drag.dx; stage.input.drag.active = true; };
      const move = (e: PointerEvent) => { if (stage?.input.drag.active) stage.input.drag.dx = base + (e.clientX - startX); };
      const up = () => { if (stage) stage.input.drag.active = false; };
      canvas.addEventListener("pointerdown", down);
      canvas.addEventListener("pointermove", move);
      canvas.addEventListener("pointerup", up);
      canvas.addEventListener("pointercancel", up);
      cleanups.push(() => { canvas.removeEventListener("pointerdown", down); canvas.removeEventListener("pointermove", move); canvas.removeEventListener("pointerup", up); canvas.removeEventListener("pointercancel", up); });
    }

    // Defer heavy work until the page is idle so it never competes with first paint or the enquiry form.
    const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    const start = () => (ric ? ric(() => void boot(), { timeout: 2500 }) : window.setTimeout(() => void boot(), 900));
    if (document.readyState === "complete") start(); else window.addEventListener("load", start, { once: true });

    return () => {
      disposed = true;
      cleanups.forEach((c) => c());
      stage?.dispose();
    };
  }, [shot, interactive, still, paramsKey]);

  if (failed) return null;
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 h-full w-full transition-opacity duration-[1400ms] ease-out ${ready ? "opacity-100" : "opacity-0"} ${interactive ? "cursor-grab touch-pan-y active:cursor-grabbing" : "pointer-events-none"} ${className}`}
    />
  );
}

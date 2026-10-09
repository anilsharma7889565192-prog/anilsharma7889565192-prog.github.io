"use client";

import { useEffect, useRef, useState } from "react";

declare global { interface Window { __capture?: (q?: number) => string; __ready?: boolean; __error?: string } }

export function StudioClient() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [info, setInfo] = useState("loading");
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const shot = q.get("shot") ?? "hero";
    const w = Number(q.get("w") ?? 1600), h = Number(q.get("h") ?? 900);
    const c = ref.current!;
    c.style.width = `${w}px`; c.style.height = `${h}px`;
    let stage: import("@/three/core/stage").Stage | undefined;
    (async () => {
      try {
        const [{ Stage }, { loadShot }] = await Promise.all([import("@/three/core/stage"), import("@/three/scenes")]);
        stage = new Stage(c, { quality: q.get("live") ? "live" : "still", pixelRatio: 1, samples: 4, fixedTime: Number(q.get("t") ?? 12) });
        await stage.load(await loadShot(shot), Object.fromEntries(q));
        window.__capture = (quality = 0.9) => stage!.capture("image/jpeg", quality);
        stage.renderFrame(1 / 30);
        window.__ready = true;
        setInfo(`${shot} ${w}x${h}`);
      } catch (e) {
        window.__error = String((e as Error).stack ?? e);
        setInfo(window.__error);
      }
    })();
    return () => stage?.dispose();
  }, []);
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 999, background: "#000", overflow: "auto" }}>
      <canvas ref={ref} style={{ display: "block" }} />
      <p style={{ position: "fixed", bottom: 4, left: 8, color: "#888", font: "12px monospace" }}>{info}</p>
    </div>
  );
}

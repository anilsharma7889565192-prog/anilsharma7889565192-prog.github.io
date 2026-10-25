"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

export type JourneyStep = { t: string; d: string };

/**
 * Scroll-driven film of the process, pre-rendered from the site's own 3D engine. The film is a visual
 * enhancement only: the same four steps are real text, and the section is replaced by a static grid
 * (children) on small screens and when reduced motion is requested. Scrolling is never hijacked.
 */
export function ScrollJourney({ steps, children }: { steps: JourneyStep[]; children: React.ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(0);
  const [load, setLoad] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = wrap.current, v = video.current;
    if (!el || !v) return;
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    const lean = !!conn && (conn.saveData === true || /(^|-)2g$/.test(conn.effectiveType ?? ""));
    if (!desktop || calm) return;

    let raf = 0, target = 0, cur = 0, p = 0, near = false, inView = false;
    const measure = () => {
      const r = el.getBoundingClientRect(), span = Math.max(1, r.height - window.innerHeight);
      p = Math.min(1, Math.max(0, -r.top / span));
      target = p;
      setActive(Math.min(steps.length - 1, Math.floor(p * steps.length)));
    };
    const tick = () => {
      raf = 0;
      cur += (target - cur) * 0.2;
      if (Math.abs(target - cur) < 0.0005) cur = target;
      let pending = false;
      if (v.duration) {
        const t = cur * (v.duration - 0.05);
        pending = Math.abs(v.currentTime - t) > 1 / 60;
        if (pending && !v.seeking) v.currentTime = t;
      }
      if (inView && (cur !== target || pending)) raf = requestAnimationFrame(tick);
    };
    const kick = () => { measure(); if (!raf && inView) raf = requestAnimationFrame(tick); };

    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      if (inView) kick();
    }, { rootMargin: "0px" });
    io.observe(el);
    const pre = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !near) { near = true; if (!lean) setLoad(true); }
    }, { rootMargin: "100% 0px" });
    pre.observe(el);
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    measure();
    return () => { io.disconnect(); pre.disconnect(); window.removeEventListener("scroll", kick); window.removeEventListener("resize", kick); cancelAnimationFrame(raf); };
  }, [steps.length]);

  return (
    <>
      {/* Static version: small screens, reduced motion, and no-script */}
      <div className="md:hidden motion-reduce:block">{children}</div>

      <div ref={wrap} className="relative hidden h-[420vh] bg-midnight md:block motion-reduce:hidden" aria-label="How a charter is arranged, step by step">
        <a href="#after-journey" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-20 focus:bg-gold focus:px-4 focus:py-2 focus:text-midnight">Skip the animation</a>
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <video
            ref={video}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
            muted playsInline preload="auto" aria-hidden="true" tabIndex={-1}
            onLoadedData={() => setReady(true)}
          >
            {load && <><source src="/media/journey.webm" type="video/webm" /><source src="/media/journey.mp4" type="video/mp4" /></>}
          </video>
          {/* poster always underneath so there is never an empty frame */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/media/journey-poster.jpg" alt="" aria-hidden="true" className="absolute inset-0 -z-10 h-full w-full object-cover" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgb(8_11_16/.82)_0%,rgb(8_11_16/.35)_48%,transparent_75%),linear-gradient(0deg,rgb(8_11_16/.6)_0%,transparent_38%)]" aria-hidden="true" />

          <div className="wrap relative z-10 flex h-full items-center">
            <div className="w-full max-w-xl">
              <p className="eyebrow">How we work</p>
              <ol className="relative mt-8 h-[19rem]">
                {steps.map((s, i) => (
                  <li key={s.t} aria-current={active === i ? "step" : undefined} className={`absolute inset-x-0 top-0 transition-all duration-700 ease-out ${active === i ? "translate-y-0 opacity-100" : i < active ? "-translate-y-6 opacity-0" : "translate-y-6 opacity-0"}`} aria-hidden={active === i ? undefined : true}>
                    <span className="font-serif text-6xl text-gold">{String(i + 1).padStart(2, "0")}</span>
                    <h2 className="h2 mt-4 !text-[clamp(2rem,4vw,3.4rem)]">{s.t}</h2>
                    <p className="lead mt-5">{s.d}</p>
                    {i === steps.length - 1 && <Link href="/request-a-charter" className="btn btn-gold mt-8">Request a Charter<ArrowRight size={16} aria-hidden="true" /></Link>}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="absolute bottom-10 right-[max(1.25rem,4vw)] z-10 flex items-center gap-3" aria-hidden="true">
            {steps.map((s, i) => <span key={s.t} className={`h-px transition-all duration-500 ${active >= i ? "w-12 bg-gold" : "w-6 bg-ivory/30"}`} />)}
          </div>
        </div>
      </div>
      <span id="after-journey" />
    </>
  );
}

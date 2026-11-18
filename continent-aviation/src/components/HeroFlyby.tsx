"use client";

import { useEffect, useRef } from "react";

/**
 * The home hero: a real sky, with a jet that starts small in the distance and, as you scroll, flies at you,
 * passes overhead and is gone. The hero content (headline and booking bar) stays pinned and usable throughout.
 * Phones and reduced-motion users get the still sky and a static jet: nothing is ever hidden behind the animation.
 */
export function HeroFlyby({ children }: { children: React.ReactNode }) {
  const track = useRef<HTMLElement>(null);
  const jet = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const el = track.current, j = jet.current;
    if (!el || !j) return;
    const mq = window.matchMedia("(min-width: 768px) and (min-height: 640px)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!mq.matches || calm.matches) return;
    let ticking = false;
    const update = () => {
      ticking = false;
      const r = el.getBoundingClientRect(), span = Math.max(1, el.offsetHeight - window.innerHeight);
      const p = Math.min(1, Math.max(0, -r.top / span));
      const a = Math.pow(p, 1.9);
      const s = 0.42 + a * 5.7, y = -a * window.innerHeight * 0.55, x = -a * window.innerWidth * 0.18;
      const fade = p < 0.8 ? 1 : Math.max(0, 1 - (p - 0.8) / 0.2);
      j.style.transform = `translate(-50%,-50%) translate(${x.toFixed(1)}px,${y.toFixed(1)}px) scale(${s.toFixed(3)})`;
      j.style.opacity = fade.toFixed(3);
      j.style.filter = `drop-shadow(0 26px 30px rgba(3,30,70,.35)) blur(${Math.max(0, (p - 0.55) * 7).toFixed(2)}px)`;
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, []);

  return (
    <section ref={track} className="relative md:[@media(min-height:640px)]:h-[240vh] motion-reduce:!h-auto">
      <div className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-[#0b6fb3] pb-12 pt-36 md:[@media(min-height:640px)]:sticky md:[@media(min-height:640px)]:top-0 md:[@media(min-height:640px)]:h-[100svh] md:pb-16 motion-reduce:!relative motion-reduce:!h-auto">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/sky.jpg" alt="" aria-hidden="true" className="absolute inset-0 -z-10 h-full w-full object-cover" fetchPriority="high" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(4,40,80,.62)_0%,rgba(4,40,80,.1)_40%,rgba(4,40,80,.4)_100%)]" aria-hidden="true" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={jet} src="/images/hero-jet.webp" alt="" aria-hidden="true" width={1500} height={424}
          className="pointer-events-none absolute left-[75%] top-[14%] z-[3] hidden h-auto w-[min(1000px,86vw)] origin-[50%_60%] will-change-transform md:block"
          style={{ transform: "translate(-50%,-50%) scale(.5)", filter: "drop-shadow(0 26px 30px rgba(3,30,70,.35))" }} />
        {children}
      </div>
    </section>
  );
}

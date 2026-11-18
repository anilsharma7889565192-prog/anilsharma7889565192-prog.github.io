"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { GlassLink } from "@/components/ui/glass-link";

export type JourneyStep = { t: string; d: string };

/** Real photographs (see IMAGES.md), one per step. They are illustrative of aircraft types, not a promise of a specific aircraft. */
const PHOTOS = [
  { src: "/images/fleet/legacy650.jpg", alt: "A large business jet in flight against a blue sky" },
  { src: "/images/fleet/falcon2000lx.jpg", alt: "A Dassault Falcon 2000 business jet on the apron" },
  { src: "/images/fleet/kingair.jpg", alt: "A Beechcraft King Air turboprop on the apron" },
  { src: "/images/fleet/aw169.jpg", alt: "A twin-engine AW169 helicopter on the apron" },
];

/**
 * Scroll-driven process section on real photographs. The same four steps are real text, and the section is
 * replaced by a static grid (children) on small screens and when reduced motion is requested.
 * Scrolling is never hijacked.
 */
export function ScrollJourney({ steps, children }: { steps: JourneyStep[]; children: React.ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [prog, setProg] = useState(0);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    if (!window.matchMedia("(min-width: 768px)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const r = el.getBoundingClientRect(), span = Math.max(1, r.height - window.innerHeight);
      const p = Math.min(1, Math.max(0, -r.top / span));
      setProg(p);
      setActive(Math.min(steps.length - 1, Math.floor(p * steps.length)));
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(measure); };
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    measure();
    return () => { window.removeEventListener("scroll", kick); window.removeEventListener("resize", kick); cancelAnimationFrame(raf); };
  }, [steps.length]);

  // progress within the current step, 0..1, drives a slow push-in on that step's photo
  const local = Math.min(1, Math.max(0, prog * steps.length - active));

  return (
    <>
      {/* Static version: small screens, reduced motion, and no-script */}
      <div className="md:hidden motion-reduce:block">{children}</div>

      <div ref={wrap} className="relative hidden h-[360vh] bg-midnight md:block motion-reduce:hidden" aria-label="How a charter is arranged, step by step">
        <a href="#after-journey" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-20 focus:bg-gold focus:px-4 focus:py-2 focus:text-midnight">Skip the animation</a>
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <Image src="/images/sky.jpg" alt="" aria-hidden="true" fill sizes="100vw" className="object-cover" style={{ transform: `scale(${1.04 + prog * 0.08})` }} />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgb(6_13_22/.9)_0%,rgb(6_13_22/.6)_42%,rgb(10_37_64/.25)_100%)]" aria-hidden="true" />

          <div className="wrap relative z-10 grid h-full items-center gap-10 lg:grid-cols-[1fr_1.15fr]">
            <div className="w-full max-w-xl">
              <p className="eyebrow">How we work</p>
              <ol className="relative mt-8 h-[19rem]">
                {steps.map((s, i) => (
                  <li key={s.t} aria-current={active === i ? "step" : undefined} className={`absolute inset-x-0 top-0 transition-all duration-700 ease-out ${active === i ? "translate-y-0 opacity-100" : i < active ? "-translate-y-6 opacity-0" : "translate-y-6 opacity-0"}`} aria-hidden={active === i ? undefined : true}>
                    <span className="font-serif text-6xl text-gold">{String(i + 1).padStart(2, "0")}</span>
                    <h2 className="h2 mt-4 !text-[clamp(2rem,4vw,3.4rem)]">{s.t}</h2>
                    <p className="lead mt-5">{s.d}</p>
                    {i === steps.length - 1 && <GlassLink href="/request-a-charter" className="mt-8">Request a Charter<ArrowRight size={16} aria-hidden="true" /></GlassLink>}
                  </li>
                ))}
              </ol>
            </div>

            <div className="relative hidden aspect-[16/11] w-full overflow-hidden rounded-3xl border border-white/30 shadow-[0_30px_80px_rgb(0_20_50/.45)] lg:block" aria-hidden="true" style={{ transform: `translateY(${(0.5 - prog) * 28}px)` }}>
              {PHOTOS.slice(0, steps.length).map((ph, i) => (
                <Image
                  key={ph.src} src={ph.src} alt={ph.alt} fill sizes="(min-width:1024px) 52vw, 0px"
                  className={`object-cover transition-opacity duration-1000 ${active === i ? "opacity-100" : "opacity-0"}`}
                  style={{ transform: `scale(${active === i ? 1.02 + local * 0.1 : 1.02})` }}
                />
              ))}
              <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/20 bg-[linear-gradient(180deg,transparent_60%,rgb(6_13_22/.35))]" />
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

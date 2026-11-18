import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { Photo } from "./Photo";
import { LiveScene } from "./three/LiveScene";
import type { ImageSlot } from "@/config/images";
import { site } from "@/config/site";

export function Breadcrumbs({ trail }: { trail: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-[0.78rem] tracking-wide text-ivory/70">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li><Link href="/" className="hover:text-gold">Home</Link></li>
        {trail.map((t, i) => (
          <li key={t.label} className="flex items-center gap-1.5">
            <ChevronRight size={12} aria-hidden="true" className="text-gold" />
            {t.href && i < trail.length - 1 ? <Link href={t.href} className="hover:text-gold">{t.label}</Link> : <span aria-current="page" className="text-ivory">{t.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

type PageHeroProps = {
  title: string;
  description: string;
  eyebrow?: string;
  slot: ImageSlot;
  crumbs: { href?: string; label: string }[];
  actions?: ReactNode;
  /** Real-time 3D version of the hero image (same shot name as the still). */
  live?: string;
};

export function PageHero({ title, description, eyebrow, slot, crumbs, actions, live }: PageHeroProps) {
  return (
    <section className="relative isolate flex min-h-[26rem] items-end overflow-hidden bg-[#0b6fb3] pb-14 pt-36 md:min-h-[34rem] md:pb-20">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/sky.jpg" alt="" aria-hidden="true" className="absolute inset-0 -z-10 h-full w-full object-cover" fetchPriority="high" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(4,40,80,.6),rgba(4,40,80,.12)_55%,rgba(4,40,80,.45))]" aria-hidden="true" />
      <div className="wrap relative z-10">
        <Breadcrumbs trail={crumbs} />
        {eyebrow && <p className="eyebrow mt-8 rise">{eyebrow}</p>}
        <h1 className={`h2 !text-[clamp(2.4rem,6vw,4.6rem)] max-w-4xl rise rise-2 ${eyebrow ? "mt-4" : "mt-8"}`}>{title}</h1>
        <p className="lead mt-6 rise rise-3">{description}</p>
        {actions && <div className="mt-9 flex flex-wrap gap-4 rise rise-4">{actions}</div>}
      </div>
    </section>
  );
}

export function SectionHead({ eyebrow, title, children, className = "" }: { eyebrow?: string; title: string; children?: ReactNode; className?: string }) {
  return (
    <div className={`max-w-3xl ${className}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className={`h2 ${eyebrow ? "mt-4" : ""}`}>{title}</h2>
      <span className="rule mt-7" />
      {children && <div className="lead mt-7">{children}</div>}
    </div>
  );
}

export function Faq({ items }: { items: { q: string; a: ReactNode }[] }) {
  return (
    <div className="faq">
      {items.map((it) => (
        <details key={it.q}>
          <summary>{it.q}<span className="plus" aria-hidden="true" /></summary>
          <div className="answer">{it.a}</div>
        </details>
      ))}
    </div>
  );
}

export function CtaBand({
  title = "Tell Us Where You Need to Be.",
  text = "Share your travel requirements and let us coordinate suitable charter options with relevant aviation operators.",
  primary = { href: "/request-a-charter", label: "Request a Charter" },
  secondary = { href: "/contact", label: "Contact Continent Aviation" },
  slot = "cta",
}: {
  title?: string;
  text?: string;
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string } | null;
  slot?: ImageSlot;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-[#0b6fb3] py-24 md:py-36">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/sky.jpg" alt="" aria-hidden="true" className="absolute inset-0 -z-10 h-full w-full object-cover" loading="lazy" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(80%_90%_at_50%_50%,rgba(4,40,80,.35),rgba(4,40,80,.7))]" aria-hidden="true" />
      <div className="wrap relative z-10 text-center">
        <span className="rule mx-auto" />
        <h2 className="h2 mx-auto mt-8 max-w-3xl !text-[clamp(2.2rem,5.5vw,4.2rem)]">{title}</h2>
        <p className="lead mx-auto mt-6">{text}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href={primary.href} className="btn btn-gold">{primary.label}<ArrowRight size={16} aria-hidden="true" /></Link>
          {secondary && <Link href={secondary.href} className="btn btn-ghost">{secondary.label}</Link>}
        </div>
      </div>
    </section>
  );
}

/** Closing call to action with a photoreal night-time Earth that bleeds into the page (home page). */
export function GlobeCta() {
  return (
    <section className="relative isolate overflow-hidden bg-[#020305]">
      {/* The Earth is part of the scene, not a picture on it: oversized, bleeding off the right edge, edges feathered to the page colour. */}
      <div className="pointer-events-none absolute -right-[22%] top-[58%] -z-10 aspect-square w-[min(150vw,64rem)] -translate-y-1/2 [mask-image:radial-gradient(circle_closest-side,#000_74%,transparent_100%)] max-lg:-right-[38%] max-lg:top-[78%] max-lg:w-[150vw] lg:-right-[8%] lg:top-1/2" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/earth-poster.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
        <LiveScene shot="globe" params={{ bg: "#000000" }} />
      </div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#020305_0%,rgba(2,3,5,.88)_30%,rgba(2,3,5,0)_62%)] max-lg:bg-[linear-gradient(180deg,#020305_0%,rgba(2,3,5,.8)_38%,rgba(2,3,5,0)_70%)]" aria-hidden="true" />
      <div className="wrap relative py-24 md:py-36 max-lg:pb-[26rem]">
        <div className="max-w-xl">
          <span className="rule" />
          <h2 className="h2 mt-8 !text-[clamp(2.2rem,5vw,4rem)]">Tell Us Where You Need to Be.</h2>
          <p className="lead mt-6">Share your travel requirements and let us coordinate suitable charter options with relevant aviation operators.</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/request-a-charter" className="btn btn-gold">Request a Charter<ArrowRight size={16} aria-hidden="true" /></Link>
            <Link href="/contact" className="btn btn-ghost">Contact Continent Aviation</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Disclaimer({ tone = "dark" }: { tone?: "dark" | "ivory" }) {
  return (
    <section aria-label="Important information" className={tone === "ivory" ? "section-ivory py-12" : "section-black py-12"}>
      <div className="wrap wrap-narrow">
        <p className={`border-l border-gold pl-6 text-[0.9rem] leading-relaxed ${tone === "ivory" ? "text-grey-deep" : "text-ivory/65"}`}>{site.disclaimerFull}</p>
      </div>
    </section>
  );
}

export function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-4">
      {items.map((i) => (
        <li key={i} className="flex gap-4"><span aria-hidden="true" className="mt-[0.8em] h-px w-5 shrink-0 bg-gold" /><span>{i}</span></li>
      ))}
    </ul>
  );
}

export function enquiryHref(params: Record<string, string>) {
  return `/request-a-charter?${new URLSearchParams(params).toString()}`;
}

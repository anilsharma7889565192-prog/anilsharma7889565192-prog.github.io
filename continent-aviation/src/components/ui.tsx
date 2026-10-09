import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { Photo } from "./Photo";
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
};

export function PageHero({ title, description, eyebrow, slot, crumbs, actions }: PageHeroProps) {
  return (
    <section className="relative isolate flex min-h-[26rem] items-end overflow-hidden pb-14 pt-36 md:min-h-[34rem] md:pb-20">
      <Photo slot={slot} shade="hero" priority sizes="100vw" />
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
    <section className="relative isolate overflow-hidden py-24 md:py-36">
      <Photo slot={slot} shade="hero" />
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

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CtaBand, Disclaimer, PageHero, SectionHead } from "@/components/ui";
import { Photo } from "@/components/Photo";
import { AlertSignup } from "@/components/AlertSignup";
import { guides } from "@/config/guides";
import { pageMeta } from "@/lib/metadata";

export const metadata = pageMeta("/airports", "Airports and Routes", "Guides to planning private jet and helicopter charter to and from key Indian cities: airports, popular routes and what to check with the operator.");

export default function Page() {
  return (
    <>
      <PageHero slot="vip" crumbs={[{ label: "Airports and Routes" }]} eyebrow="Airports and Routes"
        title="Know Your Airports Before You Fly."
        description="Short planning guides for popular charter destinations: which airports to consider, and what to check with the operator." />
      <section className="section section-ivory">
        <div className="wrap">
          <SectionHead eyebrow="Guides" title="Popular charter destinations." />
          <ul className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {guides.map((g) => (
              <li key={g.slug}>
                <Link href={`/airports/${g.slug}`} className="tile group block">
                  <div className="relative aspect-[4/3]"><Photo slot={g.slot} shade="bottom" sizes="(min-width:1024px) 33vw, 100vw" /></div>
                  <div className="pt-5"><h3 className="h3">{g.city}</h3><p className="mt-2 text-grey-deep">{g.airports.map((a) => a.code).join(" · ")}</p><span className="link-arrow mt-4">Read the guide<ArrowRight size={14} aria-hidden="true" /></span></div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="section section-navy"><div className="wrap wrap-narrow"><AlertSignup /></div></section>
      <CtaBand />
      <Disclaimer />
    </>
  );
}

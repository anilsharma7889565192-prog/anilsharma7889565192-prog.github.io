import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Bullets, CtaBand, Disclaimer, PageHero, SectionHead, enquiryHref } from "@/components/ui";
import { guideBySlug, guides } from "@/config/guides";
import { pageMeta } from "@/lib/metadata";

export const dynamicParams = false;
export const generateStaticParams = () => guides.map((g) => ({ slug: g.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const g = guideBySlug((await params).slug);
  return g ? pageMeta(`/airports/${g.slug}`, g.title, g.description) : {};
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const g = guideBySlug((await params).slug);
  if (!g) notFound();
  return (
    <>
      <PageHero slot={g.slot} crumbs={[{ href: "/airports", label: "Airports and Routes" }, { label: g.city }]} eyebrow="Airport guide" title={g.title} description={g.description}
        actions={<Link href={enquiryHref({ to: g.city })} className="btn btn-gold">Request a Quote<ArrowRight size={16} aria-hidden="true" /></Link>} />
      <section className="section section-ivory">
        <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-7">
            <p className="text-[1.15rem] leading-relaxed text-midnight/85">{g.intro}</p>
            <h2 className="h3 mt-14">Airports to know</h2>
            <ul className="mt-6 divide-y divide-midnight/15 border-y border-midnight/15">
              {g.airports.map((a) => <li key={a.code} className="py-5"><span className="font-serif text-2xl">{a.name}</span> <span className="ml-2 text-sm text-gold-deep">{a.code}</span>{a.note && <p className="mt-1 text-sm text-grey-deep">{a.note}</p>}</li>)}
            </ul>
            <h2 className="h3 mt-14">What to check with the operator</h2>
            <div className="mt-6 text-midnight/85"><Bullets items={g.check} /></div>
          </div>
          <aside className="lg:col-span-5">
            <div className="border border-midnight/15 p-7">
              <h2 className="eyebrow">Often suits</h2>
              <div className="mt-5 text-[0.98rem] text-midnight/85"><Bullets items={g.suits} /></div>
              <h2 className="eyebrow mt-9">Popular routes</h2>
              <ul className="mt-4 space-y-2 text-midnight/85">{g.popular.map((r) => <li key={r}>{r}</li>)}</ul>
            </div>
            <p className="mt-6 text-sm text-grey-deep">This guide is general. Airport operating hours, slots, terminals and handling change, and the operator confirms what applies to your flight.</p>
          </aside>
        </div>
      </section>
      <CtaBand title={`Planning a Journey to or from ${g.city}?`} text="Tell us your route and dates. We check with the operator and send you a quote." primary={{ href: enquiryHref({ to: g.city }), label: "Request a Quote" }} secondary={{ href: "/airports", label: "More guides" }} />
      <Disclaimer />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs, Disclaimer, enquiryHref } from "@/components/ui";
import { articleBySlug, articles } from "@/config/insights";
import { site } from "@/config/site";
import { pageMeta } from "@/lib/metadata";

export const dynamicParams = false;
export const generateStaticParams = () => articles.map((a) => ({ slug: a.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const a = articleBySlug((await params).slug);
  return a ? { ...pageMeta(`/insights/${a.slug}`, a.title, a.description), openGraph: { type: "article", title: `${a.title} | Continent Aviation`, description: a.description, url: `/insights/${a.slug}`, publishedTime: a.date } } : {};
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const a = articleBySlug((await params).slug);
  if (!a) notFound();
  const ld = { "@context": "https://schema.org", "@type": "Article", headline: a.title, description: a.description, datePublished: a.date, author: { "@type": "Organization", name: site.name }, publisher: { "@type": "Organization", name: site.name } };
  return (
    <>
      <section className="bg-midnight pb-10 pt-36 md:pt-44">
        <div className="wrap wrap-narrow">
          <Breadcrumbs trail={[{ href: "/insights", label: "Insights" }, { label: a.title }]} />
          <p className="eyebrow mt-8">{a.readMinutes} minute read</p>
          <h1 className="h2 mt-3 !text-[clamp(2.2rem,5vw,3.8rem)]">{a.title}</h1>
          <p className="lead mt-5">{a.description}</p>
        </div>
      </section>
      <article className="section-black pb-24">
        <div className="wrap wrap-narrow"><div className="prose-lux border-t border-gold/35 pt-4">
          {a.sections.map((s) => (
            <div key={s.heading}>
              <h2>{s.heading}</h2>
              {s.paragraphs?.map((p) => <p key={p}>{p}</p>)}
              {s.bullets && <ul>{s.bullets.map((b) => <li key={b}>{b}</li>)}</ul>}
            </div>
          ))}
          <p className="!mt-12 border-t border-gold/35 pt-8"><Link href={enquiryHref({})} className="btn btn-gold !no-underline">Request a Quote<ArrowRight size={16} aria-hidden="true" /></Link></p>
        </div></div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      </article>
      <Disclaimer />
    </>
  );
}

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CtaBand, Disclaimer, PageHero, SectionHead } from "@/components/ui";
import { articles } from "@/config/insights";
import { pageMeta } from "@/lib/metadata";

export const metadata = pageMeta("/insights", "Insights", "Practical guidance on arranging private jet and helicopter charter in India: planning, quotes and choosing the right aircraft.");

export default function Page() {
  return (
    <>
      <PageHero slot="about" crumbs={[{ label: "Insights" }]} eyebrow="Insights" title="Practical Guidance for Charter Travel." description="Short, plain-language articles to help you plan and get a more accurate quote." />
      <section className="section section-ivory">
        <div className="wrap">
          <SectionHead eyebrow="Articles" title="Plan with confidence." />
          <ul className="mt-14 divide-y divide-midnight/15 border-y border-midnight/15">
            {articles.map((a) => (
              <li key={a.slug}>
                <Link href={`/insights/${a.slug}`} className="group grid gap-3 py-8 md:grid-cols-[1fr_auto] md:items-center">
                  <div><h3 className="h3 !text-[1.9rem]">{a.title}</h3><p className="mt-2 max-w-2xl text-grey-deep">{a.description}</p><p className="mt-3 text-xs uppercase tracking-[0.14em] text-grey-deep">{a.readMinutes} minute read</p></div>
                  <span className="link-arrow">Read<ArrowRight size={14} aria-hidden="true" /></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <CtaBand />
      <Disclaimer />
    </>
  );
}

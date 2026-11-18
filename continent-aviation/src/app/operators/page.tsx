import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CtaBand, Disclaimer, PageHero, SectionHead, enquiryHref } from "@/components/ui";
import { operators } from "@/config/operators";
import { pageMeta } from "@/lib/metadata";

export const metadata = pageMeta("/operators", "Operators and Aircraft", "The independent operators Continent Aviation works with, and the aircraft they own and operate. Availability and pricing are confirmed by the operator for each request.");

const checklist = [
  ["Operating permission", "Ask the operator for its operating permit details and confirm it covers the type of flight you are planning."],
  ["The aircraft", "Ask which aircraft will fly your journey, its passenger capacity and its baggage limits."],
  ["Crew and insurance", "Ask the operator to confirm crew arrangements and the insurance that applies to your flight."],
  ["Terms in writing", "Ask for the operator's cancellation, change and refund terms in writing before you pay."],
  ["Payment", "Pay only as the operator's quote instructs, and keep the operator's receipt."],
];

export default function Page() {
  return (
    <>
      <PageHero slot="apron" crumbs={[{ label: "Operators and Aircraft" }]} eyebrow="Operators and Aircraft"
        title="The Operators Behind Your Charter."
        description="Continent Aviation does not own or operate aircraft. We arrange charters with independent operators, who operate the flight." />

      <section className="section section-ivory">
        <div className="wrap">
          <SectionHead eyebrow="Who flies you" title="Independent operators, named clearly.">
            <p>Each quote names the operator and the aircraft. The operator confirms availability, price and terms, and is responsible for operating the flight.</p>
          </SectionHead>
          <div className="mt-16 space-y-16">
            {operators.map((o) => (
              <article key={o.id} id={o.id} className="grid gap-10 lg:grid-cols-12 lg:gap-16">
                <div className="lg:col-span-4">
                  <h3 className="h3 !text-3xl">{o.name}</h3>
                  <span className="rule mt-5" />
                  <p className="mt-5 text-grey-deep">{o.summary}</p>
                  <p className="mt-4 text-sm text-grey-deep"><strong className="font-medium text-midnight">Base:</strong> {o.base}</p>
                </div>
                <div className="min-w-0 lg:col-span-8">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[32rem] text-left text-[0.95rem]">
                      <caption className="sr-only">Aircraft operated by {o.name}</caption>
                      <thead className="border-b border-midnight/20 text-[0.72rem] uppercase tracking-[0.14em] text-grey-deep"><tr><th className="py-3 pr-4">Aircraft</th><th className="py-3 pr-4">Type</th><th className="py-3 pr-4">Capacity</th><th className="py-3">Notes</th></tr></thead>
                      <tbody>
                        {o.aircraft.map((a) => (
                          <tr key={a.model} className="border-b border-midnight/10 align-top">
                            <th scope="row" className="py-4 pr-4 font-serif text-xl font-medium">{a.model}{a.count && a.count > 1 ? <span className="ml-2 font-sans text-sm text-grey-deep">× {a.count}</span> : null}</th>
                            <td className="py-4 pr-4">{a.category}</td>
                            <td className="py-4 pr-4 whitespace-nowrap">Up to {a.seats}</td>
                            <td className="py-4 text-grey-deep">{a.note}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-14 max-w-3xl border-l border-gold-deep pl-5 text-sm text-grey-deep">
            This information comes from each operator&apos;s public details and is being confirmed with the operators. It is indicative: aircraft may be unavailable, may change, or may be swapped for a similar type. Availability, aircraft and pricing are confirmed by the operator for each request. These aircraft belong to the operators, not to Continent Aviation.
          </p>
        </div>
      </section>

      <section className="section section-black">
        <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5"><SectionHead eyebrow="For your confidence" title="What to ask any operator.">
            <p>These questions are worth asking whoever you charter with. We encourage you to ask them, and we can help you put them to the operator.</p></SectionHead></div>
          <dl className="lg:col-span-7">
            {checklist.map(([t, d]) => <div key={t} className="hairline-top grid gap-2 py-6 sm:grid-cols-[13rem_1fr] sm:gap-8"><dt className="font-serif text-2xl">{t}</dt><dd className="text-ivory/72">{d}</dd></div>)}
          </dl>
        </div>
      </section>

      <section className="section section-navy">
        <div className="wrap flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div><h2 className="h3 !text-3xl">Ready to ask for options?</h2><p className="mt-3 max-w-xl text-ivory/75">Tell us your route and dates. We check with the operator and send you a quote.</p></div>
          <Link href={enquiryHref({})} className="btn btn-gold">Request a Quote<ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
      </section>
      <CtaBand title="Questions About Our Operators?" text="Ask us how we work with operators and what you can expect from a quote." primary={{ href: "/how-we-quote", label: "How We Quote" }} secondary={{ href: "/contact", label: "Contact Continent Aviation" }} />
      <Disclaimer />
    </>
  );
}

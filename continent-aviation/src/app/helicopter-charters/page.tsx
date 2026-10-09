import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CtaBand, Disclaimer, Faq, PageHero, SectionHead, enquiryHref } from "@/components/ui";
import { pageMeta } from "@/lib/metadata";

export const metadata = pageMeta("/helicopter-charters", "Helicopter Charter Enquiries in India", "Explore helicopter charter enquiries for suitable regional travel, destination events and special requirements, subject to permissions, site suitability and operator approval.");

const cta = enquiryHref({ aircraft: "Helicopter" });

const uses = [
  { t: "Event and wedding movements", d: "Short transfers for guests or families to and from venues, where a suitable landing site, permission and operator approval are in place." },
  { t: "Regional and point-to-point travel", d: "Journeys between locations within helicopter range where a road or commercial route is slow, indirect or impractical." },
  { t: "Scenic and leisure charters", d: "Where an operator offers them, scenic or leisure flights can be enquired about for a specific area and date." },
  { t: "Remote-site access", d: "Access to sites that are difficult to reach by road, where this is operationally feasible and permitted." },
];

const considerations = [
  ["Landing sites and helipads", "A suitable, approved landing site is needed at each end. Hotels, resorts, venues and private grounds are not assumed to have one. Site suitability, ground support and local authorisation are reviewed case by case."],
  ["Permissions", "Helicopter operations typically require permissions that vary by location and airspace. The operator advises on what is required, and approvals cannot be assumed in advance."],
  ["Weather", "Helicopter flights depend on weather and visibility. Conditions can lead to delay, rerouting or cancellation."],
  ["Operating hours and daylight", "Many operations are limited to daylight and to specific hours. Evening or early-morning movements may not be possible."],
  ["Safety and operator approval", "The operator and its pilots decide whether a flight can safely proceed, and may decline or amend a request."],
  ["Capacity and range", "Passenger numbers, baggage, altitude and distance all affect which helicopter is suitable."],
];

const faqs = [
  { q: "Can a helicopter land anywhere?", a: <p>No. Helicopter landings are subject to the required permissions, site suitability, operator approval, safety requirements and operational feasibility. Many locations do not have suitable infrastructure.</p> },
  { q: "Do you operate the helicopters?", a: <p>No. Continent Aviation arranges enquiries and coordinates with independent aviation operators, who are responsible for flight operations.</p> },
  { q: "Can I get a price without knowing the landing site?", a: <p>Operators generally need the departure and arrival locations to assess feasibility and pricing. Share what you know and we will help clarify the rest with the operator.</p> },
  { q: "What if the weather is poor?", a: <p>Operators may delay, reroute or cancel flights for weather or safety reasons. Their terms set out how this is handled.</p> },
  { q: "How early should I enquire?", a: <p>Early enquiries give more time to check permissions and site arrangements. Short-notice requests may not be feasible.</p> },
];

export default function Page() {
  return (
    <>
      <PageHero slot="helicopter" live="helicopter" crumbs={[{ label: "Helicopter Charters" }]} eyebrow="Helicopter Charters"
        title="Helicopter Charter Options for Distinct Journeys."
        description="Explore helicopter charter enquiries for suitable regional travel, destination events and special requirements."
        actions={<Link href={cta} className="btn btn-gold">Enquire About Helicopter Charter<ArrowRight size={16} aria-hidden="true" /></Link>} />

      <section className="section section-ivory">
        <div className="wrap">
          <SectionHead eyebrow="Enquiries" title="Where helicopter charter may be considered." />
          <div className="mt-16 grid gap-x-16 gap-y-12 md:grid-cols-2">
            {uses.map((u) => (
              <article key={u.t} className="hairline-top pt-7">
                <h3 className="h3">{u.t}</h3>
                <p className="mt-4 text-grey-deep">{u.d}</p>
              </article>
            ))}
          </div>
          <p className="mt-14 max-w-3xl border-l border-gold-deep pl-5 text-grey-deep">
            Helicopter landings are subject to the required permissions, site suitability, operator approval, safety requirements and operational feasibility.
          </p>
        </div>
      </section>

      <section className="section section-navy">
        <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-4"><SectionHead eyebrow="Considerations" title="What shapes a helicopter charter." /></div>
          <dl className="lg:col-span-8">
            {considerations.map(([t, d]) => (
              <div key={t} className="hairline-top grid gap-2 py-6 sm:grid-cols-[14rem_1fr] sm:gap-8">
                <dt className="font-serif text-2xl">{t}</dt>
                <dd className="text-ivory/70">{d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section section-black">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-4"><SectionHead eyebrow="Questions" title="Frequently asked questions." /></div>
          <div className="lg:col-span-8"><Faq items={faqs} /></div>
        </div>
      </section>

      <CtaBand slot="helicopter" title="Enquire About Helicopter Charter." text="Tell us where you would like to travel and what you know about the landing sites. We will check feasibility with relevant operators." primary={{ href: cta, label: "Enquire About Helicopter Charter" }} />
      <Disclaimer />
    </>
  );
}

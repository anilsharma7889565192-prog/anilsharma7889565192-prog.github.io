import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Photo } from "@/components/Photo";
import { Bullets, CtaBand, Disclaimer, Faq, PageHero, SectionHead, enquiryHref } from "@/components/ui";
import { AircraftExplorer } from "@/components/three/AircraftExplorer";
import { pageMeta } from "@/lib/metadata";

export const metadata = pageMeta("/private-jets", "Private Jet Charter in India", "Explore private jet charter options for executive travel, private journeys, multi-city itineraries and special occasions, sourced through independent aviation operators.");

const cta = enquiryHref({ aircraft: "Private Jet" });

const suitable = [
  "A schedule that needs to follow your itinerary rather than a published timetable.",
  "Several cities in a short window, where commercial connections would be slow or complicated.",
  "A group travelling together that benefits from a single, shared arrival.",
  "Destinations with limited or no commercial service.",
  "Journeys where privacy, space or time on the ground matter.",
];

const segments = [
  { id: "executive", t: "Executive and corporate travel", d: "Leadership teams, boards and project groups often travel to several locations with limited time at each. We coordinate quotations from relevant operators so you can compare aircraft options against your schedule and passenger list." },
  { id: "family", t: "Family and private travel", d: "Private journeys may involve children, elderly relatives, pets or particular baggage. Tell us what matters and we will take it into account when approaching operators." },
  { id: "occasions", t: "Destination weddings and special occasions", d: "Celebrations often bring guests from several cities. We can enquire about charter options for wedding families, key guests and event teams, and coordinate with your planner." },
  { id: "multicity", t: "Multi-city itineraries", d: "Itineraries with several legs are quoted by operators as a whole. Share the sequence of cities, dates and waiting times, and we will request options accordingly." },
];

const factors = [
  ["Route and distance", "The sectors involved influence which aircraft categories are practical, including whether fuel stops may be required."],
  ["Passenger count", "Cabin capacity differs between aircraft. We ask for passenger numbers so unsuitable options are not proposed."],
  ["Baggage", "Hold space varies. Golf bags, event equipment or unusual items should be mentioned early."],
  ["Airport limitations", "Runway length, operating hours, slot availability and ground handling at departure and arrival airports can restrict aircraft choice."],
  ["Availability", "Aircraft availability changes continuously, and each operator confirms its own."],
  ["Operator confirmation", "Pricing, aircraft, crew, permissions and terms are confirmed by the operator before any booking proceeds."],
];

const faqs = [
  { q: "Do you own or operate the aircraft?", a: <p>No. Continent Aviation arranges charter enquiries and coordinates with independent aviation operators. The contracted operator is responsible for flight operations.</p> },
  { q: "Which aircraft can I charter?", a: <p>We do not publish a fixed list of aircraft because availability is confirmed by operators for each request. After reviewing your requirements we approach relevant operators and share the options they propose.</p> },
  { q: "How much does a private jet charter cost?", a: <p>Pricing depends on route, aircraft category, dates, positioning requirements, airport and handling charges, taxes and operator terms. Quotations are provided by operators and are subject to change until confirmed.</p> },
  { q: "How early should I enquire?", a: <p>Earlier enquiries generally allow more options to be explored. Short-notice requests may still be possible, but availability cannot be assumed.</p> },
  { q: "Can you arrange a one-way or multi-city journey?", a: <p>You may submit one-way, return and multi-city enquiries. Operators will advise on feasibility and pricing for each.</p> },
];

export default function Page() {
  return (
    <>
      <PageHero slot="jets" live="jets" crumbs={[{ label: "Private Jets" }]} eyebrow="Private Jets"
        title="Private Jet Charter, Tailored to Your Journey."
        description="Explore private jet charter options for executive travel, private journeys, multi-city itineraries and special occasions."
        actions={<><Link href={cta} className="btn btn-gold">Request Private Jet Options<ArrowRight size={16} aria-hidden="true" /></Link></>} />

      <section className="section section-ivory">
        <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <SectionHead eyebrow="Suitability" title="When private jet charter may be suitable." />
          </div>
          <div className="lg:col-span-7 lg:pt-4">
            <div className="text-midnight/85"><Bullets items={suitable} /></div>
            <p className="mt-8 text-sm text-grey-deep">Whether charter is suitable for a particular journey depends on the route, the aircraft and the operator&apos;s confirmation.</p>
          </div>
        </div>
      </section>

      <section className="section section-black">
        <div className="wrap">
          <SectionHead eyebrow="Journeys" title="Four common requirements." />
          <div className="mt-16 grid gap-x-16 gap-y-14 md:grid-cols-2">
            {segments.map((s) => (
              <article key={s.id} id={s.id} className="hairline-top pt-7">
                <h3 className="h3">{s.t}</h3>
                <p className="mt-4 text-ivory/72">{s.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-navy" aria-label="Aircraft categories">
        <div className="wrap">
          <SectionHead eyebrow="Aircraft categories" title="Explore the main jet categories.">
            <p>Operators group business jets broadly by cabin size and range. Choosing a category is a starting point; the right aircraft depends on your route, passengers and the options operators confirm.</p>
          </SectionHead>
          <div className="mt-14"><AircraftExplorer poster={<Photo slot="group" sizes="(min-width:1024px) 60vw, 100vw" />} /></div>
        </div>
      </section>

      <section className="section section-black">
        <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <SectionHead eyebrow="Sourcing" title="How aircraft sourcing works.">
              <p>Aircraft selection is not one-size-fits-all. We review your requirement, then approach relevant operators and bring back the options they propose.</p>
            </SectionHead>
            <div className="relative mt-12 hidden aspect-[4/3] lg:block"><Photo slot="interior" sizes="40vw" /></div>
          </div>
          <dl className="lg:col-span-7">
            {factors.map(([t, d]) => (
              <div key={t} className="hairline-top grid gap-2 py-6 sm:grid-cols-[13rem_1fr] sm:gap-8">
                <dt className="font-serif text-2xl text-ivory">{t}</dt>
                <dd className="text-ivory/70">{d}</dd>
              </div>
            ))}
            <p className="hairline-top pt-6 text-sm text-grey">We do not list specific aircraft as currently available, and we do not publish indicative prices or guaranteed travel times.</p>
          </dl>
        </div>
      </section>

      <section className="section section-ivory">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-4"><SectionHead eyebrow="Questions" title="Frequently asked questions." /></div>
          <div className="lg:col-span-8"><Faq items={faqs} /></div>
        </div>
      </section>

      <CtaBand title="Request Private Jet Options." text="Share your route, dates and passenger numbers and we will approach suitable operators on your behalf." primary={{ href: cta, label: "Request Private Jet Options" }} />
      <Disclaimer />
    </>
  );
}

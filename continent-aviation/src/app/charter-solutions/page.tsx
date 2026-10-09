import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Photo } from "@/components/Photo";
import { CtaBand, Disclaimer, PageHero, enquiryHref } from "@/components/ui";
import type { ImageSlot } from "@/config/images";
import { pageMeta } from "@/lib/metadata";

export const metadata = pageMeta("/charter-solutions", "Charter Solutions", "Charter coordination for corporate and executive travel, destination weddings, VIP and event travel, private family journeys and bespoke multi-city itineraries.");

type Solution = {
  id: string; letter: string; slot: ImageSlot; title: string; type: string; provide: string[]; coordinate: string; factors: string; cta: string; params: Record<string, string>;
};

const solutions: Solution[] = [
  {
    id: "corporate", letter: "A", slot: "corporate", title: "Corporate & Executive Travel",
    type: "Executives, founders and business teams travelling to one or more cities on a defined schedule, sometimes at short notice.",
    provide: ["Cities or airports and the order of travel", "Dates and preferred timings", "Number of passengers and any VIP requirements", "Baggage or equipment", "Whether a return or onward leg is needed"],
    coordinate: "We review the itinerary, approach relevant operators and consolidate the options they propose, so you can compare aircraft, indicative pricing and conditions in one place.",
    factors: "Route length, passenger numbers, airport restrictions, timing flexibility and the number of legs all affect aircraft choice and cost.",
    cta: "Discuss Corporate Travel", params: { purpose: "Corporate Travel" },
  },
  {
    id: "weddings", letter: "B", slot: "wedding", title: "Destination Weddings",
    type: "Wedding families, special guests and planners arranging travel to a destination venue, sometimes from several cities.",
    provide: ["Wedding location and dates", "Departure cities for each group", "Number of guests per movement", "Whether helicopter transfers to the venue are being considered", "Your planner or event team contact, if any"],
    coordinate: "We can liaise with planners and hospitality teams while we approach operators for jet and, where feasible, helicopter options. Landing permissions and site suitability are confirmed by the operator.",
    factors: "Dates in peak wedding season, venue access, the number of separate movements and airport constraints all influence availability and pricing.",
    cta: "Discuss Wedding Travel", params: { purpose: "Destination Wedding" },
  },
  {
    id: "vip-events", letter: "C", slot: "vip", title: "VIP & Event Travel",
    type: "Premium events, conferences and special movements that require carefully timed arrivals and departures.",
    provide: ["Event dates, venue and schedule", "Arrival and departure windows", "Number of guests or principals", "Any security, protocol or ground handling requirements", "Event team contact details"],
    coordinate: "We share the schedule with relevant operators and coordinate responses, noting where timings or handling requirements need operator confirmation.",
    factors: "Fixed timings, local airport capacity, ground handling and permissions can narrow the options available.",
    cta: "Enquire About Event Travel", params: { purpose: "Event / VIP Movement" },
  },
  {
    id: "family", letter: "D", slot: "private", title: "Private Family Journeys",
    type: "Families and individuals travelling for personal reasons, whether for a holiday, a celebration or an important occasion.",
    provide: ["Destination and dates", "Names are not needed at first, only passenger numbers", "Ages of children or mobility needs", "Pets, baggage and special requests", "Preferred contact method"],
    coordinate: "We take the practical details into account when approaching operators and report back with the options and conditions they provide.",
    factors: "Cabin size, baggage space, airport access and dates are the main factors. Pricing varies by operator and route.",
    cta: "Plan a Private Journey", params: { purpose: "Private / Family Travel" },
  },
  {
    id: "multi-city", letter: "E", slot: "group", title: "Bespoke Multi-City Travel",
    type: "Itineraries with several stops, groups travelling together, or journeys that do not fit a standard point-to-point request.",
    provide: ["Each city or airport in sequence", "Dates and waiting times at each stop", "Passenger changes between legs", "Any flexibility on routing or timing", "Budget guidance, if you wish"],
    coordinate: "We describe the whole itinerary to operators so that they can quote the complete journey, and highlight any legs that need adjustment.",
    factors: "Number of legs, positioning flights, waiting time, airport charges and the sequence of stops all influence feasibility and cost.",
    cta: "Discuss a Multi-City Itinerary", params: { tripType: "Multi-City" },
  },
];

export default function Page() {
  return (
    <>
      <PageHero slot="bespoke" crumbs={[{ label: "Charter Solutions" }]} eyebrow="Charter Solutions"
        title="Charter Coordination Around Each Client."
        description="Different journeys call for different aircraft, timings and operators. These are the requirements we most often coordinate." />

      <nav aria-label="Solutions" className="sticky top-[4.5rem] z-30 hidden border-b border-gold/20 bg-midnight/95 backdrop-blur lg:top-20 lg:block">
        <ul className="wrap flex gap-10 py-4 text-[0.78rem] uppercase tracking-[0.14em] text-ivory/75">
          {solutions.map((s) => <li key={s.id}><a href={`#${s.id}`} className="hover:text-gold">{s.title}</a></li>)}
        </ul>
      </nav>

      {solutions.map((s, i) => {
        const light = i % 2 === 1;
        return (
          <section key={s.id} id={s.id} className={`section ${light ? "section-ivory" : i === 0 ? "section-black" : "section-navy"}`}>
            <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-20">
              <div className={`lg:col-span-5 ${i % 2 ? "lg:order-2" : ""}`}>
                <p className="eyebrow">Solution {s.letter}</p>
                <h2 className="h2 mt-4">{s.title}</h2>
                <span className="rule mt-7" />
                <div className="relative mt-10 aspect-[4/3]"><Photo slot={s.slot} sizes="(min-width:1024px) 40vw, 100vw" /></div>
              </div>
              <div className="lg:col-span-7">
                <Block title="The requirement" tone={light}><p>{s.type}</p></Block>
                <Block title="What to share with us" tone={light}>
                  <ul className="list-none space-y-2">{s.provide.map((p) => <li key={p} className="flex gap-3"><span aria-hidden="true" className="mt-[0.8em] h-px w-4 shrink-0 bg-gold" />{p}</li>)}</ul>
                </Block>
                <Block title="How we coordinate" tone={light}><p>{s.coordinate}</p></Block>
                <Block title="What influences aircraft and pricing" tone={light}><p>{s.factors}</p></Block>
                <Link href={enquiryHref(s.params)} className={`btn mt-4 ${light ? "btn-dark" : "btn-gold"}`}>{s.cta}<ArrowRight size={16} aria-hidden="true" /></Link>
              </div>
            </div>
          </section>
        );
      })}

      <CtaBand title="Not Sure Which Fits?" text="Describe what you have in mind. We will help shape it into an enquiry operators can respond to." />
      <Disclaimer />
    </>
  );
}

function Block({ title, children, tone }: { title: string; children: React.ReactNode; tone: boolean }) {
  return (
    <div className="hairline-top mb-8 pt-6">
      <h3 className="eyebrow !text-[0.74rem]">{title}</h3>
      <div className={`mt-3 ${tone ? "text-grey-deep" : "text-ivory/78"}`}>{children}</div>
    </div>
  );
}

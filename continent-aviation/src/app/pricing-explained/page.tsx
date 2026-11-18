import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CtaBand, Disclaimer, Faq, PageHero, SectionHead, enquiryHref } from "@/components/ui";
import { pageMeta } from "@/lib/metadata";

export const metadata = pageMeta("/pricing-explained", "How Charter Pricing Works", "What drives the cost of a private jet or helicopter charter in India: flight time, positioning, handling, taxes and timing. No prices, just a clear explanation.");

const drivers = [
  ["Flight time and aircraft", "Larger aircraft and longer flights generally cost more. The operator prices on the aircraft you fly and the time it is in the air."],
  ["Positioning", "If the aircraft is not already where you are flying from, it must fly there, and sometimes fly back empty afterwards. These legs can form part of the quote."],
  ["Waiting and overnight stays", "Time on the ground at your destination, crew rest and overnight stays can add cost. A one-way trip and a return trip are priced differently."],
  ["Airport, landing and handling", "Landing, parking, ground handling and similar charges vary by airport and by your arrival and departure times."],
  ["Taxes and fuel", "Applicable taxes and fuel costs are part of the total. The quote shows what the operator includes."],
  ["Catering and extras", "Onboard catering, special requests and ground transport arrangements are priced separately where they apply."],
  ["Timing and demand", "Peak dates, such as wedding season and holidays, and short-notice requests can affect availability and price."],
  ["International and permissions", "Flights outside India, and some helicopter or restricted-area operations, involve permissions and additional charges."],
];

const tips = ["Tell us your dates and how flexible you are. A shift of a few hours or a day can open more options.", "Share the number of passengers and baggage early, so the operator quotes the right aircraft.", "Ask about one-way and return options. Sometimes a different shape of trip is more practical.", "If a date is fixed, enquire as early as you can."];

const faqs = [
  { q: "Do you publish prices?", a: <p>No. Prices depend on the operator, the aircraft, the route and the date, so any figure published in advance could mislead. Every quote is itemised, so you can see where the cost comes from.</p> },
  { q: "What are empty-leg flights?", a: <p>An empty leg is a flight an aircraft needs to make without passengers, for example returning to its base after dropping passengers off. Occasionally operators offer these at a different price. They are infrequent and depend on the operator&apos;s schedule, so we do not list them unless an operator offers one.</p> },
  { q: "Can the quote change?", a: <p>A quote is valid for the time shown. After it expires, or if your plans change, a new quote may be different.</p> },
  { q: "Is there a fee for using Continent Aviation?", a: <p>Any fee or commission is stated in your quote or explained before you accept, so there are no surprises.</p> },
];

export default function Page() {
  return (
    <>
      <PageHero slot="jets" crumbs={[{ label: "Pricing Explained" }]} eyebrow="Pricing Explained"
        title="What Shapes the Cost of a Charter."
        description="No guessing and no headline prices. Here is what goes into a quote, so you can read one with confidence."
        actions={<Link href={enquiryHref({})} className="btn btn-gold">Request a Quote<ArrowRight size={16} aria-hidden="true" /></Link>} />

      <section className="section section-ivory">
        <div className="wrap">
          <SectionHead eyebrow="Cost drivers" title="Eight things that move the price." />
          <dl className="mt-16 grid gap-x-16 gap-y-2 md:grid-cols-2">
            {drivers.map(([t, d]) => <div key={t} className="hairline-top py-6"><dt className="font-serif text-2xl">{t}</dt><dd className="mt-2 text-grey-deep">{d}</dd></div>)}
          </dl>
        </div>
      </section>

      <section className="section section-black">
        <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5"><SectionHead eyebrow="Getting it right" title="How to get a more useful quote." /></div>
          <ul className="lg:col-span-7">{tips.map((x) => <li key={x} className="hairline-top flex gap-5 py-5 text-lg"><span aria-hidden="true" className="mt-[0.85em] h-px w-6 shrink-0 bg-gold" />{x}</li>)}</ul>
        </div>
      </section>

      <section className="section section-ivory">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-4"><SectionHead eyebrow="Questions" title="Pricing questions." /></div>
          <div className="lg:col-span-8"><Faq items={faqs} /></div>
        </div>
      </section>
      <CtaBand title="See What Your Journey Would Look Like." text="Share your requirements. You will receive an itemised quote from the operator." primary={{ href: enquiryHref({}), label: "Request a Quote" }} secondary={{ href: "/example-quote", label: "See an Example Quote" }} />
      <Disclaimer />
    </>
  );
}

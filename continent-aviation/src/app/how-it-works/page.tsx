import { CtaBand, Disclaimer, Faq, PageHero, SectionHead } from "@/components/ui";
import { Steps } from "@/components/Steps";
import { pageMeta } from "@/lib/metadata";

export const metadata = pageMeta("/how-it-works", "How Charter Arrangements Work", "How a Continent Aviation charter enquiry progresses, from your request to operator quotations and booking, and what each status means.");

const process = [
  ["Client submits a charter enquiry", "You share your route, dates, passenger count and preferences using the enquiry form."],
  ["Continent Aviation reviews the requirement", "We check the details for completeness and may contact you to clarify points such as airports, timings or baggage."],
  ["Suitable operators are approached", "We request options from aviation operators that appear relevant to your route and requirements."],
  ["Operators confirm potential options and quotations", "Operators indicate which aircraft they could offer and provide quotations on their own terms."],
  ["Details and conditions are communicated to you", "We share the options, indicative pricing where provided, and the operator's conditions, so you can decide with the information in front of you."],
  ["Booking documentation and payment follow the agreed terms", "If you choose to proceed, the selected operator and you proceed with booking documentation and payment according to your agreed terms."],
  ["The contracted operator executes the flight", "Flight operations remain the responsibility of the contracted operator."],
];

const statuses = [
  ["Enquiry received", "We have your request. No operator has been contacted and nothing is reserved."],
  ["Operator contacted", "We have asked one or more operators about your requirement. No availability is implied."],
  ["Quote received", "An operator has provided a quotation. It may be indicative and may change until confirmed."],
  ["Availability confirmed", "The operator has confirmed that the aircraft is available for your dates and route, on stated terms."],
  ["Booking confirmed", "Documentation and payment have been completed under the operator's terms and the operator has confirmed the booking."],
];

const faqs = [
  { q: "Does Continent Aviation own aircraft?", a: <p>No. We do not own or operate aircraft. We coordinate charter enquiries with independent aviation operators, and the contracted operator is responsible for the flight.</p> },
  { q: "How are quotes obtained?", a: <p>After reviewing your requirement we approach relevant operators, who respond with the aircraft they could offer and their pricing. We share these responses with you.</p> },
  { q: "What information is needed for a quote?", a: <p>Departure and destination, travel dates and timings, passenger numbers, and any baggage or special requirements. For return and multi-city trips, details of each leg help operators quote accurately.</p> },
  { q: "Are the prices fixed?", a: <p>Not until confirmed by the operator. Indicative quotes can change with availability, fuel, airport and handling charges, taxes and the timing of confirmation.</p> },
  { q: "How far in advance should I enquire?", a: <p>As early as you can. Earlier enquiries typically allow more options to be explored, though shorter-notice requests are welcome and may sometimes be possible. Availability cannot be assumed.</p> },
  { q: "How do payment and cancellation terms work?", a: <p>Payment and cancellation terms are set by the operator and recorded in the booking documentation. These can differ between operators, so please review them before confirming. Nothing is binding until you accept an operator&apos;s terms.</p> },
];

export default function Page() {
  return (
    <>
      <PageHero slot="apron" crumbs={[{ label: "How It Works" }]} eyebrow="How It Works"
        title="A Clearer Way to Arrange Your Charter."
        description="From first enquiry to confirmed booking, here is what happens, who is responsible at each stage, and what each status means." />

      <section className="section section-ivory">
        <div className="wrap">
          <SectionHead eyebrow="At a glance" title="Four steps." />
          <div className="mt-16"><Steps tone="ivory" /></div>
        </div>
      </section>

      <section className="section section-black">
        <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-4"><SectionHead eyebrow="In detail" title="The full process." /></div>
          <ol className="lg:col-span-8">
            {process.map(([t, d], i) => (
              <li key={t} className="hairline-top grid gap-3 py-7 sm:grid-cols-[4.5rem_1fr]">
                <span className="font-serif text-4xl leading-none text-gold">{String(i + 1).padStart(2, "0")}</span>
                <div><h3 className="h3">{t}</h3><p className="mt-3 text-ivory/72">{d}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section-navy">
        <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-4">
            <SectionHead eyebrow="Status" title="What each stage means.">
              <p>An enquiry is never described as booked until the operator has confirmed the booking.</p>
            </SectionHead>
          </div>
          <dl className="lg:col-span-8">
            {statuses.map(([t, d], i) => (
              <div key={t} className="hairline-top grid gap-2 py-6 sm:grid-cols-[17rem_1fr] sm:gap-8">
                <dt className="flex items-baseline gap-4 font-serif text-2xl"><span className="text-sm text-gold">{i + 1}</span>{t}</dt>
                <dd className="text-ivory/72">{d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section section-ivory">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-4"><SectionHead eyebrow="Questions" title="Transparent answers." /></div>
          <div className="lg:col-span-8"><Faq items={faqs} /></div>
        </div>
      </section>

      <CtaBand title="Ready When You Are." text="Share your requirements and we will begin by reviewing them with you." />
      <Disclaimer />
    </>
  );
}

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CtaBand, Disclaimer, Faq, PageHero, SectionHead, enquiryHref } from "@/components/ui";
import { STATUSES, STATUS_LABEL, STATUS_MEANING } from "@/lib/status";
import { QUOTE_VALID_HOURS } from "@/config/site";
import { pageMeta } from "@/lib/metadata";

export const metadata = pageMeta("/how-we-quote", "How We Quote", "How a Continent Aviation quote works: from your enquiry to the operator's itemised quote, its 48-hour validity, and paying the operator directly.");

const steps = [
  ["You send an enquiry", "Tell us your route, dates, passengers and preferences. Nothing is reserved at this point."],
  ["We check with the operator", "We ask the relevant operator whether they can fly your request. We do not show availability until the operator has answered."],
  ["We send you a quote", `If the operator can fly it, you receive a private quote page with the aircraft, the operator's name, itemised costs, terms and a ${QUOTE_VALID_HOURS}-hour validity.`],
  ["You accept, or let it lapse", "Accepting records that you wish to proceed. If the time passes, the quote expires and you are welcome to ask again."],
  ["You pay the operator", "After you accept, the quote page shows the operator's payment instructions. You pay the operator directly, under the operator's terms. This website does not take payment."],
  ["The operator confirms", "Your charter is confirmed only when the operator confirms. We then email you the confirmation."],
];

const inQuote = ["The aircraft and its passenger capacity", "The operator's name", "Itemised costs and the total", "The operator's terms, including cancellation and changes", `How long the quote is valid (${QUOTE_VALID_HOURS} hours)`, "How to pay the operator"];

const faqs = [
  { q: "Is the quote a binding price?", a: <p>A quote is the operator&apos;s offer for the details you gave. It is valid for the time shown and can change if your plans change or once it expires. The operator&apos;s terms apply once you accept and the operator confirms.</p> },
  { q: "Who do I pay?", a: <p>You pay the operator directly, using the instructions on your quote page after you accept. Continent Aviation does not take payment through this website.</p> },
  { q: "Why does the quote expire?", a: <p>Aircraft availability and operating costs change. A short validity keeps the quote accurate and avoids holding an aircraft that is not confirmed.</p> },
  { q: "What if the operator cannot fly my request?", a: <p>We will tell you. You can send a new enquiry with different dates, times or aircraft, and we will check again.</p> },
  { q: "Can I change my plans after accepting?", a: <p>Changes and cancellations follow the operator&apos;s terms, which are shown on your quote. Contact us as soon as you know, and we will raise it with the operator.</p> },
  { q: "How quickly will I hear back?", a: <p>We review each enquiry individually and aim to respond promptly, but operator replies take time and cannot be guaranteed. We will keep you updated through the stages below.</p> },
];

export default function Page() {
  return (
    <>
      <PageHero slot="interior" crumbs={[{ label: "How We Quote" }]} eyebrow="How We Quote"
        title="A Quote You Can Follow, Step by Step."
        description="Clear stages, a named operator, itemised costs, and no payment taken on this website."
        actions={<Link href={enquiryHref({})} className="btn btn-gold">Request a Quote<ArrowRight size={16} aria-hidden="true" /></Link>} />

      <section className="section section-ivory">
        <div className="wrap">
          <SectionHead eyebrow="The journey" title="From enquiry to confirmed charter." />
          <ol className="mt-16 grid gap-x-12 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
            {steps.map(([t, d], i) => (
              <li key={t} className="hairline-top pt-6"><p className="font-serif text-5xl leading-none text-gold-deep">{String(i + 1).padStart(2, "0")}</p><h3 className="h3 mt-5">{t}</h3><p className="mt-3 text-grey-deep">{d}</p></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section-black">
        <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <SectionHead eyebrow="What you receive" title="What a quote includes.">
              <p>Every quote is shown on a private page, with the same layout every time.</p>
            </SectionHead>
            <Link href="/example-quote" className="link-arrow mt-10">See an example quote<ArrowRight size={14} aria-hidden="true" /></Link>
          </div>
          <ul className="lg:col-span-7">
            {inQuote.map((x) => <li key={x} className="hairline-top flex gap-5 py-5 text-lg"><span aria-hidden="true" className="mt-[0.85em] h-px w-6 shrink-0 bg-gold" />{x}</li>)}
          </ul>
        </div>
      </section>

      <section className="section section-navy">
        <div className="wrap">
          <SectionHead eyebrow="Statuses" title="What each stage means.">
            <p>You can see where your enquiry stands on your quote page. An enquiry is never described as booked until the operator confirms.</p>
          </SectionHead>
          <dl className="mt-14 grid gap-x-16 md:grid-cols-2">
            {STATUSES.filter((s) => !["cancelled"].includes(s)).map((s) => (
              <div key={s} className="hairline-top py-5"><dt className="font-serif text-2xl">{STATUS_LABEL[s]}</dt><dd className="mt-2 text-ivory/72">{STATUS_MEANING[s]}</dd></div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section section-ivory">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-4"><SectionHead eyebrow="Questions" title="Quote questions, answered." /></div>
          <div className="lg:col-span-8"><Faq items={faqs} /></div>
        </div>
      </section>

      <CtaBand title="Ask for a Quote." text="Share your route, dates and passenger numbers. We will check with the operator and come back to you." primary={{ href: enquiryHref({}), label: "Request a Quote" }} secondary={{ href: "/pricing-explained", label: "How Pricing Works" }} />
      <Disclaimer />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, Disclaimer } from "@/components/ui";
import { QUOTE_VALID_HOURS } from "@/config/site";
import { pageMeta } from "@/lib/metadata";

export const metadata: Metadata = pageMeta("/example-quote", "Example Quote", "A sample of the private quote page a client receives. Layout only: all values are placeholders, not prices.");

const lines = ["Charter fare", "Positioning of the aircraft", "Airport, landing and handling charges", "Taxes"];

export default function Page() {
  return (
    <>
      <section className="bg-midnight pb-10 pt-36 md:pt-44">
        <div className="wrap wrap-narrow">
          <Breadcrumbs trail={[{ href: "/how-we-quote", label: "How We Quote" }, { label: "Example quote" }]} />
          <p className="eyebrow mt-8">Example only</p>
          <h1 className="h2 mt-3 !text-[clamp(2.2rem,5vw,3.8rem)]">What your quote looks like.</h1>
          <p className="lead mt-5">This page shows the layout of a quote. Every amount below is a placeholder, not a price, and no aircraft is being offered.</p>
        </div>
      </section>
      <section className="bg-midnight pb-24">
        <div className="wrap wrap-narrow space-y-8">
          <div role="note" className="border border-gold/60 bg-gold/10 p-4 text-sm text-gold">EXAMPLE: layout only. Placeholder amounts. Not an offer.</div>
          <article className="border border-gold/35 bg-navy p-6 md:p-10" aria-labelledby="eq">
            <p className="eyebrow">Quote</p>
            <h2 id="eq" className="mt-3 font-serif text-4xl">Aircraft type, passenger capacity</h2>
            <p className="mt-2 text-ivory/80">Operated by [operator name]</p>
            <p className="mt-2 text-sm text-grey">Mumbai to Udaipur · [date] · [passengers]</p>
            <table className="mt-8 w-full text-left text-[0.95rem]"><caption className="sr-only">Example itemised costs</caption><tbody>
              {lines.map((l) => <tr key={l} className="border-t border-ivory/15"><th scope="row" className="py-3 pr-4 font-normal text-ivory/85">{l}</th><td className="py-3 text-right text-grey">₹ •,••,•••</td></tr>)}
            </tbody></table>
            <div className="mt-6 flex items-baseline justify-between gap-6 border-t border-gold/40 pt-5"><span className="text-[0.78rem] uppercase tracking-[0.14em] text-grey">Total</span><span className="font-serif text-3xl text-gold">₹ •,••,•••</span></div>
            <p className="mt-6 text-sm text-grey">Quoted prices are provided by the operator and may change until the charter is confirmed. This quote is valid for {QUOTE_VALID_HOURS} hours from the time it is sent. A countdown shows the time left.</p>
          </article>
          <section aria-labelledby="et"><h2 id="et" className="font-serif text-2xl">Operator terms</h2><p className="mt-3 text-ivory/80">The operator&apos;s cancellation, change and refund terms appear here in full, so you can read them before you accept.</p></section>
          <section className="border border-gold/35 p-6" aria-labelledby="ep"><h2 id="ep" className="font-serif text-2xl">How to pay the operator</h2><p className="mt-3 text-ivory/85">After you accept, the operator&apos;s payment instructions appear here. You pay the operator directly. This website does not take payment.</p></section>
          <div className="border-t border-gold/35 pt-8"><p className="mb-5 text-ivory/85">By accepting, you tell us you wish to proceed on the terms above. Nothing is booked until the operator confirms.</p><span className="btn btn-gold opacity-60" aria-disabled="true">Accept this quote (example)</span></div>
          <p className="text-sm text-grey">Want the details of each stage? Read <Link className="text-gold underline underline-offset-4" href="/how-we-quote">How We Quote</Link>.</p>
        </div>
      </section>
      <Disclaimer />
    </>
  );
}

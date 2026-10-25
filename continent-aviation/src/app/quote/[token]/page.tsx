import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, Disclaimer } from "@/components/ui";
import { Countdown } from "@/components/Countdown";
import { expireOverdue, getEnquiry, getQuoteByToken, history } from "@/lib/db/repo";
import { dbConfigured } from "@/lib/db/client";
import { mail } from "@/lib/email";
import { STATUS_LABEL, TIMELINE, STATUS_MEANING, type Status } from "@/lib/status";
import { site } from "@/config/site";
import { accept } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Your quote", robots: { index: false, follow: false, nocache: true } };

const when = (d: Date) => d.toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short", timeZone: "Asia/Kolkata" }) + " IST";

export default async function Page({ params, searchParams }: { params: Promise<{ token: string }>; searchParams: Promise<{ r?: string }> }) {
  if (!dbConfigured()) notFound();
  const { token } = await params;
  const { r } = await searchParams;
  const expired = await expireOverdue();
  if (expired.length) await Promise.allSettled(expired.map((e) => mail.expired(e)));
  const q = await getQuoteByToken(token);
  if (!q) notFound();
  const e = await getEnquiry(q.enquiryId);
  if (!e) notFound();
  const hist = await history(e.id);

  const live = q.status === "sent" && q.expiresAt.getTime() > Date.now();
  const accepted = q.status === "accepted";
  const expiredNow = q.status === "expired" || (q.status === "sent" && !live);
  const superseded = q.status === "superseded";
  const reached = new Set<Status>(hist.map((h) => h.status));
  const current = e.status;

  const notice =
    r === "accepted" ? { ok: true, text: "Thank you. We have recorded your acceptance. Please follow the payment instructions below. Your charter is confirmed only when the operator confirms payment." } :
    r === "expired" ? { ok: false, text: "This quote has expired, so it can no longer be accepted. Please send a new enquiry." } :
    r === "already" ? { ok: true, text: "This quote has already been accepted." } :
    r === "busy" ? { ok: false, text: "Please wait a moment and try again." } : null;

  return (
    <>
      <section className="bg-midnight pb-10 pt-36 md:pt-44">
        <div className="wrap wrap-narrow">
          <Breadcrumbs trail={[{ label: "Your quote" }]} />
          <p className="eyebrow mt-8">Reference {e.reference}</p>
          <h1 className="h2 mt-3 !text-[clamp(2.2rem,5vw,3.8rem)]">Your charter quote</h1>
          <p className="lead mt-5">{e.from} to {e.to}{e.departDate ? `, ${e.departDate}` : ""}{e.passengers ? `, ${e.passengers} passenger${e.passengers > 1 ? "s" : ""}` : ""}</p>
        </div>
      </section>

      <section className="bg-midnight pb-24">
        <div className="wrap wrap-narrow space-y-10">
          {notice && <p role="status" className={`border p-5 ${notice.ok ? "border-[#9be09b]/60" : "border-[#e58b82]/60"}`}>{notice.text}</p>}

          {/* Progress */}
          <ol aria-label="Progress" className="grid grid-cols-3 gap-y-5 border-y border-gold/25 py-6 text-[0.78rem] uppercase tracking-[0.1em] sm:grid-cols-6">
            {TIMELINE.map((s) => {
              const done = reached.has(s); const now = current === s;
              return <li key={s} aria-current={now ? "step" : undefined} className={`flex items-center gap-2 ${now ? "text-gold" : done ? "text-ivory" : "text-grey"}`}><span aria-hidden="true" className={`h-2 w-2 rounded-full ${now ? "bg-gold" : done ? "bg-ivory" : "bg-grey/50"}`} />{STATUS_LABEL[s]}</li>;
            })}
          </ol>
          <p className="-mt-4 text-sm text-grey">{STATUS_MEANING[current]}</p>

          {superseded && <p className="border border-gold/50 p-5">A newer quote has been sent for this enquiry. Please use the link in the most recent email.</p>}
          {expiredNow && !superseded && <div className="border border-[#e58b82]/60 p-6"><h2 className="font-serif text-2xl">This quote has expired</h2><p className="mt-2 text-ivory/80">Availability and prices change, so we would need to check again.</p><Link href="/request-a-charter" className="btn btn-gold mt-5">Send a new enquiry</Link></div>}

          <article className="border border-gold/35 bg-navy p-6 md:p-10" aria-labelledby="qt">
            <p className="eyebrow">Quote</p>
            <h2 id="qt" className="mt-3 font-serif text-4xl">{q.aircraftLabel}</h2>
            {q.operatorName && <p className="mt-2 text-ivory/80">Operated by {q.operatorName}</p>}
            {q.lines.length > 0 && (
              <table className="mt-8 w-full text-left text-[0.95rem]"><caption className="sr-only">Itemised costs</caption><tbody>
                {q.lines.map((l, i) => <tr key={i} className="border-t border-ivory/15"><th scope="row" className="py-3 pr-4 font-normal text-ivory/85">{l.label}</th><td className="py-3 text-right">{l.amount}</td></tr>)}
              </tbody></table>
            )}
            <div className="mt-6 flex items-baseline justify-between gap-6 border-t border-gold/40 pt-5"><span className="text-[0.78rem] uppercase tracking-[0.14em] text-grey">Total</span><span className="font-serif text-3xl text-gold">{q.totalText}</span></div>
            <p className="mt-6 text-sm text-grey">Quoted prices are provided by the operator and may change until the charter is confirmed. {live ? <>This quote is valid until <strong className="text-ivory">{when(q.expiresAt)}</strong>.</> : null}</p>
            {live && <p className="mt-2 text-sm"><Countdown to={q.expiresAt.toISOString()} /></p>}
          </article>

          {q.terms && <section aria-labelledby="tm"><h2 id="tm" className="font-serif text-2xl">Operator terms</h2><p className="mt-3 whitespace-pre-line text-ivory/80">{q.terms}</p></section>}

          {accepted && q.paymentInstructions && (
            <section aria-labelledby="pi" className="border border-gold/35 p-6"><h2 id="pi" className="font-serif text-2xl">How to pay the operator</h2><p className="mt-3 whitespace-pre-line text-ivory/85">{q.paymentInstructions}</p><p className="mt-4 text-sm text-grey">Payment is made to the operator under the operator&apos;s terms. Continent Aviation does not take payment on this website.</p></section>
          )}
          {!accepted && q.paymentInstructions && live && <p className="text-sm text-grey">Payment instructions are shown after you accept the quote.</p>}

          {live && (
            <form action={accept} className="border-t border-gold/35 pt-8">
              <input type="hidden" name="token" value={token} />
              <p className="mb-5 text-ivory/85">By accepting, you tell us you wish to proceed on the terms above. Nothing is booked until the operator confirms. You pay the operator directly.</p>
              <button type="submit" className="btn btn-gold">Accept this quote</button>
            </form>
          )}

          <p className="text-sm text-grey">Questions? {site.contact.email ? <>Write to <a className="text-gold underline underline-offset-4" href={`mailto:${site.contact.email}`}>{site.contact.email}</a>.</> : <>Reply to the email we sent you.</>}</p>
        </div>
      </section>
      <Disclaimer />
    </>
  );
}

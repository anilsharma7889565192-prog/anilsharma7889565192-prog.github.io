import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { emailLog, getEnquiry, history, quotesFor } from "@/lib/db/repo";
import { STATUS_LABEL, STATUS_MEANING } from "@/lib/status";
import { QUOTE_VALID_HOURS } from "@/config/site";
import { operators } from "@/config/operators";
import { Badge } from "@/components/admin/Badge";
import { cancelEnquiry, confirmBooking, decline, markChecking, markPaid, saveNote, sendQuote } from "../../actions";

export const dynamic = "force-dynamic";

const when = (d: Date) => d.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });
const Row = ({ k, v }: { k: string; v?: string | number | null }) => v ? <div className="grid grid-cols-[10rem_1fr] gap-3 py-1.5"><dt className="text-grey">{k}</dt><dd>{String(v)}</dd></div> : null;
const Box = ({ title, children, id }: { title: string; children: React.ReactNode; id?: string }) => <section id={id} className="border border-ivory/15 p-6"><h2 className="font-serif text-2xl">{title}</h2><div className="mt-4">{children}</div></section>;
const Btn = ({ children, kind = "gold" }: { children: React.ReactNode; kind?: "gold" | "ghost" }) => <button type="submit" className={`btn ${kind === "gold" ? "btn-gold" : "btn-ghost"} !min-h-[2.6rem]`}>{children}</button>;
const Lbl = ({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) => <label htmlFor={htmlFor} className="mb-1.5 block text-[0.74rem] uppercase tracking-[0.1em]">{children}</label>;

export default async function Page({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ msg?: string; err?: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const { msg, err } = await searchParams;
  const e = await getEnquiry(id);
  if (!e) notFound();
  const [hist, quotes, mails] = await Promise.all([history(id), quotesFor(id), emailLog(id)]);
  const d = e.data as Record<string, string>;
  const st = e.status;
  const canCheck = st === "received" || st === "expired";
  const canQuote = ["received", "checking", "quoted", "expired"].includes(st);
  const canDecline = canQuote;
  const canPaid = st === "accepted";
  const canConfirm = st === "accepted" || st === "paid";
  const canCancel = !["declined", "cancelled", "confirmed"].includes(st);

  return (
    <>
      <Link href="/admin" className="text-sm text-grey hover:text-gold">← All enquiries</Link>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <h1 className="h2 !text-4xl">{e.reference}</h1><Badge s={st} />
      </div>
      <p className="mt-2 max-w-2xl text-grey">{STATUS_MEANING[st]}</p>
      {msg && <p role="status" className="mt-6 border border-[#9be09b]/50 p-4 text-[0.95rem]">{msg}</p>}
      {err && <p role="alert" className="mt-6 border border-[#e58b82]/60 p-4 text-[0.95rem]">{err}</p>}

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-7">
          <Box title="Enquiry">
            <dl className="text-[0.95rem]">
              <Row k="Client" v={e.clientName} /><Row k="Email" v={e.clientEmail} /><Row k="Phone" v={e.clientPhone} /><Row k="Company" v={d.company} /><Row k="Preferred contact" v={d.contactMethod} />
              <Row k="Aircraft preference" v={e.aircraft} /><Row k="Trip type" v={d.tripType} /><Row k="From" v={e.from} /><Row k="To" v={e.to} />
              <Row k="Departure" v={[e.departDate, d.departTime].filter(Boolean).join(" ")} /><Row k="Return" v={[d.returnDate, d.returnTime].filter(Boolean).join(" ")} />
              <Row k="Passengers" v={e.passengers} /><Row k="Additional stops" v={d.additionalDestinations} /><Row k="Purpose" v={e.purpose} /><Row k="Baggage / special" v={d.baggage} /><Row k="Budget" v={d.budget} /><Row k="Notes" v={d.notes} />
              <Row k="Received" v={when(e.createdAt)} />
            </dl>
          </Box>

          {quotes.length > 0 && (
            <Box title="Quotes">
              <ul className="space-y-4">
                {quotes.map((q) => (
                  <li key={q.id} className="border border-ivory/10 p-4 text-[0.92rem]">
                    <div className="flex flex-wrap justify-between gap-2"><strong>{q.aircraftLabel}</strong><span className="uppercase tracking-[0.1em] text-grey text-xs">{q.status}</span></div>
                    <p className="mt-1 text-gold">{q.totalText}</p>
                    <p className="mt-1 text-grey">Operator: {q.operatorName ?? "not named"} · Sent {when(q.createdAt)} · {q.status === "sent" ? "Valid until" : "Expiry"} {when(q.expiresAt)}{q.acceptedAt ? ` · Accepted ${when(q.acceptedAt)}` : ""}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-grey">The client's private link was emailed to them. For security the link itself is not stored. To resend, create a new quote.</p>
            </Box>
          )}

          <Box title="History">
            <ol className="space-y-3 text-[0.92rem]">
              {hist.map((h, i) => <li key={i} className="flex gap-4"><span className="w-40 shrink-0 text-grey">{when(h.at)}</span><span><strong className="font-medium">{STATUS_LABEL[h.status]}</strong>{h.note ? <span className="text-ivory/75">: {h.note}</span> : null}</span></li>)}
            </ol>
          </Box>

          <Box title="Email log">
            {mails.length ? <ul className="space-y-1 text-[0.88rem]">{mails.map((m, i) => <li key={i} className="flex gap-3"><span className="w-40 shrink-0 text-grey">{when(m.at)}</span><span>{m.type} to {m.to}: {m.ok ? "sent" : <span className="text-[#f0a199]">not sent ({m.error})</span>}</span></li>)}</ul> : <p className="text-grey">No emails recorded.</p>}
          </Box>
        </div>

        <div className="space-y-8 lg:col-span-5">
          {canCheck && (
            <Box title="1. Ask the operator">
              <form action={markChecking} className="space-y-4"><input type="hidden" name="id" value={e.id} />
                <div className="field"><Lbl htmlFor="op">Operator asked</Lbl><input id="op" name="operatorName" list="ops" className="input" defaultValue={e.operatorName ?? ""} /><datalist id="ops">{operators.map((o) => <option key={o.id} value={o.name} />)}</datalist></div>
                <div className="field"><Lbl htmlFor="chknote">Note</Lbl><textarea id="chknote" name="note" rows={2} className="input" /></div>
                <Btn>Mark as checking</Btn>
              </form>
            </Box>
          )}

          {canQuote && (
            <Box title={st === "quoted" ? "Send a new quote" : "2. Approve with a quote"} id="quote">
              <p className="mb-4 text-sm text-grey">Sends the client a private link. The quote is valid for {QUOTE_VALID_HOURS} hours. Only send a quote the operator has confirmed.</p>
              <form action={sendQuote} className="space-y-4"><input type="hidden" name="id" value={e.id} />
                <div className="field"><Lbl htmlFor="ac">Aircraft (type and capacity)</Lbl><input id="ac" name="aircraftLabel" required className="input" placeholder="e.g. Dassault Falcon 2000LX, 9 passengers" /></div>
                <div className="field"><Lbl htmlFor="opn">Operator (shown to the client)</Lbl><input id="opn" name="operatorName" list="ops2" className="input" defaultValue={e.operatorName ?? ""} /><datalist id="ops2">{operators.map((o) => <option key={o.id} value={o.name} />)}</datalist></div>
                <div className="field"><Lbl htmlFor="lines">Itemised costs</Lbl><p id="lines-help" className="mb-2 text-xs text-grey">One per line, as: label | amount. For example: Charter fare | amount, then Positioning, Airport and handling, Taxes.</p><textarea id="lines" name="lines" rows={5} className="input" placeholder="Charter fare | amount" aria-describedby="lines-help" /></div>
                <div className="field"><Lbl htmlFor="total">Total shown to the client</Lbl><input id="total" name="totalText" required className="input" placeholder="e.g. ₹ ... (including taxes)" /></div>
                <div className="field"><Lbl htmlFor="terms">Operator terms (cancellation, changes, inclusions)</Lbl><textarea id="terms" name="terms" rows={4} className="input" /></div>
                <div className="field"><Lbl htmlFor="pay">Payment instructions (client pays the operator)</Lbl><textarea id="pay" name="paymentInstructions" rows={3} className="input" /></div>
                <Btn>Send quote</Btn>
              </form>
            </Box>
          )}

          {canPaid && (
            <Box title="3. Payment">
              <p className="mb-4 text-sm text-grey">The client accepted the quote. When the operator tells you payment has arrived, record it.</p>
              <form action={markPaid} className="space-y-4"><input type="hidden" name="id" value={e.id} /><div className="field"><Lbl htmlFor="pn">Note</Lbl><input id="pn" name="note" className="input" /></div><Btn>Operator confirmed payment</Btn></form>
            </Box>
          )}

          {canConfirm && (
            <Box title="4. Confirm booking">
              <p className="mb-4 text-sm text-grey">Sends the client a booking confirmation. Do this only once the operator has confirmed the charter.</p>
              <form action={confirmBooking} className="space-y-4"><input type="hidden" name="id" value={e.id} /><div className="field"><Lbl htmlFor="cn">Note</Lbl><input id="cn" name="note" className="input" /></div><Btn>Confirm booking</Btn></form>
            </Box>
          )}

          {canDecline && (
            <Box title="Not available">
              <form action={decline} className="space-y-4"><input type="hidden" name="id" value={e.id} /><div className="field"><Lbl htmlFor="dn">Message to the client (optional)</Lbl><textarea id="dn" name="note" rows={3} className="input" placeholder="For example, alternative dates or aircraft you could try." /></div><Btn kind="ghost">Decline and email client</Btn></form>
            </Box>
          )}

          <Box title="Internal note">
            <form action={saveNote} className="space-y-4"><input type="hidden" name="id" value={e.id} /><div className="field"><Lbl htmlFor="an">Visible only to you</Lbl><textarea id="an" name="adminNote" rows={3} className="input" defaultValue={(e.adminNote ?? "").trim()} /></div><Btn kind="ghost">Save note</Btn></form>
            {e.operatorNote && <p className="mt-4 text-sm text-grey">Operator note: {e.operatorNote}</p>}
          </Box>

          {canCancel && (
            <Box title="Cancel enquiry">
              <form action={cancelEnquiry} className="space-y-4"><input type="hidden" name="id" value={e.id} /><div className="field"><Lbl htmlFor="cc">Reason (internal)</Lbl><input id="cc" name="note" className="input" /></div><Btn kind="ghost">Cancel enquiry</Btn></form>
            </Box>
          )}
        </div>
      </div>
    </>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/admin/Badge";
import { requireAdmin } from "@/lib/auth";
import { enquiriesForEmail, getClientByEmail } from "@/lib/db/repo";
import { saveClientNotes } from "../actions";
import { ContactLinks } from "../ContactLinks";

export const dynamic = "force-dynamic";
const when = (d: Date | null) => (d ? d.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }) : "never");

export default async function Page({ params, searchParams }: { params: Promise<{ email: string }>; searchParams: Promise<{ saved?: string }> }) {
  await requireAdmin();
  const email = decodeURIComponent((await params).email).toLowerCase();
  const client = await getClientByEmail(email);
  if (!client) notFound();
  const enquiries = await enquiriesForEmail(email);
  const sp = await searchParams;
  return (
    <div>
      <Link href="/admin/clients" className="text-sm text-gold underline underline-offset-4">All clients</Link>
      <h1 className="mt-4 font-serif text-4xl">{client.name || client.email}</h1>
      <p className="mt-1 text-grey">{client.company ? `${client.company} · ` : ""}{client.email}</p>
      <div className="mt-5"><ContactLinks email={client.email} phone={client.phone} /></div>
      <dl className="mt-8 grid max-w-2xl grid-cols-2 gap-4 text-[0.9rem] sm:grid-cols-3">
        <div><dt className="text-[0.7rem] uppercase tracking-[0.14em] text-grey">First seen</dt><dd className="mt-1">{when(client.createdAt)}</dd></div>
        <div><dt className="text-[0.7rem] uppercase tracking-[0.14em] text-grey">Last enquiry</dt><dd className="mt-1">{when(client.lastEnquiryAt)}</dd></div>
        <div><dt className="text-[0.7rem] uppercase tracking-[0.14em] text-grey">Last sign-in</dt><dd className="mt-1">{when(client.lastLoginAt)}</dd></div>
      </dl>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <section>
          <h2 className="font-serif text-2xl">Private notes</h2>
          <p className="mt-1 text-sm text-grey">Only you can see these. Preferences, past requests, anything worth remembering.</p>
          {sp.saved && <p role="status" className="mt-3 text-sm text-[#9be09b]">Notes saved.</p>}
          <form action={saveClientNotes} className="mt-4 space-y-3">
            <input type="hidden" name="email" value={client.email} />
            <label className="sr-only" htmlFor="notes">Notes</label>
            <textarea id="notes" name="notes" rows={8} defaultValue={client.notes ?? ""} className="input !h-auto w-full" />
            <button type="submit" className="btn btn-ghost">Save notes</button>
          </form>
        </section>
        <section>
          <h2 className="font-serif text-2xl">Enquiries ({enquiries.length})</h2>
          <ul className="mt-4 divide-y divide-gold/15 border-y border-gold/15">
            {enquiries.map((e) => (
              <li key={e.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                <div><p className="font-medium">{e.from ?? "?"} to {e.to ?? "?"}</p><p className="text-sm text-grey">{e.reference} · {e.departDate ?? "no date"}{e.passengers ? ` · ${e.passengers} pax` : ""}</p></div>
                <div className="flex items-center gap-3"><Badge s={e.status} /><Link href={`/admin/enquiries/${e.id}`} className="text-gold underline underline-offset-4">Open</Link></div>
              </li>
            ))}
            {enquiries.length === 0 && <li className="py-4 text-grey">No enquiries from this client yet.</li>}
          </ul>
        </section>
      </div>
    </div>
  );
}

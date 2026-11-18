import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { listClients } from "@/lib/db/repo";
import { ContactLinks } from "./ContactLinks";

export const dynamic = "force-dynamic";

const when = (d: Date | null) => (d ? d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" }) : "never");

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  await requireAdmin();
  const { q } = await searchParams;
  const clients = await listClients(q);
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl">Clients</h1>
          <p className="mt-1 text-sm text-grey">Everyone who has sent an enquiry or signed in. Details are remembered for next time.</p>
        </div>
        <form className="flex gap-2" role="search">
          <label className="sr-only" htmlFor="cq">Search clients</label>
          <input id="cq" name="q" defaultValue={q ?? ""} placeholder="Name, email, phone or company" className="input !h-11 w-72 max-w-full" />
          <button className="btn btn-ghost !min-h-11" type="submit">Search</button>
        </form>
      </div>
      <div className="mt-8 overflow-x-auto border border-gold/20">
        <table className="w-full min-w-[46rem] text-left text-[0.9rem]">
          <thead className="border-b border-gold/25 text-[0.7rem] uppercase tracking-[0.14em] text-grey"><tr><th className="p-4">Client</th><th className="p-4">Contact</th><th className="p-4">Enquiries</th><th className="p-4">Last activity</th><th className="p-4"><span className="sr-only">Open</span></th></tr></thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.email} className="border-b border-gold/10 align-top">
                <td className="p-4"><p className="font-medium">{c.name || "No name yet"}</p><p className="text-grey">{c.company ? `${c.company} · ` : ""}{c.email}</p></td>
                <td className="p-4"><ContactLinks email={c.email} phone={c.phone} /></td>
                <td className="p-4">{c.enquiryCount ?? 0}</td>
                <td className="p-4 whitespace-nowrap text-grey">{when(c.lastEnquiryAt ?? c.lastLoginAt ?? c.createdAt)}</td>
                <td className="p-4 text-right"><Link href={`/admin/clients/${encodeURIComponent(c.email)}`} className="text-gold underline underline-offset-4">Open</Link></td>
              </tr>
            ))}
            {clients.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-grey">{q ? "No clients match that search." : "No clients yet. They appear here after their first enquiry or sign-in."}</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { expireOverdue, listEnquiries, statusCounts } from "@/lib/db/repo";
import { mail } from "@/lib/email";
import { OPEN, STATUSES, STATUS_LABEL } from "@/lib/status";
import { Badge } from "@/components/admin/Badge";

export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: { searchParams: Promise<{ status?: string; q?: string }> }) {
  await requireAdmin();
  const { status = "open", q = "" } = await searchParams;
  const expired = await expireOverdue();
  await Promise.allSettled(expired.map((e) => mail.expired(e)));

  const [counts, all] = await Promise.all([statusCounts(), listEnquiries({ q: q || undefined, limit: 300 })]);
  const rows = status === "open" ? all.filter((e) => OPEN.includes(e.status) || e.status === "expired") : status === "all" ? all : all.filter((e) => e.status === status);
  const openCount = OPEN.reduce((n, s) => n + (counts[s] ?? 0), 0);

  const chip = (key: string, label: string, n?: number) => (
    <Link key={key} href={`/admin?status=${key}${q ? `&q=${encodeURIComponent(q)}` : ""}`} aria-current={status === key ? "page" : undefined}
      className={`border px-3 py-1.5 text-[0.75rem] uppercase tracking-[0.12em] ${status === key ? "border-gold bg-gold/12 text-gold" : "border-ivory/20 text-ivory/80 hover:border-ivory/50"}`}>
      {label}{n !== undefined ? ` · ${n}` : ""}
    </Link>
  );

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Enquiries</p>
          <h1 className="h2 mt-2 !text-4xl">Charter enquiries</h1>
        </div>
        <form className="flex gap-2" role="search">
          <input type="hidden" name="status" value={status} />
          <label htmlFor="q" className="sr-only">Search enquiries</label>
          <input id="q" name="q" defaultValue={q} placeholder="Reference, name, email, route" className="input !min-h-[2.6rem] w-64" />
          <button className="btn btn-ghost !min-h-[2.6rem] !px-4" type="submit">Search</button>
        </form>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {chip("open", "Open", openCount)}
        {STATUSES.map((s) => chip(s, STATUS_LABEL[s], counts[s] ?? 0))}
        {chip("all", "All")}
      </div>

      <div className="mt-8 overflow-x-auto border border-ivory/15">
        <table className="w-full min-w-[56rem] text-left text-[0.92rem]">
          <thead className="border-b border-ivory/15 text-[0.72rem] uppercase tracking-[0.14em] text-grey">
            <tr><th className="p-4">Reference</th><th className="p-4">Client</th><th className="p-4">Route</th><th className="p-4">Date</th><th className="p-4">Pax</th><th className="p-4">Status</th><th className="p-4">Received</th></tr>
          </thead>
          <tbody>
            {rows.map((e) => (
              <tr key={e.id} className="border-b border-ivory/10 last:border-0 hover:bg-ivory/[0.03]">
                <td className="p-4"><Link className="text-gold underline underline-offset-4" href={`/admin/enquiries/${e.id}`}>{e.reference}</Link></td>
                <td className="p-4">{e.clientName}<div className="text-xs text-grey">{e.clientEmail}</div></td>
                <td className="p-4">{e.from} <span className="text-grey">to</span> {e.to}</td>
                <td className="p-4 whitespace-nowrap">{e.departDate}</td>
                <td className="p-4">{e.passengers}</td>
                <td className="p-4"><Badge s={e.status} /></td>
                <td className="p-4 whitespace-nowrap text-grey">{e.createdAt.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" })}</td>
              </tr>
            ))}
            {!rows.length && <tr><td colSpan={7} className="p-10 text-center text-grey">No enquiries here yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}

import { requireAdmin } from "@/lib/auth";
import { listAlerts } from "@/lib/db/repo";

export const dynamic = "force-dynamic";

export default async function Page() {
  await requireAdmin();
  const rows = await listAlerts();
  return (
    <>
      <p className="eyebrow">Route alerts</p>
      <h1 className="h2 mt-2 !text-4xl">Alert sign-ups</h1>
      <p className="mt-3 max-w-2xl text-grey">People who asked to be emailed when options on a route become available. Email only people who have not unsubscribed.</p>
      <div className="mt-8 overflow-x-auto border border-ivory/15">
        <table className="w-full min-w-[40rem] text-left text-[0.92rem]">
          <thead className="border-b border-ivory/15 text-[0.72rem] uppercase tracking-[0.14em] text-grey"><tr><th className="p-4">Email</th><th className="p-4">Route</th><th className="p-4">Signed up</th><th className="p-4">Status</th></tr></thead>
          <tbody>
            {rows.map((a, i) => (
              <tr key={i} className="border-b border-ivory/10 last:border-0">
                <td className="p-4">{a.email}</td><td className="p-4">{a.route ?? "Any route"}</td>
                <td className="p-4 text-grey">{a.createdAt.toLocaleDateString("en-IN", { dateStyle: "medium" })}</td>
                <td className="p-4">{a.unsubscribedAt ? <span className="text-grey">Unsubscribed</span> : "Active"}</td>
              </tr>
            ))}
            {!rows.length && <tr><td colSpan={4} className="p-10 text-center text-grey">No sign-ups yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}

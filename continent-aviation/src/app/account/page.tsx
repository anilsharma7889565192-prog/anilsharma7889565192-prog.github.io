import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/admin/Badge";
import { getClientSession } from "@/lib/auth";
import { dbConfigured } from "@/lib/db/client";
import { enquiriesForEmail, getClientByEmail } from "@/lib/db/repo";
import { STATUS_MEANING } from "@/lib/status";
import { AccountLoginForm } from "./AccountLoginForm";
import { saveProfile } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "My account", robots: { index: false, follow: false } };

const when = (d: Date) => d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });

export default async function Page({ searchParams }: { searchParams: Promise<{ error?: string; saved?: string }> }) {
  const sp = await searchParams;
  const session = await getClientSession();
  const ready = dbConfigured();
  const client = session && ready ? await getClientByEmail(session.email).catch(() => null) : null;
  const enquiries = session && ready ? await enquiriesForEmail(session.email).catch(() => []) : [];

  return (
    <section className="min-h-[70vh] bg-midnight pb-24 pt-36 md:pt-44">
      <div className="wrap wrap-narrow">
        <p className="eyebrow">My account</p>
        {!session ? (
          <>
            <h1 className="h2 mt-4 !text-[clamp(2.2rem,5vw,3.6rem)]">Sign in to follow your enquiries.</h1>
            <p className="lead mt-5">See the status of every enquiry in one place, and have your details filled in next time. We email you a one-time link, so there is no password to remember.</p>
            {sp.error && <p role="alert" className="mt-6 border border-[#e8a09a]/60 p-4 text-[0.92rem] text-[#e8a09a]">That sign-in link is not valid or has already been used. Please request a new one.</p>}
            {ready ? <AccountLoginForm /> : <p className="mt-8 border border-gold/50 p-4 text-[0.92rem] text-ivory/80">Accounts are not available right now. You can still <Link href="/request-a-charter" className="underline">send an enquiry</Link>.</p>}
          </>
        ) : (
          <>
            <h1 className="h2 mt-4 !text-[clamp(2.2rem,5vw,3.6rem)]">Welcome{client?.name ? `, ${client.name.split(" ")[0]}` : ""}.</h1>
            <p className="lead mt-3">Signed in as {session.email}.</p>
            {sp.saved && <p role="status" className="mt-6 border border-[#9be09b]/50 p-3 text-[0.9rem] text-[#9be09b]">Your details are saved.</p>}

            <div className="mt-12 grid gap-12 md:grid-cols-12">
              <div className="md:col-span-7">
                <h2 className="font-serif text-3xl">Your enquiries</h2>
                {enquiries.length === 0 ? (
                  <p className="mt-4 text-ivory/75">You have no enquiries yet. <Link href="/request-a-charter" className="underline">Request a charter</Link> and it will appear here.</p>
                ) : (
                  <ul className="mt-5 divide-y divide-gold/20 border-y border-gold/20">
                    {enquiries.map((e) => (
                      <li key={e.id} className="py-5">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <p className="font-serif text-xl">{e.from ?? "?"} <span className="text-gold">to</span> {e.to ?? "?"}</p>
                          <Badge s={e.status} />
                        </div>
                        <p className="mt-1 text-[0.84rem] text-grey">{e.reference} · {e.departDate ?? "date to be confirmed"} · sent {when(e.createdAt)}{e.passengers ? ` · ${e.passengers} passenger${e.passengers > 1 ? "s" : ""}` : ""}</p>
                        <p className="mt-2 text-[0.9rem] text-ivory/80">{STATUS_MEANING[e.status]}{e.status === "quoted" ? " Use the private link in the email we sent you." : ""}</p>
                      </li>
                    ))}
                  </ul>
                )}
                <Link href="/request-a-charter" className="btn btn-gold mt-8">New enquiry<ArrowRight size={16} aria-hidden="true" /></Link>
              </div>

              <div className="md:col-span-5">
                <h2 className="font-serif text-3xl">Your details</h2>
                <p className="mt-2 text-[0.88rem] text-grey">We use these to fill in your next enquiry and to contact you about it. Change them any time.</p>
                <form action={saveProfile} className="mt-5 space-y-4">
                  <div className="field"><label htmlFor="p-name">Full name</label><input id="p-name" name="name" className="input" autoComplete="name" defaultValue={client?.name ?? ""} /></div>
                  <div className="field"><label htmlFor="p-phone">Phone</label><input id="p-phone" name="phone" className="input" autoComplete="tel" defaultValue={client?.phone ?? ""} /></div>
                  <div className="field"><label htmlFor="p-company">Company <span className="opt">(optional)</span></label><input id="p-company" name="company" className="input" autoComplete="organization" defaultValue={client?.company ?? ""} /></div>
                  <button type="submit" className="btn btn-ghost">Save details</button>
                </form>
                <form action="/api/account/logout" method="post" className="mt-8"><button type="submit" className="text-[0.8rem] uppercase tracking-[0.14em] text-grey underline-offset-4 hover:text-gold hover:underline">Sign out</button></form>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

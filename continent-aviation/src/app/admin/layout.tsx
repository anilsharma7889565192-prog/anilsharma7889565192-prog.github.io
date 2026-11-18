import Link from "next/link";
import type { Metadata } from "next";
import { getAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdmin();
  return (
    <div className="min-h-screen bg-midnight text-ivory">
      <header className="border-b border-gold/25">
        <div className="wrap flex h-16 items-center justify-between gap-6">
          <Link href="/admin" className="font-serif text-xl tracking-[0.08em]">CONTINENT <span className="text-gold">AVIATION</span> <span className="ml-2 text-xs uppercase tracking-[0.2em] text-grey">Admin</span></Link>
          {admin && (
            <nav className="flex items-center gap-6 text-[0.8rem] uppercase tracking-[0.14em]">
              <Link href="/admin" className="hover:text-gold">Enquiries</Link>
              <Link href="/admin/alerts" className="hover:text-gold">Alerts</Link>
              <form action="/api/admin/logout" method="post"><button className="uppercase tracking-[0.14em] text-grey hover:text-gold" type="submit">Sign out</button></form>
            </nav>
          )}
        </div>
      </header>
      <div className="wrap py-10">{children}</div>
    </div>
  );
}

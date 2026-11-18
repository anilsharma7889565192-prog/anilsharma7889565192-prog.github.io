import type { Metadata } from "next";
import Link from "next/link";
import { dbConfigured } from "@/lib/db/client";
import { unsubscribeAlert } from "@/lib/db/repo";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Unsubscribe", robots: { index: false, follow: false } };

export default async function Page({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  const done = token && dbConfigured() ? await unsubscribeAlert(token).catch(() => false) : false;
  return (
    <section className="flex min-h-[70vh] items-center bg-midnight pt-32">
      <div className="wrap wrap-narrow">
        <p className="eyebrow">Route alerts</p>
        <h1 className="h2 mt-3 !text-4xl">{done ? "You have been unsubscribed." : "Nothing to unsubscribe."}</h1>
        <p className="lead mt-5">{done ? "We will no longer email you about this route." : "This link may already have been used, or it is not valid."}</p>
        <Link href="/" className="btn btn-ghost mt-8">Return home</Link>
      </div>
    </section>
  );
}

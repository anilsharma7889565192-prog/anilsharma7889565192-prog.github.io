import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[80vh] items-center bg-midnight pt-32">
      <div className="wrap">
        <p className="eyebrow">Error 404</p>
        <h1 className="display mt-4 !text-[clamp(2.6rem,7vw,5rem)]">This page is not on our route.</h1>
        <p className="lead mt-6">The page you were looking for does not exist or has moved.</p>
        <div className="mt-9 flex gap-4"><Link href="/" className="btn btn-gold">Return Home</Link><Link href="/request-a-charter" className="btn btn-ghost">Request a Charter</Link></div>
      </div>
    </section>
  );
}

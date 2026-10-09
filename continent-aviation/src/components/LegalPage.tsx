import type { ReactNode } from "react";
import { Breadcrumbs } from "./ui";

export function LegalPage({ title, label, updated, children }: { title: string; label: string; updated: string; children: ReactNode }) {
  return (
    <>
      <section className="bg-midnight pb-10 pt-36 md:pt-44">
        <div className="wrap wrap-narrow">
          <Breadcrumbs trail={[{ label }]} />
          <h1 className="h2 mt-8 !text-[clamp(2.4rem,6vw,4.2rem)]">{title}</h1>
          <p className="mt-5 text-sm text-grey">Last updated: {updated}</p>
        </div>
      </section>
      <section className="section-black pb-24 md:pb-32">
        <div className="wrap wrap-narrow"><div className="prose-lux border-t border-gold/35 pt-4">{children}</div></div>
      </section>
    </>
  );
}

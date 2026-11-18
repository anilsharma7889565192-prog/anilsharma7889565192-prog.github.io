import { Breadcrumbs, CtaBand, Disclaimer } from "@/components/ui";
import { FleetSection } from "@/components/fleet/FleetSection";
import { pageMeta } from "@/lib/metadata";

export const metadata = pageMeta("/fleet", "Fleet: Private Jets and Helicopters", "Search the private jets, turboprops and helicopters we arrange through our partner operators in India, filter by type, operator and size, and preview each cabin.");

export default function Page() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-[#0b6fb3] pb-16 pt-36 text-white md:pb-20 md:pt-44">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/sky.jpg" alt="" aria-hidden="true" className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(4,40,80,.55),rgba(4,40,80,.1)_55%,rgba(4,40,80,.4))]" aria-hidden="true" />
        <div className="wrap">
          <Breadcrumbs trail={[{ label: "Fleet" }]} />
          <p className="eyebrow mt-8 !text-white">Our Fleet</p>
          <h1 className="h2 mt-3 max-w-3xl !text-[clamp(2.4rem,6vw,4.6rem)]">Private jets and helicopters, through our operators.</h1>
          <p className="lead mt-5 max-w-2xl !text-white/90">Search and filter the aircraft available through our partner operators, then preview the cabin. The operator confirms availability and price for your dates.</p>
        </div>
      </section>

      <section className="bg-[#f4f8fb] py-14 md:py-20">
        <div className="wrap">
          <FleetSection />
          <p className="mt-10 max-w-3xl border-l-2 border-[#2aa7e8] pl-5 text-[0.9rem] text-grey-deep">Helicopter landings depend on permissions, site suitability, operator approval and operational feasibility. We confirm these with the operator before any quote is issued.</p>
        </div>
      </section>
      <CtaBand />
      <Disclaimer />
    </>
  );
}

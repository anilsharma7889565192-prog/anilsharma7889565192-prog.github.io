import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CtaBand, Disclaimer, PageHero, SectionHead } from "@/components/ui";
import { pageMeta } from "@/lib/metadata";

export const metadata = pageMeta("/about", "About Continent Aviation", "Continent Aviation coordinates private jet and helicopter charter enquiries by connecting travel requirements with relevant aviation operators.");

export default function Page() {
  return (
    <>
      <PageHero slot="about" crumbs={[{ label: "About" }]} eyebrow="About Continent Aviation"
        title="Bringing Clarity to Private Aviation Arrangements."
        description="Private aviation arrangements should begin with a clear understanding of the client's journey." />

      <section className="section section-ivory">
        <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5"><SectionHead eyebrow="Our approach" title="Begin with the journey." /></div>
          <div className="space-y-6 text-[1.1rem] text-midnight/85 lg:col-span-7 lg:pt-3">
            <p>Continent Aviation was established around a straightforward idea: private aviation arrangements should begin with a clear understanding of the client&apos;s journey.</p>
            <p>We coordinate charter enquiries by connecting travel requirements with relevant aviation operators. Our focus is on understanding the route, schedule, passenger needs and preferences, then working with suitable providers to explore available options.</p>
            <p>Our approach is built around responsive communication, tailored sourcing and clarity throughout the enquiry process.</p>
            <p>Whether the requirement involves an executive itinerary, a private journey or a destination celebration, each enquiry is approached individually.</p>
            <Link href="/request-a-charter" className="btn btn-dark mt-6">Start a Charter Enquiry<ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <section className="section section-navy">
        <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5"><SectionHead eyebrow="What we are" title="A coordinator, not an operator." /></div>
          <div className="space-y-6 text-ivory/78 lg:col-span-7 lg:pt-3">
            <p>Continent Aviation does not own or operate aircraft. We arrange charter solutions through independent aviation operators, and the contracted operator is responsible for the flight itself.</p>
            <p>Aircraft availability, pricing, routes, permissions and bookings are subject to operator confirmation. We aim to make that process clear, so you know at each stage what has been asked, what has been offered and what has been confirmed.</p>
            <Link href="/how-it-works" className="link-arrow">See how it works<ArrowRight size={14} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <CtaBand title="Start a Charter Enquiry." text="Tell us about your journey and we will take it from there." primary={{ href: "/request-a-charter", label: "Start a Charter Enquiry" }} />
      <Disclaimer />
    </>
  );
}

import Link from "next/link";
import { PartnershipForm } from "@/components/PartnershipForm";
import { Disclaimer, PageHero, SectionHead } from "@/components/ui";
import { deliveryConfigured } from "@/lib/delivery";
import { pageMeta } from "@/lib/metadata";

export const metadata = pageMeta("/partnerships", "Corporate & Planner Partnerships", "For corporate travel teams, wedding planners, event organisers and travel partners who expect to need recurring charter coordination.");
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <>
      <PageHero slot="vip" crumbs={[{ label: "Partnerships" }]} eyebrow="Partnerships"
        title="Working With Planners, Teams and Partners."
        description="For corporate travel teams, wedding planners, event organisers and travel partners who expect to need charter coordination more than once." />
      <section className="section section-navy">
        <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <SectionHead eyebrow="Partner enquiry" title="Tell us about your requirements.">
              <p>Describe the kind of travel you coordinate. We will review it and respond with how we may be able to help. For a single journey, please use the <Link className="text-gold underline underline-offset-4" href="/request-a-charter">charter enquiry form</Link>.</p>
            </SectionHead>
          </div>
          <div className="lg:col-span-7">
            <PartnershipForm deliveryReady={deliveryConfigured()} isProduction={process.env.NODE_ENV === "production"} />
          </div>
        </div>
      </section>
      <Disclaimer />
    </>
  );
}

import { Suspense } from "react";
import { EnquiryForm } from "@/components/EnquiryForm";
import { Breadcrumbs, Disclaimer } from "@/components/ui";
import { deliveryConfigured } from "@/lib/delivery";
import { pageMeta } from "@/lib/metadata";
import { site, whatsappLink } from "@/config/site";

export const metadata = pageMeta("/request-a-charter", "Request a Charter", "Share your route, dates and passenger details to request private jet or helicopter charter options from Continent Aviation. An enquiry is not a booking.");
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <>
      <section className="bg-midnight pb-12 pt-36 md:pb-16 md:pt-44">
        <div className="wrap">
          <Breadcrumbs trail={[{ label: "Request a Charter" }]} />
          <p className="eyebrow mt-8">Request a Charter</p>
          <h1 className="h2 mt-4 max-w-3xl !text-[clamp(2.4rem,6vw,4.6rem)]">Tell Us Where You Need to Be.</h1>
          <p className="lead mt-6">Share your travel requirements and we will coordinate suitable charter options with relevant aviation operators. This form submits an enquiry only; nothing is booked until the operator confirms.</p>
        </div>
      </section>
      <section className="bg-midnight pb-24 md:pb-32">
        <div className="wrap wrap-narrow">
          <Suspense fallback={<p className="text-grey" role="status">Loading form…</p>}>
            <EnquiryForm
              deliveryReady={deliveryConfigured()}
              isProduction={process.env.NODE_ENV === "production"}
              fallback={{ email: site.contact.email, phone: site.contact.phone, whatsappUrl: whatsappLink() }}
            />
          </Suspense>
        </div>
      </section>
      <Disclaimer />
    </>
  );
}

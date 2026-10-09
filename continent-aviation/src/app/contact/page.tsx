import Link from "next/link";
import { ArrowRight, Mail, MessageCircle, Phone } from "lucide-react";
import { CtaBand, Disclaimer, PageHero } from "@/components/ui";
import { pageMeta } from "@/lib/metadata";
import { hasAnyContact, site, whatsappLink } from "@/config/site";

export const metadata = pageMeta("/contact", "Contact", "Tell us about your journey. We will review your requirements and coordinate with relevant aviation operators to explore suitable options.");

export default function Page() {
  const { email, phone, whatsapp, hours, address } = site.contact;
  const wa = whatsappLink();
  const dev = process.env.NODE_ENV !== "production";
  return (
    <>
      <PageHero slot="apron" crumbs={[{ label: "Contact" }]} eyebrow="Contact"
        title="Let's Discuss Your Journey."
        description="Tell us what you have in mind. We will review your requirements and coordinate with relevant aviation operators to explore suitable options." />

      <section className="section section-ivory">
        <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-6">
            <p className="eyebrow">Charter enquiry</p>
            <h2 className="h2 mt-4">The best place to begin.</h2>
            <span className="rule mt-7" />
            <p className="mt-7 max-w-lg text-grey-deep">The enquiry form captures the details operators need to respond, such as route, dates and passengers, so that you do not have to repeat them.</p>
            <Link href="/request-a-charter" className="btn btn-dark mt-9">Request a Charter<ArrowRight size={16} aria-hidden="true" /></Link>
            <p className="mt-8 text-sm text-grey-deep">Planners, corporate teams and travel partners can also <Link href="/partnerships" className="underline underline-offset-4">send a partnership enquiry</Link>.</p>
          </div>

          <div className="lg:col-span-6">
            <p className="eyebrow">Direct contact</p>
            {hasAnyContact ? (
              <ul className="mt-6 divide-y divide-midnight/15 border-y border-midnight/15">
                {email && <Row icon={<Mail size={20} strokeWidth={1.25} />} label="Email" href={`mailto:${email}`} value={email} />}
                {phone && <Row icon={<Phone size={20} strokeWidth={1.25} />} label="Phone" href={`tel:${phone.replace(/[^\d+]/g, "")}`} value={phone} />}
                {wa && whatsapp && <Row icon={<MessageCircle size={20} strokeWidth={1.25} />} label="WhatsApp" href={wa} value="Message us on WhatsApp" external />}
              </ul>
            ) : (
              <p className="mt-6 text-grey-deep">Please use the enquiry form. It is the quickest way to reach us.</p>
            )}
            {hours && <p className="mt-6 text-sm text-grey-deep">Business hours: {hours}</p>}
            {address && <p className="mt-2 text-sm text-grey-deep">{address}</p>}
            {dev && !hasAnyContact && (
              <p className="mt-8 border border-gold-deep p-4 text-sm text-grey-deep" role="note">
                Development notice (not shown in production builds with contact details set): no contact details are configured. Set <code>NEXT_PUBLIC_CONTACT_EMAIL</code>, <code>NEXT_PUBLIC_CONTACT_PHONE</code> and <code>NEXT_PUBLIC_WHATSAPP_NUMBER</code>. See the README.
              </p>
            )}
            <p className="mt-10 text-sm text-grey-deep">
              See our <Link href="/privacy-policy" className="underline underline-offset-4">Privacy Policy</Link> and <Link href="/terms-and-conditions" className="underline underline-offset-4">Terms and Conditions</Link>.
            </p>
          </div>
        </div>
      </section>

      <CtaBand title="Prefer to Start With the Details?" text="Share your route, dates and passenger numbers and we will take it from there." secondary={null} />
      <Disclaimer />
    </>
  );
}

function Row({ icon, label, href, value, external }: { icon: React.ReactNode; label: string; href: string; value: string; external?: boolean }) {
  return (
    <li>
      <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="group flex items-center gap-5 py-5 transition-colors hover:text-gold-deep">
        <span className="text-gold-deep">{icon}</span>
        <span><span className="block text-xs uppercase tracking-[0.18em] text-grey-deep">{label}</span><span className="font-serif text-2xl">{value}</span></span>
      </a>
    </li>
  );
}

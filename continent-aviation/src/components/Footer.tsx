import Link from "next/link";
import { Logo } from "./Logo";
import { Year } from "./Year";
import { footerNav, hasAnyContact, site, whatsappLink } from "@/config/site";

export function Footer() {
  const { email, phone, whatsapp, address, hours } = site.contact;
  const wa = whatsappLink();
  return (
    <footer className="border-t border-gold/25 bg-midnight">
      <div className="wrap grid gap-14 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-5">
          <Link href="/" aria-label="Continent Aviation, home"><Logo /></Link>
          <p className="mt-6 max-w-sm text-[0.95rem] text-ivory/70">
            Private jet and helicopter charter solutions for business, private travel, weddings and special requirements, arranged through independent aviation operators.
          </p>
          <Link href="/request-a-charter" className="btn btn-ghost mt-8">Request a Charter</Link>
        </div>

        <nav aria-label="Footer" className="md:col-span-3">
          <h2 className="eyebrow !font-sans">Explore</h2>
          <ul className="mt-5 space-y-3">
            {footerNav.map((l) => (
              <li key={l.href}><Link href={l.href} className="text-[0.95rem] text-ivory/75 transition-colors hover:text-gold">{l.label}</Link></li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-4">
          <h2 className="eyebrow !font-sans">Contact</h2>
          {hasAnyContact || address ? (
            <ul className="mt-5 space-y-3 text-[0.95rem] text-ivory/75">
              {email && <li><a className="hover:text-gold" href={`mailto:${email}`}>{email}</a></li>}
              {phone && <li><a className="hover:text-gold" href={`tel:${phone.replace(/[^\d+]/g, "")}`}>{phone}</a></li>}
              {wa && whatsapp && <li><a className="hover:text-gold" href={wa} rel="noopener noreferrer" target="_blank">WhatsApp</a></li>}
              {hours && <li className="text-ivory/60">{hours}</li>}
              {address && <li className="text-ivory/60">{address}</li>}
            </ul>
          ) : (
            <p className="mt-5 text-[0.95rem] text-ivory/70">
              The <Link href="/request-a-charter" className="text-gold underline underline-offset-4">charter enquiry form</Link> is the best way to reach us.
            </p>
          )}
        </div>
      </div>

      <div className="border-t border-ivory/10">
        <div className="wrap flex flex-col gap-4 py-8 text-[0.8rem] text-grey md:flex-row md:items-start md:justify-between">
          <div className="max-w-2xl space-y-2 leading-relaxed">
            <p>{site.disclaimerShort} Continent Aviation is not an aircraft operator unless separately and explicitly stated. All flights are subject to operator confirmation.</p>
            <p>Imagery and 3D scenes are computer-generated illustrations of generic aircraft and places. They do not depict specific operator aircraft or a Continent Aviation fleet.</p>
          </div>
          <div className="flex shrink-0 flex-col gap-2 md:items-end">
            <p className="flex gap-5">
              <Link href="/privacy-policy" className="hover:text-gold">Privacy Policy</Link>
              <Link href="/terms-and-conditions" className="hover:text-gold">Terms and Conditions</Link>
            </p>
            <p>© <Year /> Continent Aviation. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

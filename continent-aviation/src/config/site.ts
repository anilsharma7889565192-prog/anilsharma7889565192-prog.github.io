/**
 * Central brand and contact configuration.
 * Contact values come from environment variables so that nothing unverified is ever published.
 * An empty value means "not configured": the UI hides that contact method entirely.
 */
const env = (v: string | undefined) => (v && v.trim() ? v.trim() : undefined);

const whatsappDigits = env(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER)?.replace(/\D/g, "");

export const site = {
  name: "Continent Aviation",
  tagline: "Private Aviation, Arranged Around You.",
  supporting:
    "Private jet and helicopter charter solutions for business, private travel, weddings and special requirements.",
  url: (env(process.env.NEXT_PUBLIC_SITE_URL) ?? "http://localhost:3000").replace(/\/$/, ""),
  contact: {
    email: env(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
    phone: env(process.env.NEXT_PUBLIC_CONTACT_PHONE),
    whatsapp: whatsappDigits,
    hours: env(process.env.NEXT_PUBLIC_BUSINESS_HOURS),
    address: env(process.env.NEXT_PUBLIC_BUSINESS_ADDRESS),
  },
  social: {
    linkedin: env(process.env.NEXT_PUBLIC_LINKEDIN_URL),
    instagram: env(process.env.NEXT_PUBLIC_INSTAGRAM_URL),
  },
  analytics: { plausibleDomain: env(process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN) },
  disclaimerShort:
    "Continent Aviation arranges charters through independent aviation operators.",
  disclaimerFull:
    "Continent Aviation arranges charter enquiries and coordinates bookings through independent aviation operators. It is not itself an aircraft operator unless separately and explicitly stated. All flights remain subject to operator confirmation, aircraft availability, applicable regulatory approvals, weather, operational feasibility and agreed booking conditions.",
} as const;

export const hasAnyContact = Boolean(
  site.contact.email || site.contact.phone || site.contact.whatsapp,
);

export function whatsappLink(message = "Hello Continent Aviation, I would like to discuss a charter requirement.") {
  if (!site.contact.whatsapp) return undefined;
  return `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const nav = [
  { href: "/private-jets", label: "Private Jets" },
  { href: "/helicopter-charters", label: "Helicopters" },
  { href: "/charter-solutions", label: "Solutions" },
  { href: "/about", label: "About" },
] as const;

export const menuExtra = [
  { href: "/how-it-works", label: "How It Works" },
  { href: "/contact", label: "Contact" },
] as const;

export const footerNav = [
  { href: "/private-jets", label: "Private Jets" },
  { href: "/helicopter-charters", label: "Helicopter Charters" },
  { href: "/charter-solutions", label: "Charter Solutions" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About" },
  { href: "/partnerships", label: "Partnerships" },
  { href: "/contact", label: "Contact" },
] as const;

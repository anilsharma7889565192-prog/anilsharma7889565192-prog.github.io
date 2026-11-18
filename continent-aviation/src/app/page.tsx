import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Steps } from "@/components/Steps";
import { Disclaimer, GlobeCta, SectionHead } from "@/components/ui";
import { EnquiryBar } from "@/components/EnquiryBar";
import { HeroFlyby } from "@/components/HeroFlyby";
import { FleetSection } from "@/components/fleet/FleetSection";
import Image from "next/image";
import { ScrollJourney } from "@/components/ScrollJourney";
import { operators } from "@/config/operators";
import { services } from "@/config/services";
import { pageMeta } from "@/lib/metadata";

export const metadata = {
  ...pageMeta("/", "Private Jet & Helicopter Charter Arrangements in India", "Private jet and helicopter charter solutions for business, private travel, weddings and special requirements, arranged with independent aviation operators across India."),
  title: { absolute: "Continent Aviation | Private Jet & Helicopter Charter Arrangements in India" },
};

const trust = [
  { t: "You tell us the journey", d: "Route, date, passengers and any special requirements. An enquiry is free and carries no obligation." },
  { t: "We check with the operator", d: "We ask the operator whether the aircraft is available and whether the journey is feasible." },
  { t: "You get a private quote", d: "A quote that names the operator and the aircraft, valid for 48 hours, on a link only you hold." },
  { t: "Booked only when confirmed", d: "You pay the operator directly. Nothing is booked until the operator confirms it to you." },
];

const benefits = [
  { t: "Personal Coordination", d: "Requirements are reviewed individually, with attention to route, timing, passengers and preferences." },
  { t: "Operator-Based Sourcing", d: "We source potential aircraft options through aviation operators and confirm details directly with the relevant provider." },
  { t: "Tailored Options", d: "Options are evaluated against the client's requirements rather than assuming one aircraft suits every journey." },
  { t: "Clear Communication", d: "Pricing, availability, inclusions and booking conditions are clarified with the relevant operator before confirmation." },
];

export default function Home() {
  return (
    <>
      {/* A — Hero */}
      <HeroFlyby>
        <div className="wrap relative z-10">
          <p className="eyebrow rise !text-white">Private Aviation <span className="mx-2 text-white/60" aria-hidden="true">|</span> India</p>
          <h1 className="display mt-5 max-w-5xl rise rise-2">
            Private Aviation,<br />Arranged Around You.
          </h1>
          <p className="lead mt-6 rise rise-3">
            Tell us the route, date and passengers. We check with the operator and send you a private quote, valid for 48 hours.
          </p>
          <div className="mt-8 rise rise-4 md:mt-10"><EnquiryBar /></div>
          <p className="mt-6 text-[0.8rem] tracking-[0.08em] text-white/90 rise rise-4">
            No payment is taken on this website. <Link href="/how-we-quote" className="underline decoration-gold/60 underline-offset-4 hover:text-gold">See how a quote works</Link>
          </p>
        </div>
      </HeroFlyby>

      {/* A1 — Fleet */}
      <section id="fleet" className="bg-[#f4f8fb] py-16 text-midnight md:py-24" aria-labelledby="fleet-h">
        <div className="wrap">
          <div className="mb-10 max-w-3xl">
            <p className="eyebrow !text-[#0b6fb3]">Our Fleet</p>
            <h2 id="fleet-h" className="h2 mt-3 !text-midnight">Aircraft available through our operators.</h2>
            <p className="mt-4 text-grey-deep">Search the jets, turboprops and helicopters we arrange, filter by size or operator, and preview the cabin. Each aircraft is owned and operated by the named operator.</p>
          </div>
          <FleetSection />
        </div>
      </section>

      {/* A2 — Partners */}
      <section className="bg-white py-16 text-midnight md:py-24" aria-labelledby="partners-h">
        <div className="wrap">
          <div className="max-w-3xl">
            <p className="eyebrow !text-[#0b6fb3]">Our Partners</p>
            <h2 id="partners-h" className="h2 mt-3 !text-midnight">The operators who fly you.</h2>
            <p className="mt-4 text-grey-deep">We arrange your charter with independent aviation operators. Each quote names the operator and the aircraft, and the operator confirms availability, price and terms.</p>
          </div>
          <ul className="mt-12 grid gap-6 md:grid-cols-2">
            {operators.map((o) => (
              <li key={o.id} className="flex flex-col rounded-3xl border border-[#0b6fb3]/15 bg-[#f4f8fb] p-7 shadow-[0_18px_40px_-30px_rgba(11,111,179,.6)] md:p-9">
                <div className="flex h-20 items-center rounded-2xl bg-white px-6">
                  <Image src={o.id === "arrow" ? "/images/partners/arrow-aircraft.png" : "/images/partners/gmr-aviation.png"} alt={`${o.name} logo`} width={o.id === "arrow" ? 127 : 204} height={o.id === "arrow" ? 78 : 43} className="h-auto max-h-14 w-auto" />
                </div>
                <h3 className="mt-6 font-serif text-[2rem] font-semibold leading-tight">{o.name}</h3>
                <p className="mt-3 text-[0.95rem] text-grey-deep">{o.summary}</p>
                <p className="mt-3 text-[0.88rem]"><strong className="font-medium">Base:</strong> <span className="text-grey-deep">{o.base}</span></p>
                <ul className="mt-5 flex flex-wrap gap-2" aria-label={`Aircraft operated by ${o.name}`}>
                  {o.aircraft.map((a) => <li key={a.model} className="rounded-full border border-[#0b6fb3]/25 bg-white px-3 py-1 text-[0.76rem] text-[#0b6fb3]">{a.model}</li>)}
                </ul>
                <Link href={`/operators#${o.id}`} className="link-arrow mt-7 !text-[#0b6fb3]">Operator details<ArrowRight size={14} aria-hidden="true" /></Link>
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-3xl text-[0.78rem] text-grey-deep">Logos and names belong to their respective owners. Continent Aviation is an independent charter arranger and is not owned by, or an agent of, either operator.</p>
        </div>
      </section>

      {/* A4 — Services */}
      <section id="services" className="bg-[#f4f8fb] py-16 text-midnight md:py-24" aria-labelledby="services-h">
        <div className="wrap">
          <div className="max-w-3xl">
            <p className="eyebrow !text-[#0b6fb3]">Our Services</p>
            <h2 id="services-h" className="h2 mt-3 !text-midnight">Services we offer.</h2>
            <p className="mt-4 text-grey-deep">From a single executive journey to a wedding with guests arriving from several cities, we coordinate the aircraft options around the way you need to travel.</p>
          </div>
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <li key={s.id}>
                <Link href={`/services#${s.id}`} className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[#0b6fb3]/15 bg-white shadow-[0_18px_40px_-30px_rgba(11,111,179,.6)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_50px_-28px_rgba(11,111,179,.7)]">
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#e6f4fd]">
                    <Image src={s.image} alt={s.imageAlt} fill sizes="(min-width:1024px) 360px, (min-width:640px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-serif text-[1.65rem] font-semibold leading-tight">{s.title}</h3>
                    <p className="mt-2 flex-1 text-[0.92rem] text-grey-deep">{s.summary}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-[0.76rem] font-semibold uppercase tracking-[0.12em] text-[#0b6fb3]">Learn more<ArrowRight size={14} aria-hidden="true" className="transition-transform group-hover:translate-x-1" /></span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* A3 — Trust: cinematic scroll journey on desktop, static steps elsewhere */}
      <ScrollJourney steps={trust}>
        <section className="section section-ivory" aria-labelledby="trust-h">
          <div className="wrap">
            <SectionHead eyebrow="How we work" title="Clear at every step, before you pay anything." />
            <ol id="trust-h" className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
              {trust.map((t, i) => (
                <li key={t.t} className="hairline-top pt-6">
                  <span className="font-serif text-4xl text-gold-deep" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-4 font-serif text-2xl leading-snug">{t.t}</h3>
                  <p className="mt-3 text-[0.95rem] text-grey-deep">{t.d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </ScrollJourney>
      <section className="section-ivory py-10" aria-label="Learn how quotes work">
        <div className="wrap flex flex-wrap gap-x-8 gap-y-3">
          <Link href="/how-we-quote" className="link-arrow">How we quote<ArrowRight size={14} aria-hidden="true" /></Link>
          <Link href="/example-quote" className="link-arrow">See an example quote<ArrowRight size={14} aria-hidden="true" /></Link>
          <Link href="/pricing-explained" className="link-arrow">What affects the price<ArrowRight size={14} aria-hidden="true" /></Link>
        </div>
      </section>

      {/* B — Introduction */}
      <section className="section section-ivory">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-6">
            <p className="eyebrow">Continent Aviation</p>
            <h2 className="h2 mt-4">Your Journey.<br />Thoughtfully Arranged.</h2>
            <span className="rule mt-8" />
          </div>
          <div className="lg:col-span-6 lg:pt-10">
            <p className="text-[1.15rem] leading-relaxed text-midnight/85">
              Every journey has its own requirements. Continent Aviation helps clients explore suitable private jet and helicopter charter options by coordinating with aviation operators according to their route, schedule, passenger needs and preferences.
            </p>
            <p className="mt-6 text-grey-deep">From executive travel to destination celebrations, our approach is personal, responsive and tailored to the journey.</p>
            <Link href="/about" className="link-arrow mt-9">Discover Continent Aviation<ArrowRight size={14} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      {/* E — How it works */}
      <section className="section section-ivory">
        <div className="wrap">
          <SectionHead eyebrow="How It Works" title="A Clearer Way to Arrange Your Charter." />
          <div className="mt-16"><Steps tone="ivory" /></div>
          <p className="mt-14 border-l border-gold-deep pl-5 text-sm text-grey-deep">All arrangements are subject to operator confirmation, availability, applicable permissions and booking terms.</p>
          <Link href="/how-it-works" className="link-arrow mt-8">See the full process<ArrowRight size={14} aria-hidden="true" /></Link>
        </div>
      </section>

      {/* F — Why */}
      <section className="section section-black">
        <div className="wrap">
          <SectionHead eyebrow="Why Continent Aviation" title="A More Considered Approach to Private Aviation." />
          <div className="mt-16 grid gap-x-16 gap-y-12 md:grid-cols-2">
            {benefits.map((b) => (
              <div key={b.t} className="hairline-top pt-7">
                <h3 className="eyebrow !text-[0.78rem]">{b.t}</h3>
                <p className="mt-4 font-serif text-[1.65rem] leading-snug text-ivory">{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* I — Final CTA */}
      <GlobeCta />

      {/* J — Disclaimer */}
      <Disclaimer />
    </>
  );
}

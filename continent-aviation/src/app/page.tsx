import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Photo } from "@/components/Photo";
import { Steps } from "@/components/Steps";
import { Bullets, Disclaimer, GlobeCta, SectionHead, enquiryHref } from "@/components/ui";
import { LiveScene } from "@/components/three/LiveScene";
import { TiltLink } from "@/components/Tilt";
import type { ImageSlot } from "@/config/images";
import { pageMeta } from "@/lib/metadata";

export const metadata = {
  ...pageMeta("/", "Private Jet & Helicopter Charter Arrangements in India", "Private jet and helicopter charter solutions for business, private travel, weddings and special requirements, arranged with independent aviation operators across India."),
  title: { absolute: "Continent Aviation | Private Jet & Helicopter Charter Arrangements in India" },
};

const services: { slot: ImageSlot; title: string; text: string; href: string; cta: string }[] = [
  { slot: "jets", title: "Private Jet Charters", text: "Explore private jet charter options for executive journeys, private travel, multi-city itineraries and time-sensitive requirements.", href: "/private-jets", cta: "Explore Private Jets" },
  { slot: "helicopter", title: "Helicopter Charters", text: "Explore helicopter charter possibilities for suitable regional journeys, destination transfers, event movements and special travel requirements, subject to permissions and operational feasibility.", href: "/helicopter-charters", cta: "Explore Helicopters" },
  { slot: "bespoke", title: "Bespoke Charter Solutions", text: "From destination weddings and VIP movements to corporate itineraries, we coordinate charter enquiries around the specific needs of each client.", href: "/charter-solutions", cta: "Explore Solutions" },
];

const audiences: { slot: ImageSlot; title: string; text: string; href: string }[] = [
  { slot: "corporate", title: "Corporate & Executive Travel", text: "Charter enquiries for executives, entrepreneurs and businesses requiring tailored travel arrangements.", href: "/charter-solutions#corporate" },
  { slot: "private", title: "Private Journeys", text: "Private aviation options for individuals, families and personal itineraries.", href: "/charter-solutions#family" },
  { slot: "wedding", title: "Destination Weddings", text: "Charter coordination for wedding families, special guests and destination celebrations.", href: "/charter-solutions#weddings" },
  { slot: "vip", title: "VIP & Event Movements", text: "Private aviation enquiries for premium events and special movements.", href: "/charter-solutions#vip-events" },
  { slot: "group", title: "Bespoke Group Travel", text: "Explore suitable aircraft options for groups, subject to passenger capacity and availability.", href: "/charter-solutions#multi-city" },
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
      <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden pb-20 pt-40 md:items-center md:pb-24">
        <Photo slot="hero" priority sizes="100vw" />
        <LiveScene shot="hero" />
        <div className="overlay-hero" aria-hidden="true" />
        <div className="wrap relative z-10">
          <p className="eyebrow rise">Private Aviation <span className="mx-2 text-gold/60" aria-hidden="true">|</span> India</p>
          <h1 className="display mt-6 max-w-5xl rise rise-2">
            Private Aviation,<br />Arranged Around You.
          </h1>
          <span className="rule mt-9 rise rise-3" />
          <p className="lead mt-8 rise rise-3">
            Private jet and helicopter charter solutions for business travel, private journeys, destination weddings and special requirements.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 rise rise-4">
            <Link href="/request-a-charter" className="btn btn-gold">Request a Charter<ArrowRight size={16} aria-hidden="true" /></Link>
            <Link href="/charter-solutions" className="btn btn-ghost">Explore Our Services</Link>
          </div>
          <p className="mt-12 text-[0.8rem] tracking-[0.08em] text-ivory/65 rise rise-4">Tailored charter enquiries. Carefully sourced aircraft options.</p>
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

      {/* C — Services */}
      <section className="section section-black">
        <div className="wrap">
          <SectionHead eyebrow="Our Services" title="Charter Solutions, Considered." />
          <div className="mt-16 grid gap-px md:grid-cols-3 md:gap-8">
            {services.map((s, i) => (
              <TiltLink key={s.title} href={s.href} className={`tile group ${i === 1 ? "md:mt-14" : ""}`}>
                <div className="relative aspect-[4/5] w-full">
                  <Photo slot={s.slot} shade="bottom" sizes="(min-width:768px) 33vw, 100vw" />
                </div>
                <div className="relative z-10 -mt-px pb-2 pt-7">
                  <h3 className="h3">{s.title}</h3>
                  <p className="mt-4 text-[0.95rem] text-ivory/70">{s.text}</p>
                  <span className="link-arrow mt-6">{s.cta}<ArrowRight size={14} aria-hidden="true" /></span>
                </div>
              </TiltLink>
            ))}
          </div>
          <p className="mt-14 max-w-2xl text-sm text-grey">Routes, landing locations, aircraft and services are confirmed only once the relevant operator has confirmed them.</p>
        </div>
      </section>

      {/* D — Who we serve */}
      <section className="section section-navy">
        <div className="wrap">
          <SectionHead eyebrow="Who We Serve" title="Designed Around Distinct Travel Needs." />
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-6">
            {audiences.map((a, i) => (
              <TiltLink key={a.title} href={a.href} max={2.5} className={`tile group ${i < 2 ? "lg:col-span-3" : "lg:col-span-2"}`}>
                <div className={`relative w-full ${i < 2 ? "aspect-[16/10]" : "aspect-[4/5] lg:aspect-[3/4]"}`}>
                  <Photo slot={a.slot} shade="bottom" sizes="(min-width:1024px) 40vw, 100vw" />
                  <div className="absolute inset-x-0 bottom-0 z-10 p-6 md:p-7">
                    <h3 className="h3">{a.title}</h3>
                    <span className="rule mt-4 transition-all duration-500 group-hover:w-16" />
                    <p className="mt-4 text-[0.92rem] text-ivory/80">{a.text}</p>
                  </div>
                </div>
              </TiltLink>
            ))}
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

      {/* G — Weddings */}
      <section className="relative isolate overflow-hidden section-navy">
        <div className="grid lg:grid-cols-2">
          <div className="relative min-h-[22rem] lg:min-h-[44rem]"><Photo slot="wedding" shade="none" sizes="(min-width:1024px) 50vw, 100vw" /></div>
          <div className="px-[max(1.25rem,4vw)] py-20 lg:px-20 lg:py-28 xl:px-28">
            <p className="eyebrow">Destination Weddings</p>
            <h2 className="h2 mt-4">An Elevated Arrival for Exceptional Occasions.</h2>
            <span className="rule mt-7" />
            <p className="mt-7 text-ivory/80">
              Destination weddings bring together families and guests from multiple cities and countries. Continent Aviation helps wedding planners, hospitality teams and families explore private jet and helicopter charter options for suitable travel requirements.
            </p>
            <div className="mt-8 text-[0.95rem] text-ivory/85">
              <Bullets items={[
                "Wedding family and VIP travel enquiries.",
                "Private jet charter quotations.",
                "Helicopter transfer enquiries, subject to permissions and landing feasibility.",
                "Coordination with planners and event teams.",
                "Multi-city travel requirements.",
              ]} />
            </div>
            <Link href={enquiryHref({ purpose: "Destination Wedding" })} className="btn btn-gold mt-10">Discuss Wedding Travel<ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      {/* H — Corporate */}
      <section className="section section-ivory">
        <div className="wrap grid items-center gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-7">
            <p className="eyebrow">Corporate Travel</p>
            <h2 className="h2 mt-4">Private Aviation for Business on the Move.</h2>
            <span className="rule mt-7" />
            <p className="mt-7 max-w-2xl text-[1.1rem] text-grey-deep">
              Business itineraries can involve multiple destinations, tight schedules and specific passenger requirements. We coordinate charter enquiries with relevant operators to help businesses evaluate suitable private aviation options.
            </p>
            <Link href={enquiryHref({ purpose: "Corporate Travel" })} className="btn btn-dark mt-10">Discuss Corporate Travel<ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
          <div className="relative aspect-[4/3] lg:col-span-5"><Photo slot="corporate" sizes="(min-width:1024px) 40vw, 100vw" /></div>
        </div>
      </section>

      {/* I — Final CTA */}
      <GlobeCta />

      {/* J — Disclaimer */}
      <Disclaimer />
    </>
  );
}

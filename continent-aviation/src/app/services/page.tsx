import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs, CtaBand, Disclaimer, enquiryHref } from "@/components/ui";
import { services } from "@/config/services";
import { pageMeta } from "@/lib/metadata";

export const metadata = pageMeta("/services", "Services", "Charter coordination for corporate and executive travel, destination weddings, VIP and event travel, private family journeys, multi-city itineraries and helicopter transfers.");

export default function Page() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-[#0b6fb3] pb-16 pt-36 text-white md:pb-20 md:pt-44">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/sky.jpg" alt="" aria-hidden="true" className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(4,40,80,.55),rgba(4,40,80,.1)_55%,rgba(4,40,80,.4))]" aria-hidden="true" />
        <div className="wrap">
          <Breadcrumbs trail={[{ label: "Services" }]} />
          <p className="eyebrow mt-8 !text-white">Services</p>
          <h1 className="h2 mt-3 max-w-3xl !text-[clamp(2.4rem,6vw,4.6rem)]">Charter coordination around each client.</h1>
          <p className="lead mt-5 max-w-2xl !text-white/90">Different journeys call for different aircraft, timings and operators. These are the requirements we most often coordinate.</p>
        </div>
      </section>

      <nav aria-label="Services" className="sticky top-[4.5rem] z-30 hidden border-b border-[#0b6fb3]/15 bg-white/95 backdrop-blur lg:top-20 lg:block">
        <ul className="wrap flex gap-8 py-4 text-[0.74rem] uppercase tracking-[0.14em] text-grey-deep">
          {services.map((s) => <li key={s.id}><a href={`#${s.id}`} className="hover:text-[#0b6fb3]">{s.title}</a></li>)}
        </ul>
      </nav>

      {services.map((s, i) => (
        <section key={s.id} id={s.id} className={`py-16 text-midnight md:py-24 ${i % 2 ? "bg-[#f4f8fb]" : "bg-white"}`}>
          <div className="wrap grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className={`lg:col-span-5 ${i % 2 ? "lg:order-2" : ""}`}>
              <p className="eyebrow !text-[#0b6fb3]">Service {String(i + 1).padStart(2, "0")}</p>
              <h2 className="h2 mt-3 !text-midnight">{s.title}</h2>
              <p className="mt-4 text-grey-deep">{s.summary}</p>
              <div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-3xl bg-[#e6f4fd] shadow-[0_24px_50px_-32px_rgba(11,111,179,.7)]">
                <Image src={s.image} alt={s.imageAlt} fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
              </div>
              {s.credit && <p className="mt-2 text-[0.7rem] text-grey-deep">{s.credit}</p>}
            </div>
            <div className="lg:col-span-7">
              <Block title="The requirement"><p>{s.type}</p></Block>
              <Block title="What to share with us">
                <ul className="list-none space-y-2">{s.provide.map((p) => <li key={p} className="flex gap-3"><span aria-hidden="true" className="mt-[0.8em] h-px w-4 shrink-0 bg-[#2aa7e8]" />{p}</li>)}</ul>
              </Block>
              <Block title="How we coordinate"><p>{s.coordinate}</p></Block>
              <Block title="What influences aircraft and pricing"><p>{s.factors}</p></Block>
              <Link href={enquiryHref(s.params)} className="mt-4 inline-flex min-h-12 items-center gap-2 rounded-full bg-[linear-gradient(180deg,#3db5f2,#0b6fb3)] px-7 text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-white shadow-[0_12px_24px_-12px_rgba(11,111,179,.9)] transition-transform hover:-translate-y-0.5">{s.cta}<ArrowRight size={16} aria-hidden="true" /></Link>
            </div>
          </div>
        </section>
      ))}

      <CtaBand title="Not Sure Which Fits?" text="Describe what you have in mind. We will help shape it into an enquiry operators can respond to." />
      <Disclaimer />
    </>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-7 border-t border-[#0b6fb3]/15 pt-5">
      <h3 className="eyebrow !text-[0.74rem] !text-[#0b6fb3]">{title}</h3>
      <div className="mt-3 text-grey-deep">{children}</div>
    </div>
  );
}

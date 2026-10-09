const steps = [
  { n: "01", t: "Share Your Requirements", d: "Tell us your route, travel dates, passenger count and aircraft preferences." },
  { n: "02", t: "We Source Suitable Options", d: "We approach relevant aviation operators to identify potentially suitable aircraft and obtain quotations." },
  { n: "03", t: "Review the Details", d: "We coordinate available options, indicative pricing where provided, and the relevant operational details." },
  { n: "04", t: "Confirm Your Charter", d: "Once the selected operator confirms availability, pricing, documentation and booking conditions, the charter can proceed according to the agreed arrangement." },
];

export function Steps({ tone = "dark" }: { tone?: "dark" | "ivory" }) {
  return (
    <ol className="grid gap-0 md:grid-cols-4 md:gap-8">
      {steps.map((s) => (
        <li key={s.n} className="relative border-l border-gold/40 pb-10 pl-7 last:pb-0 md:border-l-0 md:border-t md:pb-0 md:pl-0 md:pt-8">
          <span className="absolute -left-[5px] top-1 h-[9px] w-[9px] rounded-full bg-gold md:-top-[5px] md:left-0" aria-hidden="true" />
          <p className="font-serif text-5xl leading-none text-gold">{s.n}</p>
          <h3 className="h3 mt-5">{s.t}</h3>
          <p className={`mt-3 text-[0.95rem] ${tone === "ivory" ? "text-grey-deep" : "text-ivory/70"}`}>{s.d}</p>
        </li>
      ))}
    </ol>
  );
}

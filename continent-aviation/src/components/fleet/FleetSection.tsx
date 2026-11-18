"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUp, Search, Users, X } from "lucide-react";
import { enquiryAircraft, fleet, KIND_INFO, KINDS, type FleetAircraft, type FleetKind } from "@/config/fleet";
import { operators } from "@/config/operators";
import { cn } from "@/lib/utils";
import { CabinPlan } from "./CabinPlan";
import { GlassPlane } from "./GlassPlane";

type SortKey = "model" | "kind" | "operator" | "seats";
const KIND_RANK: Record<FleetKind, number> = { "Large jet": 0, Turboprop: 1, Helicopter: 2 };

const chip = "rounded-full border px-4 py-1.5 text-[0.75rem] font-medium uppercase tracking-[0.1em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b6fb3]";

export function FleetSection() {
  const [q, setQ] = useState("");
  const [kind, setKind] = useState<FleetKind | "All">("All");
  const [operator, setOperator] = useState("All");
  const [minSeats, setMinSeats] = useState(0);
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "kind", dir: 1 });
  const [selectedId, setSelectedId] = useState<string>("legacy650");
  const previewRef = useRef<HTMLDivElement>(null);

  const rows = useMemo(() => {
    const t = q.trim().toLowerCase();
    const list = fleet.filter((a) =>
      (kind === "All" || a.kind === kind) &&
      (operator === "All" || a.operatorId === operator) &&
      a.seats >= minSeats &&
      (!t || `${a.model} ${a.maker} ${a.kind} ${a.operator}`.toLowerCase().includes(t)),
    );
    const val = (a: FleetAircraft) => (sort.key === "seats" ? a.seats : sort.key === "kind" ? KIND_RANK[a.kind] : a[sort.key].toLowerCase());
    return [...list].sort((a, b) => (val(a) < val(b) ? -1 : val(a) > val(b) ? 1 : a.model.localeCompare(b.model)) * sort.dir);
  }, [q, kind, operator, minSeats, sort]);

  const selected = fleet.find((a) => a.id === selectedId) ?? fleet[0];
  const sameKind = fleet.filter((a) => a.kind === selected.kind);
  const filtered = q || kind !== "All" || operator !== "All" || minSeats > 0;
  const clear = () => { setQ(""); setKind("All"); setOperator("All"); setMinSeats(0); };
  const toggleSort = (key: SortKey) => setSort((s) => (s.key === key ? { key, dir: s.dir === 1 ? -1 : 1 } : { key, dir: 1 }));
  const pick = (id: string, scroll = false) => { setSelectedId(id); if (scroll) previewRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }); };

  const th = (key: SortKey, label: string, cls = "") => (
    <th scope="col" aria-sort={sort.key === key ? (sort.dir === 1 ? "ascending" : "descending") : "none"} className={cn("px-3 py-3 font-medium", cls)}>
      <button type="button" onClick={() => toggleSort(key)} className="inline-flex items-center gap-1 uppercase tracking-[0.12em] hover:text-[#0b6fb3] focus-visible:outline-2 focus-visible:outline-[#0b6fb3]">
        {label}
        {sort.key === key && (sort.dir === 1 ? <ArrowUp size={12} aria-hidden="true" /> : <ArrowDown size={12} aria-hidden="true" />)}
      </button>
    </th>
  );

  return (
    <div className="text-midnight">
      {/* ---------- Filter bar ---------- */}
      <div className="flex flex-wrap items-center gap-3">
        <label className="relative min-w-[14rem] flex-1">
          <span className="sr-only">Search aircraft</span>
          <Search size={16} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#0b6fb3]" />
          <input value={q} onChange={(e) => setQ(e.target.value)} type="search" placeholder="Search aircraft, maker or operator" className="h-11 w-full rounded-full border border-[#0b6fb3]/25 bg-white pl-10 pr-4 text-[0.92rem] outline-none focus:border-[#0b6fb3] focus:ring-2 focus:ring-[#2aa7e8]/30" />
        </label>
        <div role="radiogroup" aria-label="Aircraft type" className="flex flex-wrap gap-2">
          {(["All", ...KINDS] as const).map((k) => (
            <button key={k} type="button" role="radio" aria-checked={kind === k} onClick={() => setKind(k)} className={cn(chip, kind === k ? "border-[#0b6fb3] bg-[#0b6fb3] text-white" : "border-[#0b6fb3]/25 bg-white text-[#0b6fb3] hover:bg-[#e6f4fd]")}>{k === "All" ? "All" : k === "Large jet" ? "Jets" : k === "Helicopter" ? "Helicopters" : "Turboprop"}</button>
          ))}
        </div>
        <label className="text-[0.78rem] text-grey-deep">
          <span className="sr-only">Operator</span>
          <select value={operator} onChange={(e) => setOperator(e.target.value)} className="h-11 rounded-full border border-[#0b6fb3]/25 bg-white px-4 text-[0.85rem] text-midnight outline-none focus:border-[#0b6fb3]">
            <option value="All">All operators</option>
            {operators.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>
        </label>
        <label className="text-[0.78rem] text-grey-deep">
          <span className="sr-only">Minimum passengers</span>
          <select value={minSeats} onChange={(e) => setMinSeats(Number(e.target.value))} className="h-11 rounded-full border border-[#0b6fb3]/25 bg-white px-4 text-[0.85rem] text-midnight outline-none focus:border-[#0b6fb3]">
            <option value={0}>Any size</option>
            <option value={6}>6+ passengers</option>
            <option value={8}>8+ passengers</option>
            <option value={9}>9+ passengers</option>
            <option value={13}>13 passengers</option>
          </select>
        </label>
        {filtered && <button type="button" onClick={clear} className="inline-flex items-center gap-1 text-[0.78rem] font-medium uppercase tracking-[0.1em] text-[#0b6fb3] underline-offset-4 hover:underline"><X size={14} aria-hidden="true" />Clear</button>}
      </div>

      {/* ---------- Table ---------- */}
      <div className="mt-5 overflow-hidden rounded-2xl border border-[#0b6fb3]/20 bg-white shadow-[0_18px_40px_-28px_rgba(11,111,179,.55)]">
        <div className="relative overflow-x-auto">
          <table className="w-full min-w-[34rem] text-left text-[0.92rem]">
            <caption className="sr-only">Aircraft available through our operators. Select a row to preview it below.</caption>
            <thead className="border-b border-[#0b6fb3]/15 bg-[#f4f8fb] text-[0.68rem] text-grey-deep">
              <tr>
                <th scope="col" className="w-20 px-3 py-3"><span className="sr-only">Photo</span></th>
                {th("model", "Aircraft")}
                {th("kind", "Type", "hidden sm:table-cell")}
                {th("operator", "Operator", "hidden md:table-cell")}
                {th("seats", "Seats")}
                <th scope="col" className="px-3 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => {
                const on = a.id === selected.id;
                return (
                  <tr key={a.id} aria-selected={on} className={cn("border-b border-[#0b6fb3]/10 last:border-0 transition-colors", on ? "bg-[#e6f4fd]" : "hover:bg-[#f4f8fb]")}>
                    <td className="px-3 py-2">
                      <div className="relative h-11 w-16 overflow-hidden rounded-md bg-[#e6f4fd]"><Image src={a.image} alt="" fill sizes="64px" className="object-cover" /></div>
                    </td>
                    <th scope="row" className="px-3 py-2 font-normal">
                      <button type="button" onClick={() => pick(a.id, true)} className="text-left font-serif text-[1.25rem] font-semibold leading-tight hover:text-[#0b6fb3] focus-visible:outline-2 focus-visible:outline-[#0b6fb3]">
                        {a.model}{a.count && a.count > 1 ? <span className="ml-1.5 font-sans text-[0.8rem] font-normal text-grey-deep">x {a.count}</span> : null}
                      </button>
                      <span className="block text-[0.74rem] text-grey-deep sm:hidden">{a.kind} · {a.operator}</span>
                    </th>
                    <td className="hidden px-3 py-2 sm:table-cell">{a.kind}</td>
                    <td className="hidden px-3 py-2 md:table-cell">{a.operator}</td>
                    <td className="px-3 py-2 whitespace-nowrap"><span className="inline-flex items-center gap-1.5"><Users size={14} aria-hidden="true" className="text-[#0b6fb3]" />up to {a.seats}</span></td>
                    <td className="px-3 py-2 text-right">
                      <button type="button" onClick={() => pick(a.id, true)} className="text-[0.74rem] font-semibold uppercase tracking-[0.1em] text-[#0b6fb3] underline-offset-4 hover:underline">Preview</button>
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-grey-deep">No aircraft match those filters. <button type="button" onClick={clear} className="font-medium text-[#0b6fb3] underline underline-offset-4">Clear filters</button></td></tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="border-t border-[#0b6fb3]/10 bg-[#f4f8fb] px-4 py-2.5 text-[0.74rem] text-grey-deep" aria-live="polite">Showing {rows.length} of {fleet.length} aircraft. Passenger numbers are the operator&apos;s &quot;up to&quot; capacity.</p>
      </div>

      {/* ---------- Aircraft cards ---------- */}
      <div className="mt-16">
        <p className="eyebrow !text-[#0b6fb3]">Aircraft in detail</p>
        <h3 className="mt-2 font-serif text-[clamp(1.8rem,3.4vw,2.6rem)] leading-tight">Every aircraft, one card.</h3>
        <ul className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((a) => (
            <li key={a.id} className={cn("group flex flex-col overflow-hidden rounded-3xl border bg-white shadow-[0_18px_40px_-30px_rgba(11,111,179,.6)] transition-all duration-300 hover:-translate-y-1", a.id === selected.id ? "border-[#0b6fb3]" : "border-[#0b6fb3]/15")}>
              <div className="relative aspect-[16/10] overflow-hidden bg-[#e6f4fd]">
                <Image src={a.image} alt={a.imageAlt} fill sizes="(min-width:1024px) 360px, (min-width:640px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <span className="absolute left-3 top-3 rounded-full bg-white/85 px-3 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.12em] text-[#0b6fb3] backdrop-blur">{a.kind}</span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h4 className="font-serif text-[1.55rem] font-semibold leading-tight">{a.model}{a.count && a.count > 1 ? <span className="ml-1.5 font-sans text-[0.8rem] font-normal text-grey-deep">x {a.count}</span> : null}</h4>
                <p className="mt-0.5 text-[0.8rem] text-grey-deep">{a.maker} · operated by {a.operator}</p>
                <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-[#0b6fb3]/10 pt-4 text-[0.84rem]">
                  <div><dt className="text-[0.64rem] uppercase tracking-[0.14em] text-grey-deep">Passengers</dt><dd className="mt-0.5 font-medium">up to {a.seats}</dd></div>
                  <div><dt className="text-[0.64rem] uppercase tracking-[0.14em] text-grey-deep">Engines</dt><dd className="mt-0.5 font-medium">{a.engines}</dd></div>
                  {a.perf?.map((f) => <div key={f.label}><dt className="text-[0.64rem] uppercase tracking-[0.14em] text-grey-deep">{f.label}</dt><dd className="mt-0.5 font-medium">{f.value}</dd></div>)}
                </dl>
                <p className="mt-3 flex-1 text-[0.82rem] text-grey-deep">{a.note ?? KIND_INFO[a.kind].blurb}{!a.perf ? " Range and cruise are given in your quote." : ""}</p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <button type="button" onClick={() => pick(a.id, true)} className="text-[0.74rem] font-semibold uppercase tracking-[0.1em] text-[#0b6fb3] underline-offset-4 hover:underline">Preview cabin</button>
                  <Link href={`/request-a-charter?${new URLSearchParams({ aircraft: enquiryAircraft(a.kind) }).toString()}`} className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-[#0b6fb3]/30 px-4 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-[#0b6fb3] transition-colors hover:bg-[#e6f4fd]">Request<ArrowRight size={14} aria-hidden="true" /></Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {rows.length === 0 && <p className="mt-4 text-grey-deep">No aircraft match those filters.</p>}
        <p className="mt-4 text-[0.74rem] text-grey-deep">Speed and range are published reference figures for the aircraft type. The operator confirms the actual figures for your flight.</p>
      </div>

      {/* ---------- Size selector ---------- */}
      <div className="mt-16">
        <p className="eyebrow !text-[#0b6fb3]">Choose by size</p>
        <h3 className="mt-2 font-serif text-[clamp(1.8rem,3.4vw,2.6rem)] leading-tight">Pick a size. See what&apos;s available.</h3>
        <div role="radiogroup" aria-label="Aircraft size" className="mt-7 grid gap-4 md:grid-cols-3">
          {KINDS.slice().reverse().map((k, i) => {
            const info = KIND_INFO[k];
            const inKind = fleet.filter((a) => a.kind === k);
            const max = Math.max(...inKind.map((a) => a.seats)), min = Math.min(...inKind.map((a) => a.seats));
            const active = selected.kind === k;
            return (
              <button key={k} type="button" role="radio" aria-checked={active} onClick={() => pick(inKind[0].id)}
                className={cn("group relative flex min-h-[15rem] flex-col items-center justify-between overflow-hidden rounded-3xl border p-6 text-white transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b6fb3]",
                  "bg-[linear-gradient(155deg,#0b6fb3_0%,#2aa7e8_62%,#8fd3f7_100%)]",
                  active ? "border-white shadow-[0_22px_44px_-18px_rgba(11,111,179,.9)] ring-2 ring-[#0b6fb3]" : "border-white/40 hover:-translate-y-0.5")}>
                <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_70%_10%,rgba(255,255,255,.35),transparent_70%)]" aria-hidden="true" />
                <div className="relative flex flex-1 items-center justify-center py-3">
                  <div className="glass-float" style={{ animationDelay: `${i * 0.9}s` }}><GlassPlane kind={k} scale={info.scale} active={active} /></div>
                </div>
                <div className="relative text-center">
                  <span className="block font-serif text-[1.7rem] font-semibold leading-none">{k}</span>
                  <span className="mt-1.5 block text-[0.76rem] uppercase tracking-[0.12em] text-white/90">{min === max ? `up to ${max}` : `${min} to ${max}`} passengers · {inKind.length} {inKind.length === 1 ? "type" : "types"}</span>
                </div>
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-[0.8rem] text-grey-deep">Need a size not shown here? Ask in your enquiry and we will check with the operators.</p>
      </div>

      {/* ---------- Preview ---------- */}
      <div ref={previewRef} aria-live="polite" className="mt-8 scroll-mt-28 overflow-hidden rounded-3xl border border-[#0b6fb3]/20 bg-white shadow-[0_24px_50px_-32px_rgba(11,111,179,.6)]">
        <div className="flex flex-wrap gap-2 border-b border-[#0b6fb3]/10 bg-[#f4f8fb] p-3" role="tablist" aria-label={`${selected.kind} aircraft`}>
          {sameKind.map((a) => (
            <button key={a.id} type="button" role="tab" aria-selected={a.id === selected.id} onClick={() => pick(a.id)} className={cn(chip, a.id === selected.id ? "border-[#0b6fb3] bg-[#0b6fb3] text-white" : "border-[#0b6fb3]/25 bg-white text-[#0b6fb3] hover:bg-[#e6f4fd]")}>{a.model}</button>
          ))}
        </div>
        <div className="relative aspect-[16/9] w-full bg-[#e6f4fd] sm:aspect-[21/8]">
          <Image src={selected.image} alt={selected.imageAlt} fill sizes="(min-width:1280px) 1160px, 100vw" className="object-cover" />
          <span className="absolute bottom-3 left-3 rounded-full bg-white/85 px-3 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-[#0b6fb3] backdrop-blur">Illustrative photo of the type</span>
        </div>
        <div className="grid gap-8 p-6 md:p-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow !text-[#0b6fb3]">{selected.kind} · {selected.maker}</p>
            <h4 className="mt-1 font-serif text-[2.1rem] font-semibold leading-tight">{selected.model}</h4>
            <dl className="mt-4 grid grid-cols-3 gap-4 text-[0.88rem]">
              <div><dt className="text-[0.68rem] uppercase tracking-[0.14em] text-grey-deep">Operator</dt><dd className="mt-0.5 font-medium">{selected.operator}</dd></div>
              <div><dt className="text-[0.68rem] uppercase tracking-[0.14em] text-grey-deep">Passengers</dt><dd className="mt-0.5 font-medium">up to {selected.seats}</dd></div>
              <div><dt className="text-[0.68rem] uppercase tracking-[0.14em] text-grey-deep">In fleet</dt><dd className="mt-0.5 font-medium">{selected.count ?? 1} aircraft</dd></div>
            </dl>
            <p className="mt-4 text-[0.9rem] text-grey-deep">{KIND_INFO[selected.kind].blurb}{selected.note ? ` ${selected.note}` : ""}</p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link href={`/request-a-charter?${new URLSearchParams({ aircraft: enquiryAircraft(selected.kind) }).toString()}`} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[linear-gradient(180deg,#3db5f2,#0b6fb3)] px-7 text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-white shadow-[0_12px_24px_-12px_rgba(11,111,179,.9)] transition-transform hover:-translate-y-0.5">Request a quote<ArrowRight size={16} aria-hidden="true" /></Link>
              <Link href="/operators" className="text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-[#0b6fb3] underline-offset-4 hover:underline">About {selected.operator}</Link>
            </div>
          </div>
          <div className="rounded-2xl bg-[#f4f8fb] p-4 lg:col-span-7">
            <CabinPlan kind={selected.kind} seats={selected.seats} label={`Indicative cabin plan for the ${selected.model}, up to ${selected.seats} passengers`} />
            <p className="mt-2 text-[0.72rem] text-grey-deep">Indicative cabin plan, up to {selected.seats} passengers (light blue). The operator confirms the actual configuration for your flight.</p>
          </div>
        </div>
      </div>

      <p className="mt-6 max-w-3xl text-[0.78rem] leading-relaxed text-grey-deep">
        Continent Aviation does not own or operate aircraft. Every aircraft above is owned and operated by the named operator. Photographs show the aircraft type and are illustrations, not a promise of a specific aircraft. Availability, configuration and price are confirmed by the operator for your dates.
        {fleet.some((a) => a.credit) && <> Image credits: {Array.from(new Set(fleet.map((a) => a.credit).filter(Boolean))).join("; ")}. Other photographs are public domain (CC0).</>}
      </p>
    </div>
  );
}

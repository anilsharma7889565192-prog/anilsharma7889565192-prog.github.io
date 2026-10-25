"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { ArrowRight, Plus, X } from "lucide-react";
import { PlaceInput } from "./PlaceInput";

type Leg = { from: string; to: string; date: string };
const TRIPS = ["One Way", "Return", "Multi-City"] as const;
const AIRCRAFT = ["Private Jet", "Helicopter", "Not Sure"] as const;

/**
 * Booking-style bar that starts an ENQUIRY. It shows no availability and no prices; it carries what the
 * visitor typed into the full Request a Charter form.
 */
export function EnquiryBar({ initialAircraft = "Not Sure", className = "" }: { initialAircraft?: (typeof AIRCRAFT)[number]; className?: string }) {
  const router = useRouter();
  const uid = useId();
  const [trip, setTrip] = useState<(typeof TRIPS)[number]>("One Way");
  const [aircraft, setAircraft] = useState<(typeof AIRCRAFT)[number]>(initialAircraft);
  const [from, setFrom] = useState(""); const [to, setTo] = useState("");
  const [date, setDate] = useState(""); const [time, setTime] = useState("");
  const [rdate, setRdate] = useState(""); const [rtime, setRtime] = useState("");
  const [pax, setPax] = useState("2");
  const [legs, setLegs] = useState<Leg[]>([]);
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [today, setToday] = useState("");
  useEffect(() => setToday(new Date().toISOString().slice(0, 10)), []);
  const id = (k: string) => `${uid}-${k}`;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!from.trim()) er.from = "Where are you flying from?";
    if (!to.trim()) er.to = "Where would you like to go?";
    if (from.trim() && to.trim() && from.trim().toLowerCase() === to.trim().toLowerCase()) er.to = "Choose a different destination.";
    if (!date) er.date = "Choose a date."; else if (today && date < today) er.date = "Choose a date that has not passed.";
    if (trip === "Return") { if (!rdate) er.rdate = "Choose a return date."; else if (date && rdate < date) er.rdate = "Return cannot be before departure."; }
    const n = Number(pax); if (!pax || !Number.isInteger(n) || n < 1 || n > 500) er.pax = "Enter 1 to 500.";
    setErrs(er);
    if (Object.keys(er).length) { document.getElementById(id(Object.keys(er)[0]))?.focus(); return; }
    const q = new URLSearchParams({ tripType: trip, aircraft, from: from.trim(), to: to.trim(), departDate: date, passengers: String(n) });
    if (time) q.set("departTime", time);
    if (trip === "Return") { q.set("returnDate", rdate); if (rtime) q.set("returnTime", rtime); }
    if (trip === "Multi-City" && legs.length) q.set("additionalDestinations", legs.filter((l) => l.from || l.to).map((l, i) => `Leg ${i + 2}: ${l.from || "?"} to ${l.to || "?"}${l.date ? ` on ${l.date}` : ""}`).join("\n"));
    router.push(`/request-a-charter?${q.toString()}`);
  }

  const lab = "mb-1.5 block text-[0.68rem] font-medium uppercase tracking-[0.14em] text-grey-deep";
  const inp = "input-light";
  const err = (k: string) => (errs[k] ? <p id={`${id(k)}-e`} role="alert" className="mt-1 text-[0.78rem] text-[#b23b30]">{errs[k]}</p> : null);
  const aria = (k: string) => ({ "aria-invalid": errs[k] ? (true as const) : undefined, "aria-describedby": errs[k] ? `${id(k)}-e` : undefined });

  return (
    <form onSubmit={submit} noValidate aria-label="Start a charter enquiry" className={`bg-ivory text-midnight shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)] ${className}`}>
      <div className="h-[2px] w-full bg-gradient-to-r from-gold via-gold/60 to-transparent" />
      <div className="p-5 md:p-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <fieldset className="flex gap-1.5" aria-label="Trip type">
            {TRIPS.map((t) => (
              <label key={t} className="relative cursor-pointer">
                <input type="radio" name={`${uid}-trip`} className="peer sr-only" checked={trip === t} onChange={() => setTrip(t)} />
                <span className="block border border-midnight/20 px-3.5 py-1.5 text-[0.72rem] uppercase tracking-[0.12em] text-grey-deep transition-colors peer-checked:border-midnight peer-checked:bg-midnight peer-checked:text-ivory peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold">{t}</span>
              </label>
            ))}
          </fieldset>
          <fieldset className="flex gap-1.5" aria-label="Aircraft">
            {AIRCRAFT.map((t) => (
              <label key={t} className="relative cursor-pointer">
                <input type="radio" name={`${uid}-ac`} className="peer sr-only" checked={aircraft === t} onChange={() => setAircraft(t)} />
                <span className="block border border-midnight/20 px-3.5 py-1.5 text-[0.72rem] uppercase tracking-[0.12em] text-grey-deep transition-colors peer-checked:border-gold-deep peer-checked:bg-gold/20 peer-checked:text-midnight peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold">{t}</span>
              </label>
            ))}
          </fieldset>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-12">
          <div className="md:col-span-3"><label htmlFor={id("from")} className={lab}>From</label>
            <PlaceInput id={id("from")} name="from" className={inp} placeholder="City or airport" onValueChange={setFrom} {...aria("from")} />{err("from")}</div>
          <div className="md:col-span-3"><label htmlFor={id("to")} className={lab}>To</label>
            <PlaceInput id={id("to")} name="to" className={inp} placeholder="City, airport or venue" onValueChange={setTo} {...aria("to")} />{err("to")}</div>
          <div className="md:col-span-2"><label htmlFor={id("date")} className={lab}>Departure</label>
            <input id={id("date")} type="date" min={today || undefined} value={date} onChange={(e) => setDate(e.target.value)} className={inp} {...aria("date")} />{err("date")}</div>
          <div className="md:col-span-2"><label htmlFor={id("time")} className={lab}>Time <span className="normal-case tracking-normal text-grey">(optional)</span></label>
            <input id={id("time")} type="time" value={time} onChange={(e) => setTime(e.target.value)} className={inp} /></div>
          <div className="md:col-span-2"><label htmlFor={id("pax")} className={lab}>Passengers</label>
            <input id={id("pax")} type="number" inputMode="numeric" min={1} max={500} value={pax} onChange={(e) => setPax(e.target.value)} className={inp} {...aria("pax")} />{err("pax")}</div>

          {trip === "Return" && (
            <>
              <div className="md:col-span-3 md:col-start-7"><label htmlFor={id("rdate")} className={lab}>Return</label>
                <input id={id("rdate")} type="date" min={date || today || undefined} value={rdate} onChange={(e) => setRdate(e.target.value)} className={inp} {...aria("rdate")} />{err("rdate")}</div>
              <div className="md:col-span-3"><label htmlFor={id("rtime")} className={lab}>Return time <span className="normal-case tracking-normal text-grey">(optional)</span></label>
                <input id={id("rtime")} type="time" value={rtime} onChange={(e) => setRtime(e.target.value)} className={inp} /></div>
            </>
          )}
        </div>

        {trip === "Multi-City" && (
          <div className="mt-4 space-y-3">
            {legs.map((l, i) => (
              <div key={i} className="grid gap-3 md:grid-cols-12">
                <div className="md:col-span-4"><label htmlFor={id(`lf${i}`)} className={lab}>Leg {i + 2}: from</label><PlaceInput id={id(`lf${i}`)} name={`leg${i}from`} className={inp} placeholder="City or airport" onValueChange={(v) => setLegs((a) => a.map((x, j) => (j === i ? { ...x, from: v } : x)))} /></div>
                <div className="md:col-span-4"><label htmlFor={id(`lt${i}`)} className={lab}>To</label><PlaceInput id={id(`lt${i}`)} name={`leg${i}to`} className={inp} placeholder="City or airport" onValueChange={(v) => setLegs((a) => a.map((x, j) => (j === i ? { ...x, to: v } : x)))} /></div>
                <div className="md:col-span-3"><label htmlFor={id(`ld${i}`)} className={lab}>Date</label><input id={id(`ld${i}`)} type="date" min={date || today || undefined} value={l.date} onChange={(e) => setLegs((a) => a.map((x, j) => (j === i ? { ...x, date: e.target.value } : x)))} className={inp} /></div>
                <div className="flex items-end md:col-span-1"><button type="button" onClick={() => setLegs((a) => a.filter((_, j) => j !== i))} aria-label={`Remove leg ${i + 2}`} className="flex h-[3.1rem] w-full items-center justify-center border border-midnight/20 text-grey-deep hover:border-midnight"><X size={18} aria-hidden="true" /></button></div>
              </div>
            ))}
            {legs.length < 4 && <button type="button" onClick={() => setLegs((a) => [...a, { from: "", to: "", date: "" }])} className="inline-flex items-center gap-2 text-[0.78rem] uppercase tracking-[0.12em] text-gold-deep hover:text-midnight"><Plus size={15} aria-hidden="true" />Add another leg</button>}
          </div>
        )}

        <div className="mt-6 flex flex-col items-start gap-4 border-t border-midnight/10 pt-5 md:flex-row md:items-center md:justify-between">
          <p className="max-w-2xl text-[0.82rem] leading-relaxed text-grey-deep">This starts an enquiry. Availability and pricing are confirmed by the operator and sent as a quote valid for 48 hours. Nothing is booked until confirmed.</p>
          <button type="submit" className="btn btn-dark shrink-0">Request a Quote<ArrowRight size={16} aria-hidden="true" /></button>
        </div>
        {aircraft === "Helicopter" && <p className="mt-4 border-l border-gold-deep pl-4 text-[0.82rem] text-grey-deep">Helicopter landings depend on permissions, site suitability, operator approval and operational feasibility.</p>}
      </div>
    </form>
  );
}

"use client";

import { useRef, useState, type ReactNode } from "react";
import { LiveScene } from "./LiveScene";

const CATEGORIES = [
  { id: "light", label: "Light", seats: "Typically 4 to 7 passengers", text: "Compact cabins often considered for shorter regional sectors and smaller groups." },
  { id: "midsize", label: "Midsize", seats: "Typically 7 to 9 passengers", text: "A balance of cabin space and range that suits many domestic journeys." },
  { id: "supermid", label: "Super-midsize", seats: "Typically 8 to 10 passengers", text: "Roomier cabins, often with a stand-up aisle, for longer domestic or regional sectors." },
  { id: "large", label: "Large cabin", seats: "Typically 10 to 16 passengers", text: "Long-range cabins for international itineraries and larger travelling parties." },
] as const;

/** Interactive comparison of generic aircraft categories. Text is the content; the 3D model is illustrative. */
export function AircraftExplorer({ poster }: { poster: ReactNode }) {
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]["id"]>("supermid");
  const api = useRef<Record<string, (arg: string) => void> | null>(null);
  const current = CATEGORIES.find((c) => c.id === cat)!;
  const choose = (id: typeof cat) => { setCat(id); api.current?.setCategory(id); };

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
      <div className="relative aspect-[16/10] overflow-hidden bg-[#0c1320] lg:col-span-8">
        {poster}
        <LiveScene shot="viewer" interactive params={{ bg: "#0c1320", category: "supermid" }} onApi={(a) => { api.current = a; a.setCategory(cat); }} />
        <p className="pointer-events-none absolute bottom-3 left-4 z-10 text-[0.72rem] uppercase tracking-[0.18em] text-ivory/50">Drag to rotate · Illustrative model</p>
      </div>
      <div className="lg:col-span-4">
        <div role="group" aria-label="Aircraft category" className="grid grid-cols-2 gap-3">
          {CATEGORIES.map((c) => (
            <button key={c.id} type="button" aria-pressed={cat === c.id} onClick={() => choose(c.id)}
              className={`min-h-[3rem] border px-3 py-2 text-[0.8rem] uppercase tracking-[0.12em] transition-colors ${cat === c.id ? "border-gold bg-gold/12 text-gold" : "border-ivory/20 text-ivory/80 hover:border-ivory/50"}`}>
              {c.label}
            </button>
          ))}
        </div>
        <div aria-live="polite" className="mt-8 border-t border-gold/35 pt-6">
          <h3 className="font-serif text-3xl">{current.label} jets</h3>
          <p className="mt-3 text-gold">{current.seats}</p>
          <p className="mt-3 text-ivory/75">{current.text}</p>
        </div>
        <p className="mt-8 text-sm text-grey">Indicative only. Seating, range and suitability vary by aircraft, configuration and operator, and are confirmed by the operator for each request. The model shown is a generic illustration, not a specific aircraft.</p>
      </div>
    </div>
  );
}

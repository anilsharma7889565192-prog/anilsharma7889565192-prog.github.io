import type { FleetKind } from "@/config/fleet";

/**
 * Indicative top-down cabin plan drawn from the operator-stated passenger capacity.
 * It is a schematic, not a drawing of the operator's actual configuration.
 */
export function CabinPlan({ kind, seats, label }: { kind: FleetKind; seats: number; label: string }) {
  return kind === "Helicopter" ? <HelicopterPlan seats={seats} label={label} /> : <FixedWingPlan kind={kind} seats={seats} label={label} />;
}

const seatClass = "fill-[#2aa7e8]/80 stroke-white";
const crewClass = "fill-[#0b6fb3]/70 stroke-white";

function FixedWingPlan({ kind, seats, label }: { kind: FleetKind; seats: number; label: string }) {
  const rows = Math.ceil(seats / 2);
  const x0 = 150, x1 = 462; // seating run along the cabin
  const step = rows > 1 ? Math.min(46, (x1 - x0) / (rows - 1)) : 0;
  const seatsList: { x: number; y: number }[] = [];
  for (let r = 0; r < rows; r++) {
    seatsList.push({ x: x0 + r * step, y: 62 });
    if (seatsList.length < seats) seatsList.push({ x: x0 + r * step, y: 98 });
  }
  const wing = kind === "Turboprop";
  return (
    <svg viewBox="0 0 640 160" role="img" aria-label={label} className="h-auto w-full">
      {/* wings behind the fuselage */}
      {wing ? (
        <path d="M250 80 L236 6 L330 6 L326 80 L326 80 L330 154 L236 154 Z" fill="#e6f4fd" stroke="#0b6fb3" strokeOpacity=".35" />
      ) : (
        <path d="M270 80 L150 10 L196 6 L360 80 L196 154 L150 150 Z" fill="#e6f4fd" stroke="#0b6fb3" strokeOpacity=".35" />
      )}
      {/* tail */}
      <path d="M40 80 L8 60 L8 100 Z" fill="#e6f4fd" stroke="#0b6fb3" strokeOpacity=".35" />
      {/* fuselage */}
      <path d="M40 46 Q40 38 60 38 L540 38 Q610 52 622 80 Q610 108 540 122 L60 122 Q40 122 40 114 Z" fill="#ffffff" stroke="#0b6fb3" strokeOpacity=".5" strokeWidth="2" />
      {/* galley / lavatory */}
      <rect x="62" y="50" width="60" height="60" rx="6" fill="#e6f4fd" stroke="#0b6fb3" strokeOpacity=".25" />
      {/* cockpit */}
      <rect x="520" y="56" width="22" height="18" rx="4" className={crewClass} strokeWidth="1.5" />
      <rect x="520" y="86" width="22" height="18" rx="4" className={crewClass} strokeWidth="1.5" />
      {seatsList.map((s, i) => (
        <rect key={i} x={s.x - 14} y={s.y - 12} width="28" height="24" rx="7" className={seatClass} strokeWidth="1.5" />
      ))}
      {/* door */}
      <rect x="140" y="36" width="34" height="4" rx="2" fill="#0b6fb3" fillOpacity=".5" />
    </svg>
  );
}

function HelicopterPlan({ seats, label }: { seats: number; label: string }) {
  const pax: { x: number; y: number }[] = [];
  const rows = Math.ceil(seats / 2);
  for (let r = 0; r < rows; r++) {
    const x = 340 + r * 54;
    pax.push({ x, y: 96 });
    if (pax.length < seats) pax.push({ x, y: 134 });
  }
  return (
    <svg viewBox="0 0 640 230" role="img" aria-label={label} className="h-auto w-full">
      {/* main rotor reach */}
      <circle cx="400" cy="115" r="108" fill="none" stroke="#0b6fb3" strokeOpacity=".28" strokeDasharray="6 7" />
      {/* tail boom and rotor */}
      <path d="M280 108 L40 114 L40 118 L280 124 Z" fill="#e6f4fd" stroke="#0b6fb3" strokeOpacity=".4" />
      <circle cx="40" cy="116" r="22" fill="none" stroke="#0b6fb3" strokeOpacity=".28" strokeDasharray="4 5" />
      {/* cabin */}
      <path d="M270 70 Q270 40 320 40 L470 40 Q560 56 568 115 Q560 174 470 190 L320 190 Q270 190 270 160 Z" fill="#ffffff" stroke="#0b6fb3" strokeOpacity=".5" strokeWidth="2" />
      {/* pilots */}
      <rect x="512" y="96" width="28" height="24" rx="7" className={crewClass} strokeWidth="1.5" />
      <rect x="512" y="130" width="28" height="24" rx="7" className={crewClass} strokeWidth="1.5" />
      {pax.map((s, i) => (
        <rect key={i} x={s.x - 14} y={s.y - 12} width="28" height="24" rx="7" className={seatClass} strokeWidth="1.5" transform="translate(0,-4)" />
      ))}
    </svg>
  );
}

import type { FleetKind } from "@/config/fleet";
import { cn } from "@/lib/utils";

/** A translucent "glass" aircraft silhouette. Its drawn size follows the class: smaller class, smaller aircraft. */
export function GlassPlane({ kind, scale, active }: { kind: FleetKind; scale: number; active: boolean }) {
  const id = `gp-${kind.replace(/\s/g, "")}`;
  const stroke = active ? "#ffffff" : "rgba(255,255,255,.75)";
  return (
    <svg viewBox="0 0 260 150" aria-hidden="true" style={{ width: `${Math.round(240 * scale)}px` }} className={cn("h-auto drop-shadow-[0_14px_22px_rgba(4,40,90,.35)] transition-transform duration-500", active && "scale-105")}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity={active ? 0.8 : 0.58} />
          <stop offset="1" stopColor="#bfe3fa" stopOpacity={active ? 0.5 : 0.25} />
        </linearGradient>
      </defs>
      <g fill={`url(#${id})`} stroke={stroke} strokeWidth="2" strokeLinejoin="round">
        {kind === "Helicopter" && (
          <>
            <circle cx="150" cy="70" r="62" fill="none" strokeDasharray="5 6" strokeOpacity=".7" />
            <path d="M105 70 L12 68 L12 78 L105 80 Z" />
            <path d="M96 48 Q96 30 128 30 L170 30 Q214 40 220 70 Q214 100 170 110 L128 110 Q96 110 96 92 Z" />
            <rect x="196" y="56" width="14" height="12" rx="3" />
          </>
        )}
        {kind === "Turboprop" && (
          <>
            <path d="M20 75 L4 58 L4 92 Z" />
            <path d="M100 75 L90 8 L150 8 L146 75 L150 142 L90 142 Z" />
            <path d="M24 56 Q24 50 38 50 L196 50 Q244 58 252 75 Q244 92 196 100 L38 100 Q24 100 24 94 Z" />
            <circle cx="120" cy="30" r="11" fillOpacity=".5" />
            <circle cx="120" cy="120" r="11" fillOpacity=".5" />
          </>
        )}
        {kind === "Large jet" && (
          <>
            <path d="M18 75 L2 52 L2 98 Z" />
            <path d="M120 75 L62 6 L88 4 L170 75 L88 146 L62 144 Z" />
            <path d="M22 56 Q22 48 38 48 L196 48 Q246 58 256 75 Q246 92 196 102 L38 102 Q22 102 22 94 Z" />
            <ellipse cx="46" cy="38" rx="20" ry="7" />
            <ellipse cx="46" cy="112" rx="20" ry="7" />
          </>
        )}
      </g>
    </svg>
  );
}

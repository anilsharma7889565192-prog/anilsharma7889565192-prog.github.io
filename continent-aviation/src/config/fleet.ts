import { operators, type AircraftCategory } from "./operators";

/**
 * The aircraft we arrange. Continent Aviation owns no aircraft: every entry is owned and operated by the
 * named operator, and availability, configuration and price are confirmed by that operator per request.
 * Photos are real photographs of the TYPE (never of a specific aircraft offered), from Wikimedia Commons.
 */
export type FleetKind = "Large jet" | "Turboprop" | "Helicopter";
export const KINDS: FleetKind[] = ["Large jet", "Turboprop", "Helicopter"];

export type FleetAircraft = {
  id: string;
  model: string;
  maker: string;
  kind: FleetKind;
  operatorId: string;
  operator: string;
  /** Operator-stated "up to" passenger capacity. */
  seats: number;
  count?: number;
  note?: string;
  image: string;
  imageAlt: string;
  /** Required attribution for the photo, where its licence asks for one. */
  credit?: string;
  engines: string;
  /** Reference figures for the TYPE (published type data), shown only where verified. */
  perf?: { label: string; value: string }[];
};

const META: Record<string, { id: string; maker: string; image: string; credit?: string; alt: string; engines: string; perf?: { label: string; value: string }[] }> = {
  "Airbus H125": { id: "h125", engines: "Single turboshaft", perf: [{ label: "Cruise speed", value: "about 245 km/h" }, { label: "Range", value: "about 660 km" }], maker: "Airbus Helicopters", image: "/images/fleet/h125.jpg", alt: "An Airbus H125 helicopter on the ground" },
  "Bell 407": { id: "bell407", engines: "Single turboshaft", perf: [{ label: "Cruise speed", value: "about 246 km/h" }, { label: "Range", value: "about 600 km" }], maker: "Bell", image: "/images/fleet/bell407.jpg", alt: "A Bell 407 helicopter on a helipad" },
  "Leonardo AW169": { id: "aw169", engines: "Twin turboshaft", perf: [{ label: "Max speed", value: "about 306 km/h" }, { label: "Range", value: "about 820 km" }], maker: "Leonardo", image: "/images/fleet/aw169.jpg", credit: "AW169 photo: Julian Herzog, CC BY 4.0", alt: "A Leonardo AW169 helicopter on display" },
  "Embraer Legacy 650": { id: "legacy650", engines: "Twin turbofan", maker: "Embraer", image: "/images/fleet/legacy650.jpg", alt: "An Embraer Legacy 650 business jet in flight" },
  "Beechcraft King Air": { id: "kingair", engines: "Twin turboprop", maker: "Beechcraft", image: "/images/fleet/kingair.jpg", credit: "King Air photo: Elen Schurova, CC BY-SA 2.0", alt: "A Beechcraft King Air 350i turboprop on the ground" },
  "Dassault Falcon 2000LX": { id: "falcon2000lx", engines: "Twin turbofan", perf: [{ label: "Max speed", value: "about Mach 0.86" }, { label: "Range", value: "about 7,400 km" }], maker: "Dassault", image: "/images/fleet/falcon2000lx.jpg", alt: "A Dassault Falcon 2000 business jet on the ground" },
  "Embraer Legacy 600": { id: "legacy600", engines: "Twin turbofan", maker: "Embraer", image: "/images/fleet/legacy600.jpg", alt: "An Embraer Legacy 600 business jet on an apron" },
};

const kindOf = (c: AircraftCategory): FleetKind => (c === "Helicopter" ? "Helicopter" : c === "Turboprop" ? "Turboprop" : "Large jet");

export const fleet: FleetAircraft[] = operators.flatMap((o) =>
  o.aircraft.map((a): FleetAircraft => {
    const m = META[a.model];
    return {
      id: m.id, model: a.model, maker: m.maker, kind: kindOf(a.category), operatorId: o.id, operator: o.name,
      seats: a.seats, count: a.count, note: a.note, image: m.image, imageAlt: m.alt, credit: m.credit, engines: m.engines, perf: m.perf,
    };
  }),
);

/** Representative drawing scale, so the size selector shows a smaller aircraft for a smaller class. */
export const KIND_INFO: Record<FleetKind, { blurb: string; scale: number; aircraft: string }> = {
  Helicopter: { blurb: "Short hops, event and wedding transfers, and sites a jet cannot reach, subject to permissions and landing feasibility.", scale: 0.56, aircraft: "helicopter" },
  Turboprop: { blurb: "Efficient on shorter regional sectors and smaller airfields.", scale: 0.78, aircraft: "turboprop" },
  "Large jet": { blurb: "Long, fast sectors with a large cabin and room for the whole group.", scale: 1, aircraft: "jet" },
};

export const enquiryAircraft = (k: FleetKind) => (k === "Helicopter" ? "Helicopter" : "Private Jet");

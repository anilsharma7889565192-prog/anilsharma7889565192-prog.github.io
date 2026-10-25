/**
 * Partner operators and the aircraft they own and operate.
 * Source: each operator's public website, viewed 2026-10-25. To be confirmed in writing by each operator
 * before relying on it. Brokered or leased aircraft are deliberately excluded.
 * Registrations, staff names, phone numbers, flight counts and approvals are NOT published here.
 */
export type AircraftCategory = "Helicopter" | "Large jet" | "Turboprop";

export type OperatorAircraft = {
  model: string;
  category: AircraftCategory;
  /** Operator-stated passenger capacity ("up to"). */
  seats: number;
  /** Shown only when the operator's own pages agree. */
  note?: string;
  count?: number;
};

export type Operator = {
  id: string;
  name: string;
  /** What the operator does, in neutral factual terms. */
  summary: string;
  base: string;
  aircraft: OperatorAircraft[];
};

export const operators: Operator[] = [
  {
    id: "arrow",
    name: "Arrow Aircraft",
    summary:
      "A non-scheduled operator offering aircraft and helicopter charters, with offices in Gurugram (Delhi NCR), Mumbai, Kolkata and the UAE.",
    base: "Offices in Gurugram, Mumbai and Kolkata. Base airport to be confirmed.",
    aircraft: [
      { model: "Airbus H125", category: "Helicopter", seats: 6, count: 2, note: "Single-engine helicopter." },
      { model: "Bell 407", category: "Helicopter", seats: 6, note: "Single-engine helicopter." },
      { model: "Leonardo AW169", category: "Helicopter", seats: 6, note: "Twin-engine helicopter in a VVIP configuration." },
      { model: "Embraer Legacy 650", category: "Large jet", seats: 13, note: "Large-cabin jet." },
      { model: "Beechcraft King Air", category: "Turboprop", seats: 8, note: "Exact model to be confirmed by the operator." },
    ],
  },
  {
    id: "gmr",
    name: "GMR Aviation",
    summary:
      "A charter operator and aircraft manager, part of the GMR Group, based at the general aviation terminal at Indira Gandhi International Airport, New Delhi.",
    base: "Delhi (Indira Gandhi International Airport).",
    aircraft: [
      { model: "Dassault Falcon 2000LX", category: "Large jet", seats: 9, note: "Long-range business jet. Exact variant to be confirmed by the operator." },
      { model: "Embraer Legacy 600", category: "Large jet", seats: 13, note: "Large-cabin jet." },
    ],
  },
];

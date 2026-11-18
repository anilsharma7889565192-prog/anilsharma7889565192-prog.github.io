/** Services we offer. Used by the home page section and the /services page. Photographs are real destinations and venues, never identifiable people. */
export type Service = {
  id: string; title: string; summary: string; image: string; imageAlt: string; credit?: string; type: string; provide: string[]; coordinate: string; factors: string; cta: string; params: Record<string, string>;
};

export const services: Service[] = [
  {
    id: "corporate", title: "Corporate & Executive Travel",
    summary: "Charter enquiries for executives, founders and business teams who need a tailored itinerary, often at short notice.", image: "/images/services/corporate.jpg", imageAlt: "The Mumbai skyline beyond the Bandra-Worli Sea Link", credit: "Woodysworldtv, CC BY 2.0, via Wikimedia Commons",
    type: "Executives, founders and business teams travelling to one or more cities on a defined schedule, sometimes at short notice.",
    provide: ["Cities or airports and the order of travel", "Dates and preferred timings", "Number of passengers and any VIP requirements", "Baggage or equipment", "Whether a return or onward leg is needed"],
    coordinate: "We review the itinerary, approach relevant operators and consolidate the options they propose, so you can compare aircraft, indicative pricing and conditions in one place.",
    factors: "Route length, passenger numbers, airport restrictions, timing flexibility and the number of legs all affect aircraft choice and cost.",
    cta: "Discuss Corporate Travel", params: { purpose: "Corporate Travel" },
  },
  {
    id: "weddings", title: "Destination Weddings",
    summary: "Charter coordination for wedding families, special guests and planners, including multi-city arrivals.", image: "/images/services/weddings.jpg", imageAlt: "The City Palace on the lake in Udaipur, a classic destination wedding setting", credit: "Jakub Hałun, CC BY-SA 4.0, via Wikimedia Commons",
    type: "Wedding families, special guests and planners arranging travel to a destination venue, sometimes from several cities.",
    provide: ["Wedding location and dates", "Departure cities for each group", "Number of guests per movement", "Whether helicopter transfers to the venue are being considered", "Your planner or event team contact, if any"],
    coordinate: "We can liaise with planners and hospitality teams while we approach operators for jet and, where feasible, helicopter options. Landing permissions and site suitability are confirmed by the operator.",
    factors: "Dates in peak wedding season, venue access, the number of separate movements and airport constraints all influence availability and pricing.",
    cta: "Discuss Wedding Travel", params: { purpose: "Destination Wedding" },
  },
  {
    id: "vip-events", title: "VIP & Event Travel",
    summary: "Premium events, conferences and special movements with carefully timed arrivals and departures.", image: "/images/services/vip-events.jpg", imageAlt: "The Taj Mahal Palace hotel in Mumbai, a grand heritage venue", credit: "Joe Ravi, CC BY-SA 3.0, via Wikimedia Commons",
    type: "Premium events, conferences and special movements that require carefully timed arrivals and departures.",
    provide: ["Event dates, venue and schedule", "Arrival and departure windows", "Number of guests or principals", "Any security, protocol or ground handling requirements", "Event team contact details"],
    coordinate: "We share the schedule with relevant operators and coordinate responses, noting where timings or handling requirements need operator confirmation.",
    factors: "Fixed timings, local airport capacity, ground handling and permissions can narrow the options available.",
    cta: "Enquire About Event Travel", params: { purpose: "Event / VIP Movement" },
  },
  {
    id: "family", title: "Private Family Journeys",
    summary: "Private journeys for families and individuals: holidays, celebrations and important occasions.", image: "/images/services/family.jpg", imageAlt: "Rocks on Palolem Beach, South Goa, a coastal holiday destination", credit: "Vachary, CC BY-SA 4.0, via Wikimedia Commons",
    type: "Families and individuals travelling for personal reasons, whether for a holiday, a celebration or an important occasion.",
    provide: ["Destination and dates", "Names are not needed at first, only passenger numbers", "Ages of children or mobility needs", "Pets, baggage and special requests", "Preferred contact method"],
    coordinate: "We take the practical details into account when approaching operators and report back with the options and conditions they provide.",
    factors: "Cabin size, baggage space, airport access and dates are the main factors. Pricing varies by operator and route.",
    cta: "Plan a Private Journey", params: { purpose: "Private / Family Travel" },
  },
  {
    id: "multi-city", title: "Bespoke Multi-City Travel",
    summary: "Itineraries with several stops, groups travelling together, or journeys that do not fit a point-to-point request.", image: "/images/services/multi-city.jpg", imageAlt: "Amber Fort in Rajasthan, one stop on a multi-city journey", credit: "PRITAMDUTTA20, CC BY-SA 4.0, via Wikimedia Commons",
    type: "Itineraries with several stops, groups travelling together, or journeys that do not fit a standard point-to-point request.",
    provide: ["Each city or airport in sequence", "Dates and waiting times at each stop", "Passenger changes between legs", "Any flexibility on routing or timing", "Budget guidance, if you wish"],
    coordinate: "We describe the whole itinerary to operators so that they can quote the complete journey, and highlight any legs that need adjustment.",
    factors: "Number of legs, positioning flights, waiting time, airport charges and the sequence of stops all influence feasibility and cost.",
    cta: "Discuss a Multi-City Itinerary", params: { tripType: "Multi-City" },
  },
  {
    id: "helicopter", title: "Helicopter Transfers",
    summary: "Short transfers for events, weddings and destinations, where a suitable landing site and permissions are in place.", image: "/images/services/helicopter.jpg", imageAlt: "A light helicopter flying over open countryside", credit: "Thomas C. Gray, public domain, via Wikimedia Commons (illustrative image of a light helicopter, not an operator aircraft)",
    type: "Short regional journeys and event or wedding transfers to and from venues that are hard to reach by road or by jet.",
    provide: ["Pick-up and drop-off locations, including the exact landing site if known", "Dates and timings", "Number of passengers and baggage", "Event or venue contact, if relevant", "Flexibility on timing, as weather and permissions apply"],
    coordinate: "We check with the operator whether the transfer is feasible. Landing permissions, site suitability and operator approval are confirmed by the operator before any quote is issued.",
    factors: "Distance, the landing site, daylight and weather, passenger and baggage weight, and permissions all affect feasibility and price.",
    cta: "Enquire About a Helicopter Transfer", params: { aircraft: "Helicopter" },
  },
];


export type Article = {
  slug: string;
  title: string;
  description: string;
  date: string;
  readMinutes: number;
  sections: { heading: string; paragraphs?: string[]; bullets?: string[] }[];
};

export const articles: Article[] = [
  {
    slug: "planning-charter-travel-for-a-destination-wedding",
    title: "Planning charter travel for a destination wedding",
    description: "A practical checklist for families and planners arranging private jet or helicopter travel for wedding guests.",
    date: "2026-10-25",
    readMinutes: 4,
    sections: [
      { heading: "Start with the guest plan, not the aircraft", paragraphs: ["Charter options depend on who is travelling, from where and when. Before you contact anyone, list the groups of guests, their departure cities and the dates they need to arrive and leave. One flight rarely fits everyone, so it helps to know whether you are planning a single movement or several."] },
      { heading: "What to share when you enquire", bullets: ["Departure and destination cities or airports for each group", "Dates and preferred times, and how flexible they are", "Number of passengers and any special needs, such as children, elderly guests or medical requirements", "Baggage and equipment, including wedding items", "The venue name and, if relevant, whether you want to ask about helicopter transfers"] },
      { heading: "Be realistic about helicopters", paragraphs: ["Helicopter transfers to a venue are not always possible. They depend on permissions, a suitable landing site, weather, daylight and the operator's approval. It is better to ask early, and to have a road transfer as a fallback."] },
      { heading: "Allow time", paragraphs: ["Wedding dates are popular, and operators' aircraft may already be committed. Enquiring early gives the operators more room to find a suitable option. A quote is valid for a limited time, so be ready to decide once you receive it."] },
      { heading: "Know who does what", paragraphs: ["Continent Aviation arranges the enquiry and coordinates with the operator. The operator confirms availability, price and terms, and operates the flight. Nothing is booked until the operator confirms."] },
    ],
  },
  {
    slug: "what-to-share-to-get-an-accurate-charter-quote",
    title: "What to share to get an accurate charter quote",
    description: "The details operators need to quote accurately, and why each one matters.",
    date: "2026-10-25",
    readMinutes: 3,
    sections: [
      { heading: "The essentials", bullets: ["Where you are flying from and to, including the airport if you know it", "Dates and timings, and whether there is flexibility", "Number of passengers", "Whether it is one way, return or multi-city"] },
      { heading: "Details that change the quote", bullets: ["Baggage, sports equipment or unusual items", "Waiting time at a destination before returning", "Whether the aircraft needs to stay overnight", "Catering or onboard requests", "Any airport restrictions you know about"] },
      { heading: "Why flexibility helps", paragraphs: ["If you can move your dates or times by a few hours or a day, tell us. Aircraft positioning and availability affect cost, and a flexible plan gives the operator more ways to make it work."] },
      { heading: "What a quote includes", paragraphs: ["A quote should show the aircraft, the operator, itemised costs, the total, the terms and how long the quote is valid. Quotes from operators can change until the charter is confirmed."] },
    ],
  },
  {
    slug: "private-jet-or-helicopter-for-a-short-regional-journey",
    title: "Private jet or helicopter for a short regional journey?",
    description: "How to think about choosing between a jet and a helicopter for a shorter trip.",
    date: "2026-10-25",
    readMinutes: 3,
    sections: [
      { heading: "Start with the endpoints", paragraphs: ["A helicopter can sometimes serve a point that has no airport, but only where there is a suitable, approved landing site. A jet needs an airport that can handle it. The practical choice often depends on where you are starting and finishing."] },
      { heading: "Things that favour a helicopter", bullets: ["Short distances where a road journey is slow", "Destinations without a nearby airport, where a landing site is available and approved", "Small groups with limited baggage"] },
      { heading: "Things that favour a jet", bullets: ["Longer sectors", "Larger groups or more baggage", "Journeys where weather limits helicopter operations", "Travel between established airports"] },
      { heading: "Always confirm the constraints", paragraphs: ["Helicopter landings depend on permissions, site suitability, daylight, weather and operator approval. Jets depend on airport operating hours, slots and runway limits. The operator will confirm what is feasible for your request."] },
    ],
  },
];

export const articleBySlug = (slug: string) => articles.find((a) => a.slug === slug);

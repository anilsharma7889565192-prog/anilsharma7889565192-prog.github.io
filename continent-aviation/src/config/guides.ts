import type { ImageSlot } from "./images";

/**
 * Airport and route guides. Deliberately general: operational details (slots, curfews, terminals, handling)
 * change and are confirmed by the operator for each request.
 */
export type Guide = {
  slug: string;
  title: string;
  city: string;
  slot: ImageSlot;
  description: string;
  intro: string;
  airports: { code: string; name: string; note?: string }[];
  suits: string[];
  check: string[];
  popular: string[];
};

const commonCheck = [
  "Operating hours and any night restrictions at both ends.",
  "Parking and slot availability for your dates, especially in peak periods.",
  "Ground handling and passenger processing arrangements for private flights.",
  "Aircraft limits for the runway and the planned route.",
];

export const guides: Guide[] = [
  {
    slug: "mumbai", title: "Private jet charter from Mumbai", city: "Mumbai", slot: "vip",
    description: "What to know when enquiring about private jet or helicopter charter to and from Mumbai.",
    intro: "Mumbai is one of India's busiest airports, so planning ahead helps. Slot availability and parking can influence which times and aircraft are practical, and the operator will confirm what is feasible for your dates.",
    airports: [{ code: "BOM", name: "Chhatrapati Shivaji Maharaj International Airport" }],
    suits: ["Business travel to other metros and regional cities", "Wedding and event travel to destinations such as Udaipur, Jaipur and Goa", "Helicopter transfers to nearby locations, where permissions and landing sites allow"],
    check: [...commonCheck, "Whether a helicopter transfer is realistic for your pickup and drop-off points."],
    popular: ["Mumbai to Goa", "Mumbai to Udaipur", "Mumbai to Delhi", "Mumbai to Jaipur"],
  },
  {
    slug: "delhi-ncr", title: "Private jet charter from Delhi NCR", city: "Delhi NCR", slot: "jets",
    description: "Planning private jet or helicopter charter from Delhi and the National Capital Region.",
    intro: "Delhi NCR has a major international airport and other airfields in the region. Which one suits your journey depends on your aircraft, your timings and where your passengers are coming from. The operator can advise on the practical options.",
    airports: [{ code: "DEL", name: "Indira Gandhi International Airport" }, { code: "HDO", name: "Hindon Airport", note: "An alternative in the region that may be considered for some flights, subject to the operator's advice." }],
    suits: ["Executive and corporate travel across India", "Travel to hill destinations, subject to weather and permissions", "Group travel for events"],
    check: [...commonCheck, "Which airport in the region is most convenient and practical for your passengers."],
    popular: ["Delhi to Mumbai", "Delhi to Udaipur", "Delhi to Jaipur", "Delhi to Dehradun"],
  },
  {
    slug: "goa", title: "Private jet charter to Goa", city: "Goa", slot: "bespoke",
    description: "Private jet and helicopter charter to Goa: the two airports and what to check.",
    intro: "Goa has two airports, so it is worth telling the operator where your guests are staying. Peak holiday and event periods can be busy, so earlier enquiries leave more room to find a suitable option.",
    airports: [{ code: "GOI", name: "Dabolim Airport" }, { code: "GOX", name: "Manohar International Airport (Mopa)" }],
    suits: ["Leisure and celebration travel", "Corporate retreats and events", "Multi-city itineraries that include Goa"],
    check: [...commonCheck, "Which of the two airports is closer to your destination and whether the operator can use it."],
    popular: ["Mumbai to Goa", "Delhi to Goa", "Bengaluru to Goa", "Hyderabad to Goa"],
  },
  {
    slug: "udaipur", title: "Private jet and helicopter charter to Udaipur", city: "Udaipur", slot: "wedding",
    description: "Charter travel to Udaipur for weddings, events and leisure.",
    intro: "Udaipur is a popular destination for weddings and events. Wedding dates can be in high demand, so share your plan early. If you are considering helicopter transfers to a venue, landing permission and site suitability are confirmed by the operator and are not guaranteed.",
    airports: [{ code: "UDR", name: "Maharana Pratap Airport" }],
    suits: ["Destination wedding guests and families", "Event and VIP movements", "Leisure travel"],
    check: [...commonCheck, "For helicopter transfers: landing sites at or near the venue, permissions and daylight limits."],
    popular: ["Mumbai to Udaipur", "Delhi to Udaipur", "Ahmedabad to Udaipur", "Jaipur to Udaipur"],
  },
  {
    slug: "jaipur", title: "Private jet charter to Jaipur", city: "Jaipur", slot: "private",
    description: "Private jet and helicopter charter to Jaipur: what to plan and what to ask.",
    intro: "Jaipur is a frequent choice for weddings, events and business travel. As with other busy leisure destinations, peak dates can limit options, so it helps to enquire early and tell the operator how flexible you can be.",
    airports: [{ code: "JAI", name: "Jaipur International Airport" }],
    suits: ["Weddings and celebrations", "Corporate events", "Multi-city tours of Rajasthan"],
    check: commonCheck,
    popular: ["Delhi to Jaipur", "Mumbai to Jaipur", "Jaipur to Udaipur", "Jaipur to Jodhpur"],
  },
  {
    slug: "bengaluru", title: "Private jet charter from Bengaluru", city: "Bengaluru", slot: "corporate",
    description: "Planning charter travel from Bengaluru for business and private journeys.",
    intro: "Bengaluru is a hub for business travel across southern India and beyond. Operators will confirm which aircraft and timings are practical, based on your route and passengers.",
    airports: [{ code: "BLR", name: "Kempegowda International Airport" }],
    suits: ["Executive and corporate travel", "Regional travel across the south", "Multi-city business itineraries"],
    check: commonCheck,
    popular: ["Bengaluru to Mumbai", "Bengaluru to Goa", "Bengaluru to Hyderabad", "Bengaluru to Chennai"],
  },
  {
    slug: "hyderabad", title: "Private jet charter from Hyderabad", city: "Hyderabad", slot: "group",
    description: "Charter travel from Hyderabad: airports and planning tips.",
    intro: "Hyderabad has more than one airport. The operator can advise which is practical for your aircraft and passengers, and confirm operating arrangements at each.",
    airports: [{ code: "HYD", name: "Rajiv Gandhi International Airport" }, { code: "BPM", name: "Begumpet Airport", note: "Availability for private flights is confirmed by the operator." }],
    suits: ["Business and executive travel", "Group and event travel", "Multi-city itineraries"],
    check: commonCheck,
    popular: ["Hyderabad to Mumbai", "Hyderabad to Delhi", "Hyderabad to Goa", "Hyderabad to Bengaluru"],
  },
  {
    slug: "dehradun-uttarakhand", title: "Charter travel to Dehradun and Uttarakhand", city: "Dehradun", slot: "helicopter",
    description: "Planning charter travel to Dehradun and the hills: flights, helicopters, permissions and weather.",
    intro: "Journeys into the hills often combine a flight to Dehradun with onward travel. Helicopter operations in mountain areas depend heavily on weather, daylight, permissions and site suitability, and can be changed or cancelled at short notice. Always allow flexibility.",
    airports: [{ code: "DED", name: "Jolly Grant Airport" }, { code: "PGH", name: "Pantnagar Airport" }],
    suits: ["Travel to Dehradun and onward ground or helicopter connections", "Leisure and pilgrimage-related travel, where operators offer it", "Short regional helicopter journeys"],
    check: [...commonCheck, "Weather and visibility, which can delay or cancel flights in the hills.", "Permissions for helicopter landings and the operator's approval of any landing site."],
    popular: ["Delhi to Dehradun", "Dehradun to Delhi"],
  },
];

export const guideBySlug = (slug: string) => guides.find((g) => g.slug === slug);

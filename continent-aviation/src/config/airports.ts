/**
 * Suggestion list for the enquiry bar. Compiled from public IATA airport codes and city names.
 * It is a convenience, not an authority: visitors can always type any place (hotel, venue, helipad).
 * Review before launch; add or remove entries freely.
 */
export type Place = { code?: string; name: string; city: string; country: string };

const IN = "India";
const raw: [string, string, string, string][] = [
  ["DEL", "Indira Gandhi International Airport", "Delhi", IN],
  ["HDO", "Hindon Airport (general aviation)", "Ghaziabad (Delhi NCR)", IN],
  ["BOM", "Chhatrapati Shivaji Maharaj International Airport", "Mumbai", IN],
  ["BLR", "Kempegowda International Airport", "Bengaluru", IN],
  ["HYD", "Rajiv Gandhi International Airport", "Hyderabad", IN],
  ["BPM", "Begumpet Airport", "Hyderabad", IN],
  ["MAA", "Chennai International Airport", "Chennai", IN],
  ["CCU", "Netaji Subhas Chandra Bose International Airport", "Kolkata", IN],
  ["AMD", "Sardar Vallabhbhai Patel International Airport", "Ahmedabad", IN],
  ["PNQ", "Pune Airport", "Pune", IN],
  ["GOI", "Dabolim Airport", "Goa", IN],
  ["GOX", "Manohar International Airport (Mopa)", "Goa", IN],
  ["JAI", "Jaipur International Airport", "Jaipur", IN],
  ["UDR", "Maharana Pratap Airport", "Udaipur", IN],
  ["JDH", "Jodhpur Airport", "Jodhpur", IN],
  ["JSA", "Jaisalmer Airport", "Jaisalmer", IN],
  ["LKO", "Chaudhary Charan Singh International Airport", "Lucknow", IN],
  ["IXC", "Chandigarh International Airport", "Chandigarh", IN],
  ["ATQ", "Sri Guru Ram Dass Jee International Airport", "Amritsar", IN],
  ["SXR", "Srinagar Airport", "Srinagar", IN],
  ["IXL", "Kushok Bakula Rimpochee Airport", "Leh", IN],
  ["IXJ", "Jammu Airport", "Jammu", IN],
  ["DED", "Jolly Grant Airport", "Dehradun", IN],
  ["PGH", "Pantnagar Airport", "Pantnagar", IN],
  ["VNS", "Lal Bahadur Shastri Airport", "Varanasi", IN],
  ["AYJ", "Ayodhya Airport", "Ayodhya", IN],
  ["PAT", "Jay Prakash Narayan Airport", "Patna", IN],
  ["IXR", "Birsa Munda Airport", "Ranchi", IN],
  ["BBI", "Biju Patnaik International Airport", "Bhubaneswar", IN],
  ["RPR", "Swami Vivekananda Airport", "Raipur", IN],
  ["NAG", "Dr. Babasaheb Ambedkar International Airport", "Nagpur", IN],
  ["IDR", "Devi Ahilya Bai Holkar Airport", "Indore", IN],
  ["BHO", "Raja Bhoj Airport", "Bhopal", IN],
  ["HJR", "Khajuraho Airport", "Khajuraho", IN],
  ["COK", "Cochin International Airport", "Kochi", IN],
  ["TRV", "Trivandrum International Airport", "Thiruvananthapuram", IN],
  ["CCJ", "Calicut International Airport", "Kozhikode", IN],
  ["CJB", "Coimbatore International Airport", "Coimbatore", IN],
  ["IXM", "Madurai Airport", "Madurai", IN],
  ["VTZ", "Visakhapatnam Airport", "Visakhapatnam", IN],
  ["VGA", "Vijayawada Airport", "Vijayawada", IN],
  ["TIR", "Tirupati Airport", "Tirupati", IN],
  ["IXE", "Mangaluru International Airport", "Mangaluru", IN],
  ["MYQ", "Mysuru Airport", "Mysuru", IN],
  ["HBX", "Hubballi Airport", "Hubballi", IN],
  ["GAU", "Lokpriya Gopinath Bordoloi International Airport", "Guwahati", IN],
  ["IXB", "Bagdogra Airport", "Siliguri (Bagdogra)", IN],
  ["IXA", "Agartala Airport", "Agartala", IN],
  ["IMF", "Imphal International Airport", "Imphal", IN],
  ["IXU", "Chhatrapati Sambhajinagar Airport", "Aurangabad", IN],
  ["ISK", "Nashik Airport", "Nashik", IN],
  ["SAG", "Shirdi Airport", "Shirdi", IN],
  ["KLH", "Kolhapur Airport", "Kolhapur", IN],
  ["STV", "Surat Airport", "Surat", IN],
  ["BDQ", "Vadodara Airport", "Vadodara", IN],
  ["RAJ", "Rajkot Airport", "Rajkot", IN],
  ["BHJ", "Bhuj Airport", "Bhuj", IN],
  ["JGA", "Jamnagar Airport", "Jamnagar", IN],
  ["KNU", "Kanpur Airport", "Kanpur", IN],
  ["GOP", "Gorakhpur Airport", "Gorakhpur", IN],
  ["IXD", "Prayagraj Airport", "Prayagraj", IN],
  ["KUU", "Bhuntar Airport", "Kullu-Manali", IN],
  ["SLV", "Shimla Airport", "Shimla", IN],
  ["DHM", "Gaggal Airport", "Dharamshala", IN],
  ["IXZ", "Veer Savarkar International Airport", "Port Blair", IN],
  ["DMU", "Dimapur Airport", "Dimapur", IN],
  ["DXB", "Dubai International Airport", "Dubai", "United Arab Emirates"],
  ["DWC", "Al Maktoum International Airport", "Dubai", "United Arab Emirates"],
  ["AUH", "Zayed International Airport", "Abu Dhabi", "United Arab Emirates"],
  ["SHJ", "Sharjah International Airport", "Sharjah", "United Arab Emirates"],
  ["MLE", "Velana International Airport", "Malé", "Maldives"],
  ["KTM", "Tribhuvan International Airport", "Kathmandu", "Nepal"],
  ["CMB", "Bandaranaike International Airport", "Colombo", "Sri Lanka"],
  ["SIN", "Changi Airport", "Singapore", "Singapore"],
  ["BKK", "Suvarnabhumi Airport", "Bangkok", "Thailand"],
  ["LHR", "Heathrow Airport", "London", "United Kingdom"],
];

export const places: Place[] = raw.map(([code, name, city, country]) => ({ code, name, city, country }));

export function labelFor(p: Place) {
  return p.code ? `${p.city} (${p.code}), ${p.name}` : `${p.city}, ${p.name}`;
}

export function searchPlaces(q: string, limit = 8): Place[] {
  const s = q.trim().toLowerCase();
  if (!s) return [];
  const score = (p: Place) => {
    const code = (p.code ?? "").toLowerCase();
    const city = p.city.toLowerCase();
    const name = p.name.toLowerCase();
    if (code === s) return 0;
    if (city.startsWith(s)) return 1;
    if (code.startsWith(s)) return 2;
    if (name.startsWith(s)) return 3;
    if (city.includes(s) || name.includes(s)) return 4;
    return 9;
  };
  return places.map((p) => [score(p), p] as const).filter(([sc]) => sc < 9).sort((a, b) => a[0] - b[0]).slice(0, limit).map(([, p]) => p);
}

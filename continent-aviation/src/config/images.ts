/**
 * Replaceable image slots. Files live in /public/images; a missing file shows a neutral placeholder.
 * The current files are original computer-generated renders of generic, unbranded aircraft and
 * places (see scripts/render-images.mjs). Replace any of them with licensed photography at any time.
 * `position` sets the crop focus (CSS object-position) for narrow screens.
 */
export const images = {
  hero: { file: "hero-jet-dusk.jpg", alt: "A business jet on a wet apron at dusk, with its cabin lights on", position: "72% 55%" },
  jets: { file: "private-jet-exterior.jpg", alt: "A white business jet parked on an apron at blue hour", position: "50% 55%" },
  helicopter: { file: "helicopter-scenic.jpg", alt: "A twin-engine helicopter flying over a forested valley and lake at golden hour", position: "62% 60%" },
  bespoke: { file: "bespoke-travel.jpg", alt: "A business jet with its airstair lowered outside a private aviation terminal at dusk", position: "62% 50%" },
  corporate: { file: "corporate-travel.jpg", alt: "A business jet with its airstair lowered and cabin lights on at dusk", position: "35% 50%" },
  private: { file: "private-journeys.jpg", alt: "Ivory leather club seats and a walnut table with champagne flutes in a private jet cabin", position: "55% 50%" },
  wedding: { file: "destination-wedding.jpg", alt: "A lake palace lit with string lights and floating diyas at dusk", position: "50% 50%" },
  vip: { file: "vip-event.jpg", alt: "A large-cabin business jet outside a glass-fronted private terminal at dusk", position: "40% 50%" },
  group: { file: "group-travel.jpg", alt: "Three business jets of different sizes parked on an apron at blue hour", position: "45% 50%" },
  cta: { file: "cta-aircraft.jpg", alt: "A private jet wing above the clouds at sunset, seen through a cabin window", position: "50% 50%" },
  interior: { file: "cabin-interior.jpg", alt: "A private jet cabin with ivory club seating, walnut tables and warm lighting", position: "50% 50%" },
  apron: { file: "apron-night.jpg", alt: "A business jet on an apron at night under floodlights", position: "30% 50%" },
  about: { file: "about-skyline.jpg", alt: "A business jet flying above a sea of clouds at sunset", position: "40% 50%" },
} as const;

export type ImageSlot = keyof typeof images;

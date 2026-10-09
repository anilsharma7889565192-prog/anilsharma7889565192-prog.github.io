/**
 * Replaceable image slots. Drop a file with the listed name into /public/images and it appears automatically.
 * Slots with no file show a refined neutral placeholder, never a broken image.
 * See IMAGES.md for sizing, licensing and sourcing guidance.
 */
export const images = {
  hero: { file: "hero-jet-dusk.jpg", alt: "A private jet on an airport apron at dusk" },
  jets: { file: "private-jet-exterior.jpg", alt: "A private jet parked on an executive aviation apron" },
  helicopter: { file: "helicopter-scenic.jpg", alt: "A helicopter in flight over a scenic landscape" },
  bespoke: { file: "bespoke-travel.jpg", alt: "Passengers boarding a private aircraft at an executive terminal" },
  corporate: { file: "corporate-travel.jpg", alt: "An executive stepping towards a private jet" },
  private: { file: "private-journeys.jpg", alt: "A private jet cabin with ivory leather seating" },
  wedding: { file: "destination-wedding.jpg", alt: "A destination wedding venue overlooking water at golden hour" },
  vip: { file: "vip-event.jpg", alt: "An executive aviation terminal at dusk" },
  group: { file: "group-travel.jpg", alt: "A larger private aircraft on an apron" },
  cta: { file: "cta-aircraft.jpg", alt: "A private jet wing against an evening sky" },
  interior: { file: "cabin-interior.jpg", alt: "The interior of a private jet cabin" },
  apron: { file: "apron-night.jpg", alt: "An aircraft apron lit at night" },
  about: { file: "about-skyline.jpg", alt: "Evening sky seen from an aircraft window" },
} as const;

export type ImageSlot = keyof typeof images;

/**
 * Replaceable image slots. Files live in /public/images; a missing file shows a neutral placeholder.
 * All files are real photographs (licences and credits in IMAGES.md).
 * `position` sets the crop focus (CSS object-position) for narrow screens.
 */
export const images = {
  hero: { file: "sky.jpg", alt: "A bright blue sky with high cloud", position: "50% 50%" },
  helicopter: { file: "services/helicopter.jpg", alt: "A light helicopter flying over open countryside", position: "50% 50%" },
  jets: { file: "fleet/falcon2000lx.jpg", alt: "A Dassault Falcon 2000 business jet on an apron", position: "50% 50%" },
  bespoke: { file: "services/family.jpg", alt: "Rocks on Palolem Beach in South Goa", position: "50% 50%" },
  corporate: { file: "fleet/legacy650.jpg", alt: "A large business jet in flight against a blue sky", position: "50% 50%" },
  wedding: { file: "services/weddings.jpg", alt: "The City Palace on the lake in Udaipur", position: "50% 50%" },
  private: { file: "services/multi-city.jpg", alt: "Amber Fort near Jaipur, seen through an arch", position: "50% 50%" },
  vip: { file: "services/vip-events.jpg", alt: "The Taj Mahal Palace hotel in Mumbai", position: "50% 50%" },
  group: { file: "fleet/legacy600.jpg", alt: "An Embraer Legacy 600 business jet on an apron", position: "50% 50%" },
  interior: { file: "fleet/kingair.jpg", alt: "A Beechcraft King Air turboprop on an apron", position: "50% 50%" },
  apron: { file: "fleet/legacy600.jpg", alt: "An Embraer Legacy 600 business jet on an apron", position: "50% 50%" },
  cta: { file: "sky.jpg", alt: "A bright blue sky with high cloud", position: "50% 50%" },
  about: { file: "fleet/legacy650.jpg", alt: "A large business jet in flight against a blue sky", position: "50% 50%" },
} as const;

export type ImageSlot = keyof typeof images;

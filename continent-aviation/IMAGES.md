# Imagery

All 13 image slots ship with **original computer-generated renders** made by this project's own 3D engine
(`src/three/`): generic, unbranded aircraft, a fictional terminal, a cabin interior, a lake palace and landscapes.
There are no third-party photos, so there are no licensing obligations. The footer states that imagery is illustrative
and does not depict specific operator aircraft or a company fleet.

## Re-rendering

```bash
npm run dev                         # terminal 1 (studio route only works in development)
npm i -D playwright-core            # once, if not installed
CHROME_PATH=/path/to/chrome node scripts/render-images.mjs            # all slots
CHROME_PATH=/path/to/chrome node scripts/render-images.mjs hero cta   # selected slots
```

Shots are defined in `src/three/scenes/*` (cameras, lighting, sky presets) and mapped to files in
`scripts/render-images.mjs`. Preview any shot at `http://localhost:3000/studio?shot=hero&w=1600&h=900`.

## Replacing with photography

Drop a JPG with the same file name into `public/images/` (or change names in `src/config/images.ts`).
Recommended: 2400px wide for full-width slots, JPEG quality 80-85. Use images you own or that carry a licence
permitting commercial use, and avoid identifiable operator livery or logos unless you have permission,
because the site must not imply that partner aircraft are your own fleet. Update the `alt` text to match.

| File | Used on |
|---|---|
| `hero-jet-dusk.jpg` | Home hero (poster under the live 3D scene) |
| `private-jet-exterior.jpg` | Home service card, Private Jets hero |
| `helicopter-scenic.jpg` | Home service card, Helicopter hero/CTA |
| `bespoke-travel.jpg` | Home service card, Solutions hero |
| `corporate-travel.jpg` | Home, Solutions A |
| `private-journeys.jpg` | Home, Solutions D |
| `destination-wedding.jpg` | Home, Solutions B |
| `vip-event.jpg` | Home, Solutions C, Partnerships hero |
| `group-travel.jpg` | Home, Solutions E, aircraft explorer fallback |
| `cta-aircraft.jpg` | Closing call-to-action bands |
| `cabin-interior.jpg` | Private Jets sourcing section |
| `apron-night.jpg` | How It Works, Contact hero |
| `about-skyline.jpg` | About hero |

## Real photographs and satellite imagery (added 2026-11-18)

All sourced from Wikimedia Commons. Aircraft photos show the aircraft TYPE and are labelled "Illustrative photo of the type" on the site; they are never presented as a specific aircraft offered.

| File | Subject | Licence | Credit shown on site |
|---|---|---|---|
| `public/images/fleet/legacy650.jpg` | Embraer Legacy 650 (ERJ-135BJ) | CC0 | none needed |
| `public/images/fleet/legacy600.jpg` | Embraer Legacy 600 | CC0 | none needed |
| `public/images/fleet/falcon2000lx.jpg` | Dassault Falcon 2000 | CC0 | none needed |
| `public/images/fleet/bell407.jpg` | Bell 407 | CC0 | none needed |
| `public/images/fleet/h125.jpg` | Airbus H125 (Ecureuil) | CC0 | none needed |
| `public/images/fleet/aw169.jpg` | Leonardo/AgustaWestland AW169 | CC BY 4.0, Julian Herzog | yes (Fleet section footnote) |
| `public/images/fleet/kingair.jpg` | Beechcraft King Air 350i | CC BY-SA 2.0, Elen Schurova | yes (Fleet section footnote) |
| `public/images/sky.jpg` | Sky with cirrus (cropped) | CC0 | none needed |
| `public/images/earth/night.jpg` | NASA "City Lights 2012" flat map | Public domain (NASA) | none needed |
| `public/images/earth/day.jpg` | NASA "Blue Marble Next Generation + topography + bathymetry" | Public domain (NASA) | none needed |
| `public/images/earth-poster.jpg` | Still render of the globe scene from the two NASA maps | Derived, public domain inputs | none needed |

Operator logos (`public/images/partners/`) are the operators' own marks, taken from their public websites and shown on the home page "Our Partners" section. Get each operator's written permission before relying on them.

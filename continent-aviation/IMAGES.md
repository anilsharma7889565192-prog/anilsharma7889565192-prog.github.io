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

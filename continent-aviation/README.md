# Continent Aviation website

Next.js 16 (App Router), TypeScript, Tailwind CSS 4, Zod, Lucide icons, Three.js. Fonts (Cormorant Garamond, Inter) are bundled locally, so there are no third-party font requests.

## 3D

`src/three/` is a small real-time engine built on Three.js: procedural generic aircraft (`models/`), scenes (`scenes/`), a dusk sky shader, a wet-apron reflective ground, bloom and a filmic finish (`core/`).

- **Live scenes**: home hero (jet on a dusk apron, drifting with pointer and scroll), Private Jets hero, Helicopter hero, an interactive aircraft-category explorer (drag to rotate) and a globe of India in the home closing section.
- **Rendered stills**: the same engine renders every site image (see `IMAGES.md`), which also serve as posters under the live scenes.
- **Performance and accessibility**: three.js is code-split and loaded only after the page is idle, never before the form or text. Scenes pause off-screen and in background tabs, cap pixel ratio, drop resolution if frames are slow, and give up gracefully (the poster image stays). Reduced-motion users, data-saver users and devices without WebGL2 just see the still. Canvases are `aria-hidden`; all meaning is in the text.

Pages: Home, Private Jets, Helicopter Charters, Charter Solutions, How It Works, About, Request a Charter, Contact, Privacy Policy, Terms and Conditions, plus Partnerships (B2B enquiry form).

## Run locally

```bash
cd continent-aviation
npm install
cp .env.example .env.local   # fill in what you have
npm run dev                  # http://localhost:3000
npm run build && npm start   # production build
npm run typecheck
npm run check-links          # with the server running: crawls all internal links and anchors
```

## Configuration

Everything unverified is read from environment variables (see `.env.example`) through `src/config/site.ts`.
**If a contact value is empty, it is not shown anywhere**, so no placeholder phone number or email is ever published.
`NEXT_PUBLIC_*` variables are inlined at build time, so rebuild or redeploy after changing them.
Set `NEXT_PUBLIC_SITE_URL` to the production domain (used for canonical URLs, sitemap, robots and Open Graph).

## Activating real enquiries

The forms post to `/api/enquiry` and `/api/partnership` (server-side route handlers). Nothing is sent from the browser to third parties, and keys never reach the frontend.
The server validates every submission (Zod), checks origin and content type, applies a honeypot and timing check, and rate-limits per IP.

Choose one or both delivery channels:

1. **Email (Resend):** create an account at resend.com, verify your sending domain, then set `RESEND_API_KEY`, `ENQUIRY_FROM_EMAIL` (an address on the verified domain) and `ENQUIRY_TO_EMAIL` (comma-separated recipients). Replies go to the enquirer's address.
2. **CRM / automation webhook:** set `ENQUIRY_WEBHOOK_URL` (Zapier, Make, a HubSpot or Zoho workflow, etc.) and optionally `ENQUIRY_WEBHOOK_SECRET`, which is sent as `Authorization: Bearer ...`. Payload: `{ kind, reference, receivedAt, fields }`.

Behaviour when nothing is configured:
- **Development:** the form shows a visible "Development mode" notice; submissions are logged to the server console only and the success screen says they were not delivered.
- **Production:** the form shows "Online enquiries are not yet available" and the API returns 503. Submissions are never silently discarded.
If any delivery channel succeeds the enquirer sees success; if all fail they see an error and their entries are preserved.

Rate limiting is in-memory per server instance, which is only a first line of defence on serverless hosting. For stricter protection add Vercel Firewall rate limiting or Upstash Redis.
No database is used. Enquiries live in your email inbox or CRM, so apply that system's retention and access controls.

## Deployment

The enquiry API needs a server runtime, so **GitHub Pages (static only) cannot run this site's forms.** Use a Node-capable host, e.g. Vercel:

1. Import the repository, set the project's **Root Directory** to `continent-aviation`.
2. Add the environment variables from `.env.example`.
3. Deploy, then attach your domain and set `NEXT_PUBLIC_SITE_URL`.

Any Node 20+ host works with `npm run build && npm start`.

Note: the repository root currently contains an unrelated static site (KisanSevak, served via the `CNAME` file). This project lives in its own folder so that site is untouched.

## Replacing imagery

See `IMAGES.md`. Photos are optional until supplied; slots show a neutral placeholder.

## Feature checklist

Done: all 10 pages plus partnerships; live 3D scenes and 13 original rendered images; header with accessible mobile menu (focus trap, Esc, aria-expanded); footer with dynamic year and disclaimer; sticky mobile enquiry bar; breadcrumbs; active nav states; enquiry form with conditional return / multi-city fields, inline and summary errors, loading / success / failure states, duplicate-submit prevention, data preserved on failure, query-string prefill from CTAs; partnership form; server validation, honeypot, timing trap, origin check, rate limit; per-page metadata, canonical URLs, Open Graph image, sitemap, robots, manifest, favicon, minimal Organization JSON-LD (only verified facts); security headers; reduced-motion support; cookie-free optional Plausible analytics; WhatsApp click-to-chat built from config only.

Needs external credentials or content: Resend key or webhook URL (enquiries), contact details, production domain, optional analytics.

## Before public launch, provide

- Legal company name and, if you want it shown, a verified business address.
- Verified business email, phone number and WhatsApp number; confirmed business hours (or leave blank).
- Production domain.
- Resend API key and sender domain (or CRM webhook).
- Optional: licensed photography to replace or complement the rendered imagery (see `IMAGES.md`).
- Social profile URLs (optional) and analytics domain (optional).
- Legal review of `/privacy-policy` and `/terms-and-conditions`. They are sensible drafts for an intermediary model, not legal advice. Confirm regulatory position (e.g. whether any licence or registration applies to your activities) with counsel.
- A named grievance/data-protection contact if required.

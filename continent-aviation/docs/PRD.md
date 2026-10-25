# Continent Aviation: Product Requirements Document

Status: Draft v0.1 · Owner: Company founder · Last updated: 2026-10-25

## 1. Summary

Continent Aviation is a private jet and helicopter charter **arrangement** business in India. It does not own or operate aircraft. It receives charter enquiries, checks availability and quotes with independent aviation operators, and helps clients proceed. The client pays the operator directly.

This document covers phase 2 of the website: a redesign, an enquiry-approval workflow and a set of additions. Phase 1 (marketing site, 3D scenes, enquiry form) is built and merged.

## 2. Goals and non-goals

**Goals**
1. Turn more visits into complete charter enquiries.
2. Let one person (the founder) run the full enquiry-to-booking process without spreadsheets.
3. Build client trust: clear status, honest wording, no false availability.
4. Look and feel like a premium, credible private-aviation brand on mobile and desktop.

**Non-goals (this phase)**
- Online payment gateway (client pays the operator directly).
- Live availability feeds from operators or marketplaces.
- Air ambulance or medical transport.
- Owning, operating or listing aircraft as the company's fleet.
- User accounts for clients (access is via private quote links).

## 3. Users

| User | Needs |
|---|---|
| **Client** (executive, family, wedding planner, event organiser) | Quick, discreet enquiry; clear status; a firm quote with an expiry; no surprises |
| **Founder / admin** (single user) | See every enquiry, record operator answers, approve or decline, send quotes, mark bookings confirmed |
| **Operator** (external) | Receives a clear request by email; no login in this phase |

## 4. Core principles (non-negotiable)

- An enquiry is **not** a booking. A booking shows as confirmed only after the operator confirms and the operator has confirmed payment.
- Availability is never shown as fact. Nothing is promised until the operator confirms.
- No invented fleet, prices, clients, testimonials, certifications or contact details.
- The company arranges charters and is not an operator unless explicitly stated.
- Imagery is illustrative, with no operator liveries or logos.

## 5. Enquiry-to-booking workflow

```
Received → Checking with operator → Approved (quote sent, valid 48 h)
        → Client accepted → Awaiting operator payment → Booking confirmed
Side exits: Declined · Expired (48 h) · Cancelled by client
```

1. **Client submits an enquiry** (existing form; plus a short quick-enquiry on the home page).
2. **System stores it**, emails the client an acknowledgement ("enquiry received, not a booking") and notifies the admin.
3. **Admin checks with the operator** offline (email or phone) and records the answer.
4. **Admin approves or declines** in the admin screen.
   - Approve: enter aircraft category, indicative price, operator terms and payment instructions; the system sets a 48-hour expiry and emails the client a private quote link.
   - Decline: optional note or alternatives; client is emailed.
5. **Client opens the private quote page**, reviews the quote and presses **Accept**. The admin is notified.
6. **Client pays the operator directly** using the operator's instructions shown on the quote page.
7. **Admin marks "Payment received by operator"**, then **"Booking confirmed"**; the client is emailed the confirmation.
8. If the 48 hours pass without acceptance, the quote **expires** automatically and the client is told how to re-enquire.

## 6. Functional requirements

### 6.1 Public site
- **FR-1** Home page with hero, quick enquiry (route, date, passengers), services, who we serve, how it works, trust section, weddings and corporate sections, closing call to action.
- **FR-2** Existing pages retained: Private Jets, Helicopters, Charter Solutions, How It Works, About, Request a Charter, Contact, Partnerships, Privacy, Terms.
- **FR-3** New pages: Cost explainer ("what drives charter pricing", no prices), Airport and route guides, Insights (articles), Empty-leg alerts sign-up.
- **FR-4** Trust section: how operators are vetted, with no fake testimonials, logos or counts.
- **FR-5** WhatsApp quick contact shown **only** when a verified number is configured.
- **FR-6** Live 3D hero and explorer kept, with posters, reduced-motion and low-end fallbacks.

### 6.2 Enquiry and status
- **FR-7** Enquiry form validated on client and server, with spam protection and rate limiting (exists).
- **FR-8** Every enquiry is stored in a database with a unique reference (CA-XXXX).
- **FR-9** Statuses as in section 5, with a timestamped history.
- **FR-10** Client receives emails at: received, quote sent, declined, expired, accepted (receipt), booking confirmed.

### 6.3 Admin (single user)
- **FR-11** Login by emailed sign-in link to the company's official email address only. Session expiry and sign-out. Two-step verification if the host supports it.
- **FR-12** List and filter enquiries by status, date and route; open one for full details.
- **FR-13** Record operator name, operator reply, notes (internal only).
- **FR-14** Approve with quote (category, indicative price, terms, payment instructions) or decline with a note.
- **FR-15** Mark: payment received by operator, booking confirmed, cancelled.
- **FR-16** Resend any client email; view email log.

### 6.4 Private quote page
- **FR-17** Unique, unguessable link per quote; shows only that client's approved option.
- **FR-18** Shows quote, terms, operator payment details, a countdown to the 48-hour expiry, and an Accept button.
- **FR-19** After expiry the link shows "this quote has expired" and a re-enquire button.
- **FR-20** Wording states clearly: payment goes to the operator under the operator's terms; Continent Aviation arranges the charter.

### 6.5 Additions
- **FR-21** Empty-leg alerts: email sign-up by route; admin can send a list. No deals are shown until real operator data exists.
- **FR-22** Airport and route guides: static, editable content.
- **FR-23** Insights: simple article pages with metadata, authored in files.

### 6.6 Partner operators and aircraft (added 2026-10-25)

Two partner operators. Only aircraft that each operator itself owns and operates are listed. Aircraft they broker, or hold under lease, are excluded.

- **FR-24** An "Operators and Aircraft" section lists each partner operator and its aircraft by type: manufacturer and model, category, seats, and "operated by [operator]".
- **FR-25** Wording on every listing: indicative only; availability, aircraft and pricing are confirmed by the operator for each request. Aircraft are never described as Continent Aviation's fleet.
- **FR-26** Do not publish aircraft registrations, staff names or phone numbers, pilgrimage prices, or the operators' own claims (for example flight counts or approvals) as Continent Aviation's.
- **FR-27** Operator photos and logos are used only where the operator has approved them in writing. Until then the site keeps its generic renders. Photos showing identifiable people, manufacturer renders and named-client testimonial portraits are excluded unless cleared.
- **FR-28** Where an operator's own pages conflict (see below), publish only the version the operator confirms. Until confirmed, show the category only.

**Initial listing (from public pages, viewed 2026-10-25; to be confirmed with each operator)**

| Operator | Aircraft | Category | Seats | Note |
|---|---|---|---|---|
| Arrow Aircraft | Airbus H125 (2) | Helicopter | up to 6 | On its NSOP per fleet page |
| Arrow Aircraft | Bell 407 (1) | Helicopter | up to 6 | |
| Arrow Aircraft | Leonardo AW169 (1) | Helicopter | up to 6 (VVIP) | |
| Arrow Aircraft | Embraer Legacy 650 (1) | Large jet | up to 13 | Operator's pages disagree on range class |
| Arrow Aircraft | Beechcraft King Air (1) | Turboprop | up to 8 | Model conflict: B200GT (fleet page) vs 250 (charters page) |
| GMR Aviation | Dassault Falcon 2000LX (1) | Large jet | 9 | Operator's pages say both "2000LX" and "2000EX" |
| GMR Aviation | Embraer Legacy 600 (1) | Large jet | 13 | Category and altitude figures inconsistent on its pages |

Excluded: Arrow's leased Bombardier Challenger 604 and Sikorsky S-76C++; the further types on Arrow's charters page (for example Phenom, Citation, Hawker, Learjet, G150, Falcon, Lineage, Agusta) unless Arrow confirms it operates them; any GMR helicopter (not confirmed).

**Still needed from operators**: NSOP numbers (if they agree to publication), base airports (Arrow's are not stated), seat counts, written approval for names, logos and photos, and quote turnaround and payment-instruction preferences.

Source data is kept as an unverified working record, not for publication.

## 7. Redesign requirements

- **RD-1** Direction (recommended, to confirm): **light editorial**. Ivory and white lead; midnight navy for the hero and key bands; champagne gold as a restrained accent; Cormorant Garamond and Inter retained.
- **RD-2** Larger imagery, more whitespace, calmer motion; reuse the rendered imagery and 3D scenes, re-balanced for the new palette.
- **RD-3** Quick enquiry above the fold on the home page and prominent on mobile.
- **RD-4** Redesigned header, footer, forms and status components as a single design system.
- **RD-5** WCAG 2.2 AA contrast, keyboard access and visible focus.

## 8. Data model (initial)

- **Enquiry**: id, reference, createdAt, client (name, company, email, phone, preferred contact), journey (aircraft, trip type, from, to, dates and times, passengers, baggage, extra stops), purpose, budget, notes, consent, status, statusHistory.
- **Quote**: id, enquiryId, aircraftCategory, indicativePrice, currency, terms, operatorName (internal), operatorPaymentInstructions, token (hashed), expiresAt, acceptedAt, status.
- **EmailLog**: id, enquiryId, type, sentAt, status.
- **AlertSubscription**: id, email, route, createdAt, consent, unsubscribedAt.
- **AdminSession**: handled by the auth provider.

Stack suggestion: keep Next.js and Vercel; add Postgres (for example Vercel Postgres, Neon or Supabase); send email through Resend; use a vetted auth library with email sign-in links. All secrets stay server-side.

## 9. Non-functional requirements

- **Security**: server-side validation; hashed quote tokens; admin routes protected; rate limiting; no card data handled; audit trail of status changes.
- **Privacy**: collect only what's needed; retention policy; consent recorded; data export and deletion on request; update Privacy Policy for stored enquiries.
- **Performance**: LCP under 2.5 s on mobile 4G for the home page; 3D loads after idle; images optimised.
- **Reliability**: enquiry never lost; if email fails, the enquiry is still stored and the admin is notified in the dashboard.
- **Accessibility**: WCAG 2.2 AA.
- **SEO**: unique titles, descriptions, canonical URLs, sitemap, structured data only for verified facts.

## 10. Success metrics

- Enquiry completion rate (visits to submitted enquiries).
- Time from enquiry to first reply.
- Share of quotes accepted before expiry.
- Enquiries recorded without data loss (target 100%).
- Lighthouse performance and accessibility scores.

## 11. Dependencies and open questions

**Needed from the owner**
- Confirm the domain spelling (continentaviation.in), mailbox (enquiries@) and the admin email address.
- Confirm the redesign direction (light editorial recommended).
- Resend account, domain verification and sender address.
- Operator agreements, including commission, cancellation and refund terms.
- Legal review of Privacy, Terms and the quote page wording; accountant advice on GST for commissions.
- Verified phone and WhatsApp numbers.

**Open questions**
- Which operators will supply quotes first, and how will payment instructions be shown (bank details, or the operator's own link)?
- How long should data be retained for expired and declined enquiries?
- Should clients be able to cancel from the quote link?

## 12. Milestones

1. **M1: Redesign** (design system, home, key pages).
2. **M2: Database and enquiry storage** (stores every enquiry; emails; no regression to the current form).
3. **M3: Admin and approval flow** (login, list, approve or decline, quote page, expiry, emails).
4. **M4: Additions** (cost explainer, guides, insights, alerts, trust section, WhatsApp).
5. **M5: Launch** (domain, email, Vercel, legal review, test pass).

## 13. Risks

| Risk | Mitigation |
|---|---|
| Single admin is a bottleneck or single point of failure | Dashboard reminders for stale enquiries; backup contact email |
| Operators reply slowly, so quotes expire | 48 h expiry is shown clearly; easy re-quote in admin |
| Misleading availability claims | Wording rules in section 4; legal review |
| Stored personal data | Minimal fields, access control, retention policy |
| Regulatory position unclear | Take legal advice before launch |

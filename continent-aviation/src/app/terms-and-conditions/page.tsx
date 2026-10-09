import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { site } from "@/config/site";
import { pageMeta } from "@/lib/metadata";

export const metadata = pageMeta("/terms-and-conditions", "Terms and Conditions", "Terms governing use of the Continent Aviation website and the nature of charter enquiries and arrangements made through independent aviation operators.");

export default function Page() {
  return (
    <LegalPage title="Terms and Conditions" label="Terms and Conditions" updated="October 2026">
      <p>These terms apply to your use of this website and to enquiries made through it.</p>

      <h2>Who we are and what we do</h2>
      <p>{site.name} arranges charter enquiries and coordinates bookings through independent aviation operators. We do not own aircraft, and we are not an aircraft operator unless separately and explicitly stated in writing for a particular arrangement.</p>

      <h2>Enquiries are not bookings</h2>
      <p>Submitting an enquiry, receiving an acknowledgement, or receiving a quotation does not create a booking. A charter is confirmed only when the operator has confirmed availability, pricing and terms, and the required booking documentation and payment have been completed under the operator&apos;s terms.</p>

      <h2>Information on this website</h2>
      <p>Content on this website is general information. It does not constitute an offer, a quotation or a promise of availability. Aircraft, routes, landing locations, services and prices described are subject to operator confirmation.</p>

      <h2>Quotations and pricing</h2>
      <p>Quotations are provided by operators and may be indicative. Prices can change until confirmed, including because of availability, fuel, airport and handling charges, taxes and timing.</p>

      <h2>Operators&apos; responsibilities</h2>
      <p>The contracted operator is responsible for operating the flight, including crew, aircraft, safety, regulatory compliance and operational decisions. Flights are subject to aircraft availability, regulatory approvals and permissions, weather, safety and operational feasibility. Operators may delay, change or cancel flights in accordance with their terms.</p>

      <h2>Payment, changes and cancellation</h2>
      <p>Payment, amendment and cancellation terms are set out in the operator&apos;s booking documentation and apply to your booking. Please review them before confirming.</p>

      <h2>Your responsibilities</h2>
      <p>Please provide accurate information, and ensure all passengers hold valid identification and any travel documents the journey requires.</p>

      <h2>Limitation of liability</h2>
      <p>To the extent permitted by law, we are not liable for acts or omissions of independent operators, or for delays, changes or cancellations outside our reasonable control. Nothing in these terms limits liability that cannot be limited by law.</p>

      <h2>Intellectual property</h2>
      <p>Website content, branding and design belong to {site.name} or its licensors and may not be reproduced without permission.</p>

      <h2>Privacy</h2>
      <p>Our handling of personal information is described in the <Link href="/privacy-policy">Privacy Policy</Link>.</p>

      <h2>Governing law</h2>
      <p>These terms are governed by the laws of India. Courts in India will have jurisdiction, subject to any mandatory rules that apply to you.</p>

      <h2>Changes</h2>
      <p>We may update these terms and will revise the date above when we do.</p>
    </LegalPage>
  );
}

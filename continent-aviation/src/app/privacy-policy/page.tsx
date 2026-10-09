import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { site } from "@/config/site";
import { pageMeta } from "@/lib/metadata";

export const metadata = pageMeta("/privacy-policy", "Privacy Policy", "How Continent Aviation collects, uses and protects personal information submitted through its website enquiry forms.");

export default function Page() {
  const email = site.contact.email;
  return (
    <LegalPage title="Privacy Policy" label="Privacy Policy" updated="October 2026">
      <p>This policy explains how Continent Aviation (&ldquo;we&rdquo;, &ldquo;us&rdquo;) handles personal information collected through this website. We aim to collect only what is needed to respond to your enquiry.</p>

      <h2>Information we collect</h2>
      <p>When you submit a charter or partnership enquiry, we collect the details you provide: your name, organisation, email address, phone number, preferred contact method, journey details (such as locations, dates, passenger numbers, baggage and notes), purpose of travel, and any optional budget information.</p>
      <p>We do not ask for passport numbers, identity documents or payment card details through the enquiry forms. Please do not include them in free-text fields. If these are needed later, we will explain how they are to be provided securely.</p>

      <h2>How we use it</h2>
      <ul>
        <li>To review your requirement and contact you about it.</li>
        <li>To request options and quotations from aviation operators on your behalf.</li>
        <li>To keep a record of the enquiry and respond to follow-up questions.</li>
        <li>To protect the website against spam and misuse.</li>
      </ul>

      <h2>Sharing with operators and service providers</h2>
      <p>Because we arrange charters through independent aviation operators, we share the relevant journey details with the operators we approach so that they can quote. We share contact details only as needed to progress your enquiry. Operators handle information under their own privacy practices once they receive it.</p>
      <p>We use service providers to run the website and deliver enquiries (for example hosting and email delivery). They process data on our behalf for those purposes only.</p>

      <h2>Legal basis and consent</h2>
      <p>We process your information with your consent, given when you submit the enquiry form, and as needed to respond to your request. We handle personal data in line with applicable Indian data protection law, including the Digital Personal Data Protection Act, 2023, as it applies.</p>

      <h2>Retention</h2>
      <p>We keep enquiry information only for as long as needed to deal with your enquiry and any resulting arrangement, and as required by law. We then delete or anonymise it.</p>

      <h2>Cookies and analytics</h2>
      <p>The website does not use advertising cookies. {site.analytics.plausibleDomain ? "We use a privacy-focused analytics service that does not use cookies or collect personal data to measure aggregate visits." : "Privacy-focused, cookie-free analytics may be enabled to measure aggregate visits."}</p>

      <h2>Your rights</h2>
      <p>Subject to applicable law, you may ask to access, correct or erase your personal information, withdraw consent, or raise a concern about how it is handled.{" "}
        {email ? <>Contact us at <a href={`mailto:${email}`}>{email}</a>.</> : <>Please contact us through the <Link href="/contact">contact page</Link>.</>}</p>

      <h2>Security</h2>
      <p>Enquiries are sent over encrypted connections and validated on our servers. No method of transmission or storage is completely secure, but we take reasonable steps to protect your information.</p>

      <h2>Changes</h2>
      <p>We may update this policy and will revise the date above when we do.</p>
    </LegalPage>
  );
}

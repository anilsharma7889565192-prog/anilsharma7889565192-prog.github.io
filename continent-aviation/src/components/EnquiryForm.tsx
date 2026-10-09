"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { enquirySchema, toFieldErrors, BUDGETS, PURPOSES } from "@/lib/validation";
import { Choice, ErrorSummary, Field, SectionTitle, Spinner, type Errors } from "./form-bits";

export type Fallback = { email?: string; phone?: string; whatsappUrl?: string };

const LABELS: Record<string, string> = {
  fullName: "Full name", email: "Email", phone: "Phone", contactMethod: "Preferred contact method", aircraft: "Aircraft preference",
  tripType: "Trip type", from: "Departure", to: "Destination", departDate: "Departure date", returnDate: "Return date",
  passengers: "Passengers", purpose: "Purpose", consent: "Consent", form: "Form",
};

const TRIP_TYPES = ["One Way", "Return", "Multi-City"] as const;
const AIRCRAFT = ["Private Jet", "Helicopter", "Not Sure"] as const;
const CONTACT = ["Phone", "WhatsApp", "Email"] as const;

type Status = "idle" | "submitting" | "success" | "error";

export function EnquiryForm({ deliveryReady, isProduction, fallback }: { deliveryReady: boolean; isProduction: boolean; fallback: Fallback }) {
  const params = useSearchParams();
  const pick = <T extends readonly string[]>(key: string, list: T): T[number] | undefined => {
    const v = params.get(key);
    return v && (list as readonly string[]).includes(v) ? v : undefined;
  };

  const [tripType, setTripType] = useState<string>(pick("tripType", TRIP_TYPES) ?? "One Way");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverMsg, setServerMsg] = useState("");
  const [result, setResult] = useState<{ reference: string; mode: string } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const mountedAt = useRef(0);
  const touched = useRef<Set<string>>(new Set());
  const [today, setToday] = useState("");

  useEffect(() => {
    mountedAt.current = Date.now();
    setToday(new Date().toISOString().slice(0, 10));
  }, []);

  function collect() {
    const fd = new FormData(formRef.current!);
    const g = (k: string) => String(fd.get(k) ?? "");
    return {
      fullName: g("fullName"), company: g("company"), email: g("email"), phone: g("phone"), contactMethod: g("contactMethod"),
      aircraft: g("aircraft"), tripType: g("tripType"), from: g("from"), to: g("to"), departDate: g("departDate"), departTime: g("departTime"),
      returnDate: g("tripType") === "Return" ? g("returnDate") : "", returnTime: g("tripType") === "Return" ? g("returnTime") : "",
      passengers: g("passengers"), baggage: g("baggage"), additionalDestinations: g("tripType") === "Multi-City" ? g("additionalDestinations") : "",
      purpose: g("purpose"), budget: g("budget"), notes: g("notes"), consent: fd.get("consent") === "on",
      website: g("website"), elapsedMs: Date.now() - mountedAt.current,
    };
  }

  function validateField(name: string) {
    touched.current.add(name);
    const r = enquirySchema.safeParse(collect());
    const all = r.success ? {} : toFieldErrors(r.error);
    setErrors((prev) => {
      const next = { ...prev };
      if (all[name]) next[name] = all[name]; else delete next[name];
      return next;
    });
  }
  const onBlur = (e: React.FocusEvent<HTMLFormElement>) => {
    const n = (e.target as unknown as HTMLInputElement).name;
    if (n && n !== "website") validateField(n);
  };
  const onInput = (e: React.FormEvent<HTMLFormElement>) => {
    const n = (e.target as unknown as HTMLInputElement).name;
    if (n && errors[n]) validateField(n);
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;
    const data = collect();
    const parsed = enquirySchema.safeParse(data);
    if (!parsed.success) {
      setErrors(toFieldErrors(parsed.error));
      setStatus("idle");
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setErrors({});
    setServerMsg("");
    setStatus("submitting");
    try {
      const res = await fetch("/api/enquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const body = await res.json().catch(() => ({}));
      if (res.ok && body.ok) {
        setResult({ reference: body.reference, mode: body.mode });
        setStatus("success");
        requestAnimationFrame(() => successRef.current?.focus());
        return;
      }
      if (res.status === 422 && body.fieldErrors) {
        setErrors(body.fieldErrors);
        setStatus("idle");
        requestAnimationFrame(() => summaryRef.current?.focus());
        return;
      }
      setServerMsg(body.message ?? "We could not send your enquiry. Your details are still here, so please try again.");
      setStatus("error");
    } catch {
      setServerMsg("We could not reach the server. Please check your connection and try again. Your details are still here.");
      setStatus("error");
    }
    requestAnimationFrame(() => bannerRef.current?.focus());
  }

  if (status === "success" && result) {
    return (
      <div ref={successRef} tabIndex={-1} role="status" className="border border-gold/50 bg-navy p-8 outline-none md:p-14">
        <p className="eyebrow">Enquiry received</p>
        <h2 className="mt-4 font-serif text-4xl md:text-5xl">Thank you.</h2>
        <span className="rule mt-7" />
        <p className="mt-7 max-w-2xl text-[1.1rem] text-ivory/90">
          Thank you for contacting Continent Aviation. Your charter enquiry has been received. Our team will review your requirements and contact you regarding the next steps. This is an enquiry acknowledgement, not a flight booking confirmation.
        </p>
        <p className="mt-6 text-sm text-grey">Reference: <span className="font-medium text-ivory">{result.reference}</span></p>
        {result.mode === "development" && (
          <p className="mt-8 border border-gold/60 p-4 text-sm text-gold">
            Development mode: email delivery is not configured, so this enquiry was only logged to the server console and has not been sent to anyone. See the README to activate real submissions.
          </p>
        )}
        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/" className="btn btn-ghost">Return home</Link>
          <Link href="/how-it-works" className="btn btn-ghost">What happens next</Link>
        </div>
      </div>
    );
  }

  const submitting = status === "submitting";
  const showFallback = status === "error" && (fallback.email || fallback.phone || fallback.whatsappUrl);

  return (
    <form ref={formRef} onSubmit={onSubmit} onBlur={onBlur} onInput={onInput} noValidate aria-describedby="form-note" className="space-y-16">
      {!deliveryReady && (
        <div className="border border-gold/60 bg-gold/8 p-5 text-[0.95rem]" role="note">
          {isProduction ? (
            <p><strong className="font-medium text-gold">Online enquiries are not yet available.</strong> Submissions cannot be delivered until the site&apos;s enquiry service is configured. Please check back shortly.</p>
          ) : (
            <p><strong className="font-medium text-gold">Development mode.</strong> No email provider or webhook is configured. Submissions will only be logged to the server console and not delivered. See the README section &ldquo;Activating real enquiries&rdquo;.</p>
          )}
        </div>
      )}

      <ErrorSummary errors={errors} labels={LABELS} refEl={summaryRef} />

      {status === "error" && (
        <div ref={bannerRef} tabIndex={-1} role="alert" className="border border-[#e58b82]/60 bg-[#e58b82]/8 p-6 outline-none">
          <p className="font-serif text-2xl">Your enquiry has not been sent</p>
          <p className="mt-2">{serverMsg}</p>
          {showFallback && (
            <p className="mt-3 text-[0.95rem]">
              You can also reach us directly:{" "}
              {[fallback.email && <a key="e" className="underline underline-offset-4" href={`mailto:${fallback.email}`}>{fallback.email}</a>,
                fallback.phone && <a key="p" className="underline underline-offset-4" href={`tel:${fallback.phone.replace(/[^\d+]/g, "")}`}>{fallback.phone}</a>,
                fallback.whatsappUrl && <a key="w" className="underline underline-offset-4" href={fallback.whatsappUrl} target="_blank" rel="noopener noreferrer">WhatsApp</a>]
                .filter(Boolean).reduce<React.ReactNode[]>((a, x, i) => (i ? [...a, " · ", x] : [x]), [])}
            </p>
          )}
        </div>
      )}

      <p id="form-note" className="text-sm text-grey">Fields marked optional can be left blank. Submitting this form is an enquiry only. It does not book a flight.</p>

      {/* 01 */}
      <section aria-labelledby="s1">
        <SectionTitle n="01" title="Contact details" />
        <h3 id="s1" className="sr-only">Contact details</h3>
        <div className="grid gap-x-8 gap-y-7 md:grid-cols-2">
          <Field name="fullName" label="Full name" error={errors.fullName}>
            {(p) => <input {...p} name="fullName" type="text" autoComplete="name" required className="input" />}
          </Field>
          <Field name="company" label="Company / organisation" optional error={errors.company}>
            {(p) => <input {...p} name="company" type="text" autoComplete="organization" className="input" />}
          </Field>
          <Field name="email" label="Email address" error={errors.email}>
            {(p) => <input {...p} name="email" type="email" autoComplete="email" inputMode="email" required className="input" />}
          </Field>
          <Field name="phone" label="Phone number with country code" error={errors.phone} hint="For example +91 98765 43210">
            {(p) => <input {...p} name="phone" type="tel" autoComplete="tel" inputMode="tel" required placeholder="+91" className="input" />}
          </Field>
          <div className="md:col-span-2">
            <Choice name="contactMethod" legend="Preferred contact method" options={CONTACT} defaultValue="Phone" error={errors.contactMethod} />
          </div>
        </div>
      </section>

      {/* 02 */}
      <section aria-labelledby="s2">
        <SectionTitle n="02" title="Journey details" />
        <h3 id="s2" className="sr-only">Journey details</h3>
        <div className="grid gap-x-8 gap-y-7 md:grid-cols-2">
          <div className="md:col-span-2"><Choice name="aircraft" legend="Aircraft preference" options={AIRCRAFT} defaultValue={pick("aircraft", AIRCRAFT) ?? "Not Sure"} error={errors.aircraft} /></div>
          <div className="md:col-span-2"><Choice name="tripType" legend="Trip type" options={TRIP_TYPES} defaultValue={tripType} onChange={setTripType} error={errors.tripType} /></div>
          <Field name="from" label="Departure city / airport" error={errors.from}>
            {(p) => <input {...p} name="from" type="text" required autoComplete="off" className="input" />}
          </Field>
          <Field name="to" label="Destination city / airport" error={errors.to}>
            {(p) => <input {...p} name="to" type="text" required autoComplete="off" className="input" />}
          </Field>
          <Field name="departDate" label="Departure date" error={errors.departDate}>
            {(p) => <input {...p} name="departDate" type="date" required min={today || undefined} className="input" />}
          </Field>
          <Field name="departTime" label="Preferred departure time" optional error={errors.departTime}>
            {(p) => <input {...p} name="departTime" type="time" className="input" />}
          </Field>
          {tripType === "Return" && (
            <>
              <Field name="returnDate" label="Return date" error={errors.returnDate}>
                {(p) => <input {...p} name="returnDate" type="date" min={today || undefined} className="input" />}
              </Field>
              <Field name="returnTime" label="Return time" optional error={errors.returnTime}>
                {(p) => <input {...p} name="returnTime" type="time" className="input" />}
              </Field>
            </>
          )}
          <Field name="passengers" label="Number of passengers" error={errors.passengers}>
            {(p) => <input {...p} name="passengers" type="number" inputMode="numeric" min={1} max={500} required className="input" />}
          </Field>
          {tripType === "Multi-City" && (
            <div className="md:col-span-2">
              <Field name="additionalDestinations" label="Additional destinations" optional error={errors.additionalDestinations} hint="List each further city or airport in order, with dates if you have them.">
                {(p) => <textarea {...p} name="additionalDestinations" rows={3} maxLength={1000} className="input" />}
              </Field>
            </div>
          )}
          <div className="md:col-span-2">
            <Field name="baggage" label="Baggage / special requirements" optional error={errors.baggage}>
              {(p) => <textarea {...p} name="baggage" rows={3} maxLength={1000} className="input" />}
            </Field>
          </div>
        </div>
      </section>

      {/* 03 */}
      <section aria-labelledby="s3">
        <SectionTitle n="03" title="Purpose of travel" />
        <h3 id="s3" className="sr-only">Purpose of travel</h3>
        <Choice name="purpose" legend="Purpose" options={PURPOSES} defaultValue={pick("purpose", PURPOSES)} error={errors.purpose} />
      </section>

      {/* 04 */}
      <section aria-labelledby="s4">
        <SectionTitle n="04" title="Additional information" />
        <h3 id="s4" className="sr-only">Additional information</h3>
        <div className="grid gap-7">
          <Field name="budget" label="Budget range" optional error={errors.budget} hint="Optional. Sharing a range can help operators propose suitable aircraft. It is not a commitment.">
            {(p) => (
              <select {...p} name="budget" className="input" defaultValue="">
                {BUDGETS.map((b) => <option key={b} value={b}>{b || "Select a range"}</option>)}
              </select>
            )}
          </Field>
          <Field name="notes" label="Additional notes" optional error={errors.notes}>
            {(p) => <textarea {...p} name="notes" rows={5} maxLength={3000} className="input" />}
          </Field>
        </div>
      </section>

      {/* 05 */}
      <section aria-labelledby="s5">
        <SectionTitle n="05" title="Privacy" />
        <h3 id="s5" className="sr-only">Privacy</h3>
        <div className="field">
          <label className="!mb-0 flex cursor-pointer items-start gap-4 !normal-case !tracking-normal !text-[0.98rem] !font-normal">
            <input id="f-consent" name="consent" type="checkbox" required aria-invalid={errors.consent ? true : undefined} aria-describedby={errors.consent ? "f-consent-err" : undefined}
              className="mt-1 h-5 w-5 shrink-0 accent-[#c8a96b]" />
            <span>I consent to Continent Aviation using these details to process my enquiry and contact me about it, and to share the relevant journey details with aviation operators for quotations. See the <Link href="/privacy-policy" className="text-gold underline underline-offset-4">Privacy Policy</Link>.</span>
          </label>
          {errors.consent && <p id="f-consent-err" className="field-error" role="alert">{errors.consent}</p>}
        </div>
      </section>

      {/* honeypot */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>Leave this field empty<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <div className="flex flex-col items-start gap-5 border-t border-gold/35 pt-10 sm:flex-row sm:items-center">
        <button type="submit" disabled={submitting} aria-disabled={submitting} className="btn btn-gold min-w-[16rem]">
          {submitting ? <><Spinner /> Sending enquiry</> : "Submit Charter Enquiry"}
        </button>
        <p className="text-sm text-grey" aria-live="polite">{submitting ? "Sending your enquiry, please wait." : "This is an enquiry, not a booking."}</p>
      </div>
    </form>
  );
}

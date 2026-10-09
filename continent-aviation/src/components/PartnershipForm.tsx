"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { PARTNER_CATEGORIES, partnershipSchema, toFieldErrors } from "@/lib/validation";
import { ErrorSummary, Field, Spinner, type Errors } from "./form-bits";

const LABELS: Record<string, string> = { organisation: "Organisation", contactPerson: "Contact person", email: "Business email", category: "Category", description: "Description", consent: "Consent" };

export function PartnershipForm({ deliveryReady, isProduction }: { deliveryReady: boolean; isProduction: boolean }) {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");
  const [mode, setMode] = useState("live");
  const ref = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const mountedAt = useRef(0);
  useEffect(() => { mountedAt.current = Date.now(); }, []);

  const collect = () => {
    const fd = new FormData(ref.current!);
    const g = (k: string) => String(fd.get(k) ?? "");
    return { organisation: g("organisation"), contactPerson: g("contactPerson"), email: g("email"), phone: g("phone"), category: g("category"), description: g("description"), consent: fd.get("consent") === "on", website: g("website"), elapsedMs: Date.now() - mountedAt.current };
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;
    const data = collect();
    const parsed = partnershipSchema.safeParse(data);
    if (!parsed.success) { setErrors(toFieldErrors(parsed.error)); requestAnimationFrame(() => summaryRef.current?.focus()); return; }
    setErrors({}); setStatus("submitting");
    try {
      const res = await fetch("/api/partnership", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const body = await res.json().catch(() => ({}));
      if (res.ok && body.ok) { setMode(body.mode); setStatus("success"); requestAnimationFrame(() => doneRef.current?.focus()); return; }
      if (res.status === 422 && body.fieldErrors) { setErrors(body.fieldErrors); setStatus("idle"); requestAnimationFrame(() => summaryRef.current?.focus()); return; }
      setMsg(body.message ?? "We could not send your enquiry. Your details are still here, so please try again.");
    } catch {
      setMsg("We could not reach the server. Please check your connection and try again. Your details are still here.");
    }
    setStatus("error");
    requestAnimationFrame(() => bannerRef.current?.focus());
  }

  if (status === "success") {
    return (
      <div ref={doneRef} tabIndex={-1} role="status" className="border border-gold/50 bg-navy p-8 outline-none md:p-12">
        <h3 className="font-serif text-4xl">Thank you.</h3>
        <p className="mt-5 text-ivory/90">Your partnership enquiry has been received. Our team will review it and be in touch.</p>
        {mode === "development" && <p className="mt-6 border border-gold/60 p-4 text-sm text-gold">Development mode: delivery is not configured, so this was only logged to the server console. See the README.</p>}
      </div>
    );
  }
  const busy = status === "submitting";
  return (
    <form ref={ref} onSubmit={onSubmit} noValidate className="space-y-7">
      {!deliveryReady && (
        <p className="border border-gold/60 bg-gold/8 p-4 text-[0.95rem]" role="note">
          {isProduction ? "Online enquiries are not yet available. Please check back shortly." : "Development mode: no delivery provider configured. Submissions are logged to the server console only."}
        </p>
      )}
      <ErrorSummary errors={errors} labels={LABELS} refEl={summaryRef} />
      {status === "error" && (
        <div ref={bannerRef} tabIndex={-1} role="alert" className="border border-[#e58b82]/60 bg-[#e58b82]/8 p-5 outline-none"><p className="font-serif text-2xl">Your enquiry has not been sent</p><p className="mt-2">{msg}</p></div>
      )}
      <div className="grid gap-7 md:grid-cols-2">
        <Field name="organisation" label="Organisation" error={errors.organisation}>{(p) => <input {...p} name="organisation" required autoComplete="organization" className="input" />}</Field>
        <Field name="contactPerson" label="Contact person" error={errors.contactPerson}>{(p) => <input {...p} name="contactPerson" required autoComplete="name" className="input" />}</Field>
        <Field name="email" label="Business email" error={errors.email}>{(p) => <input {...p} name="email" type="email" required autoComplete="email" className="input" />}</Field>
        <Field name="phone" label="Phone" optional error={errors.phone}>{(p) => <input {...p} name="phone" type="tel" autoComplete="tel" className="input" />}</Field>
      </div>
      <Field name="category" label="Partnership category" error={errors.category}>
        {(p) => (
          <select {...p} name="category" required className="input" defaultValue="">
            <option value="" disabled>Select a category</option>
            {PARTNER_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        )}
      </Field>
      <Field name="description" label="Brief description of potential requirements" error={errors.description}>{(p) => <textarea {...p} name="description" rows={5} maxLength={3000} required className="input" />}</Field>
      <div className="field">
        <label className="!mb-0 flex cursor-pointer items-start gap-4 !normal-case !tracking-normal !text-[0.98rem] !font-normal">
          <input id="f-consent" name="consent" type="checkbox" required aria-invalid={errors.consent ? true : undefined} className="mt-1 h-5 w-5 shrink-0 accent-[#c8a96b]" />
          <span>I consent to Continent Aviation using these details to respond to this enquiry. See the <Link href="/privacy-policy" className="text-gold underline underline-offset-4">Privacy Policy</Link>.</span>
        </label>
        {errors.consent && <p className="field-error" role="alert">{errors.consent}</p>}
      </div>
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden"><label>Leave empty<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <button type="submit" disabled={busy} className="btn btn-gold min-w-[16rem]">{busy ? <><Spinner /> Sending</> : "Send Partnership Enquiry"}</button>
    </form>
  );
}

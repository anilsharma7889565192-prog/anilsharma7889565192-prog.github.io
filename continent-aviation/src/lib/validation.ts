import { z } from "zod";

const text = (max: number) => z.string().trim().max(max, `Please keep this under ${max} characters.`);
const required = (label: string, max = 120) =>
  z.string().trim().min(1, `Please enter ${label}.`).max(max, `Please keep this under ${max} characters.`);

const phone = z
  .string()
  .trim()
  .min(1, "Please enter a phone number including country code.")
  .max(24, "Please check this phone number.")
  .regex(/^\+?[0-9][0-9 ()\-.]{6,22}$/, "Use digits with country code, e.g. +91 98765 43210.")
  .refine((v) => v.replace(/\D/g, "").length >= 8 && v.replace(/\D/g, "").length <= 15, "Please check this phone number.");

const email = z
  .string()
  .trim()
  .min(1, "Please enter your email address.")
  .max(160)
  .pipe(z.email("Please enter a valid email address."));

const isoDate = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `Please choose ${label}.`)
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Please enter a valid date.");

const optionalTime = z
  .string()
  .trim()
  .regex(/^$|^([01]\d|2[0-3]):[0-5]\d$/, "Please enter a valid time.")
  .optional()
  .default("");

export const PURPOSES = [
  "Corporate Travel",
  "Private / Family Travel",
  "Destination Wedding",
  "Event / VIP Movement",
  "Other",
] as const;

export const BUDGETS = [
  "",
  "Prefer to discuss",
  "Up to ₹5 lakh",
  "₹5 – 15 lakh",
  "₹15 – 40 lakh",
  "₹40 lakh and above",
] as const;

export const enquirySchema = z
  .object({
    fullName: required("your full name"),
    company: text(120).optional().default(""),
    email,
    phone,
    contactMethod: z.enum(["Phone", "WhatsApp", "Email"], "Please choose how we should contact you."),
    aircraft: z.enum(["Private Jet", "Helicopter", "Not Sure"], "Please choose an aircraft preference."),
    tripType: z.enum(["One Way", "Return", "Multi-City"], "Please choose a trip type."),
    from: required("a departure city or airport"),
    to: required("a destination city or airport"),
    departDate: isoDate("a departure date"),
    departTime: optionalTime,
    returnDate: z.string().trim().optional().default(""),
    returnTime: optionalTime,
    passengers: z
      .string()
      .trim()
      .min(1, "Please enter the number of passengers.")
      .regex(/^\d{1,3}$/, "Please enter a whole number.")
      .refine((v) => Number(v) >= 1 && Number(v) <= 500, "Please enter between 1 and 500 passengers."),
    baggage: text(1000).optional().default(""),
    additionalDestinations: text(1000).optional().default(""),
    purpose: z.enum(PURPOSES, "Please choose the purpose of travel."),
    budget: text(60).optional().default(""),
    notes: text(3000).optional().default(""),
    consent: z.literal(true, "Please confirm your consent so we can process your enquiry."),
    // Anti-spam fields (not user-facing)
    website: text(200).optional().default(""), // honeypot
    elapsedMs: z.coerce.number().optional().default(0), // time-trap
  })
  .superRefine((d, ctx) => {
    if (d.tripType === "Return") {
      if (!d.returnDate) {
        ctx.addIssue({ code: "custom", path: ["returnDate"], message: "Please choose a return date." });
      } else if (!/^\d{4}-\d{2}-\d{2}$/.test(d.returnDate)) {
        ctx.addIssue({ code: "custom", path: ["returnDate"], message: "Please enter a valid date." });
      } else if (d.departDate && d.returnDate < d.departDate) {
        ctx.addIssue({ code: "custom", path: ["returnDate"], message: "Return date cannot be before departure." });
      }
    }
    const today = new Date().toISOString().slice(0, 10);
    if (d.departDate && /^\d{4}-\d{2}-\d{2}$/.test(d.departDate) && d.departDate < shiftDay(today, -1)) {
      ctx.addIssue({ code: "custom", path: ["departDate"], message: "Please choose a date that has not passed." });
    }
  });

function shiftDay(iso: string, days: number) {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export type EnquiryInput = z.infer<typeof enquirySchema>;

export const PARTNER_CATEGORIES = [
  "Corporate / travel desk",
  "Wedding planner",
  "Event organiser",
  "Hospitality / hotel / resort",
  "Travel agency / consultant",
  "Aviation operator",
  "Other",
] as const;

export const partnershipSchema = z.object({
  organisation: required("your organisation"),
  contactPerson: required("a contact person"),
  email,
  phone: z.string().trim().max(24).optional().default(""),
  category: z.enum(PARTNER_CATEGORIES, "Please choose a category."),
  description: required("a brief description", 3000),
  consent: z.literal(true, "Please confirm your consent so we can process your enquiry."),
  website: text(200).optional().default(""),
  elapsedMs: z.coerce.number().optional().default(0),
});

export type PartnershipInput = z.infer<typeof partnershipSchema>;

export type FieldErrors = Record<string, string>;

export function toFieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

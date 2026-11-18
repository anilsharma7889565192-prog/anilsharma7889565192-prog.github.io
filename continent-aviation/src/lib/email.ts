import "server-only";
import fs from "node:fs";
import path from "node:path";
import { site } from "@/config/site";
import { dbConfigured } from "./db/client";
import { logEmail } from "./db/repo";

export const adminEmail = () => (process.env.ADMIN_EMAIL ?? (process.env.NODE_ENV !== "production" ? site.contact.email : undefined))?.trim().toLowerCase();
export const teamInbox = () => (process.env.ENQUIRY_TO_EMAIL ?? adminEmail() ?? "").split(",")[0].trim();
export const emailConfigured = () => Boolean(process.env.RESEND_API_KEY && process.env.ENQUIRY_FROM_EMAIL);

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
export const abs = (p: string) => `${site.url}${p}`;

function layout(title: string, body: string, footer?: string) {
  return `<!doctype html><html><body style="margin:0;background:#f5f2ea;font-family:Arial,Helvetica,sans-serif;color:#10151f">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f2ea;padding:28px 12px"><tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-top:3px solid #c8a96b">
<tr><td style="padding:28px 32px 8px;font-family:Georgia,serif;font-size:13px;letter-spacing:4px;color:#9c8247">CONTINENT AVIATION</td></tr>
<tr><td style="padding:4px 32px 0;font-family:Georgia,serif;font-size:26px;line-height:1.2">${esc(title)}</td></tr>
<tr><td style="padding:16px 32px 28px;font-size:15px;line-height:1.65;color:#2a303b">${body}</td></tr>
<tr><td style="padding:0 32px 28px;font-size:12px;line-height:1.6;color:#6b7280;border-top:1px solid #eee8da">${footer ?? ""}<p style="margin:14px 0 0">${esc(site.disclaimerShort)} Availability, aircraft and pricing are confirmed by the operator. This message is not a booking confirmation unless it says so.</p></td></tr>
</table></td></tr></table></body></html>`;
}
const p = (t: string) => `<p style="margin:0 0 14px">${t}</p>`;
const btn = (href: string, label: string) => `<p style="margin:20px 0"><a href="${href}" style="display:inline-block;background:#c8a96b;color:#080b10;padding:13px 26px;text-decoration:none;font-size:13px;letter-spacing:1.5px;text-transform:uppercase">${esc(label)}</a></p>`;
const kv = (rows: [string, string | null | undefined][]) =>
  `<table cellpadding="0" cellspacing="0" style="margin:6px 0 16px;font-size:14px">${rows.filter(([, v]) => v).map(([k, v]) => `<tr><td style="padding:4px 18px 4px 0;color:#6b7280;vertical-align:top">${esc(k)}</td><td style="padding:4px 0">${esc(String(v))}</td></tr>`).join("")}</table>`;
const fmt = (d: Date) => d.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }) + " IST";

export type MailInput = { to: string; subject: string; html: string; text: string; type: string; enquiryId?: string | null; replyTo?: string };

export async function sendMail(m: MailInput): Promise<boolean> {
  const { RESEND_API_KEY, ENQUIRY_FROM_EMAIL } = process.env;
  const log = (ok: boolean, error?: string) => (dbConfigured() ? logEmail({ enquiryId: m.enquiryId, type: m.type, to: m.to, ok, error }) : Promise.resolve());
  if (!RESEND_API_KEY || !ENQUIRY_FROM_EMAIL) {
    if (process.env.NODE_ENV !== "production") {
      try {
        const dir = process.env.OUTBOX_DIR || path.join(process.cwd(), ".data");
        fs.mkdirSync(dir, { recursive: true });
        fs.appendFileSync(path.join(dir, "outbox.jsonl"), JSON.stringify({ at: new Date().toISOString(), ...m }) + "\n");
      } catch { /* ignore */ }
      console.info(`[email:dev] ${m.type} -> ${m.to}: ${m.subject}`);
    } else {
      console.error(`[email] provider not configured; ${m.type} to ${m.to} not sent`);
    }
    await log(false, "email provider not configured");
    return false;
  }
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: ENQUIRY_FROM_EMAIL, to: [m.to], subject: m.subject, html: m.html, text: m.text, ...(m.replyTo ? { reply_to: m.replyTo } : {}) }),
      signal: AbortSignal.timeout(10000),
    });
    if (!r.ok) throw new Error(`Email provider responded ${r.status}`);
    await log(true);
    return true;
  } catch (e) {
    console.error("[email] send failed:", (e as Error).message);
    await log(false, (e as Error).message);
    return false;
  }
}

type E = { id: string; reference: string; clientName: string; clientEmail: string; from: string | null; to: string | null; departDate: string | null; passengers: number | null; aircraft: string | null };
const journey = (e: E): [string, string | null | undefined][] => [["Reference", e.reference], ["Route", e.from && e.to ? `${e.from} to ${e.to}` : null], ["Departure date", e.departDate], ["Passengers", e.passengers ? String(e.passengers) : null], ["Aircraft preference", e.aircraft]];
const first = (n: string) => n.split(" ")[0] || "there";
const contactLine = () => (site.contact.email ? `You can reply to this email or write to ${esc(site.contact.email)}.` : "You can reply to this email.");

export const mail = {
  ack: (e: E) => sendMail({
    type: "client_ack", enquiryId: e.id, to: e.clientEmail, replyTo: site.contact.email,
    subject: `We have your charter enquiry (${e.reference})`,
    html: layout("Your enquiry has been received",
      p(`Dear ${esc(first(e.clientName))},`) + p("Thank you for contacting Continent Aviation. Your charter enquiry has been received. We will review your requirements, check with the relevant operator and contact you about the next steps.") + kv(journey(e)) +
      p("<strong>This is an enquiry acknowledgement, not a flight booking confirmation.</strong> Nothing is reserved until the operator confirms availability, pricing and terms.") + p(contactLine())),
    text: `Dear ${first(e.clientName)},\n\nYour charter enquiry (${e.reference}) has been received. We will review it, check with the relevant operator and contact you.\n\nThis is an enquiry acknowledgement, not a flight booking confirmation.`,
  }),
  adminNew: (e: E) => sendMail({
    type: "admin_new", enquiryId: e.id, to: teamInbox(),
    subject: `New charter enquiry ${e.reference}: ${e.from ?? "?"} to ${e.to ?? "?"}`,
    html: layout("New charter enquiry", kv([["Client", e.clientName], ["Email", e.clientEmail], ...journey(e)]) + btn(abs(`/admin/enquiries/${e.id}`), "Open in admin")),
    text: `New charter enquiry ${e.reference}\n${e.clientName} <${e.clientEmail}>\n${e.from} to ${e.to}\n${abs(`/admin/enquiries/${e.id}`)}`,
  }),
  quote: (e: E, q: { token: string; expiresAt: Date; aircraftLabel: string; operatorName?: string | null; totalText: string }) => {
    const link = abs(`/quote/${q.token}`);
    return sendMail({
      type: "client_quote", enquiryId: e.id, to: e.clientEmail, replyTo: site.contact.email,
      subject: `Your quote is ready (${e.reference})`,
      html: layout("Your quote is ready",
        p(`Dear ${esc(first(e.clientName))},`) + p("The operator has responded to your enquiry. Here is a summary; the full quote, terms and payment instructions are on your private page.") +
        kv([["Reference", e.reference], ["Aircraft", q.aircraftLabel], ["Operator", q.operatorName], ["Indicative total", q.totalText], ["Valid until", fmt(q.expiresAt)]]) + btn(link, "Review your quote") +
        p("This quote is valid until the time shown. After that it expires and you are welcome to send a new enquiry. Payment is made to the operator under the operator's terms; nothing is booked until the operator confirms."), `<p style="margin:14px 0 0">Private link: ${esc(link)}</p>`),
      text: `Dear ${first(e.clientName)},\n\nYour quote (${e.reference}) is ready: ${q.aircraftLabel}, ${q.totalText}. Valid until ${fmt(q.expiresAt)}.\nReview: ${link}\n\nPayment is made to the operator under the operator's terms.`,
    });
  },
  declined: (e: E, note?: string | null) => sendMail({
    type: "client_declined", enquiryId: e.id, to: e.clientEmail, replyTo: site.contact.email,
    subject: `Update on your enquiry (${e.reference})`,
    html: layout("An update on your enquiry",
      p(`Dear ${esc(first(e.clientName))},`) + p("Thank you for your patience. Unfortunately we could not secure a suitable option for this request with the operators we work with.") + (note ? p(esc(note)) : "") + kv(journey(e)) +
      p("You are welcome to send a new enquiry with different dates or aircraft, and we will check again.") + btn(abs("/request-a-charter"), "Send a new enquiry")),
    text: `Dear ${first(e.clientName)},\n\nWe could not secure a suitable option for enquiry ${e.reference}.${note ? "\n\n" + note : ""}\n\nYou are welcome to send a new enquiry: ${abs("/request-a-charter")}`,
  }),
  expired: (e: E) => sendMail({
    type: "client_expired", enquiryId: e.id, to: e.clientEmail, replyTo: site.contact.email,
    subject: `Your quote has expired (${e.reference})`,
    html: layout("Your quote has expired", p(`Dear ${esc(first(e.clientName))},`) + p("The quote for your enquiry was not accepted in time, so it has expired. Availability and prices change, so we would need to check again.") + kv(journey(e)) + btn(abs("/request-a-charter"), "Send a new enquiry")),
    text: `Dear ${first(e.clientName)},\n\nThe quote for enquiry ${e.reference} has expired. Send a new enquiry: ${abs("/request-a-charter")}`,
  }),
  acceptedClient: (e: E, q: { aircraftLabel: string; operatorName?: string | null }) => sendMail({
    type: "client_accepted", enquiryId: e.id, to: e.clientEmail, replyTo: site.contact.email,
    subject: `We have recorded your acceptance (${e.reference})`,
    html: layout("Your acceptance is recorded",
      p(`Dear ${esc(first(e.clientName))},`) + p("Thank you. We have recorded that you accepted the quote.") + kv([["Reference", e.reference], ["Aircraft", q.aircraftLabel], ["Operator", q.operatorName]]) +
      p("Please follow the operator's payment instructions on your quote page. <strong>The charter is confirmed only when the operator confirms receiving payment</strong>, and we will email you then.") + p(contactLine())),
    text: `Dear ${first(e.clientName)},\n\nWe recorded your acceptance of the quote (${e.reference}). Please follow the operator's payment instructions. The charter is confirmed only when the operator confirms receipt of payment; we will email you then.`,
  }),
  acceptedAdmin: (e: E) => sendMail({
    type: "admin_accepted", enquiryId: e.id, to: teamInbox(),
    subject: `Quote accepted: ${e.reference}`,
    html: layout("Quote accepted", p(`${esc(e.clientName)} accepted the quote.`) + kv(journey(e)) + btn(abs(`/admin/enquiries/${e.id}`), "Open in admin")),
    text: `${e.clientName} accepted the quote for ${e.reference}. ${abs(`/admin/enquiries/${e.id}`)}`,
  }),
  confirmed: (e: E, q?: { aircraftLabel: string; operatorName?: string | null } | null) => sendMail({
    type: "client_confirmed", enquiryId: e.id, to: e.clientEmail, replyTo: site.contact.email,
    subject: `Your charter is confirmed (${e.reference})`,
    html: layout("Your charter is confirmed",
      p(`Dear ${esc(first(e.clientName))},`) + p("The operator has confirmed your charter.") + kv([...journey(e), ["Aircraft", q?.aircraftLabel ?? e.aircraft], ["Operator", q?.operatorName]]) +
      p("The operator will contact you with the remaining flight details and documentation. Their booking terms apply.") + p(contactLine())),
    text: `Dear ${first(e.clientName)},\n\nThe operator has confirmed your charter (${e.reference}).`,
  }),
  login: (to: string, link: string) => sendMail({
    type: "admin_login", to,
    subject: "Your Continent Aviation admin sign-in link",
    html: layout("Sign in to admin", p("Use the button below to sign in. The link works once and expires in 15 minutes.") + btn(link, "Sign in") + p("If you did not request this, you can ignore this email.")),
    text: `Sign in to Continent Aviation admin (valid 15 minutes, single use): ${link}`,
  }),
  alertConfirm: (to: string, route: string | null, unsub: string) => sendMail({
    type: "alert_confirm", to,
    subject: "You are signed up for route alerts",
    html: layout("Route alerts", p("Thank you. We will email you if suitable options for this route become available." ) + kv([["Route", route ?? "Any route"]]) + p("We will only use your email for these alerts.") , `<p style="margin:14px 0 0"><a href="${abs(`/alerts/unsubscribe?token=${unsub}`)}">Unsubscribe</a></p>`),
    text: `You are signed up for route alerts (${route ?? "any route"}). Unsubscribe: ${abs(`/alerts/unsubscribe?token=${unsub}`)}`,
  }),
};

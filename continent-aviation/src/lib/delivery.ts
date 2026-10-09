import "server-only";

/**
 * Enquiry delivery. Real delivery requires Resend and/or a webhook to be configured.
 * Nothing is ever silently discarded: unconfigured production deployments return an error,
 * and development mode logs to the server console and says so in the UI.
 */
export const deliveryConfigured = () =>
  Boolean(
    (process.env.RESEND_API_KEY && process.env.ENQUIRY_FROM_EMAIL && process.env.ENQUIRY_TO_EMAIL) ||
      process.env.ENQUIRY_WEBHOOK_URL,
  );

export type DeliveryKind = "charter-enquiry" | "partnership-enquiry";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const LABELS: Record<string, string> = {
  fullName: "Full name", company: "Company / organisation", email: "Email", phone: "Phone",
  contactMethod: "Preferred contact", aircraft: "Aircraft preference", tripType: "Trip type",
  from: "From", to: "To", departDate: "Departure date", departTime: "Departure time",
  returnDate: "Return date", returnTime: "Return time", passengers: "Passengers",
  baggage: "Baggage / special requirements", additionalDestinations: "Additional destinations",
  purpose: "Purpose", budget: "Budget range", notes: "Notes",
  organisation: "Organisation", contactPerson: "Contact person", category: "Category",
  description: "Description",
};

const CLEAN = (data: Record<string, unknown>) => {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(data)) {
    if (k in LABELS && typeof v === "string" && v.trim()) out[k] = v.trim();
  }
  return out;
};

export async function deliver(kind: DeliveryKind, data: Record<string, unknown>, ref: string) {
  const fields = CLEAN(data);
  const title = kind === "charter-enquiry" ? "New charter enquiry" : "New partnership enquiry";
  const subject = `${title} — ${fields.fullName ?? fields.organisation ?? "website"} (${ref})`;
  const tasks: Promise<void>[] = [];

  const { RESEND_API_KEY, ENQUIRY_FROM_EMAIL, ENQUIRY_TO_EMAIL, ENQUIRY_WEBHOOK_URL, ENQUIRY_WEBHOOK_SECRET } = process.env;

  if (RESEND_API_KEY && ENQUIRY_FROM_EMAIL && ENQUIRY_TO_EMAIL) {
    const rows = Object.entries(fields)
      .map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#666;vertical-align:top">${esc(LABELS[k])}</td><td style="padding:6px 0">${esc(v).replace(/\n/g, "<br>")}</td></tr>`)
      .join("");
    const text = Object.entries(fields).map(([k, v]) => `${LABELS[k]}: ${v}`).join("\n");
    tasks.push(
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: ENQUIRY_FROM_EMAIL,
          to: ENQUIRY_TO_EMAIL.split(",").map((s) => s.trim()).filter(Boolean),
          reply_to: fields.email,
          subject,
          html: `<h2 style="font-family:Georgia,serif">${esc(title)}</h2><p style="color:#666">Reference ${esc(ref)}. This is an enquiry only; nothing has been booked.</p><table style="font-family:Arial,sans-serif;font-size:14px">${rows}</table>`,
          text: `${title}\nReference ${ref}\n\n${text}`,
        }),
        signal: AbortSignal.timeout(10000),
      }).then(async (r) => {
        if (!r.ok) throw new Error(`Email provider responded ${r.status}`);
      }),
    );
  }

  if (ENQUIRY_WEBHOOK_URL) {
    tasks.push(
      fetch(ENQUIRY_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(ENQUIRY_WEBHOOK_SECRET ? { Authorization: `Bearer ${ENQUIRY_WEBHOOK_SECRET}` } : {}),
        },
        body: JSON.stringify({ kind, reference: ref, receivedAt: new Date().toISOString(), fields }),
        signal: AbortSignal.timeout(10000),
      }).then((r) => {
        if (!r.ok) throw new Error(`Webhook responded ${r.status}`);
      }),
    );
  }

  const results = await Promise.allSettled(tasks);
  const ok = results.some((r) => r.status === "fulfilled");
  for (const r of results) if (r.status === "rejected") console.error("[enquiry] delivery channel failed:", (r.reason as Error).message);
  return ok;
}

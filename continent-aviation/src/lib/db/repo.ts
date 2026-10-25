import "server-only";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { getDb, type Row } from "./client";
import type { Status } from "../status";

export const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");
export const newToken = () => randomBytes(24).toString("base64url");

export type Enquiry = {
  id: string; reference: string; status: Status; createdAt: Date; updatedAt: Date; kind: string;
  clientName: string; clientEmail: string; clientPhone: string | null;
  from: string | null; to: string | null; departDate: string | null; passengers: number | null; aircraft: string | null; purpose: string | null;
  data: Record<string, unknown>; operatorName: string | null; operatorNote: string | null; adminNote: string | null;
};
export type QuoteLine = { label: string; amount: string };
export type Quote = {
  id: string; enquiryId: string; status: "sent" | "accepted" | "expired" | "superseded"; aircraftLabel: string; operatorName: string | null;
  lines: QuoteLine[]; totalText: string; terms: string | null; paymentInstructions: string | null; createdAt: Date; expiresAt: Date; acceptedAt: Date | null;
};
export type HistoryItem = { status: Status; note: string | null; at: Date };

const d = (v: unknown) => (v instanceof Date ? v : new Date(String(v)));
const asEnquiry = (r: Row): Enquiry => ({
  id: String(r.id), reference: String(r.reference), status: r.status as Status, createdAt: d(r.created_at), updatedAt: d(r.updated_at), kind: String(r.kind),
  clientName: String(r.client_name), clientEmail: String(r.client_email), clientPhone: (r.client_phone as string) ?? null,
  from: (r.from_place as string) ?? null, to: (r.to_place as string) ?? null, departDate: (r.depart_date as string) ?? null,
  passengers: r.passengers == null ? null : Number(r.passengers), aircraft: (r.aircraft as string) ?? null, purpose: (r.purpose as string) ?? null,
  data: (typeof r.data === "string" ? JSON.parse(r.data) : r.data) as Record<string, unknown>,
  operatorName: (r.operator_name as string) ?? null, operatorNote: (r.operator_note as string) ?? null, adminNote: (r.admin_note as string) ?? null,
});
const asQuote = (r: Row): Quote => ({
  id: String(r.id), enquiryId: String(r.enquiry_id), status: r.status as Quote["status"], aircraftLabel: String(r.aircraft_label), operatorName: (r.operator_name as string) ?? null,
  lines: (typeof r.lines === "string" ? JSON.parse(r.lines) : r.lines) as QuoteLine[], totalText: String(r.total_text), terms: (r.terms as string) ?? null,
  paymentInstructions: (r.payment_instructions as string) ?? null, createdAt: d(r.created_at), expiresAt: d(r.expires_at), acceptedAt: r.accepted_at ? d(r.accepted_at) : null,
});

export async function addHistory(enquiryId: string, status: Status, note?: string | null) {
  const db = await getDb();
  await db.query("INSERT INTO status_history (enquiry_id, status, note) VALUES ($1,$2,$3)", [enquiryId, status, note ?? null]);
}

export async function createEnquiry(input: { reference: string; data: Record<string, unknown> }) {
  const db = await getDb();
  const x = input.data as Record<string, string | number | boolean | undefined>;
  const id = randomUUID();
  await db.query(
    `INSERT INTO enquiries (id, reference, status, kind, client_name, client_email, client_phone, from_place, to_place, depart_date, passengers, aircraft, purpose, data)
     VALUES ($1,$2,'received','charter',$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
    [id, input.reference, String(x.fullName ?? ""), String(x.email ?? "").toLowerCase(), x.phone ?? null, x.from ?? null, x.to ?? null, x.departDate ?? null,
      x.passengers ? Number(x.passengers) : null, x.aircraft ?? null, x.purpose ?? null, JSON.stringify(stripSensitive(input.data))],
  );
  await addHistory(id, "received", "Enquiry submitted through the website");
  return id;
}

/** Keep only the journey fields in the JSON blob. */
function stripSensitive(data: Record<string, unknown>) {
  const { website, elapsedMs, consent, ...rest } = data;
  void website; void elapsedMs;
  return { ...rest, consentGiven: Boolean(consent) };
}

export async function getEnquiry(id: string) {
  const rows = await (await getDb()).query("SELECT * FROM enquiries WHERE id = $1", [id]);
  return rows[0] ? asEnquiry(rows[0]) : null;
}
export async function getEnquiryByReference(ref: string) {
  const rows = await (await getDb()).query("SELECT * FROM enquiries WHERE reference = $1", [ref]);
  return rows[0] ? asEnquiry(rows[0]) : null;
}

export async function listEnquiries(opts: { status?: string; q?: string; limit?: number } = {}) {
  const where: string[] = []; const params: unknown[] = [];
  if (opts.status && opts.status !== "all") { params.push(opts.status); where.push(`status = $${params.length}`); }
  if (opts.q) { params.push(`%${opts.q.toLowerCase()}%`); where.push(`(lower(reference) LIKE $${params.length} OR lower(client_name) LIKE $${params.length} OR lower(client_email) LIKE $${params.length} OR lower(coalesce(from_place,'')) LIKE $${params.length} OR lower(coalesce(to_place,'')) LIKE $${params.length})`); }
  params.push(opts.limit ?? 200);
  const rows = await (await getDb()).query(`SELECT * FROM enquiries ${where.length ? "WHERE " + where.join(" AND ") : ""} ORDER BY created_at DESC LIMIT $${params.length}`, params);
  return rows.map(asEnquiry);
}

export async function statusCounts() {
  const rows = await (await getDb()).query("SELECT status, count(*)::int AS n FROM enquiries GROUP BY status");
  return Object.fromEntries(rows.map((r) => [String(r.status), Number(r.n)])) as Record<string, number>;
}

export async function history(enquiryId: string): Promise<HistoryItem[]> {
  const rows = await (await getDb()).query("SELECT status, note, at FROM status_history WHERE enquiry_id = $1 ORDER BY at, id", [enquiryId]);
  return rows.map((r) => ({ status: r.status as Status, note: (r.note as string) ?? null, at: d(r.at) }));
}

export async function setStatus(id: string, status: Status, note?: string | null) {
  await (await getDb()).query("UPDATE enquiries SET status = $2, updated_at = now() WHERE id = $1", [id, status]);
  await addHistory(id, status, note);
}

export async function setOperatorInfo(id: string, info: { operatorName?: string | null; operatorNote?: string | null; adminNote?: string | null }) {
  await (await getDb()).query(
    "UPDATE enquiries SET operator_name = COALESCE($2, operator_name), operator_note = COALESCE($3, operator_note), admin_note = COALESCE($4, admin_note), updated_at = now() WHERE id = $1",
    [id, info.operatorName ?? null, info.operatorNote ?? null, info.adminNote ?? null],
  );
}

export async function createQuote(input: { enquiryId: string; aircraftLabel: string; operatorName?: string | null; lines: QuoteLine[]; totalText: string; terms?: string | null; paymentInstructions?: string | null; validHours: number }) {
  const db = await getDb();
  await db.query("UPDATE quotes SET status = 'superseded' WHERE enquiry_id = $1 AND status = 'sent'", [input.enquiryId]);
  const token = newToken();
  const id = randomUUID();
  const expires = new Date(Date.now() + input.validHours * 3600_000);
  await db.query(
    `INSERT INTO quotes (id, enquiry_id, token_hash, status, aircraft_label, operator_name, lines, total_text, terms, payment_instructions, expires_at)
     VALUES ($1,$2,$3,'sent',$4,$5,$6,$7,$8,$9,$10)`,
    [id, input.enquiryId, sha256(token), input.aircraftLabel, input.operatorName ?? null, JSON.stringify(input.lines), input.totalText, input.terms ?? null, input.paymentInstructions ?? null, expires.toISOString()],
  );
  return { id, token, expiresAt: expires };
}

export async function getQuoteByToken(token: string) {
  const rows = await (await getDb()).query("SELECT * FROM quotes WHERE token_hash = $1", [sha256(token)]);
  return rows[0] ? asQuote(rows[0]) : null;
}
export async function quotesFor(enquiryId: string) {
  const rows = await (await getDb()).query("SELECT * FROM quotes WHERE enquiry_id = $1 ORDER BY created_at DESC", [enquiryId]);
  return rows.map(asQuote);
}

/** Accept a quote only if it is still valid. Returns the enquiry id on success. */
export async function acceptQuote(token: string): Promise<{ ok: true; enquiryId: string } | { ok: false; reason: "not_found" | "expired" | "already" }> {
  const db = await getDb();
  const q = await getQuoteByToken(token);
  if (!q) return { ok: false, reason: "not_found" };
  if (q.status === "accepted") return { ok: false, reason: "already" };
  if (q.status !== "sent" || q.expiresAt.getTime() < Date.now()) return { ok: false, reason: "expired" };
  const res = await db.query("UPDATE quotes SET status = 'accepted', accepted_at = now() WHERE id = $1 AND status = 'sent' AND expires_at > now() RETURNING id", [q.id]);
  if (!res.length) return { ok: false, reason: "expired" };
  await setStatus(q.enquiryId, "accepted", "Client accepted the quote");
  return { ok: true, enquiryId: q.enquiryId };
}

/** Mark overdue quotes expired. Returns the affected enquiries (for notification emails). */
export async function expireOverdue() {
  const db = await getDb();
  const rows = await db.query(
    "UPDATE quotes SET status = 'expired' WHERE status = 'sent' AND expires_at < now() RETURNING enquiry_id",
  );
  const out: Enquiry[] = [];
  for (const r of rows) {
    const e = await getEnquiry(String(r.enquiry_id));
    if (e && e.status === "quoted") { await setStatus(e.id, "expired", "Quote validity ended"); out.push({ ...e, status: "expired" }); }
  }
  return out;
}

export async function logEmail(e: { enquiryId?: string | null; type: string; to: string; ok: boolean; error?: string | null }) {
  try { await (await getDb()).query("INSERT INTO email_log (enquiry_id, type, to_email, ok, error) VALUES ($1,$2,$3,$4,$5)", [e.enquiryId ?? null, e.type, e.to, e.ok, e.error ?? null]); } catch { /* never block on logging */ }
}
export async function emailLog(enquiryId: string) {
  const rows = await (await getDb()).query("SELECT type, to_email, ok, error, sent_at FROM email_log WHERE enquiry_id = $1 ORDER BY sent_at DESC", [enquiryId]);
  return rows.map((r) => ({ type: String(r.type), to: String(r.to_email), ok: Boolean(r.ok), error: (r.error as string) ?? null, at: d(r.sent_at) }));
}

// ---- admin login tokens
export async function createLoginToken(ttlMinutes = 15) {
  const token = newToken();
  await (await getDb()).query("INSERT INTO login_tokens (token_hash, expires_at) VALUES ($1,$2)", [sha256(token), new Date(Date.now() + ttlMinutes * 60_000).toISOString()]);
  return token;
}
export async function consumeLoginToken(token: string) {
  const rows = await (await getDb()).query("UPDATE login_tokens SET used_at = now() WHERE token_hash = $1 AND used_at IS NULL AND expires_at > now() RETURNING token_hash", [sha256(token)]);
  return rows.length > 0;
}

// ---- alerts
export async function addAlert(email: string, route: string | null, consent: boolean) {
  const db = await getDb();
  const existing = await db.query("SELECT id, unsubscribe_token FROM alerts WHERE lower(email) = $1 AND coalesce(route,'') = $2 AND unsubscribed_at IS NULL", [email.toLowerCase(), route ?? ""]);
  if (existing.length) return { id: String(existing[0].id), token: String(existing[0].unsubscribe_token), created: false };
  const id = randomUUID(); const token = newToken();
  await db.query("INSERT INTO alerts (id, email, route, consent, unsubscribe_token) VALUES ($1,$2,$3,$4,$5)", [id, email.toLowerCase(), route, consent, token]);
  return { id, token, created: true };
}
export async function unsubscribeAlert(token: string) {
  const rows = await (await getDb()).query("UPDATE alerts SET unsubscribed_at = now() WHERE unsubscribe_token = $1 AND unsubscribed_at IS NULL RETURNING id", [token]);
  return rows.length > 0;
}
export async function listAlerts() {
  const rows = await (await getDb()).query("SELECT email, route, created_at, unsubscribed_at FROM alerts ORDER BY created_at DESC LIMIT 500");
  return rows.map((r) => ({ email: String(r.email), route: (r.route as string) ?? null, createdAt: d(r.created_at), unsubscribedAt: r.unsubscribed_at ? d(r.unsubscribed_at) : null }));
}

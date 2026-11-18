"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { createQuote, getEnquiry, quotesFor, setOperatorInfo, setStatus, type QuoteLine } from "@/lib/db/repo";
import { emailConfigured, mail } from "@/lib/email";
import { QUOTE_VALID_HOURS } from "@/config/site";
import { isOpen, type Status } from "@/lib/status";

const back = (id: string, msg: string, kind: "ok" | "err" = "ok") => redirect(`/admin/enquiries/${id}?${kind === "ok" ? "msg" : "err"}=${encodeURIComponent(msg)}`);
const text = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();

async function load(fd: FormData) {
  await requireAdmin();
  const id = text(fd, "id");
  const e = id ? await getEnquiry(id) : null;
  if (!e) redirect("/admin");
  return e;
}
const can = (from: Status, allowed: Status[]) => allowed.includes(from);

export async function markChecking(fd: FormData) {
  const e = await load(fd);
  if (!can(e.status, ["received", "expired"])) return back(e.id, "This enquiry cannot be moved to checking from its current status.", "err");
  const operator = text(fd, "operatorName") || null;
  const note = text(fd, "note") || null;
  await setOperatorInfo(e.id, { operatorName: operator, operatorNote: note });
  await setStatus(e.id, "checking", [operator && `Asked ${operator}`, note].filter(Boolean).join(": ") || "Checking with operator");
  revalidatePath(`/admin/enquiries/${e.id}`);
  return back(e.id, "Marked as checking with the operator.");
}

const quoteSchema = z.object({
  aircraftLabel: z.string().min(2, "Enter the aircraft").max(160),
  operatorName: z.string().max(120).optional(),
  totalText: z.string().min(1, "Enter the total").max(120),
  lines: z.string().max(4000).optional(),
  terms: z.string().max(4000).optional(),
  paymentInstructions: z.string().max(4000).optional(),
});

export async function sendQuote(fd: FormData) {
  const e = await load(fd);
  if (!can(e.status, ["received", "checking", "quoted", "expired"])) return back(e.id, "A quote cannot be sent from the current status.", "err");
  const parsed = quoteSchema.safeParse({
    aircraftLabel: text(fd, "aircraftLabel"), operatorName: text(fd, "operatorName") || undefined, totalText: text(fd, "totalText"),
    lines: text(fd, "lines") || undefined, terms: text(fd, "terms") || undefined, paymentInstructions: text(fd, "paymentInstructions") || undefined,
  });
  if (!parsed.success) return back(e.id, parsed.error.issues[0]?.message ?? "Please check the quote form.", "err");
  const q = parsed.data;
  const lines: QuoteLine[] = (q.lines ?? "").split("\n").map((l) => l.trim()).filter(Boolean).slice(0, 20).map((l) => {
    const [label, ...rest] = l.split("|");
    return { label: label.trim(), amount: rest.join("|").trim() };
  });
  const created = await createQuote({ enquiryId: e.id, aircraftLabel: q.aircraftLabel, operatorName: q.operatorName ?? null, lines, totalText: q.totalText, terms: q.terms ?? null, paymentInstructions: q.paymentInstructions ?? null, validHours: QUOTE_VALID_HOURS });
  if (q.operatorName) await setOperatorInfo(e.id, { operatorName: q.operatorName });
  await setStatus(e.id, "quoted", `Quote sent: ${q.aircraftLabel}, ${q.totalText} (valid ${QUOTE_VALID_HOURS} h)`);
  const sent = await mail.quote(e, { token: created.token, expiresAt: created.expiresAt, aircraftLabel: q.aircraftLabel, operatorName: q.operatorName, totalText: q.totalText });
  revalidatePath("/admin"); revalidatePath(`/admin/enquiries/${e.id}`);
  if (!sent && process.env.NODE_ENV !== "production" && !emailConfigured()) return back(e.id, "Quote saved. Development mode: the email was written to .data/outbox.jsonl instead of being sent.");
  return back(e.id, sent ? "Quote sent to the client." : "Quote saved, but the email could not be sent. Check the email log, and re-send by creating the quote again.", sent ? "ok" : "err");
}

export async function decline(fd: FormData) {
  const e = await load(fd);
  if (!can(e.status, ["received", "checking", "quoted", "expired"])) return back(e.id, "This enquiry cannot be declined from its current status.", "err");
  const note = text(fd, "note") || null;
  await setStatus(e.id, "declined", note);
  await mail.declined(e, note);
  revalidatePath("/admin"); revalidatePath(`/admin/enquiries/${e.id}`);
  return back(e.id, "Marked as not available; the client has been emailed.");
}

export async function markPaid(fd: FormData) {
  const e = await load(fd);
  if (e.status !== "accepted") return back(e.id, "Payment can be recorded only after the client accepts the quote.", "err");
  await setStatus(e.id, "paid", text(fd, "note") || "Operator confirmed receiving payment");
  revalidatePath("/admin"); revalidatePath(`/admin/enquiries/${e.id}`);
  return back(e.id, "Recorded: operator has confirmed payment.");
}

export async function confirmBooking(fd: FormData) {
  const e = await load(fd);
  if (!can(e.status, ["accepted", "paid"])) return back(e.id, "A booking can be confirmed only after the quote is accepted.", "err");
  await setStatus(e.id, "confirmed", text(fd, "note") || "Booking confirmed by the operator");
  const qs = await quotesFor(e.id);
  const q = qs.find((x) => x.status === "accepted");
  await mail.confirmed(e, q ? { aircraftLabel: q.aircraftLabel, operatorName: q.operatorName } : null);
  revalidatePath("/admin"); revalidatePath(`/admin/enquiries/${e.id}`);
  return back(e.id, "Booking confirmed; the client has been emailed.");
}

export async function cancelEnquiry(fd: FormData) {
  const e = await load(fd);
  if (!isOpen(e.status) && e.status !== "expired") return back(e.id, "This enquiry is already closed.", "err");
  await setStatus(e.id, "cancelled", text(fd, "note") || null);
  revalidatePath("/admin"); revalidatePath(`/admin/enquiries/${e.id}`);
  return back(e.id, "Enquiry cancelled.");
}

export async function saveNote(fd: FormData) {
  const e = await load(fd);
  await setOperatorInfo(e.id, { adminNote: text(fd, "adminNote") || " " });
  revalidatePath(`/admin/enquiries/${e.id}`);
  return back(e.id, "Note saved.");
}

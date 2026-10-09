import "server-only";
import { NextResponse } from "next/server";
import type { ZodType } from "zod";
import { deliver, deliveryConfigured, type DeliveryKind } from "./delivery";
import { rateLimit } from "./ratelimit";
import { toFieldErrors } from "./validation";

const MAX_BODY = 20_000;

function clientIp(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

function sameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) return true; // non-browser clients; still validated and rate limited
  try {
    return new URL(origin).host === (req.headers.get("x-forwarded-host") ?? req.headers.get("host"));
  } catch {
    return false;
  }
}

export async function handleSubmission(req: Request, kind: DeliveryKind, schema: ZodType<Record<string, unknown>>) {
  const json = (body: object, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

  if (!sameOrigin(req)) return json({ ok: false, error: "forbidden" }, 403);
  if (!(req.headers.get("content-type") ?? "").includes("application/json")) return json({ ok: false, error: "bad_request" }, 415);

  const raw = await req.text();
  if (raw.length > MAX_BODY) return json({ ok: false, error: "too_large" }, 413);

  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: "bad_request" }, 400);
  }

  if (!rateLimit(`${kind}:${clientIp(req)}`)) {
    return json({ ok: false, error: "rate_limited", message: "Too many submissions from this connection. Please try again in a few minutes." }, 429);
  }

  const parsed = schema.safeParse(payload);
  if (!parsed.success) return json({ ok: false, error: "validation", fieldErrors: toFieldErrors(parsed.error) }, 422);
  const data = parsed.data;

  // Anti-spam: honeypot filled or form submitted implausibly fast. Respond as success so bots learn nothing,
  // but nothing is delivered. Real users never trigger either.
  if ((typeof data.website === "string" && data.website) || (typeof data.elapsedMs === "number" && data.elapsedMs > 0 && data.elapsedMs < 1500)) {
    return json({ ok: true, reference: "CA-0000", mode: "live" });
  }

  const reference = `CA-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 5).toUpperCase()}`;

  if (!deliveryConfigured()) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[enquiry:${kind}] DEVELOPMENT MODE — not delivered. Reference ${reference}`, { ...data, email: "***", phone: "***" });
      return json({ ok: true, reference, mode: "development" });
    }
    console.error("[enquiry] No delivery provider configured; rejecting submission instead of discarding it.");
    return json({ ok: false, error: "not_configured", message: "Online enquiries are temporarily unavailable." }, 503);
  }

  try {
    const delivered = await deliver(kind, data, reference);
    if (!delivered) return json({ ok: false, error: "delivery_failed", message: "We could not send your enquiry just now. Please try again shortly." }, 502);
  } catch (e) {
    console.error("[enquiry] unexpected delivery error:", (e as Error).message);
    return json({ ok: false, error: "delivery_failed", message: "We could not send your enquiry just now. Please try again shortly." }, 502);
  }
  return json({ ok: true, reference, mode: "live" });
}

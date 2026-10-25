import { NextResponse } from "next/server";
import { authConfigured } from "@/lib/auth";
import { dbConfigured } from "@/lib/db/client";
import { createLoginToken } from "@/lib/db/repo";
import { abs, adminEmail, emailConfigured, mail } from "@/lib/email";
import { rateLimit } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Always answers the same way, so it never reveals whether an address is the admin's. */
export async function POST(req: Request) {
  const res = (body: object, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
  const origin = req.headers.get("origin");
  if (origin) {
    try { if (new URL(origin).host !== (req.headers.get("x-forwarded-host") ?? req.headers.get("host"))) return res({ ok: false }, 403); } catch { return res({ ok: false }, 403); }
  }
  if (!authConfigured() || !dbConfigured()) return res({ ok: false, error: "not_configured", message: "Admin sign-in is not configured." }, 503);
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(`login:${ip}`, 5, 15 * 60 * 1000)) return res({ ok: false, error: "rate_limited", message: "Too many attempts. Please try again later." }, 429);

  let email = "";
  try { email = String((await req.json()).email ?? "").trim().toLowerCase(); } catch { return res({ ok: false }, 400); }
  const body: { ok: true; devLink?: string } = { ok: true };
  if (email && email === adminEmail()) {
    const token = await createLoginToken();
    const link = abs(`/admin/verify?token=${token}`);
    await mail.login(email, link);
    if (process.env.NODE_ENV !== "production" && !emailConfigured()) body.devLink = link;
  }
  return res(body);
}

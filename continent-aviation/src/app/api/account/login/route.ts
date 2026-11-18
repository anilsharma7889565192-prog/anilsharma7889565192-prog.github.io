import { NextResponse } from "next/server";
import { z } from "zod";
import { clientAuthConfigured } from "@/lib/auth";
import { dbConfigured } from "@/lib/db/client";
import { createClientLoginToken } from "@/lib/db/repo";
import { abs, emailConfigured, mail } from "@/lib/email";
import { rateLimit } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({ email: z.string().trim().max(160).pipe(z.email()), website: z.string().max(200).optional().default("") });

/** Passwordless sign-in. Always answers the same way, so it never reveals whether an address already has an account. */
export async function POST(req: Request) {
  const res = (body: object, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
  const origin = req.headers.get("origin");
  if (origin) {
    try { if (new URL(origin).host !== (req.headers.get("x-forwarded-host") ?? req.headers.get("host"))) return res({ ok: false }, 403); } catch { return res({ ok: false }, 403); }
  }
  if (!clientAuthConfigured() || !dbConfigured()) return res({ ok: false, error: "not_configured", message: "Sign-in is not available right now." }, 503);
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(`acct:${ip}`, 6, 15 * 60 * 1000)) return res({ ok: false, error: "rate_limited", message: "Too many attempts. Please try again in a few minutes." }, 429);

  let body: unknown;
  try { body = await req.json(); } catch { return res({ ok: false }, 400); }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return res({ ok: false, message: "Please enter a valid email address." }, 422);
  const { email, website } = parsed.data;
  if (website) return res({ ok: true }); // honeypot: pretend success
  const addr = email.toLowerCase();
  if (!rateLimit(`acct-email:${addr}`, 3, 60 * 60 * 1000)) return res({ ok: true }); // quietly absorb repeated requests for one address

  const out: { ok: true; devLink?: string } = { ok: true };
  try {
    const token = await createClientLoginToken(addr);
    const link = abs(`/account/verify?token=${token}`);
    await mail.clientLogin(addr, link);
    if (process.env.NODE_ENV !== "production" && !emailConfigured()) out.devLink = link;
  } catch (e) {
    console.error("[account] sign-in link failed:", (e as Error).message);
    return res({ ok: false, message: "We could not send the sign-in link. Please try again." }, 500);
  }
  return res(out);
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { dbConfigured } from "@/lib/db/client";
import { addAlert } from "@/lib/db/repo";
import { mail } from "@/lib/email";
import { rateLimit } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  email: z.string().trim().max(160).pipe(z.email()),
  route: z.string().trim().max(160).optional().default(""),
  consent: z.literal(true),
  website: z.string().max(200).optional().default(""),
  elapsedMs: z.coerce.number().optional().default(0),
});

export async function POST(req: Request) {
  const res = (b: object, status = 200) => NextResponse.json(b, { status, headers: { "Cache-Control": "no-store" } });
  const origin = req.headers.get("origin");
  if (origin) { try { if (new URL(origin).host !== (req.headers.get("x-forwarded-host") ?? req.headers.get("host"))) return res({ ok: false }, 403); } catch { return res({ ok: false }, 403); } }
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(`alerts:${ip}`, 5, 10 * 60 * 1000)) return res({ ok: false, message: "Too many sign-ups from this connection. Please try again later." }, 429);
  let body: unknown;
  try { body = await req.json(); } catch { return res({ ok: false }, 400); }
  const p = schema.safeParse(body);
  if (!p.success) return res({ ok: false, message: "Please enter a valid email and tick the consent box." }, 422);
  const d = p.data;
  if (d.website || (d.elapsedMs > 0 && d.elapsedMs < 1200)) return res({ ok: true });
  if (!dbConfigured() || (process.env.NODE_ENV === "production" && !process.env.DATABASE_URL)) return res({ ok: false, message: "Route alerts are not available right now." }, 503);
  try {
    const a = await addAlert(d.email, d.route || null, true);
    if (a.created) await mail.alertConfirm(d.email, d.route || null, a.token);
    return res({ ok: true });
  } catch (e) {
    console.error("[alerts] failed:", (e as Error).message);
    return res({ ok: false, message: "We could not save your sign-up. Please try again." }, 500);
  }
}

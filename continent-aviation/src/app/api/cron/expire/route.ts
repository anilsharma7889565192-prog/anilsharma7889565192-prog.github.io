import { NextResponse } from "next/server";
import { expireOverdue } from "@/lib/db/repo";
import { mail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Marks overdue quotes expired and emails the clients. Protect with CRON_SECRET (Vercel Cron sends it as a bearer token). */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) return NextResponse.json({ ok: false }, { status: 401 });
  const expired = await expireOverdue();
  await Promise.allSettled(expired.map((e) => mail.expired(e)));
  return NextResponse.json({ ok: true, expired: expired.length });
}

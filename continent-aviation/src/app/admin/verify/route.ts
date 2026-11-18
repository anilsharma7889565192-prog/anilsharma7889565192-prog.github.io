import { NextResponse, type NextRequest } from "next/server";
import { makeSession, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth";
import { consumeLoginToken } from "@/lib/db/repo";
import { adminEmail } from "@/lib/email";
import { site } from "@/config/site";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const base = process.env.NODE_ENV === "production" ? site.url : req.nextUrl.origin;
  const token = req.nextUrl.searchParams.get("token") ?? "";
  const email = adminEmail();
  if (!token || !email || !(await consumeLoginToken(token))) return NextResponse.redirect(new URL("/admin/login?error=invalid", base));
  const res = NextResponse.redirect(new URL("/admin", base));
  res.cookies.set(SESSION_COOKIE, makeSession(email), sessionCookieOptions);
  return res;
}

import { NextResponse, type NextRequest } from "next/server";
import { CLIENT_COOKIE, clientCookieOptions, makeClientSession } from "@/lib/auth";
import { consumeClientLoginToken } from "@/lib/db/repo";
import { site } from "@/config/site";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const base = process.env.NODE_ENV === "production" ? site.url : req.nextUrl.origin;
  const token = req.nextUrl.searchParams.get("token") ?? "";
  const email = token ? await consumeClientLoginToken(token).catch(() => null) : null;
  if (!email) return NextResponse.redirect(new URL("/account?error=invalid", base));
  const res = NextResponse.redirect(new URL("/account", base));
  res.cookies.set(CLIENT_COOKIE, makeClientSession(email), clientCookieOptions);
  return res;
}

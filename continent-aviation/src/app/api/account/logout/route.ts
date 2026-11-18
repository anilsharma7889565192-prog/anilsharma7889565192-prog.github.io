import { NextResponse } from "next/server";
import { CLIENT_COOKIE } from "@/lib/auth";

export async function POST(req: Request) {
  const res = NextResponse.redirect(new URL("/account", req.url), 303);
  res.cookies.set(CLIENT_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}

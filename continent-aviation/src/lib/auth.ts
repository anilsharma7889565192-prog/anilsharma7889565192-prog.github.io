import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminEmail } from "./email";

export const SESSION_COOKIE = "ca_admin";
const MAX_AGE_S = 60 * 60 * 8; // 8 hours

function secret() {
  const s = process.env.SESSION_SECRET;
  if (s && s.length >= 24) return s;
  if (process.env.NODE_ENV !== "production") return "development-only-session-secret-change-me";
  return null;
}

/** Admin access is available only when an admin email and a strong session secret are configured. */
export const authConfigured = () => Boolean(adminEmail() && secret());

const b64 = (b: Buffer | string) => Buffer.from(b).toString("base64url");
const sign = (payload: string, key: string) => createHmac("sha256", key).update(payload).digest("base64url");

export function makeSession(email: string) {
  const key = secret();
  if (!key) throw new Error("SESSION_SECRET is not configured");
  const payload = b64(JSON.stringify({ email, exp: Math.floor(Date.now() / 1000) + MAX_AGE_S }));
  return `${payload}.${sign(payload, key)}`;
}

export function readSession(value: string | undefined | null): { email: string } | null {
  const key = secret();
  if (!key || !value) return null;
  const [payload, sig] = value.split(".");
  if (!payload || !sig) return null;
  const expected = sign(payload, key);
  const a = Buffer.from(sig), b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const { email, exp, role } = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (role) return null; // client sessions carry a role and are never admin sessions
    if (typeof email !== "string" || typeof exp !== "number" || exp < Date.now() / 1000) return null;
    if (email !== adminEmail()) return null;
    return { email };
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: MAX_AGE_S,
};

export async function getAdmin() {
  return readSession((await cookies()).get(SESSION_COOKIE)?.value);
}

export async function requireAdmin() {
  const a = await getAdmin();
  if (!a) redirect("/admin/login");
  return a;
}

// ---- client (customer) sessions: separate cookie and payload from the admin session
export const CLIENT_COOKIE = "ca_client";
const CLIENT_MAX_AGE_S = 60 * 60 * 24 * 30;

export function makeClientSession(email: string) {
  const key = secret();
  if (!key) throw new Error("SESSION_SECRET is not configured");
  const payload = b64(JSON.stringify({ role: "client", email, exp: Math.floor(Date.now() / 1000) + CLIENT_MAX_AGE_S }));
  return `${payload}.${sign(payload, key)}`;
}
export function readClientSession(value: string | undefined | null): { email: string } | null {
  const key = secret();
  if (!key || !value) return null;
  const [payload, sig] = value.split(".");
  if (!payload || !sig) return null;
  const a = Buffer.from(sig), b = Buffer.from(sign(payload, key));
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const { role, email, exp } = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (role !== "client" || typeof email !== "string" || typeof exp !== "number" || exp < Date.now() / 1000) return null;
    return { email };
  } catch {
    return null;
  }
}
export const clientCookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/", maxAge: CLIENT_MAX_AGE_S };
export async function getClientSession() {
  return readClientSession((await cookies()).get(CLIENT_COOKIE)?.value);
}
export const clientAuthConfigured = () => Boolean(secret());

"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { acceptQuote, getEnquiry, getQuoteByToken } from "@/lib/db/repo";
import { mail } from "@/lib/email";
import { rateLimit } from "@/lib/ratelimit";
import { headers } from "next/headers";

export async function accept(fd: FormData) {
  const token = String(fd.get("token") ?? "");
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!token || !rateLimit(`accept:${ip}`, 20, 10 * 60 * 1000)) redirect(`/quote/${encodeURIComponent(token)}?r=busy`);
  const res = await acceptQuote(token);
  if (res.ok) {
    const [e, q] = await Promise.all([getEnquiry(res.enquiryId), getQuoteByToken(token)]);
    if (e && q) await Promise.allSettled([mail.acceptedClient(e, q), mail.acceptedAdmin(e)]);
    revalidatePath(`/quote/${token}`);
    redirect(`/quote/${encodeURIComponent(token)}?r=accepted`);
  }
  redirect(`/quote/${encodeURIComponent(token)}?r=${res.reason}`);
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getClientSession } from "@/lib/auth";
import { updateClientProfile } from "@/lib/db/repo";

export async function saveProfile(fd: FormData) {
  const s = await getClientSession();
  if (!s) redirect("/account");
  const f = (k: string) => String(fd.get(k) ?? "").trim();
  await updateClientProfile(s.email, { name: f("name"), phone: f("phone"), company: f("company") });
  revalidatePath("/account");
  redirect("/account?saved=1");
}

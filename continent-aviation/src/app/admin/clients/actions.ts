"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { updateClientNotes } from "@/lib/db/repo";

export async function saveClientNotes(fd: FormData) {
  await requireAdmin();
  const email = String(fd.get("email") ?? "").trim().toLowerCase();
  if (!email) redirect("/admin/clients");
  await updateClientNotes(email, String(fd.get("notes") ?? ""));
  redirect(`/admin/clients/${encodeURIComponent(email)}?saved=1`);
}

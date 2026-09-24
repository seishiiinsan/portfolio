"use server";

import { createPublicClient } from "@/lib/supabase/public";

export type ContactState = { status: "idle" | "ok" | "error" };

export async function sendMessage(_: ContactState, form: FormData): Promise<ContactState> {
  if (form.get("company")) return { status: "ok" }; // honeypot
  const name = String(form.get("name") ?? "").trim();
  const email = String(form.get("email") ?? "").trim();
  const body = String(form.get("body") ?? "").trim();
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !body || body.length > 5000) {
    return { status: "error" };
  }
  const { error } = await createPublicClient().from("messages").insert({ name, email, body });
  return { status: error ? "error" : "ok" };
}

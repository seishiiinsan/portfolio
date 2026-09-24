"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { createPublicClient } from "@/lib/supabase/public";

export type ContactState = { status: "idle" | "ok" | "error" | "limited" };
export type SubscribeState = { status: "idle" | "ok" | "error" };

const MIN_FILL_MS = 2500;

async function ipHash() {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  const day = new Date().toISOString().slice(0, 10);
  return createHash("sha256").update(`${ip}|${day}|${process.env.NEXT_PUBLIC_SUPABASE_URL}`).digest("hex").slice(0, 32);
}

async function verifyTurnstile(token: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // Turnstile non configuré
  if (!token) return false;
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: new URLSearchParams({ secret, response: token }),
  }).catch(() => null);
  const data = (await res?.json().catch(() => null)) as { success?: boolean } | null;
  return !!data?.success;
}

async function notify(name: string, email: string, body: string) {
  const url = process.env.NOTIFY_WEBHOOK_URL;
  if (!url) return;
  const text = `📬 Nouveau message de **${name}** (${email})\n>>> ${body.slice(0, 1500)}`;
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // Compatible Discord (content) et Slack (text)
    body: JSON.stringify({ content: text, text }),
  }).catch(() => {});
}

export async function sendMessage(_: ContactState, form: FormData): Promise<ContactState> {
  if (form.get("company")) return { status: "ok" }; // honeypot
  const started = Number(form.get("t") ?? 0);
  if (!started || Date.now() - started < MIN_FILL_MS) return { status: "ok" }; // soumis trop vite : robot
  if (!(await verifyTurnstile(String(form.get("cf-turnstile-response") ?? "")))) return { status: "error" };

  const name = String(form.get("name") ?? "").trim();
  const email = String(form.get("email") ?? "").trim();
  const body = String(form.get("body") ?? "").trim();
  if (!name || name.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !body || body.length > 5000) {
    return { status: "error" };
  }
  const { data, error } = await createPublicClient().rpc("submit_message", {
    p_name: name,
    p_email: email,
    p_body: body,
    p_ip_hash: await ipHash(),
  });
  if (error) return { status: "error" };
  if (data === false) return { status: "limited" };
  await notify(name, email, body);
  return { status: "ok" };
}

export async function subscribe(_: SubscribeState, form: FormData): Promise<SubscribeState> {
  if (form.get("company")) return { status: "ok" };
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const locale = form.get("locale") === "fr" ? "fr" : "en";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 320) return { status: "error" };
  const { error } = await createPublicClient().from("subscribers").insert({ email, locale });
  return { status: error ? "error" : "ok" };
}

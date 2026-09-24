"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import { safeHex } from "@/lib/color";

const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const l10n = (f: FormData, k: string) => ({ fr: str(f, `${k}_fr`), en: str(f, `${k}_en`) });
const opt = (f: FormData, k: string) => str(f, k) || null;
const list = (f: FormData, k: string) =>
  str(f, k)
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);

function publish() {
  revalidatePath("/", "layout");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function saveSettings(f: FormData) {
  const db = await requireAdmin();
  const socials = str(f, "socials")
    .split("\n")
    .map((l) => l.split("|").map((s) => s.trim()))
    .filter(([label, url]) => label && url)
    .map(([label, url]) => ({ label, url }));
  const { error } = await db
    .from("settings")
    .update({
      name: str(f, "name"),
      accent: safeHex(str(f, "accent")),
      role: l10n(f, "role"),
      hero: l10n(f, "hero"),
      about: l10n(f, "about"),
      location: str(f, "location"),
      email: str(f, "email"),
      available: f.get("available") === "on",
      cv_url: opt(f, "cv_url"),
      studio_name: opt(f, "studio_name"),
      studio_url: opt(f, "studio_url"),
      socials,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);
  if (error) throw new Error(error.message);
  publish();
  redirect("/admin?saved=1");
}

export async function saveProject(f: FormData) {
  const db = await requireAdmin();
  const id = str(f, "id");
  const row = {
    slug: str(f, "slug")
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-|-$/g, ""),
    title: l10n(f, "title"),
    summary: l10n(f, "summary"),
    content: l10n(f, "content"),
    role: l10n(f, "role"),
    cover_url: opt(f, "cover_url"),
    gallery: list(f, "gallery"),
    tags: list(f, "tags"),
    year: Number(str(f, "year")) || null,
    repo_url: opt(f, "repo_url"),
    demo_url: opt(f, "demo_url"),
    featured: f.get("featured") === "on",
    published: f.get("published") === "on",
    position: Number(str(f, "position")) || 0,
  };
  if (!row.slug) throw new Error("Slug requis");
  const { error } = id ? await db.from("projects").update(row).eq("id", id) : await db.from("projects").insert(row);
  if (error) throw new Error(error.message);
  publish();
  redirect("/admin/projects?saved=1");
}

export async function deleteProject(f: FormData) {
  const db = await requireAdmin();
  const { error } = await db.from("projects").delete().eq("id", str(f, "id"));
  if (error) throw new Error(error.message);
  publish();
  redirect("/admin/projects");
}

export async function moveProject(f: FormData) {
  const db = await requireAdmin();
  const { data } = await db.from("projects").select("id").order("position").order("created_at", { ascending: false });
  const ids = (data ?? []).map((r) => r.id as string);
  const i = ids.indexOf(str(f, "id"));
  const j = i + (str(f, "dir") === "up" ? -1 : 1);
  if (i < 0 || j < 0 || j >= ids.length) return;
  [ids[i], ids[j]] = [ids[j], ids[i]];
  await Promise.all(ids.map((id, position) => db.from("projects").update({ position }).eq("id", id)));
  publish();
  revalidatePath("/admin/projects");
}

export async function saveExperience(f: FormData) {
  const db = await requireAdmin();
  const id = str(f, "id");
  const row = {
    kind: str(f, "kind") === "education" ? "education" : "work",
    title: l10n(f, "title"),
    description: l10n(f, "description"),
    org: str(f, "org"),
    location: opt(f, "location"),
    start_date: str(f, "start_date"),
    end_date: opt(f, "end_date"),
    position: Number(str(f, "position")) || 0,
  };
  const { error } = id
    ? await db.from("experiences").update(row).eq("id", id)
    : await db.from("experiences").insert(row);
  if (error) throw new Error(error.message);
  publish();
  revalidatePath("/admin/experiences");
}

export async function deleteExperience(f: FormData) {
  const db = await requireAdmin();
  await db.from("experiences").delete().eq("id", str(f, "id"));
  publish();
  revalidatePath("/admin/experiences");
}

export async function toggleMessage(f: FormData) {
  const db = await requireAdmin();
  await db.from("messages").update({ read: str(f, "read") !== "true" }).eq("id", str(f, "id"));
  revalidatePath("/admin/messages");
}

export async function deleteMessage(f: FormData) {
  const db = await requireAdmin();
  await db.from("messages").delete().eq("id", str(f, "id"));
  revalidatePath("/admin/messages");
}

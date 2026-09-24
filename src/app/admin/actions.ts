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

const slugify = (v: string) =>
  v
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-|-$/g, "");

/** « valeur | libellé FR | libellé EN » par ligne. */
function metrics(f: FormData) {
  return str(f, "metrics")
    .split("\n")
    .map((l) => l.split("|").map((s) => s.trim()))
    .filter(([value]) => value)
    .map(([value, fr = "", en = ""]) => ({ value, label: { fr, en: en || fr } }));
}

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
      booking_url: opt(f, "booking_url"),
      trainings_count: Math.max(0, Number(str(f, "trainings_count")) || 0),
      stack: list(f, "stack"),
      cta_label: l10n(f, "cta_label"),
      cta_url: opt(f, "cta_url"),
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
    video_url: opt(f, "video_upload") ?? opt(f, "video_url"),
    metrics: metrics(f),
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

const SORTABLE = ["projects", "experiences", "testimonials"] as const;

export async function reorder(table: (typeof SORTABLE)[number], ids: string[]) {
  if (!SORTABLE.includes(table)) throw new Error("Table invalide");
  const db = await requireAdmin();
  await Promise.all(ids.map((id, position) => db.from(table).update({ position }).eq("id", id)));
  publish();
  revalidatePath(`/admin/${table}`);
}

export async function savePost(f: FormData) {
  const db = await requireAdmin();
  const id = str(f, "id");
  const row = {
    slug: slugify(str(f, "slug")),
    title: l10n(f, "title"),
    summary: l10n(f, "summary"),
    content: l10n(f, "content"),
    cover_url: opt(f, "cover_url"),
    tags: list(f, "tags"),
    published: f.get("published") === "on",
    published_at: str(f, "published_at") ? new Date(str(f, "published_at")).toISOString() : new Date().toISOString(),
  };
  if (!row.slug) throw new Error("Slug requis");
  const { error } = id ? await db.from("posts").update(row).eq("id", id) : await db.from("posts").insert(row);
  if (error) throw new Error(error.message);
  publish();
  redirect("/admin/posts?saved=1");
}

export async function deletePost(f: FormData) {
  const db = await requireAdmin();
  await db.from("posts").delete().eq("id", str(f, "id"));
  publish();
  redirect("/admin/posts");
}

export async function savePage(f: FormData) {
  const db = await requireAdmin();
  const slug = slugify(str(f, "slug"));
  if (!slug) throw new Error("Slug requis");
  const { error } = await db
    .from("pages")
    .upsert({ slug, title: l10n(f, "title"), content: l10n(f, "content"), updated_at: new Date().toISOString() });
  if (error) throw new Error(error.message);
  publish();
  redirect("/admin/pages?saved=1");
}

export async function saveTestimonial(f: FormData) {
  const db = await requireAdmin();
  const id = str(f, "id");
  const row = {
    author: str(f, "author"),
    role: opt(f, "role"),
    url: opt(f, "url"),
    quote: l10n(f, "quote"),
  };
  if (!row.author) throw new Error("Auteur requis");
  const { error } = id
    ? await db.from("testimonials").update(row).eq("id", id)
    : await db.from("testimonials").insert({ ...row, position: 999 });
  if (error) throw new Error(error.message);
  publish();
  revalidatePath("/admin/testimonials");
}

export async function deleteTestimonial(f: FormData) {
  const db = await requireAdmin();
  await db.from("testimonials").delete().eq("id", str(f, "id"));
  publish();
  revalidatePath("/admin/testimonials");
}

export async function deleteSubscriber(f: FormData) {
  const db = await requireAdmin();
  await db.from("subscribers").delete().eq("id", str(f, "id"));
  revalidatePath("/admin/subscribers");
}

export async function regeneratePreviewToken(f: FormData) {
  const db = await requireAdmin();
  const id = str(f, "id");
  await db.from("projects").update({ preview_token: crypto.randomUUID() }).eq("id", id);
  revalidatePath(`/admin/projects/${id}`);
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
  };
  const { error } = id
    ? await db.from("experiences").update(row).eq("id", id)
    : await db.from("experiences").insert({ ...row, position: 999 });
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

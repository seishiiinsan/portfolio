import { cache } from "react";
import { createPublicClient } from "./supabase/public";
import type { Experience, Page, Post, Project, Settings, Testimonial } from "./types";

const FALLBACK: Settings = {
  id: 1,
  name: "Gabin Hallosserie",
  accent: "#be3455",
  role: { fr: "Développeur logiciel", en: "Software developer" },
  hero: { fr: "", en: "" },
  about: { fr: "", en: "" },
  location: "France",
  available: true,
  email: "",
  socials: [],
  cv_url: null,
  studio_name: null,
  studio_url: null,
  booking_url: null,
  trainings_count: 0,
  stack: [],
  cta_label: { fr: "", en: "" },
  cta_url: null,
  updated_at: "",
};

export const getSettings = cache(async (): Promise<Settings> => {
  const { data } = await createPublicClient().from("settings").select("*").eq("id", 1).maybeSingle();
  return (data as Settings) ?? FALLBACK;
});

export const getProjects = cache(async (): Promise<Project[]> => {
  const { data } = await createPublicClient()
    .from("projects")
    .select("*")
    .eq("published", true)
    .order("position")
    .order("created_at", { ascending: false });
  return (data as Project[]) ?? [];
});

export const getProject = cache(async (slug: string) => {
  const all = await getProjects();
  const i = all.findIndex((p) => p.slug === slug);
  if (i === -1) return null;
  return { project: all[i], next: all.length > 1 ? all[(i + 1) % all.length] : null };
});

export const getExperiences = cache(async (): Promise<Experience[]> => {
  const { data } = await createPublicClient().from("experiences").select("*").order("position");
  return (data as Experience[]) ?? [];
});

export const getPage = cache(async (slug: string): Promise<Page | null> => {
  const { data } = await createPublicClient().from("pages").select("*").eq("slug", slug).maybeSingle();
  return (data as Page) ?? null;
});

export const getPosts = cache(async (): Promise<Post[]> => {
  const { data } = await createPublicClient()
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });
  return (data as Post[]) ?? [];
});

export const getPost = cache(async (slug: string) => (await getPosts()).find((p) => p.slug === slug) ?? null);

export const getTestimonials = cache(async (): Promise<Testimonial[]> => {
  const { data } = await createPublicClient().from("testimonials").select("*").order("position");
  return (data as Testimonial[]) ?? [];
});

/** Projet non publié, lu via son jeton de prévisualisation. */
export async function getPreviewProject(token: string): Promise<Project | null> {
  if (!/^[0-9a-f-]{36}$/i.test(token)) return null;
  const { data } = await createPublicClient().rpc("project_by_preview_token", { p_token: token });
  return ((data as Project[] | null) ?? [])[0] ?? null;
}

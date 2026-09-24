import { cache } from "react";
import { createPublicClient } from "./supabase/public";
import type { Experience, Project, Settings } from "./types";

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

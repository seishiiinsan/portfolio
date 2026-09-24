import type { MetadataRoute } from "next";
import { getPosts, getProjects } from "@/lib/data";
import { locales } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts] = await Promise.all([getProjects(), getPosts()]);
  const paths: { path: string; lastModified?: string; priority: number }[] = [
    { path: "", priority: 1 },
    { path: "/projects", priority: 0.9 },
    { path: "/blog", priority: 0.6 },
    { path: "/now", priority: 0.5 },
    { path: "/uses", priority: 0.4 },
    { path: "/studio", priority: 0.6 },
    ...projects.map((p) => ({ path: `/projects/${p.slug}`, lastModified: p.created_at, priority: 0.8 })),
    ...posts.map((p) => ({ path: `/blog/${p.slug}`, lastModified: p.published_at, priority: 0.6 })),
  ];
  return paths.flatMap(({ path, lastModified, priority }) =>
    locales.map((l) => ({
      url: `${SITE_URL}/${l}${path}`,
      lastModified,
      priority,
      alternates: { languages: Object.fromEntries(locales.map((x) => [x, `${SITE_URL}/${x}${path}`])) },
    })),
  );
}

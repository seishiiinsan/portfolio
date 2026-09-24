import { getProject } from "@/lib/data";
import { isLocale, t } from "@/lib/i18n";
import { ogImage, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Project";

export default async function Image({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const l = isLocale(locale) ? locale : "en";
  const r = await getProject(slug);
  if (!r) return ogImage({ kicker: "404", title: "Not found" });
  return ogImage({
    kicker: [r.project.year, ...r.project.tags.slice(0, 3)].filter(Boolean).join(" / "),
    title: t(r.project.title, l),
    subtitle: t(r.project.summary, l),
  });
}

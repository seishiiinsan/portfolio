import { getPost } from "@/lib/data";
import { isLocale, t } from "@/lib/i18n";
import { ogImage, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Blog post";

export default async function Image({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const l = isLocale(locale) ? locale : "en";
  const p = await getPost(slug);
  if (!p) return ogImage({ kicker: "404", title: "Not found" });
  return ogImage({ kicker: "Blog", title: t(p.title, l), subtitle: t(p.summary, l) });
}

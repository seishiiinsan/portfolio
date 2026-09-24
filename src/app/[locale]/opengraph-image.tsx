import { getSettings } from "@/lib/data";
import { isLocale, t } from "@/lib/i18n";
import { ogImage, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Portfolio";

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const s = await getSettings();
  const l = isLocale(locale) ? locale : "en";
  return ogImage({ kicker: t(s.role, l), title: s.name, subtitle: t(s.hero, l) });
}

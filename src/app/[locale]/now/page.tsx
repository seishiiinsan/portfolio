import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDict, isLocale, t } from "@/lib/i18n";
import { getPage, getSettings } from "@/lib/data";
import { alternates } from "@/lib/site";
import { ContentPage } from "@/components/content-page";

export async function generateMetadata({ params }: PageProps<"/[locale]/now">): Promise<Metadata> {
  const { locale } = await params;
  const page = await getPage("now");
  if (!isLocale(locale) || !page) return {};
  return { title: t(page.title, locale), alternates: alternates(locale, "/now") };
}

export default async function Page({ params }: PageProps<"/[locale]/now">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const [page, s] = await Promise.all([getPage("now"), getSettings()]);
  if (!page) notFound();
  const dict = getDict(locale);
  return <ContentPage page={page} s={s} dict={dict} locale={locale} label={dict.nav2.now} />;
}

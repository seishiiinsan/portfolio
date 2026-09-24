import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDict, isLocale } from "@/lib/i18n";
import { getPreviewProject } from "@/lib/data";
import { ProjectView } from "@/components/project-view";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Preview", robots: { index: false, follow: false } };

/** Aperçu privé d'un projet (même non publié), accessible via son jeton. */
export default async function PreviewPage({ params }: PageProps<"/[locale]/preview/[token]">) {
  const { locale, token } = await params;
  if (!isLocale(locale)) notFound();
  const p = await getPreviewProject(token);
  if (!p) notFound();
  return <ProjectView p={p} locale={locale} dict={getDict(locale)} preview />;
}

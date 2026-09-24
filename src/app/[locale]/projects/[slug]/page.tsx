import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDict, isLocale, locales, t } from "@/lib/i18n";
import { getProject, getProjects, getSettings } from "@/lib/data";
import { alternates } from "@/lib/site";
import { PageTransition } from "@/components/page-transition";
import { ProjectView } from "@/components/project-view";
import { Footer } from "@/components/footer";

export async function generateStaticParams() {
  const projects = await getProjects();
  return locales.flatMap((locale) => projects.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/projects/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const r = await getProject(slug);
  if (!r || !isLocale(locale)) return {};
  const title = t(r.project.title, locale);
  const description = t(r.project.summary, locale);
  return {
    title,
    description,
    keywords: r.project.tags,
    alternates: alternates(locale, `/projects/${slug}`),
    openGraph: { title, description, type: "article", url: `/${locale}/projects/${slug}` },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ProjectPage({ params }: PageProps<"/[locale]/projects/[slug]">) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const r = await getProject(slug);
  if (!r) notFound();
  const dict = getDict(locale);
  const s = await getSettings();

  return (
    <PageTransition>
      <ProjectView p={r.project} next={r.next} locale={locale} dict={dict} />
      <Footer s={s} dict={dict} locale={locale} />
    </PageTransition>
  );
}

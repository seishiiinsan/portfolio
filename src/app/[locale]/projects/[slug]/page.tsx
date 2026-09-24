import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getDict, isLocale, locales, t } from "@/lib/i18n";
import { getProject, getProjects, getSettings } from "@/lib/data";
import { PageTransition } from "@/components/page-transition";
import { Reveal, Rule } from "@/components/reveal";
import { Footer } from "@/components/footer";
import { GalleryCarousel } from "@/components/gallery-carousel";

export async function generateStaticParams() {
  const projects = await getProjects();
  return locales.flatMap((locale) => projects.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/projects/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const r = await getProject(slug);
  if (!r || !isLocale(locale)) return {};
  return {
    title: t(r.project.title, locale),
    description: t(r.project.summary, locale),
    openGraph: r.project.cover_url ? { images: [r.project.cover_url] } : undefined,
  };
}

export default async function ProjectPage({ params }: PageProps<"/[locale]/projects/[slug]">) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const r = await getProject(slug);
  if (!r) notFound();
  const { project: p, next } = r;
  const dict = getDict(locale);
  const s = await getSettings();

  const meta = [
    { k: dict.year, v: p.year ? String(p.year) : "" },
    { k: dict.role, v: t(p.role, locale) },
    { k: dict.stack, v: p.tags.join(", ") },
  ].filter((m) => m.v);

  return (
    <PageTransition>
      <article>
        <header className="px-4 pt-32 md:px-8 md:pt-44">
          <Link
            href={`/${locale}/projects`}
            transitionTypes={["nav-back"]}
            className="link-u mb-10 inline-block font-mono text-xs uppercase"
          >
            ← {dict.back}
          </Link>
          <ViewTransition name={`project-title-${p.slug}`} share="morph" default="none">
            <h1 className="max-w-[14ch] text-6xl leading-[0.9] font-medium tracking-[-0.05em] md:text-[9vw]">
              {t(p.title, locale)}
            </h1>
          </ViewTransition>
          <Rule className="mt-12" delay={0.3} />
          <div className="grid grid-cols-2 gap-6 py-8 md:grid-cols-12">
            {meta.map((m, i) => (
              <Reveal key={m.k} delay={0.35 + i * 0.07} y={16} className="md:col-span-3">
                <p className="font-mono text-xs uppercase text-muted">{m.k}</p>
                <p className="mt-2">{m.v}</p>
              </Reveal>
            ))}
            {(p.repo_url || p.demo_url) && (
              <Reveal delay={0.55} y={16} className="md:col-span-3">
                <p className="font-mono text-xs uppercase text-muted">{dict.links}</p>
                <div className="mt-2 flex flex-col">
                  {p.demo_url && (
                    <a href={p.demo_url} target="_blank" rel="noreferrer" className="link-u w-fit hover:text-accent">
                      {dict.demo} ↗
                    </a>
                  )}
                  {p.repo_url && (
                    <a href={p.repo_url} target="_blank" rel="noreferrer" className="link-u w-fit hover:text-accent">
                      {dict.repo} ↗
                    </a>
                  )}
                </div>
              </Reveal>
            )}
          </div>
        </header>

        {p.cover_url && (
          <div className="grid px-4 md:grid-cols-12 md:gap-6 md:px-8">
            <Reveal className="md:col-span-8 md:col-start-3" y={60}>
              <div className="relative aspect-video overflow-hidden bg-line">
                <Image
                  src={p.cover_url}
                  alt={t(p.title, locale)}
                  fill
                  priority
                  sizes="(min-width: 768px) 66vw, 100vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>
        )}

        <section className="grid gap-10 px-4 py-24 md:grid-cols-12 md:gap-6 md:px-8">
          <Reveal className="md:col-span-4">
            <p className="text-2xl leading-tight font-medium tracking-tight">{t(p.summary, locale)}</p>
          </Reveal>
          <Reveal className="prose-swiss md:col-span-7 md:col-start-6" delay={0.1}>
            <Markdown remarkPlugins={[remarkGfm]}>{t(p.content, locale)}</Markdown>
          </Reveal>
        </section>

        {p.gallery.length > 0 && (
          <Reveal className="px-4 md:px-8">
            <GalleryCarousel images={p.gallery} title={t(p.title, locale)} />
          </Reveal>
        )}

        {next && (
          <Link
            href={`/${locale}/projects/${next.slug}`}
            transitionTypes={["nav-forward"]}
            data-cursor="view"
            className="group mt-32 block px-4 md:px-8"
          >
            <Rule />
            <p className="mt-6 font-mono text-xs uppercase text-muted">{dict.next} →</p>
            <p className="mt-4 text-[12vw] leading-[0.85] font-medium tracking-[-0.05em] transition-colors duration-500 group-hover:text-accent md:text-[8vw]">
              {t(next.title, locale)}
            </p>
          </Link>
        )}
      </article>
      <Footer s={s} />
    </PageTransition>
  );
}

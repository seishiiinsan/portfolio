import Link from "next/link";
import { ViewTransition } from "react";
import type { Dict, Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import type { Project } from "@/lib/types";
import { SITE_URL } from "@/lib/site";
import { Reveal, Rule } from "./reveal";
import { GalleryCarousel } from "./gallery-carousel";
import { FadeImage } from "./fade-image";
import { Magnetic } from "./magnetic";
import { ReadingProgress } from "./reading-progress";
import { JsonLd } from "./json-ld";
import { Prose } from "./markdown";

const isVideoFile = (u: string) => /\.(mp4|webm|mov)(\?|$)/i.test(u);

function Video({ url, title }: { url: string; title: string }) {
  if (isVideoFile(url)) {
    return <video src={url} controls playsInline preload="metadata" className="aspect-video w-full bg-line" aria-label={title} />;
  }
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/)?.[1];
  const vimeo = url.match(/vimeo\.com\/(\d+)/)?.[1];
  const src = yt ? `https://www.youtube-nocookie.com/embed/${yt}` : vimeo ? `https://player.vimeo.com/video/${vimeo}` : null;
  if (!src) return null;
  return (
    <iframe
      src={src}
      title={title}
      loading="lazy"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className="aspect-video w-full bg-line"
    />
  );
}

export function ProjectView({
  p,
  next,
  locale,
  dict,
  preview,
}: {
  p: Project;
  next?: Project | null;
  locale: Locale;
  dict: Dict;
  preview?: boolean;
}) {
  const title = t(p.title, locale);
  const meta = [
    { k: dict.year, v: p.year ? String(p.year) : "" },
    { k: dict.role, v: t(p.role, locale) },
    { k: dict.stack, v: p.tags.join(", ") },
  ].filter((m) => m.v);

  return (
    <article>
      <ReadingProgress />
      {!preview && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: title,
            description: t(p.summary, locale),
            image: p.cover_url ?? undefined,
            dateCreated: p.year ? String(p.year) : undefined,
            keywords: p.tags.join(", "),
            url: `${SITE_URL}/${locale}/projects/${p.slug}`,
            sameAs: p.demo_url ?? undefined,
            inLanguage: locale,
          }}
        />
      )}
      {preview && (
        <p className="fixed inset-x-0 bottom-0 z-[60] bg-accent px-4 py-2 text-center font-mono text-xs uppercase text-accent-fg">
          {dict.previewBanner}
        </p>
      )}
      <header className="px-4 pt-32 md:px-8 md:pt-44">
        <Link
          href={`/${locale}/projects`}
          transitionTypes={["nav-back"]}
          className="link-u mb-10 inline-block font-mono text-xs uppercase"
        >
          ← {dict.back}
        </Link>
        <ViewTransition name={`project-title-${p.slug}`} share="morph" default="none">
          <h1 className="max-w-[14ch] text-6xl leading-[0.9] font-medium tracking-[-0.05em] md:text-[9vw]">{title}</h1>
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
            <Reveal delay={0.55} y={16} className="col-span-2 flex flex-wrap items-start gap-3 md:col-span-3 md:justify-end">
              {p.demo_url && (
                <Magnetic>
                  <a
                    href={p.demo_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-full bg-accent px-5 py-2.5 font-mono text-xs uppercase text-accent-fg transition-opacity hover:opacity-85"
                  >
                    {dict.demo} ↗
                  </a>
                </Magnetic>
              )}
              {p.repo_url && (
                <Magnetic>
                  <a
                    href={p.repo_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-full border border-fg/40 px-5 py-2.5 font-mono text-xs uppercase transition-colors hover:border-accent hover:text-accent"
                  >
                    {dict.repo} ↗
                  </a>
                </Magnetic>
              )}
            </Reveal>
          )}
        </div>
      </header>

      {p.cover_url && (
        <div className="grid px-4 md:grid-cols-12 md:gap-6 md:px-8">
          <Reveal className="md:col-span-8 md:col-start-3" y={60}>
            <ViewTransition name={`project-cover-${p.slug}`} share="morph" default="none">
              <div className="relative aspect-video overflow-hidden bg-line">
                <FadeImage src={p.cover_url} alt={title} fill priority sizes="(min-width: 768px) 66vw, 100vw" className="object-cover" />
              </div>
            </ViewTransition>
          </Reveal>
        </div>
      )}

      {p.metrics.length > 0 && (
        <section aria-label={dict.keyFigures} className="grid grid-cols-2 gap-6 px-4 pt-20 md:grid-cols-4 md:px-8">
          {p.metrics.map((m, i) => (
            <Reveal key={i} delay={i * 0.08} className="border-t border-line pt-4">
              <p className="text-5xl font-medium tracking-tight text-accent md:text-6xl">{m.value}</p>
              <p className="mt-2 font-mono text-xs uppercase text-muted">{t(m.label, locale)}</p>
            </Reveal>
          ))}
        </section>
      )}

      <section className="grid gap-10 px-4 py-24 md:grid-cols-12 md:gap-6 md:px-8">
        <Reveal className="md:col-span-4">
          <p className="text-2xl leading-tight font-medium tracking-tight md:sticky md:top-28">{t(p.summary, locale)}</p>
        </Reveal>
        <Reveal className="md:col-span-7 md:col-start-6" delay={0.1}>
          <Prose>{t(p.content, locale)}</Prose>
        </Reveal>
      </section>

      {p.video_url && (
        <div className="grid px-4 pb-24 md:grid-cols-12 md:gap-6 md:px-8">
          <Reveal className="md:col-span-8 md:col-start-3">
            <p className="mb-4 font-mono text-xs uppercase text-muted">{dict.video}</p>
            <Video url={p.video_url} title={title} />
          </Reveal>
        </div>
      )}

      {p.gallery.length > 0 && (
        <Reveal className="px-4 md:px-8">
          <GalleryCarousel images={p.gallery} title={title} labels={dict} />
        </Reveal>
      )}

      {next && (
        <Link
          href={`/${locale}/projects/${next.slug}`}
          transitionTypes={["nav-forward"]}
          data-cursor="view"
          data-cursor-label={t(next.title, locale)}
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
  );
}

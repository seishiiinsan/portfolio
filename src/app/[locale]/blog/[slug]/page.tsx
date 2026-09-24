import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDict, isLocale, locales, t } from "@/lib/i18n";
import { getPost, getPosts, getSettings } from "@/lib/data";
import { SITE_URL, alternates } from "@/lib/site";
import { PageTransition } from "@/components/page-transition";
import { Reveal, Rule } from "@/components/reveal";
import { Footer } from "@/components/footer";
import { FadeImage } from "@/components/fade-image";
import { ReadingProgress } from "@/components/reading-progress";
import { JsonLd } from "@/components/json-ld";
import { Prose } from "@/components/markdown";

export async function generateStaticParams() {
  const posts = await getPosts();
  return locales.flatMap((locale) => posts.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/blog/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const p = await getPost(slug);
  if (!p || !isLocale(locale)) return {};
  const title = t(p.title, locale);
  const description = t(p.summary, locale);
  return {
    title,
    description,
    alternates: alternates(locale, `/blog/${slug}`),
    openGraph: { title, description, type: "article", publishedTime: p.published_at, url: `/${locale}/blog/${slug}` },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function PostPage({ params }: PageProps<"/[locale]/blog/[slug]">) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const p = await getPost(slug);
  if (!p) notFound();
  const dict = getDict(locale);
  const s = await getSettings();
  const title = t(p.title, locale);
  const date = new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(new Date(p.published_at));

  return (
    <PageTransition>
      <article>
        <ReadingProgress />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: title,
            description: t(p.summary, locale),
            datePublished: p.published_at,
            image: p.cover_url ?? undefined,
            author: { "@type": "Person", name: s.name, url: SITE_URL },
            url: `${SITE_URL}/${locale}/blog/${p.slug}`,
            inLanguage: locale,
          }}
        />
        <header className="px-4 pt-32 md:px-8 md:pt-44">
          <Link href={`/${locale}/blog`} transitionTypes={["nav-back"]} className="link-u mb-10 inline-block font-mono text-xs uppercase">
            ← {dict.blog}
          </Link>
          <h1 className="max-w-[18ch] text-5xl leading-[0.95] font-medium tracking-[-0.04em] md:text-7xl">{title}</h1>
          <Rule className="mt-10" />
          <p className="mt-4 flex flex-wrap gap-4 font-mono text-xs uppercase text-muted">
            <span>
              {dict.publishedOn} <time dateTime={p.published_at}>{date}</time>
            </span>
            {p.tags.length > 0 && <span>{p.tags.join(" / ")}</span>}
          </p>
        </header>
        {p.cover_url && (
          <div className="grid px-4 pt-12 md:grid-cols-12 md:gap-6 md:px-8">
            <Reveal className="md:col-span-8 md:col-start-3">
              <div className="relative aspect-video overflow-hidden bg-line">
                <FadeImage src={p.cover_url} alt={title} fill priority sizes="(min-width: 768px) 66vw, 100vw" className="object-cover" />
              </div>
            </Reveal>
          </div>
        )}
        <div className="grid px-4 py-20 md:grid-cols-12 md:gap-6 md:px-8">
          <Reveal className="md:col-span-7 md:col-start-4">
            <p className="mb-10 text-2xl leading-snug font-medium tracking-tight">{t(p.summary, locale)}</p>
            <Prose>{t(p.content, locale)}</Prose>
          </Reveal>
        </div>
      </article>
      <Footer s={s} dict={dict} locale={locale} />
    </PageTransition>
  );
}

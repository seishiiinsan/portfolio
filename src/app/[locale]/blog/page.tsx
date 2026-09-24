import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDict, isLocale, t } from "@/lib/i18n";
import { getPosts, getSettings } from "@/lib/data";
import { alternates } from "@/lib/site";
import { PageTransition } from "@/components/page-transition";
import { Reveal, SplitText } from "@/components/reveal";
import { Footer } from "@/components/footer";

export async function generateMetadata({ params }: PageProps<"/[locale]/blog">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: getDict(locale).blog, alternates: alternates(locale, "/blog") };
}

export default async function BlogPage({ params }: PageProps<"/[locale]/blog">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDict(locale);
  const [posts, s] = await Promise.all([getPosts(), getSettings()]);
  const fmt = new Intl.DateTimeFormat(locale, { dateStyle: "medium" });

  return (
    <PageTransition>
      <div>
        <section className="px-4 pt-36 pb-24 md:px-8 md:pt-48">
          <div className="mb-10 flex items-end justify-between gap-4">
            <SplitText as="h1" text={dict.blog} className="text-[22vw] leading-[0.8] font-medium tracking-[-0.06em] md:text-[16vw]" />
            <a href={`/${locale}/blog/rss.xml`} className="link-u mb-[2vw] font-mono text-xs uppercase text-muted">
              {dict.rss} ↗
            </a>
          </div>
          {posts.length ? (
            <ul className="border-t border-line">
              {posts.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.05}>
                  <li className="border-b border-line">
                    <Link
                      href={`/${locale}/blog/${p.slug}`}
                      transitionTypes={["nav-forward"]}
                      data-cursor-label={dict.readMore}
                      className="group grid gap-2 py-8 md:grid-cols-12 md:gap-6"
                    >
                      <time dateTime={p.published_at} className="font-mono text-xs uppercase text-muted md:col-span-2 md:pt-2">
                        {fmt.format(new Date(p.published_at))}
                      </time>
                      <span className="text-3xl font-medium tracking-tight transition-colors group-hover:text-accent md:col-span-6 md:text-5xl">
                        {t(p.title, locale)}
                      </span>
                      <span className="text-muted md:col-span-4 md:pt-2">{t(p.summary, locale)}</span>
                    </Link>
                  </li>
                </Reveal>
              ))}
            </ul>
          ) : (
            <p className="font-mono text-xs uppercase text-muted">{dict.noPosts}</p>
          )}
        </section>
        <Footer s={s} dict={dict} locale={locale} />
      </div>
    </PageTransition>
  );
}

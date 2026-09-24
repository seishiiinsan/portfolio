import Link from "next/link";
import { notFound } from "next/navigation";
import { getDict, isLocale, t } from "@/lib/i18n";
import { getExperiences, getProjects, getSettings, getTestimonials } from "@/lib/data";
import { PageTransition } from "@/components/page-transition";
import { Hero } from "@/components/hero";
import { ScrollText } from "@/components/scroll-text";
import { SectionHead } from "@/components/section-head";
import { ProjectIndex } from "@/components/project-index";
import { Reveal, SplitText } from "@/components/reveal";
import { ContactForm } from "@/components/contact-form";
import { Footer } from "@/components/footer";
import { Marquee } from "@/components/marquee";
import { Magnetic } from "@/components/magnetic";
import { alternates } from "@/lib/site";
import type { Metadata } from "next";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { alternates: alternates(locale) } : {};
}

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDict(locale);
  const [s, projects, exps, testimonials] = await Promise.all([
    getSettings(),
    getProjects(),
    getExperiences(),
    getTestimonials(),
  ]);
  const ctaLabel = t(s.cta_label, locale);
  const featured = projects.filter((p) => p.featured);
  const shown = (featured.length ? featured : projects).slice(0, 6);
  const about = t(s.about, locale);

  return (
    <PageTransition>
      <div>
        <Hero
          name={s.name}
          role={t(s.role, locale)}
          text={t(s.hero, locale)}
          location={s.location}
          available={s.available}
          labels={dict}
          cta={ctaLabel && s.cta_url ? { label: ctaLabel, url: s.cta_url } : undefined}
        />

        <Marquee items={s.stack} />

        {about && (
          <section id="about" className="scroll-mt-24 px-4 py-24 md:px-8 md:py-40">
            <SectionHead n="01" label={dict.about} />
            <div className="grid gap-12 md:grid-cols-12 md:gap-6">
              <ScrollText
                text={about}
                className="text-3xl leading-[1.1] font-medium tracking-[-0.03em] md:col-span-10 md:text-6xl"
              />
              {s.trainings_count > 0 && (
                <Reveal className="md:col-span-12">
                  <p className="flex items-baseline gap-4">
                    <span className="text-6xl font-medium tracking-tight text-accent md:text-8xl">{s.trainings_count}</span>
                    <span className="font-mono text-xs uppercase text-muted">{dict.trainings}</span>
                  </p>
                </Reveal>
              )}
              {s.cv_url && (
                <Reveal className="md:col-span-12">
                  <a
                    href={s.cv_url}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-4 font-mono text-xs uppercase"
                  >
                    <span className="flex size-12 items-center justify-center rounded-full border border-fg transition-colors duration-500 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-fg">
                      ↓
                    </span>
                    <span className="link-u">{dict.downloadCv}</span>
                  </a>
                </Reveal>
              )}
            </div>
          </section>
        )}

        <section id="work" className="scroll-mt-24 px-4 py-24 md:px-8 md:py-40">
          <SectionHead n="02" label={`${dict.selected} (${shown.length})`} title={dict.selected} />
          {shown.length ? (
            <ProjectIndex projects={shown} locale={locale} />
          ) : (
            <p className="font-mono text-xs uppercase text-muted">{dict.noProjects}</p>
          )}
          {projects.length > shown.length && (
            <Reveal className="mt-12 flex justify-end">
              <Link
                href={`/${locale}/projects`}
                transitionTypes={["nav-forward"]}
                className="link-u font-mono text-xs uppercase"
              >
                {dict.allProjects} ({projects.length}) →
              </Link>
            </Reveal>
          )}
        </section>

        {exps.length > 0 && (
          <section id="experience" className="scroll-mt-24 px-4 py-24 md:px-8 md:py-40">
            <SectionHead n="03" label={dict.experience} title={dict.experience} />
            {(["work", "education"] as const).map((kind) => {
              const rows = exps.filter((e) => e.kind === kind);
              if (!rows.length) return null;
              return (
                <div key={kind} className="mb-16 grid gap-4 md:grid-cols-12 md:gap-6">
                  <h3 className="font-mono text-xs uppercase text-muted md:col-span-3">
                    {kind === "work" ? dict.work : dict.education}
                  </h3>
                  <ul className="md:col-span-9">
                    {rows.map((e, i) => (
                      <Reveal key={e.id} delay={i * 0.08}>
                        <li className="group grid grid-cols-4 gap-4 border-t border-line py-6 md:grid-cols-9 md:gap-6">
                          <span className="col-span-4 font-mono text-xs uppercase text-muted md:col-span-2 md:pt-2">
                            {e.end_date === e.start_date ? e.start_date : `${e.start_date} — ${e.end_date || dict.present}`}
                          </span>
                          <div className="col-span-4 md:col-span-5">
                            <p className="text-2xl font-medium tracking-tight transition-colors group-hover:text-accent md:text-3xl">
                              {t(e.title, locale)}
                            </p>
                            {t(e.description, locale) && (
                              <p className="mt-2 max-w-prose text-muted">{t(e.description, locale)}</p>
                            )}
                          </div>
                          <span className="col-span-4 font-mono text-xs uppercase md:col-span-2 md:pt-2 md:text-right">
                            {[e.org, e.location].filter(Boolean).join(", ")}
                          </span>
                        </li>
                      </Reveal>
                    ))}
                  </ul>
                </div>
              );
            })}
          </section>
        )}

        {testimonials.length > 0 && (
          <section className="px-4 py-24 md:px-8 md:py-40">
            <SectionHead n="04" label={dict.testimonials} />
            <div className="grid gap-12 md:grid-cols-2 md:gap-6">
              {testimonials.map((q, i) => (
                <Reveal key={q.id} delay={(i % 2) * 0.1}>
                  <figure className="border-t border-line pt-6">
                    <blockquote className="text-2xl leading-snug font-medium tracking-tight md:text-3xl">
                      “{t(q.quote, locale)}”
                    </blockquote>
                    <figcaption className="mt-6 font-mono text-xs uppercase text-muted">
                      {q.url ? (
                        <a href={q.url} target="_blank" rel="noreferrer" className="link-u hover:text-fg">
                          {q.author}
                        </a>
                      ) : (
                        q.author
                      )}
                      {q.role && ` — ${q.role}`}
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        <section id="contact" className="scroll-mt-24 px-4 py-24 md:px-8 md:py-40">
          <SectionHead n={testimonials.length ? "05" : "04"} label={dict.contact} />
          <SplitText
            as="h2"
            by="word"
            text={dict.contactTitle}
            className="text-[13vw] leading-[0.9] font-medium tracking-[-0.05em] md:text-[9vw]"
          />
          <div className="mt-16 grid gap-16 md:grid-cols-12 md:gap-6">
            <Reveal className="md:col-span-5">
              {s.email && (
                <a
                  href={`mailto:${s.email}`}
                  className="link-u break-all text-2xl font-medium tracking-tight hover:text-accent md:text-3xl"
                >
                  {s.email}
                </a>
              )}
              {s.booking_url && (
                <div className="mt-8">
                  <Magnetic>
                    <a
                      href={s.booking_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex rounded-full border border-fg px-6 py-3 font-mono text-xs uppercase transition-colors hover:border-accent hover:bg-accent hover:text-accent-fg"
                    >
                      {dict.bookCall} ↗
                    </a>
                  </Magnetic>
                </div>
              )}
              <ul className="mt-8 grid gap-2 font-mono text-xs uppercase">
                {s.socials.map((so) => (
                  <li key={so.url}>
                    <a href={so.url} target="_blank" rel="noreferrer" className="link-u">
                      {so.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal className="md:col-span-7" delay={0.1}>
              <ContactForm dict={dict} />
            </Reveal>
          </div>
        </section>

        <Footer s={s} dict={dict} locale={locale} />
      </div>
    </PageTransition>
  );
}

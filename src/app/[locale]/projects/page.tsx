import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDict, isLocale } from "@/lib/i18n";
import { getProjects, getSettings } from "@/lib/data";
import { PageTransition } from "@/components/page-transition";
import { ProjectsBrowser } from "@/components/projects-browser";
import { alternates } from "@/lib/site";
import { SplitText } from "@/components/reveal";
import { Footer } from "@/components/footer";

export async function generateMetadata({ params }: PageProps<"/[locale]/projects">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: getDict(locale).allProjects, alternates: alternates(locale, "/projects") };
}

export default async function ProjectsPage({ params }: PageProps<"/[locale]/projects">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDict(locale);
  const [projects, s] = await Promise.all([getProjects(), getSettings()]);

  return (
    <PageTransition>
      <div>
        <section className="px-4 pt-36 pb-24 md:px-8 md:pt-48">
          <div className="mb-10 flex items-end justify-between gap-4">
            <SplitText
              as="h1"
              text={dict.index}
              className="text-[22vw] leading-[0.8] font-medium tracking-[-0.06em] md:text-[16vw]"
            />
            <span className="mb-[2vw] font-mono text-xs uppercase text-muted">({projects.length})</span>
          </div>
          {projects.length ? (
            <ProjectsBrowser projects={projects} locale={locale} allLabel={dict.filterAll} />
          ) : (
            <p className="font-mono text-xs uppercase text-muted">{dict.noProjects}</p>
          )}
        </section>
        <Footer s={s} dict={dict} locale={locale} />
      </div>
    </PageTransition>
  );
}

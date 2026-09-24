import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "../globals.css";
import { grotesk, mono } from "../fonts";
import { getDict, isLocale, locales, t } from "@/lib/i18n";
import { getProjects, getSettings } from "@/lib/data";
import { contrastOn, safeHex } from "@/lib/color";
import { SITE_URL, alternates } from "@/lib/site";
import { themeScript } from "@/components/theme";
import { Header } from "@/components/header";
import { Loader } from "@/components/loader";
import { MotionProvider } from "@/components/motion-provider";
import { ClientExtras } from "@/components/client-extras";
import { JsonLd } from "@/components/json-ld";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0d0d0d" },
    { media: "(prefers-color-scheme: light)", color: "#f1efea" },
  ],
};

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const s = await getSettings();
  const title = `${s.name} — ${t(s.role, locale)}`;
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s — ${s.name}` },
    description:
      t(s.hero, locale) ||
      (locale === "fr" ? `${s.name}, développeur full-stack.` : `${s.name}, full-stack developer.`),
    authors: [{ name: s.name, url: SITE_URL }],
    creator: s.name,
    alternates: {
      ...alternates(locale),
      types: { "application/rss+xml": `/${locale}/blog/rss.xml` },
    },
    openGraph: {
      title,
      description: t(s.hero, locale),
      locale: locale === "fr" ? "fr_FR" : "en_US",
      alternateLocale: locale === "fr" ? "en_US" : "fr_FR",
      type: "website",
      siteName: s.name,
      url: `/${locale}`,
    },
    twitter: { card: "summary_large_image", title, description: t(s.hero, locale) },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const [s, projects] = await Promise.all([getSettings(), getProjects()]);
  const accent = safeHex(s.accent);
  const dict = getDict(locale);

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${grotesk.variable} ${mono.variable}`}
      style={{ "--accent": accent, "--accent-fg": contrastOn(accent) } as React.CSSProperties}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh overflow-x-clip">
        <a href="#main" className="skip-link">
          {locale === "fr" ? "Aller au contenu" : "Skip to content"}
        </a>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Person",
            name: s.name,
            jobTitle: t(s.role, locale),
            url: SITE_URL,
            email: s.email ? `mailto:${s.email}` : undefined,
            address: { "@type": "PostalAddress", addressLocality: s.location, addressCountry: "FR" },
            worksFor: s.studio_name ? { "@type": "Organization", name: s.studio_name, url: s.studio_url } : undefined,
            sameAs: s.socials.map((so) => so.url),
            knowsAbout: s.stack,
          }}
        />
        <div className="swiss-grid" aria-hidden>
          {Array.from({ length: 12 }, (_, i) => (
            <span key={i} className={i >= 4 ? "hidden md:block" : undefined} />
          ))}
        </div>
        <MotionProvider>
          <Loader name={s.name} />
          <Header
            locale={locale}
            dict={dict}
            name={s.name}
            studio={s.studio_name && s.studio_url ? { name: s.studio_name, url: s.studio_url } : undefined}
            socials={s.socials}
            projects={projects.map((p) => ({ slug: p.slug, title: t(p.title, locale) }))}
          />
          <main id="main" className="relative z-10">
            {children}
          </main>
        </MotionProvider>
        <div className="grain" aria-hidden />
        <ClientExtras />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

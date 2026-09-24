import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { grotesk, mono } from "../fonts";
import { getDict, isLocale, locales } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { getSettings } from "@/lib/data";
import { contrastOn, safeHex } from "@/lib/color";
import { themeScript } from "@/components/theme";
import { Header } from "@/components/header";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Cursor } from "@/components/cursor";
import { Loader } from "@/components/loader";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const s = await getSettings();
  const title = `${s.name} — ${t(s.role, locale)}`;
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    title: { default: title, template: `%s — ${s.name}` },
    description: t(s.hero, locale),
    alternates: { languages: { fr: "/fr", en: "/en" } },
    openGraph: { title, description: t(s.hero, locale), locale, type: "website" },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const s = await getSettings();
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
        <div className="swiss-grid" aria-hidden>
          {Array.from({ length: 12 }, (_, i) => (
            <span key={i} className={i >= 4 ? "hidden md:block" : undefined} />
          ))}
        </div>
        <Loader name={s.name} />
        <Header locale={locale} dict={dict} name={s.name} />
        <main className="relative z-10">{children}</main>
        <div className="grain" aria-hidden />
        <Cursor />
        <SmoothScroll />
      </body>
    </html>
  );
}

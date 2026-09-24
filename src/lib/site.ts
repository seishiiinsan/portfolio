import type { Locale } from "./i18n";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

/** Canonique + hreflang pour un chemin (sans préfixe de langue). */
export function alternates(locale: Locale, path = "") {
  return {
    canonical: `/${locale}${path}`,
    languages: { fr: `/fr${path}`, en: `/en${path}`, "x-default": `/en${path}` },
  };
}

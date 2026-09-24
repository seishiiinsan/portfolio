import { getPosts, getSettings } from "@/lib/data";
import { isLocale, locales, t } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const esc = (s: string) => s.replace(/[<>&'"]/g, (c) => `&#${c.charCodeAt(0)};`);

export async function GET(_: Request, { params }: RouteContext<"/[locale]/blog/rss.xml">) {
  const { locale } = await params;
  if (!isLocale(locale)) return new Response("Not found", { status: 404 });
  const [posts, s] = await Promise.all([getPosts(), getSettings()]);
  const items = posts
    .map((p) => {
      const url = `${SITE_URL}/${locale}/blog/${p.slug}`;
      return `<item><title>${esc(t(p.title, locale))}</title><link>${url}</link><guid>${url}</guid><pubDate>${new Date(
        p.published_at,
      ).toUTCString()}</pubDate><description>${esc(t(p.summary, locale))}</description></item>`;
    })
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${esc(
    `${s.name} — Blog`,
  )}</title><link>${SITE_URL}/${locale}/blog</link><atom:link href="${SITE_URL}/${locale}/blog/rss.xml" rel="self" type="application/rss+xml"/><description>${esc(
    t(s.hero, locale),
  )}</description><language>${locale}</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}

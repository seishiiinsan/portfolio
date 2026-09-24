import Link from "next/link";
import type { Dict, Locale } from "@/lib/i18n";
import type { Settings } from "@/lib/types";
import { LocalTime } from "./local-time";
import { MotionToggle } from "./motion-toggle";
import { NewsletterForm } from "./newsletter-form";

export function Footer({ s, dict, locale }: { s: Settings; dict: Dict; locale: Locale }) {
  const h = `/${locale}`;
  const pages = [
    { href: `${h}/projects`, label: dict.nav.work },
    { href: `${h}/blog`, label: dict.nav2.blog },
    { href: `${h}/now`, label: dict.nav2.now },
    { href: `${h}/uses`, label: dict.nav2.uses },
    { href: `${h}/studio`, label: dict.nav2.studio },
  ];
  return (
    <footer className="relative z-10 px-4 pt-32 pb-6 md:px-8">
      <div className="mb-16 grid gap-12 md:grid-cols-12 md:gap-6">
        <div className="md:col-span-5">
          <NewsletterForm dict={dict} locale={locale} />
        </div>
        <nav aria-label="Footer" className="grid content-start gap-2 font-mono text-xs uppercase md:col-span-3 md:col-start-8">
          {pages.map((p) => (
            <Link key={p.href} href={p.href} transitionTypes={["nav-curtain"]} className="link-u w-fit hover:text-accent">
              {p.label}
            </Link>
          ))}
        </nav>
        <div className="grid content-start gap-2 font-mono text-xs uppercase md:col-span-2">
          {s.socials.map((so) => (
            <a key={so.url} href={so.url} target="_blank" rel="noreferrer" className="link-u w-fit hover:text-accent">
              {so.label} ↗
            </a>
          ))}
          <a href={`${h}/blog/rss.xml`} className="link-u w-fit hover:text-accent">
            RSS ↗
          </a>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4 border-t border-line pt-6 font-mono text-xs uppercase text-muted md:grid-cols-12 md:gap-6">
        <span className="col-span-2 md:col-span-3">
          © {new Date().getFullYear()} {s.name}
        </span>
        <span className="col-span-2 md:col-span-3">
          {s.location} · <LocalTime />
        </span>
        <div className="col-span-4 flex flex-wrap gap-4 md:col-span-6 md:justify-end">
          <MotionToggle labels={dict} />
          <span className="hidden lg:inline">⌘K</span>
        </div>
      </div>
      <p aria-hidden className="mt-10 select-none text-[16.5vw] leading-[0.75] font-medium tracking-[-0.06em] text-fg">
        {s.name.split(" ")[0]}
        <span className="text-accent">.</span>
      </p>
    </footer>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { createPortal } from "react-dom";
import type { Dict, Locale } from "@/lib/i18n";
import type { Social } from "@/lib/types";
import { ThemeToggle } from "./theme";
import { LocalTime } from "./local-time";
import { CommandPalette } from "./command-palette";

export function Header({
  locale,
  dict,
  name,
  studio,
  socials,
  projects,
}: {
  locale: Locale;
  dict: Dict;
  name: string;
  studio?: { name: string; url: string };
  socials: Social[];
  projects: { slug: string; title: string }[];
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }
  const other: Locale = locale === "fr" ? "en" : "fr";
  const switchHref = pathname.replace(/^\/(fr|en)/, `/${other}`) || `/${other}`;
  const home = `/${locale}`;
  const deep = pathname !== home;

  const links = [
    { href: `${home}#about`, label: dict.nav.about },
    { href: `${home}/projects`, label: dict.nav.work, types: deep ? ["nav-curtain"] : ["nav-forward"] },
    { href: `${home}#experience`, label: dict.nav.experience },
    { href: `${home}#contact`, label: dict.nav.contact },
  ];
  const secondary = [
    { href: `${home}/blog`, label: dict.nav2.blog },
    { href: `${home}/now`, label: dict.nav2.now },
    { href: `${home}/uses`, label: dict.nav2.uses },
    { href: `${home}/studio`, label: dict.nav2.studio },
  ];

  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("");

  const current = (href: string) => (pathname === href.split("#")[0] && !href.includes("#") ? "page" : undefined);

  const menu =
    typeof document !== "undefined" &&
    createPortal(
        <AnimatePresence>
          {open && (
            <motion.nav
              id="mobile-menu"
              aria-label="Mobile"
              className="fixed inset-0 z-[45] flex flex-col justify-between bg-black p-4 pt-20 pb-8 text-white md:hidden"
              initial={{ clipPath: "inset(0 0 100% 0)" }}
              animate={{ clipPath: "inset(0 0 0% 0)" }}
              exit={{ clipPath: "inset(0 0 100% 0)" }}
              transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            >
              <div className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs uppercase opacity-70">
                {secondary.map((l) => (
                  <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
                    {l.label}
                  </Link>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                {links.map((l, i) => (
                  <motion.div
                    key={l.href}
                    initial={{ y: 60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 + i * 0.06, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link href={l.href} onClick={() => setOpen(false)} className="text-5xl font-medium tracking-tight">
                      <span className="mr-3 align-top font-mono text-xs opacity-50">0{i + 1}</span>
                      {l.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
              <div className="grid gap-4 border-t border-white/20 pt-4 font-mono text-xs uppercase">
                <div className="flex flex-wrap gap-4">
                  {socials.map((s) => (
                    <a key={s.url} href={s.url} target="_blank" rel="noreferrer">
                      {s.label} ↗
                    </a>
                  ))}
                </div>
                <div className="flex items-center justify-between opacity-70">
                  <LocalTime />
                  <ThemeToggle label={dict.theme} />
                </div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>,
      document.body,
    );

  return (
    <>
    {menu}
    <header
      style={{ viewTransitionName: "site-header" }}
      className="fixed inset-x-0 top-0 z-50 px-4 py-4 text-white mix-blend-difference md:px-8"
    >
      <div className="grid grid-cols-4 items-center gap-4 font-mono text-xs uppercase md:grid-cols-12 md:gap-6">
        <Link
          href={home}
          transitionTypes={deep ? ["nav-back"] : undefined}
          className="col-span-2 flex items-center gap-2 md:col-span-3"
        >
          <span aria-hidden className="inline-flex size-6 items-center justify-center bg-white text-[10px] font-bold text-black">
            {initials}
          </span>
          <span className="sr-only sm:not-sr-only">{name}</span>
        </Link>

        <nav aria-label="Main" className="hidden md:col-span-6 md:flex md:gap-8">
          {links.map((l, i) => (
            <Link key={l.href} href={l.href} transitionTypes={l.types} aria-current={current(l.href)} className="link-u">
              <span className="opacity-50">0{i + 1}</span> {l.label}
            </Link>
          ))}
        </nav>

        <div className="col-span-2 flex items-center justify-end gap-5 md:col-span-3">
          {studio && (
            <a href={studio.url} target="_blank" rel="noreferrer" className="link-u hidden xl:inline">
              {studio.name} ↗
            </a>
          )}
          <CommandPalette locale={locale} dict={dict} projects={projects} />
          <Link
            href={switchHref}
            transitionTypes={["nav-fade"]}
            onClick={() => (document.cookie = `locale=${other};path=/;max-age=31536000`)}
            className="link-u"
            hrefLang={other}
            lang={other}
            title={dict.toggleLang}
          >
            {other}
          </Link>
          <ThemeToggle label={dict.theme} />
          <button
            type="button"
            className="uppercase md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Menu"
          >
            {open ? "×" : "Menu"}
          </button>
        </div>
      </div>

    </header>
    </>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Dict, Locale } from "@/lib/i18n";
import { ThemeToggle } from "./theme";

export function Header({ locale, dict, name }: { locale: Locale; dict: Dict; name: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const other: Locale = locale === "fr" ? "en" : "fr";
  const switchHref = pathname.replace(/^\/(fr|en)/, `/${other}`) || `/${other}`;
  const home = `/${locale}`;
  const onProject = pathname.startsWith(`${home}/projects/`);

  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  const links = [
    { href: `${home}#about`, label: dict.nav.about },
    { href: `${home}/projects`, label: dict.nav.work, types: onProject ? ["nav-back"] : ["nav-forward"] },
    { href: `${home}#experience`, label: dict.nav.experience },
    { href: `${home}#contact`, label: dict.nav.contact },
  ];

  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("");

  return (
    <header
      style={{ viewTransitionName: "site-header" }}
      className="fixed inset-x-0 top-0 z-50 px-4 py-4 mix-blend-difference text-white md:px-8"
    >
      <div className="grid grid-cols-4 items-center gap-4 font-mono text-xs uppercase md:grid-cols-12 md:gap-6">
        <Link
          href={home}
          transitionTypes={pathname === home ? undefined : ["nav-back"]}
          className="col-span-2 flex items-center gap-2 md:col-span-3"
        >
          <span className="inline-flex size-6 items-center justify-center bg-white text-[10px] font-bold text-black">
            {initials}
          </span>
          <span className="hidden sm:inline">{name}</span>
        </Link>

        <nav className="hidden md:col-span-6 md:flex md:gap-8">
          {links.map((l, i) => (
            <Link key={l.href} href={l.href} transitionTypes={l.types} className="link-u">
              <span className="opacity-50">0{i + 1}</span> {l.label}
            </Link>
          ))}
        </nav>

        <div className="col-span-2 flex items-center justify-end gap-5 md:col-span-3">
          <Link
            href={switchHref}
            transitionTypes={["nav-fade"]}
            onClick={() => (document.cookie = `locale=${other};path=/;max-age=31536000`)}
            className="link-u"
            hrefLang={other}
          >
            {other}
          </Link>
          <ThemeToggle label={dict.theme} />
          <button
            type="button"
            className="uppercase md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label="Menu"
          >
            {open ? "×" : "Menu"}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            className="fixed inset-0 -z-10 flex flex-col justify-end gap-2 bg-black p-4 pb-12 text-white md:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
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
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

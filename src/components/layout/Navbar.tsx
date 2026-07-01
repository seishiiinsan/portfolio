"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { useI18n } from "@/context/i18n";
import { LANGUAGES, FLAGS, Language } from "@/lib/translations";

function LanguageDropdown({ onSelect }: { onSelect?: () => void }) {
  const { lang, setLang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function select(code: Language) {
    setLang(code);
    setOpen(false);
    onSelect?.();
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-1.5 font-black uppercase tracking-widest text-xs border-2 border-white hover:shadow-[4px_4px_0_#fff] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-150"
        aria-label={t.contact.lang_label}
      >
        <span>{FLAGS[lang]}</span>
        <span className="hidden sm:inline">{LANGUAGES[lang]}</span>
        <span className="text-[#FFDD00]">{open ? "▴" : "▾"}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 bg-black border-2 border-white shadow-[4px_4px_0_#fff] z-50 min-w-[160px]"
          >
            {(Object.entries(LANGUAGES) as [Language, string][]).map(([code, name]) => (
              <li key={code}>
                <button
                  onClick={() => select(code)}
                  className={`w-full flex items-center gap-3 px-4 py-3 font-bold text-xs uppercase tracking-widest text-left transition-colors duration-100 border-b border-white/10 last:border-0 ${
                    lang === code
                      ? "bg-white text-black"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  <span className="text-base">{FLAGS[code]}</span>
                  <span>{name}</span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();

  const NAV_LINKS = [
    { label: t.nav.about, href: "#about" },
    { label: t.nav.experience, href: "#experience" },
    { label: t.nav.work, href: "#work" },
    { label: t.nav.contact, href: "#contact" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-black border-b-4 border-white">
        <nav className="flex items-center justify-between px-6 md:px-12 h-16">
          {/* Logo */}
          <Link
            href="/"
            className="font-black uppercase tracking-tighter text-xl text-white leading-none"
          >
            GH<span className="text-[#FFDD00]">.</span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-0">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block px-5 py-1 font-bold uppercase tracking-widest text-sm text-white border-2 border-transparent hover:border-white hover:shadow-[4px_4px_0_#fff] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-150"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop: language selector */}
          <div className="hidden md:block">
            <LanguageDropdown />
          </div>

          {/* Mobile: hamburger */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden flex flex-col justify-center gap-1.5 w-10 h-10 border-2 border-white p-2 hover:shadow-[4px_4px_0_#fff] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-150"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <span className={`block h-0.5 bg-white transition-transform duration-200 ${open ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block h-0.5 bg-white transition-opacity duration-200 ${open ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 bg-white transition-transform duration-200 ${open ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </nav>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-30 bg-black border-b-4 border-white flex flex-col justify-center items-start px-8 pt-16 gap-10"
          >
            {/* Nav links */}
            <ul className="flex flex-col gap-2 w-full">
              {NAV_LINKS.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block py-4 font-black uppercase tracking-widest text-4xl text-white border-b-2 border-white hover:text-[#FFDD00] transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>

            {/* Mobile language selector */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: NAV_LINKS.length * 0.07 }}
              className="w-full"
            >
              <LanguageDropdown onSelect={() => setOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

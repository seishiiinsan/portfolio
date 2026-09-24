"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Dict, Locale } from "@/lib/i18n";
import { setReducedMotion, useReducedMotionPref } from "@/lib/motion-pref";
import { toggleTheme } from "./theme";

type Item = { id: string; group: string; label: string; hint?: string; run: () => void };

function isTyping(e: KeyboardEvent) {
  const t = e.target as HTMLElement | null;
  return !!t && (t.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName));
}

/** Palette ⌘K + raccourcis clavier globaux (T thème, L langue, M animations, ? aide). */
export function CommandPalette({
  locale,
  dict,
  projects,
}: {
  locale: Locale;
  dict: Dict;
  projects: { slug: string; title: string }[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const reduce = useReducedMotionPref();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const other: Locale = locale === "fr" ? "en" : "fr";

  const go = (href: string, types?: string[]) => {
    setOpen(false);
    router.push(href, { transitionTypes: types });
  };

  const items = useMemo<Item[]>(() => {
    const h = `/${locale}`;
    const switchLang = () => {
      document.cookie = `locale=${other};path=/;max-age=31536000`;
      go(pathname.replace(/^\/(fr|en)/, `/${other}`) || `/${other}`, ["nav-fade"]);
    };
    return [
      { id: "home", group: dict.palettePages, label: dict.home, run: () => go(h, ["nav-back"]) },
      { id: "work", group: dict.palettePages, label: dict.allProjects, run: () => go(`${h}/projects`, ["nav-forward"]) },
      { id: "blog", group: dict.palettePages, label: dict.nav2.blog, run: () => go(`${h}/blog`, ["nav-curtain"]) },
      { id: "now", group: dict.palettePages, label: dict.nav2.now, run: () => go(`${h}/now`, ["nav-curtain"]) },
      { id: "uses", group: dict.palettePages, label: dict.nav2.uses, run: () => go(`${h}/uses`, ["nav-curtain"]) },
      { id: "studio", group: dict.palettePages, label: dict.nav2.studio, run: () => go(`${h}/studio`, ["nav-curtain"]) },
      { id: "contact", group: dict.palettePages, label: dict.contact, run: () => go(`${h}#contact`) },
      ...projects.map((p) => ({
        id: `p-${p.slug}`,
        group: dict.paletteProjects,
        label: p.title,
        run: () => go(`${h}/projects/${p.slug}`, ["nav-forward"]),
      })),
      { id: "theme", group: dict.paletteActions, label: dict.toggleTheme, hint: "T", run: () => (setOpen(false), toggleTheme()) },
      { id: "lang", group: dict.paletteActions, label: dict.toggleLang, hint: "L", run: switchLang },
      {
        id: "motion",
        group: dict.paletteActions,
        label: reduce ? dict.motionOn : dict.reduceMotion,
        hint: "M",
        run: () => (setOpen(false), setReducedMotion(!reduce)),
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, dict, projects, pathname, reduce]);

  const filtered = query
    ? items.filter((i) => i.label.toLowerCase().includes(query.toLowerCase()) || i.group.toLowerCase().includes(query.toLowerCase()))
    : items;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
        return;
      }
      if (isTyping(e) || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "?") setOpen(true);
      else if (e.key.toLowerCase() === "t") toggleTheme();
      else if (e.key.toLowerCase() === "m") setReducedMotion(!reduce);
      else if (e.key.toLowerCase() === "l") items.find((i) => i.id === "lang")?.run();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [items, reduce]);

  useEffect(() => {
    if (!open) return;
    window.__lenis?.stop();
    const id = requestAnimationFrame(() => input.current?.focus());
    return () => {
      cancelAnimationFrame(id);
      window.__lenis?.start();
    };
  }, [open]);

  function onListKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(filtered.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter") {
      filtered[active]?.run();
    } else if (e.key === "Escape") setOpen(false);
  }

  let lastGroup = "";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden items-center gap-1 rounded border border-current/30 px-1.5 py-0.5 font-mono text-[10px] lg:inline-flex"
        aria-label={dict.paletteHint}
      >
        ⌘K
      </button>
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                className="fixed inset-0 z-[96] flex items-start justify-center bg-bg/70 p-4 pt-[15vh] backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
              >
                <motion.div
                  role="dialog"
                  aria-modal
                  aria-label={dict.paletteHint}
                  className="w-full max-w-xl border border-line bg-bg text-fg shadow-2xl"
                  initial={{ y: -16, scale: 0.98 }}
                  animate={{ y: 0, scale: 1 }}
                  exit={{ y: -8, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={onListKey}
                >
                  <input
                    ref={input}
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setActive(0);
                    }}
                    placeholder={dict.paletteHint}
                    aria-label={dict.paletteHint}
                    className="w-full border-b border-line bg-transparent px-5 py-4 text-lg outline-none focus-visible:outline-none"
                  />
                  <ul role="listbox" className="max-h-[50vh] overflow-y-auto py-2" data-lenis-prevent>
                    {filtered.map((it, i) => {
                      const head = it.group !== lastGroup ? (lastGroup = it.group) : null;
                      return (
                        <li key={it.id}>
                          {head && <p className="px-5 pt-3 pb-1 font-mono text-[10px] uppercase text-muted">{head}</p>}
                          <button
                            type="button"
                            role="option"
                            aria-selected={i === active}
                            onMouseEnter={() => setActive(i)}
                            onClick={it.run}
                            className={`flex w-full items-center justify-between px-5 py-2.5 text-left ${
                              i === active ? "bg-accent text-accent-fg" : ""
                            }`}
                          >
                            {it.label}
                            {it.hint && <kbd className="font-mono text-[10px] opacity-70">{it.hint}</kbd>}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                  <p className="flex flex-wrap gap-x-4 gap-y-1 border-t border-line px-5 py-3 font-mono text-[10px] uppercase text-muted">
                    <span>{dict.shortcuts} :</span>
                    <span>⌘K / ?</span>
                    <span>T {dict.theme}</span>
                    <span>L {locale === "fr" ? "Langue" : "Language"}</span>
                    <span>M {dict.motionOn}</span>
                    <span>Esc {dict.close}</span>
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}

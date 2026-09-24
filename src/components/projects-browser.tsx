"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import type { Project } from "@/lib/types";
import { ProjectIndex } from "./project-index";

/** Index des projets filtrable par tag. */
export function ProjectsBrowser({ projects, locale, allLabel }: { projects: Project[]; locale: Locale; allLabel: string }) {
  const tags = [...new Set(projects.flatMap((p) => p.tags))].sort((a, b) => a.localeCompare(b));
  const [tag, setTag] = useState<string | null>(null);
  const shown = tag ? projects.filter((p) => p.tags.includes(tag)) : projects;

  return (
    <>
      {tags.length > 1 && (
        <div role="group" aria-label="Filter" className="mb-8 flex flex-wrap gap-2 font-mono text-xs uppercase">
          {[null, ...tags].map((tg) => {
            const on = tag === tg;
            return (
              <button
                key={tg ?? "all"}
                type="button"
                aria-pressed={on}
                onClick={() => setTag(tg)}
                className={`relative rounded-full border px-4 py-1.5 transition-colors ${
                  on ? "border-accent text-accent-fg" : "border-line hover:border-fg"
                }`}
              >
                {on && (
                  <motion.span layoutId="tag-pill" className="absolute inset-0 -z-10 rounded-full bg-accent" />
                )}
                {tg ?? allLabel}
                <span className="ml-1.5 opacity-60">
                  {tg ? projects.filter((p) => p.tags.includes(tg)).length : projects.length}
                </span>
              </button>
            );
          })}
        </div>
      )}
      <AnimatePresence mode="wait">
        <motion.div
          key={tag ?? "all"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <ProjectIndex projects={shown} locale={locale} />
        </motion.div>
      </AnimatePresence>
    </>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { ViewTransition, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import type { Project } from "@/lib/types";

export function ProjectIndex({ projects, locale }: { projects: Project[]; locale: Locale }) {
  const [active, setActive] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 20 });
  const sy = useSpring(y, { stiffness: 150, damping: 20 });

  return (
    <div
      className="relative"
      onPointerMove={(e) => {
        x.set(e.clientX);
        y.set(e.clientY);
      }}
      onPointerLeave={() => setActive(null)}
    >
      <ul className="border-t border-line">
        {projects.map((p, i) => (
          <motion.li
            key={p.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-5% 0px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: i * 0.05 }}
            className="border-b border-line"
          >
            <Link
              href={`/${locale}/projects/${p.slug}`}
              transitionTypes={["nav-forward"]}
              data-cursor="view"
              onPointerEnter={() => setActive(i)}
              className="group relative grid grid-cols-4 items-baseline gap-4 py-6 md:grid-cols-12 md:gap-6 md:py-8"
            >
              <span
                className="absolute inset-0 origin-bottom scale-y-0 bg-accent transition-transform duration-500 ease-out-expo group-hover:scale-y-100"
                aria-hidden
              />
              <span className="relative col-span-1 font-mono text-xs text-muted transition-colors group-hover:text-accent-fg md:pl-2">
                {String(i + 1).padStart(2, "0")}
              </span>
              <ViewTransition name={`project-title-${p.slug}`} share="morph" default="none">
                <span className="relative col-span-3 text-3xl font-medium tracking-tight transition-[color,transform] duration-500 ease-out-expo group-hover:translate-x-3 group-hover:text-accent-fg md:col-span-6 md:text-6xl">
                  {t(p.title, locale)}
                </span>
              </ViewTransition>
              <span className="relative col-span-3 col-start-2 font-mono text-xs uppercase text-muted transition-colors group-hover:text-accent-fg md:col-span-3 md:col-start-auto">
                {p.tags.slice(0, 3).join(" / ")}
              </span>
              <span className="relative hidden text-right font-mono text-xs text-muted transition-colors group-hover:text-accent-fg md:col-span-2 md:block md:pr-2">
                {p.year ?? ""}
              </span>
            </Link>
          </motion.li>
        ))}
      </ul>

      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-40 hidden aspect-[4/3] w-[22vw] overflow-hidden md:block"
        style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
        animate={{ scale: active !== null && projects[active]?.cover_url ? 1 : 0, rotate: active !== null ? (active % 2 ? 3 : -3) : 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <AnimatePresence initial={false}>
          {active !== null && projects[active]?.cover_url && (
            <motion.div
              key={active}
              className="absolute inset-0"
              initial={{ clipPath: "inset(100% 0 0 0)" }}
              animate={{ clipPath: "inset(0% 0 0 0)" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image src={projects[active].cover_url!} alt="" fill sizes="22vw" className="object-cover" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

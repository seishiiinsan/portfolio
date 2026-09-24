"use client";

import { motion, useInView } from "motion/react";
import { useRef, useSyncExternalStore, type ReactNode } from "react";
import { LOADER_EVENT } from "./loader";

const ease = [0.22, 1, 0.36, 1] as const;

function subscribeIntro(cb: () => void) {
  window.addEventListener(LOADER_EVENT, cb);
  return () => window.removeEventListener(LOADER_EVENT, cb);
}

export function useIntroDone() {
  return useSyncExternalStore(subscribeIntro, () => !!window.__introDone, () => false);
}

/** Texte découpé en lettres ou mots, qui montent depuis un masque. */
export function SplitText({
  text,
  by = "char",
  className,
  delay = 0,
  stagger,
  waitIntro = false,
  as: Tag = "span",
}: {
  text: string;
  by?: "char" | "word";
  className?: string;
  delay?: number;
  stagger?: number;
  waitIntro?: boolean;
  as?: "span" | "h1" | "h2" | "p";
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const intro = useIntroDone();
  const go = inView && (!waitIntro || intro);
  const words = text.split(" ");
  const step = stagger ?? (by === "char" ? 0.03 : 0.06);
  let i = 0;

  return (
    <Tag ref={ref as never} className={className}>
      <span className="sr-only">{text}</span>
      {words.map((w, wi) => (
        <span key={wi} aria-hidden className="inline-block whitespace-nowrap">
          {(by === "char" ? w.split("") : [w]).map((c, ci) => {
            const d = delay + i++ * step;
            return (
              <span key={ci} className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em] align-bottom">
                <motion.span
                  className="inline-block"
                  initial={{ y: "110%", rotate: 6 }}
                  animate={go ? { y: "0%", rotate: 0 } : undefined}
                  transition={{ duration: 1, ease, delay: d }}
                >
                  {c}
                </motion.span>
              </span>
            );
          })}
          {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </Tag>
  );
}

export function Reveal({
  children,
  className,
  delay = 0,
  y = 40,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Trait horizontal qui se dessine. */
export function Rule({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.div
      className={`h-px origin-left bg-fg/20 ${className ?? ""}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, ease, delay }}
    />
  );
}

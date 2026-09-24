"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

function Word({ w, range, p }: { w: string; range: [number, number]; p: MotionValue<number> }) {
  const o = useTransform(p, range, [0.12, 1]);
  return <motion.span style={{ opacity: o }}>{w} </motion.span>;
}

/** Paragraphe qui s'allume mot à mot avec le scroll. */
export function ScrollText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <Word key={i} w={w} p={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
      ))}
    </p>
  );
}

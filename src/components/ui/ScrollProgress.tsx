"use client";

import { motion, useScroll, useReducedMotion } from "motion/react";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const prefersReduced = useReducedMotion();

  if (prefersReduced) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] bg-black dark:bg-white origin-left z-50"
      style={{ scaleX: scrollYProgress }}
    />
  );
}

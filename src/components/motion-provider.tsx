"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { useReducedMotionPref } from "@/lib/motion-pref";

/** Applique la préférence « réduire les animations » à toutes les animations Motion. */
export function MotionProvider({ children }: { children: ReactNode }) {
  const reduce = useReducedMotionPref();
  return <MotionConfig reducedMotion={reduce ? "always" : "never"}>{children}</MotionConfig>;
}

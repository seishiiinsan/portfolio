"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";

interface Props {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

export default function MagneticButton({ children, className = "", strength = 0.38 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { damping: 12, stiffness: 180, mass: 0.5 });
  const springY = useSpring(y, { damping: 12, stiffness: 180, mass: 0.5 });

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current || prefersReduced) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  }

  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      className={`inline-flex ${className}`}
      style={{ x: springX, y: springY }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </motion.div>
  );
}

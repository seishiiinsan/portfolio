"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";

export default function Cursor() {
  const prefersReduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);

  const x = useSpring(rawX, { damping: 28, stiffness: 500, mass: 0.4 });
  const y = useSpring(rawY, { damping: 28, stiffness: 500, mass: 0.4 });

  useEffect(() => {
    if (prefersReduced) return;

    function onMove(e: MouseEvent) {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      setVisible(true);
    }

    function onOver(e: MouseEvent) {
      const el = e.target as Element;
      setHovered(!!el.closest("a, button, [data-cursor-hover]"));
    }

    function onLeave() { setVisible(false); }
    function onEnter() { setVisible(true); }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, [rawX, rawY, prefersReduced]);

  if (prefersReduced) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 z-[9999] pointer-events-none"
      style={{ x, y }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.15 }}
    >
      <motion.div
        className="border-2 border-[#FFDD00]"
        animate={{
          width: hovered ? 44 : 14,
          height: hovered ? 44 : 14,
          x: hovered ? -22 : -7,
          y: hovered ? -22 : -7,
          backgroundColor: hovered ? "rgba(255,221,0,0.12)" : "rgba(0,0,0,0)",
        }}
        transition={{ duration: 0.12, ease: "easeOut" }}
      />
    </motion.div>
  );
}

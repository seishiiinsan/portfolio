"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

type State = { kind: "default" | "hover" | "view"; label?: string };

export function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });
  const [state, setState] = useState<State>({ kind: "default" });
  const [down, setDown] = useState(false);

  useEffect(() => {
    if (!matchMedia("(pointer: fine)").matches) return;
    document.documentElement.classList.add("has-cursor");
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        "a,button,[data-cursor],input,textarea,select,label",
      );
      const label = el?.dataset.cursorLabel;
      const kind = el?.dataset.cursor === "view" || label ? "view" : el ? "hover" : "default";
      setState((s) => (s.kind === kind && s.label === label ? s : { kind, label }));
    };
    const d = () => setDown(true);
    const u = () => setDown(false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", d);
    window.addEventListener("pointerup", u);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", d);
      window.removeEventListener("pointerup", u);
    };
  }, [x, y]);

  const labelled = state.kind === "view" && !!state.label;
  const size = state.kind === "view" ? 88 : state.kind === "hover" ? 44 : 12;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[100] hidden items-center justify-center rounded-full bg-accent font-mono text-[10px] uppercase text-accent-fg pointer-fine:flex"
      style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%", mixBlendMode: state.kind === "view" ? "normal" : "difference" }}
      animate={{
        width: labelled ? "auto" : size,
        height: labelled ? 36 : size,
        paddingInline: labelled ? 16 : 0,
        scale: down ? 0.85 : 1,
      }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      {state.kind === "view" && <span className="whitespace-nowrap">{state.label ?? "View"} {labelled && "→"}</span>}
    </motion.div>
  );
}

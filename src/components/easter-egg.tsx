"use client";

import { useEffect } from "react";

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

export function EasterEgg() {
  useEffect(() => {
    const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#be3455";
    console.log(
      "%c GH %c Curieux·se ? Le code est ici : https://github.com/seishiiinsan/portfolio — essaie ↑↑↓↓←→←→BA",
      `background:${accent};color:#fff;font-weight:bold;padding:2px 6px`,
      "color:inherit",
    );
    let i = 0;
    const onKey = (e: KeyboardEvent) => {
      i = e.key === KONAMI[i] ? i + 1 : e.key === KONAMI[0] ? 1 : 0;
      if (i < KONAMI.length) return;
      i = 0;
      const d = document.documentElement;
      d.classList.add("party");
      setTimeout(() => d.classList.remove("party"), 6000);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return null;
}

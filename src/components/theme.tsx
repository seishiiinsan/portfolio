"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

// Inline dans <head> : pose thème (sombre par défaut) et préférence d'animation avant le premier paint.
export const themeScript = `(()=>{var d=document.documentElement;try{var t=localStorage.getItem('theme');d.dataset.theme=t==='light'?'light':'dark';var m=localStorage.getItem('motion');d.dataset.motion=m==='reduce'||(m!=='full'&&matchMedia('(prefers-reduced-motion: reduce)').matches)?'reduce':'full'}catch(e){d.dataset.theme='dark'}})()`;

function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}
const getTheme = () => (document.documentElement.dataset.theme as Theme) ?? "dark";

export function toggleTheme() {
  const next: Theme = getTheme() === "dark" ? "light" : "dark";
  const apply = () => {
    document.documentElement.dataset.theme = next;
  };
  try {
    localStorage.setItem("theme", next);
  } catch {}
  if (document.startViewTransition && document.documentElement.dataset.motion !== "reduce") {
    document.startViewTransition(apply);
  } else apply();
}

export function ThemeToggle({ label }: { label: string }) {
  const theme = useSyncExternalStore(subscribe, getTheme, (): Theme => "dark");
  const toggle = toggleTheme;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      data-cursor="hover"
      className="group flex items-center gap-2 font-mono text-xs uppercase"
    >
      <span className="relative block size-3 overflow-hidden rounded-full border border-current">
        <span
          className="absolute inset-0 bg-current transition-transform duration-500 ease-out-expo"
          style={{ transform: theme === "dark" ? "translateX(50%)" : "translateX(-50%)" }}
        />
      </span>
      <span className="hidden sm:inline">{theme === "dark" ? "Dark" : "Light"}</span>
    </button>
  );
}

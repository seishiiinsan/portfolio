"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

// Inline dans <head> : pose le thème avant le premier paint.
export const themeScript = `(()=>{try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark')t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme='light'}})()`;

function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}
const getTheme = () => (document.documentElement.dataset.theme as Theme) ?? "light";

export function ThemeToggle({ label }: { label: string }) {
  const theme = useSyncExternalStore(subscribe, getTheme, () => null);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    const apply = () => {
      document.documentElement.dataset.theme = next;
    };
    try {
      localStorage.setItem("theme", next);
    } catch {}
    if (document.startViewTransition && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.startViewTransition(apply);
    } else apply();
  }

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

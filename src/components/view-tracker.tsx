"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Compte une vue par page (sans cookie, sans donnée personnelle). */
export function ViewTracker() {
  const pathname = usePathname();
  useEffect(() => {
    if (navigator.webdriver) return;
    const body = JSON.stringify({ path: pathname });
    if (!navigator.sendBeacon?.("/api/view", new Blob([body], { type: "application/json" }))) {
      fetch("/api/view", { method: "POST", body, keepalive: true }).catch(() => {});
    }
  }, [pathname]);
  return null;
}

import { ViewTransition, type ReactNode } from "react";

const map = { "nav-forward": "nav-forward", "nav-back": "nav-back", "nav-fade": "nav-fade", default: "none" };

/** À placer dans chaque page.tsx (pas le layout). */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter={map} exit={map} default="none">
      {children}
    </ViewTransition>
  );
}

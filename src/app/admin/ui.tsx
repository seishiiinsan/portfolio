import type { ReactNode } from "react";
export { L10nField } from "./l10n-field";

export const input =
  "w-full border border-line bg-transparent px-3 py-2 outline-none transition-colors focus:border-accent";

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="grid gap-1.5">
      <span className="font-mono text-[11px] uppercase text-muted">{label}</span>
      {children}
      {hint && <span className="text-xs text-muted">{hint}</span>}
    </label>
  );
}

export function Submit({ children = "Enregistrer" }: { children?: ReactNode }) {
  return (
    <button className="w-fit rounded-full bg-fg px-6 py-3 font-mono text-xs uppercase text-bg transition-colors hover:bg-accent">
      {children}
    </button>
  );
}

export function Title({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
      <h1 className="text-5xl font-medium tracking-[-0.04em] md:text-7xl">{children}</h1>
      {aside}
    </div>
  );
}

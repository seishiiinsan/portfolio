/** Histogramme des vues quotidiennes : une couleur (accent), sommets arrondis, info-bulle au survol / focus. */
export function ViewsChart({ series }: { series: { d: string; n: number }[] }) {
  const fmtDay = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", timeZone: "UTC" });
  const fmtN = new Intl.NumberFormat("fr-FR");
  const max = Math.max(1, ...series.map((s) => s.n));
  const peak = series.reduce((a, b) => (b.n > a.n ? b : a), series[0]);
  const days = series.map((s) => s.d);
  const DAYS = days.length;
  return (
        <div className="relative">
      <span className="absolute -top-5 left-0 font-mono text-[10px] text-muted tabular-nums">{fmtN.format(max)}</span>
      <div className="absolute inset-x-0 top-0 border-t border-dashed border-line" aria-hidden />
      <ol className="flex h-56 items-end gap-[2px] border-b border-fg/30" role="list">
        {series.map((s) => (
          <li
            key={s.d}
            tabIndex={0}
            aria-label={`${fmtDay.format(new Date(s.d))} : ${s.n} vue${s.n > 1 ? "s" : ""}`}
            className="group relative flex h-full flex-1 items-end justify-center outline-none"
          >
            <span
              className="w-full max-w-6 rounded-t-[4px] bg-accent transition-opacity group-hover:opacity-80 group-focus-visible:opacity-80"
              style={{ height: s.n ? `max(2px, ${(s.n / max) * 100}%)` : 0 }}
            />
            {s === peak && s.n > 0 && (
              <span
                className="absolute font-mono text-[10px] tabular-nums"
                style={{ bottom: `calc(${(s.n / max) * 100}% + 4px)` }}
              >
                {s.n}
              </span>
            )}
            <span
              role="tooltip"
              className="pointer-events-none absolute bottom-full z-10 mb-2 hidden whitespace-nowrap border border-line bg-bg px-2 py-1 font-mono text-[11px] shadow-lg group-hover:block group-focus-visible:block"
            >
              <span className="text-muted">{fmtDay.format(new Date(s.d))}</span> · <strong>{s.n}</strong>
            </span>
          </li>
        ))}
      </ol>
      <div className="mt-2 flex justify-between font-mono text-[10px] text-muted">
        <span>{fmtDay.format(new Date(days[0]))}</span>
        <span>{fmtDay.format(new Date(days[Math.floor(DAYS / 2)]))}</span>
        <span>{fmtDay.format(new Date(days.at(-1)!))}</span>
      </div>
    </div>
  );
}

import { requireAdmin } from "@/lib/admin";
import { Title } from "../../ui";
import { ViewsChart } from "../../views-chart";

const DAYS = 30;

/** Début de la fenêtre (minuit UTC, il y a DAYS jours). Page dynamique : calcul à chaque requête. */
function windowStart(): Date {
  const since = new Date(Date.now() - DAYS * 86400000);
  since.setUTCHours(0, 0, 0, 0);
  return since;
}

export default async function AdminStats() {
  const db = await requireAdmin();
  const since = windowStart();
  const { data } = await db
    .from("page_views")
    .select("path, created_at")
    .gte("created_at", since.toISOString())
    .limit(50000);
  const views = (data ?? []) as { path: string; created_at: string }[];

  const days = Array.from({ length: DAYS }, (_, i) => {
    const d = new Date(since.getTime() + (i + 1) * 86400000);
    return d.toISOString().slice(0, 10);
  });
  const perDay = new Map(days.map((d) => [d, 0]));
  const perPath = new Map<string, number>();
  for (const v of views) {
    const d = v.created_at.slice(0, 10);
    if (perDay.has(d)) perDay.set(d, perDay.get(d)! + 1);
    perPath.set(v.path, (perPath.get(v.path) ?? 0) + 1);
  }
  const series = days.map((d) => ({ d, n: perDay.get(d)! }));
  const total = series.reduce((a, b) => a + b.n, 0);
  const last7 = series.slice(-7).reduce((a, b) => a + b.n, 0);
  const today = series.at(-1)!.n;
  const top = [...perPath.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
  const topMax = top[0]?.[1] ?? 1;
  const fmtDay = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", timeZone: "UTC" });
  const fmtN = new Intl.NumberFormat("fr-FR");

  const tiles = [
    { label: `Vues · ${DAYS} jours`, value: total },
    { label: "Vues · 7 jours", value: last7 },
    { label: "Vues · aujourd'hui", value: today },
  ];

  return (
    <>
      <Title>Statistiques</Title>

      <div className="grid max-w-5xl gap-6 md:grid-cols-3">
        {tiles.map((t) => (
          <div key={t.label} className="border-t border-line pt-4">
            <p className="font-mono text-[11px] uppercase text-muted">{t.label}</p>
            <p className="mt-2 text-5xl font-medium tracking-tight tabular-nums">{fmtN.format(t.value)}</p>
          </div>
        ))}
      </div>

      <section className="mt-16 max-w-5xl" aria-labelledby="daily">
        <h2 id="daily" className="mb-6 font-mono text-[11px] uppercase text-muted">
          Vues par jour — {DAYS} derniers jours
        </h2>
        <ViewsChart series={series} />
        <details className="mt-4">
          <summary className="cursor-pointer font-mono text-[11px] uppercase text-muted">Voir le tableau</summary>
          <table className="mt-3 w-full max-w-sm font-mono text-xs">
            <thead>
              <tr className="text-left text-muted">
                <th className="py-1 font-normal">Jour</th>
                <th className="py-1 text-right font-normal">Vues</th>
              </tr>
            </thead>
            <tbody>
              {series.map((s) => (
                <tr key={s.d} className="border-t border-line">
                  <td className="py-1">{fmtDay.format(new Date(s.d))}</td>
                  <td className="py-1 text-right tabular-nums">{s.n}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      </section>

      <section className="mt-16 max-w-3xl" aria-labelledby="top">
        <h2 id="top" className="mb-4 font-mono text-[11px] uppercase text-muted">
          Pages les plus vues — {DAYS} jours
        </h2>
        {!top.length && <p className="text-muted">Pas encore de données.</p>}
        <ul className="grid gap-2">
          {top.map(([path, n]) => (
            <li key={path} className="grid grid-cols-[1fr_auto] items-center gap-4">
              <div className="relative py-1.5">
                <span className="absolute inset-y-0 left-0 rounded-r-[4px] bg-fg/10" style={{ width: `${(n / topMax) * 100}%` }} aria-hidden />
                <a href={path} target="_blank" rel="noreferrer" className="link-u relative pl-2 font-mono text-xs">
                  {path}
                </a>
              </div>
              <span className="font-mono text-xs tabular-nums">{fmtN.format(n)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-xs text-muted">
          Comptage maison sans cookie (une vue par affichage de page, robots exclus). Pour les visiteurs uniques et Core Web
          Vitals, voir Vercel Analytics / Speed Insights.
        </p>
        <p className="mt-2 text-xs text-muted">
          Suivi des erreurs : Sentry.{" "}
          <a href="/api/sentry-test" target="_blank" rel="noreferrer" className="link-u">
            Déclencher une erreur de test
          </a>
        </p>
      </section>
    </>
  );
}

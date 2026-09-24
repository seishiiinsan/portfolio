/** Bandeau défilant infini (CSS pur, stoppé si animations réduites). */
export function Marquee({ items }: { items: string[] }) {
  if (!items.length) return null;
  const row = (hidden?: boolean) => (
    <ul aria-hidden={hidden} className="marquee-track flex shrink-0 items-center gap-10 pr-10">
      {items.map((it, i) => (
        <li key={i} className="flex items-center gap-10 whitespace-nowrap">
          {it}
          <span className="size-1.5 rounded-full bg-accent" aria-hidden />
        </li>
      ))}
    </ul>
  );
  return (
    <div className="marquee flex overflow-hidden border-y border-line py-4 font-mono text-xs uppercase text-muted">
      {row()}
      {row(true)}
    </div>
  );
}

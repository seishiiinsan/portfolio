import { requireAdmin } from "@/lib/admin";
import type { Subscriber } from "@/lib/types";
import { deleteSubscriber } from "../../actions";
import { Title } from "../../ui";

export default async function AdminSubscribers() {
  const db = await requireAdmin();
  const { data } = await db.from("subscribers").select("*").order("created_at", { ascending: false });
  const subs = (data ?? []) as Subscriber[];
  const fmt = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" });
  return (
    <>
      <Title
        aside={
          subs.length > 0 && (
            <a href="/admin/subscribers.csv" className="rounded-full bg-fg px-6 py-3 font-mono text-xs uppercase text-bg hover:bg-accent">
              Export CSV
            </a>
          )
        }
      >
        Abonnés <span className="text-muted">({subs.length})</span>
      </Title>
      {!subs.length && <p className="text-muted">Aucun abonné.</p>}
      <ul className="max-w-3xl border-t border-line">
        {subs.map((s) => (
          <li key={s.id} className="flex items-center gap-4 border-b border-line py-3">
            <a href={`mailto:${s.email}`} className="link-u flex-1">
              {s.email}
            </a>
            <span className="font-mono text-xs uppercase text-muted">
              {s.locale} · {fmt.format(new Date(s.created_at))}
            </span>
            <form action={deleteSubscriber}>
              <input type="hidden" name="id" value={s.id} />
              <button className="font-mono text-xs text-accent" aria-label={`Supprimer ${s.email}`}>
                ×
              </button>
            </form>
          </li>
        ))}
      </ul>
    </>
  );
}

import { requireAdmin } from "@/lib/admin";
import type { Message } from "@/lib/types";
import { deleteMessage, toggleMessage } from "../../actions";
import { Title } from "../../ui";

export default async function AdminMessages() {
  const db = await requireAdmin();
  const { data } = await db.from("messages").select("*").order("created_at", { ascending: false });
  const msgs = (data ?? []) as Message[];
  const fmt = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" });

  return (
    <>
      <Title>Messages</Title>
      {!msgs.length && <p className="text-muted">Aucun message.</p>}
      <ul className="grid max-w-4xl gap-4">
        {msgs.map((m) => (
          <li key={m.id} className={`border p-5 ${m.read ? "border-line opacity-60" : "border-accent"}`}>
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-lg font-medium">
                {m.name}{" "}
                <a href={`mailto:${m.email}`} className="link-u font-mono text-xs text-muted">
                  {m.email}
                </a>
              </p>
              <span className="font-mono text-xs text-muted">{fmt.format(new Date(m.created_at))}</span>
            </div>
            <p className="whitespace-pre-wrap">{m.body}</p>
            <div className="mt-4 flex gap-4 font-mono text-xs uppercase">
              <form action={toggleMessage}>
                <input type="hidden" name="id" value={m.id} />
                <input type="hidden" name="read" value={String(m.read)} />
                <button className="link-u">{m.read ? "Marquer non lu" : "Marquer lu"}</button>
              </form>
              <form action={deleteMessage}>
                <input type="hidden" name="id" value={m.id} />
                <button className="text-accent hover:underline">Supprimer</button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

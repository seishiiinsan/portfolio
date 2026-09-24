import { requireAdmin } from "@/lib/admin";
import type { Experience } from "@/lib/types";
import { deleteExperience, saveExperience } from "../../actions";
import { Field, L10nField, Submit, Title, input } from "../../ui";

function ExpForm({ e }: { e?: Experience }) {
  return (
    <form action={saveExperience} className="grid gap-4">
      {e && <input type="hidden" name="id" value={e.id} />}
      <div className="grid gap-4 md:grid-cols-5">
        <Field label="Type">
          <select name="kind" defaultValue={e?.kind ?? "work"} className={`${input} bg-bg`}>
            <option value="work">Expérience</option>
            <option value="education">Formation</option>
          </select>
        </Field>
        <Field label="Organisation">
          <input name="org" defaultValue={e?.org} className={input} />
        </Field>
        <Field label="Lieu">
          <input name="location" defaultValue={e?.location ?? ""} className={input} />
        </Field>
        <Field label="Début">
          <input name="start_date" defaultValue={e?.start_date} placeholder="2025" className={input} />
        </Field>
        <Field label="Fin" hint="Vide = présent">
          <input name="end_date" defaultValue={e?.end_date ?? ""} className={input} />
        </Field>
      </div>
      <L10nField name="title" label="Intitulé" value={e?.title} />
      <L10nField name="description" label="Description" value={e?.description} area rows={2} />
      <div className="flex items-center gap-4">
        <Field label="Position">
          <input name="position" type="number" defaultValue={e?.position ?? 0} className={`${input} w-24`} />
        </Field>
        <div className="self-end">
          <Submit>{e ? "Enregistrer" : "Ajouter"}</Submit>
        </div>
      </div>
    </form>
  );
}

export default async function AdminExperiences() {
  const db = await requireAdmin();
  const { data } = await db.from("experiences").select("*").order("position");
  const exps = (data ?? []) as Experience[];
  return (
    <>
      <Title>Parcours</Title>
      <div className="grid max-w-5xl gap-6">
        {exps.map((e) => (
          <details key={e.id} className="group border border-line p-4 open:pb-6">
            <summary className="flex cursor-pointer items-center justify-between gap-4">
              <span className="text-lg font-medium">
                {e.title.fr || e.title.en} <span className="text-muted">— {e.org}</span>
              </span>
              <span className="font-mono text-xs uppercase text-muted">
                {e.kind === "work" ? "Exp" : "Formation"} · {e.start_date}
              </span>
            </summary>
            <div className="mt-6">
              <ExpForm e={e} />
              <form action={deleteExperience} className="mt-4">
                <input type="hidden" name="id" value={e.id} />
                <button className="font-mono text-xs uppercase text-accent hover:underline">Supprimer</button>
              </form>
            </div>
          </details>
        ))}
        <div className="border border-dashed border-line p-4">
          <p className="mb-4 font-mono text-xs uppercase text-muted">+ Ajouter</p>
          <ExpForm />
        </div>
      </div>
    </>
  );
}

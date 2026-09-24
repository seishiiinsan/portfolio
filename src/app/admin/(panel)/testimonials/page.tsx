import { requireAdmin } from "@/lib/admin";
import type { Testimonial } from "@/lib/types";
import { deleteTestimonial, reorder, saveTestimonial } from "../../actions";
import { Field, L10nField, Submit, Title, input } from "../../ui";
import { SortableList } from "../../sortable-list";

function TForm({ q }: { q?: Testimonial }) {
  return (
    <form action={saveTestimonial} className="grid gap-4">
      {q && <input type="hidden" name="id" value={q.id} />}
      <div className="grid gap-4 md:grid-cols-3">
        <Field label="Auteur">
          <input name="author" required defaultValue={q?.author} className={input} />
        </Field>
        <Field label="Rôle / entreprise">
          <input name="role" defaultValue={q?.role ?? ""} className={input} />
        </Field>
        <Field label="Lien (LinkedIn…)">
          <input name="url" type="url" defaultValue={q?.url ?? ""} className={input} />
        </Field>
      </div>
      <L10nField name="quote" label="Citation" value={q?.quote} area />
      <Submit>{q ? "Enregistrer" : "Ajouter"}</Submit>
    </form>
  );
}

export default async function AdminTestimonials() {
  const db = await requireAdmin();
  const { data } = await db.from("testimonials").select("*").order("position");
  const list = (data ?? []) as Testimonial[];
  return (
    <>
      <Title>Témoignages</Title>
      {list.length > 1 && (
        <div className="mb-12 max-w-5xl">
          <SortableList
            onReorder={reorder.bind(null, "testimonials")}
            items={list.map((q) => ({ id: q.id, label: q.author, meta: q.role ?? "" }))}
          />
        </div>
      )}
      <div className="grid max-w-5xl gap-6">
        {list.map((q) => (
          <details key={q.id} className="border border-line p-4">
            <summary className="cursor-pointer text-lg font-medium">
              {q.author} <span className="text-muted">— {q.role}</span>
            </summary>
            <div className="mt-6">
              <TForm q={q} />
              <form action={deleteTestimonial} className="mt-4">
                <input type="hidden" name="id" value={q.id} />
                <button className="font-mono text-xs uppercase text-accent hover:underline">Supprimer</button>
              </form>
            </div>
          </details>
        ))}
        <div className="border border-dashed border-line p-4">
          <p className="mb-4 font-mono text-xs uppercase text-muted">+ Ajouter un témoignage</p>
          <TForm />
        </div>
      </div>
    </>
  );
}

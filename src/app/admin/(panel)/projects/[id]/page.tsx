import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import type { Project } from "@/lib/types";
import { deleteProject, regeneratePreviewToken, saveProject } from "../../../actions";
import { SITE_URL } from "@/lib/site";
import { Field, L10nField, Submit, Title, input } from "../../../ui";
import { MediaInput } from "../../../media-input";

export default async function EditProject({ params }: PageProps<"/admin/projects/[id]">) {
  const { id } = await params;
  const db = await requireAdmin();
  let p: Partial<Project> = { published: true };
  if (id !== "new") {
    const { data } = await db.from("projects").select("*").eq("id", id).maybeSingle();
    if (!data) notFound();
    p = data as Project;
  }

  return (
    <>
      <Title aside={<Link href="/admin/projects" className="font-mono text-xs uppercase link-u">← Liste</Link>}>
        {id === "new" ? "Nouveau projet" : p.title?.fr || p.slug}
      </Title>
      <form action={saveProject} className="grid max-w-4xl gap-8">
        {p.id && <input type="hidden" name="id" value={p.id} />}
        <div className="grid gap-4 md:grid-cols-4">
          <Field label="Slug (url)">
            <input name="slug" required defaultValue={p.slug} pattern="[a-z0-9\-]+" className={`${input} font-mono`} />
          </Field>
          <Field label="Année">
            <input name="year" type="number" defaultValue={p.year ?? ""} className={input} />
          </Field>
          <Field label="Position">
            <input name="position" type="number" defaultValue={p.position ?? 0} className={input} />
          </Field>
          <div className="flex flex-col justify-end gap-2 pb-1">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="published" defaultChecked={p.published} /> Publié
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="featured" defaultChecked={p.featured} /> Mis en avant
            </label>
          </div>
        </div>
        <L10nField name="title" label="Titre" value={p.title} />
        <L10nField name="role" label="Rôle" value={p.role} />
        <L10nField name="summary" label="Résumé" value={p.summary} area />
        <L10nField name="content" label="Contenu (Markdown)" value={p.content} markdown template rows={16} />
        <Field label="Stack / tags" hint="Séparés par virgule">
          <input name="tags" defaultValue={p.tags?.join(", ")} className={input} />
        </Field>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Lien repo">
            <input name="repo_url" type="url" defaultValue={p.repo_url ?? ""} className={input} />
          </Field>
          <Field label="Lien démo">
            <input name="demo_url" type="url" defaultValue={p.demo_url ?? ""} className={input} />
          </Field>
        </div>
        <Field label="Chiffres clés" hint="Une ligne par chiffre : valeur | libellé FR | libellé EN (ex. 120 | agences | agencies)">
          <textarea
            name="metrics"
            rows={3}
            defaultValue={(p.metrics ?? []).map((m) => `${m.value} | ${m.label.fr} | ${m.label.en}`).join("\n")}
            className={`${input} font-mono text-sm`}
          />
        </Field>
        <Field label="Vidéo de démo" hint="URL YouTube / Vimeo, ou fichier MP4/WebM uploadé">
          <input name="video_url" type="url" defaultValue={p.video_url ?? ""} className={input} />
        </Field>
        <Field label="…ou uploader une vidéo (remplace l'URL ci-dessus si renseignée)">
          <MediaInput name="video_upload" accept="video/mp4,video/webm" />
        </Field>
        <Field label="Cover (16:9)">
          <MediaInput name="cover_url" defaultValue={p.cover_url ? [p.cover_url] : []} />
        </Field>
        <Field label="Galerie (16:9)">
          <MediaInput name="gallery" multiple defaultValue={p.gallery ?? []} />
        </Field>
        <Submit />
      </form>
      {p.id && p.preview_token && (
        <div className="mt-16 grid gap-2 border-t border-line pt-6">
          <p className="font-mono text-[11px] uppercase text-muted">Lien de prévisualisation privé (fonctionne même en brouillon)</p>
          <div className="flex flex-wrap items-center gap-4">
            <a href={`/fr/preview/${p.preview_token}`} target="_blank" rel="noreferrer" className="link-u break-all font-mono text-xs">
              {SITE_URL}/fr/preview/{p.preview_token}
            </a>
            <form action={regeneratePreviewToken}>
              <input type="hidden" name="id" value={p.id} />
              <button className="font-mono text-[11px] uppercase text-muted hover:text-accent">Régénérer (révoque l&apos;ancien)</button>
            </form>
          </div>
        </div>
      )}
      {p.id && (
        <form action={deleteProject} className="mt-16 border-t border-line pt-6">
          <input type="hidden" name="id" value={p.id} />
          <button className="font-mono text-xs uppercase text-accent hover:underline">Supprimer ce projet</button>
        </form>
      )}
    </>
  );
}

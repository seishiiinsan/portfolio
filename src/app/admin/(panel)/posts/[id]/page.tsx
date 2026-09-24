import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import type { Post } from "@/lib/types";
import { deletePost, savePost } from "../../../actions";
import { Field, L10nField, Submit, Title, input } from "../../../ui";
import { MediaInput } from "../../../media-input";

export default async function EditPost({ params }: PageProps<"/admin/posts/[id]">) {
  const { id } = await params;
  const db = await requireAdmin();
  let p: Partial<Post> = { published: false };
  if (id !== "new") {
    const { data } = await db.from("posts").select("*").eq("id", id).maybeSingle();
    if (!data) notFound();
    p = data as Post;
  }
  const date = (p.published_at ? new Date(p.published_at) : new Date()).toISOString().slice(0, 10);

  return (
    <>
      <Title aside={<Link href="/admin/posts" className="link-u font-mono text-xs uppercase">← Liste</Link>}>
        {id === "new" ? "Nouvel article" : p.title?.fr || p.slug}
      </Title>
      <form action={savePost} className="grid max-w-5xl gap-8">
        {p.id && <input type="hidden" name="id" value={p.id} />}
        <div className="grid gap-4 md:grid-cols-4">
          <Field label="Slug (url)">
            <input name="slug" required defaultValue={p.slug} className={`${input} font-mono`} />
          </Field>
          <Field label="Date de publication">
            <input name="published_at" type="date" defaultValue={date} className={input} />
          </Field>
          <Field label="Tags" hint="Séparés par virgule">
            <input name="tags" defaultValue={p.tags?.join(", ")} className={input} />
          </Field>
          <label className="flex items-center gap-2 self-end pb-2">
            <input type="checkbox" name="published" defaultChecked={p.published} /> Publié
          </label>
        </div>
        <L10nField name="title" label="Titre" value={p.title} />
        <L10nField name="summary" label="Chapô" value={p.summary} area />
        <L10nField name="content" label="Contenu (Markdown)" value={p.content} markdown rows={20} />
        <Field label="Cover (16:9)">
          <MediaInput name="cover_url" defaultValue={p.cover_url ? [p.cover_url] : []} />
        </Field>
        <Submit />
      </form>
      {p.id && (
        <form action={deletePost} className="mt-16 border-t border-line pt-6">
          <input type="hidden" name="id" value={p.id} />
          <button className="font-mono text-xs uppercase text-accent hover:underline">Supprimer cet article</button>
        </form>
      )}
    </>
  );
}

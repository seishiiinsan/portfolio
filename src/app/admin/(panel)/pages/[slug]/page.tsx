import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import type { Page } from "@/lib/types";
import { savePage } from "../../../actions";
import { L10nField, Submit, Title } from "../../../ui";

export default async function EditPage({ params }: PageProps<"/admin/pages/[slug]">) {
  const { slug } = await params;
  const db = await requireAdmin();
  const { data } = await db.from("pages").select("*").eq("slug", slug).maybeSingle();
  if (!data) notFound();
  const p = data as Page;
  return (
    <>
      <Title aside={<Link href="/admin/pages" className="link-u font-mono text-xs uppercase">← Liste</Link>}>{p.title.fr || slug}</Title>
      <form action={savePage} className="grid max-w-5xl gap-8">
        <input type="hidden" name="slug" value={p.slug} />
        <L10nField name="title" label="Titre" value={p.title} />
        <L10nField name="content" label="Contenu (Markdown)" value={p.content} markdown rows={18} />
        <Submit />
      </form>
    </>
  );
}

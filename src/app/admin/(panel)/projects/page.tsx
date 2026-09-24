import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import type { Project } from "@/lib/types";
import { reorder } from "../../actions";
import { Title } from "../../ui";
import { SortableList } from "../../sortable-list";

export default async function AdminProjects() {
  const db = await requireAdmin();
  const { data } = await db.from("projects").select("*").order("position").order("created_at", { ascending: false });
  const projects = (data ?? []) as Project[];

  return (
    <>
      <Title
        aside={
          <Link href="/admin/projects/new" className="rounded-full bg-fg px-6 py-3 font-mono text-xs uppercase text-bg hover:bg-accent">
            + Nouveau
          </Link>
        }
      >
        Projets
      </Title>
      {!projects.length && <p className="text-muted">Aucun projet.</p>}
      <SortableList
        onReorder={reorder.bind(null, "projects")}
        items={projects.map((p) => ({
          id: p.id,
          href: `/admin/projects/${p.id}`,
          label: p.title.fr || p.title.en || p.slug,
          meta: `${p.featured ? "★ " : ""}${p.published ? "publié" : "brouillon"} · ${p.year ?? "—"}`,
        }))}
      />
    </>
  );
}

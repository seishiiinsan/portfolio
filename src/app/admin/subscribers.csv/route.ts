import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const db = await createClient();
  const { data: ok } = await db.rpc("is_admin");
  if (!ok) return new Response("Unauthorized", { status: 401 });
  const { data } = await db.from("subscribers").select("email,locale,created_at").order("created_at");
  const rows = (data ?? []).map((r) => [r.email, r.locale, r.created_at].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","));
  return new Response(["email,locale,created_at", ...rows].join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="abonnes-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}

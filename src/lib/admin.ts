import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";

/** Vérifie session + droit admin (login GitHub dans public.admins). */
export async function requireAdmin() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) redirect("/admin/login");
  const { data: ok } = await supabase.rpc("is_admin");
  if (!ok) redirect("/admin/login?error=forbidden");
  return supabase;
}

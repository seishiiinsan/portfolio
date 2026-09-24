import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Déclenche volontairement une erreur serveur pour vérifier la remontée dans Sentry (admin uniquement). */
export async function GET() {
  const db = await createClient();
  const { data: ok } = await db.rpc("is_admin");
  if (!ok) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  throw new Error(`Sentry test — ${new Date().toISOString()}`);
}

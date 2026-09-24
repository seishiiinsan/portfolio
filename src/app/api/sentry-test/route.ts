import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Envoie une erreur de test à Sentry et renvoie un diagnostic (admin uniquement). */
export async function GET() {
  const db = await createClient();
  const { data: ok } = await db.rpc("is_admin");
  if (!ok) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const eventId = Sentry.captureException(new Error(`Sentry test — ${new Date().toISOString()}`));
  const flushed = await Sentry.flush(5000);
  return NextResponse.json(
    {
      dsnConfigured: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
      sdkEnabled: !!Sentry.getClient()?.getOptions().enabled,
      eventId,
      flushed,
    },
    { status: 500 },
  );
}

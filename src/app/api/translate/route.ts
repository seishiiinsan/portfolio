import Anthropic from "@anthropic-ai/sdk";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Traduction FR ⇄ EN pour l'admin (réservée aux administrateurs). */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: ok } = await supabase.rpc("is_admin");
  if (!ok) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY manquante" }, { status: 503 });
  }

  const { text, from, to, markdown } = (await req.json().catch(() => ({}))) as {
    text?: string;
    from?: string;
    to?: string;
    markdown?: boolean;
  };
  const langs: Record<string, string> = { fr: "French", en: "English" };
  if (!text?.trim() || text.length > 20000 || !langs[from ?? ""] || !langs[to ?? ""] || from === to) {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  try {
    const client = new Anthropic();
    const response = await client.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 16000,
      output_config: { effort: "low" },
      system: `You translate portfolio content written by a French full-stack developer from ${langs[from!]} to ${langs[to!]}. Keep the author's tone (warm, direct, first person), technical terms and product names unchanged.${
        markdown ? " Preserve the Markdown structure exactly (headings, lists, links, code)." : ""
      } Reply with the translation only, no preamble.`,
      messages: [{ role: "user", content: text }],
    });
    if (response.stop_reason === "refusal") {
      return NextResponse.json({ error: "Traduction refusée" }, { status: 422 });
    }
    const out = response.content
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("")
      .trim();
    return NextResponse.json({ text: out });
  } catch (e) {
    if (e instanceof Anthropic.RateLimitError) return NextResponse.json({ error: "Limite atteinte, réessaie" }, { status: 429 });
    if (e instanceof Anthropic.APIError) {
      console.error("translate:", e.status, e.message);
      const detail = (e.error as { error?: { message?: string } } | undefined)?.error?.message ?? e.message;
      return NextResponse.json({ error: `Erreur API (${e.status}) : ${detail}` }, { status: 502 });
    }
    console.error("translate:", e);
    return NextResponse.json({ error: "Traduction impossible" }, { status: 500 });
  }
}

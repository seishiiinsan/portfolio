import { NextResponse, type NextRequest } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";

const BOT = /bot|crawl|spider|slurp|preview|lighthouse|headless/i;

export async function POST(req: NextRequest) {
  if (BOT.test(req.headers.get("user-agent") ?? "")) return new NextResponse(null, { status: 204 });
  const { path } = (await req.json().catch(() => ({}))) as { path?: unknown };
  if (typeof path !== "string" || !/^\/(fr|en)(\/[\w\-/]*)?$/.test(path) || path.length > 300) {
    return new NextResponse(null, { status: 204 });
  }
  await createPublicClient().from("page_views").insert({ path });
  return new NextResponse(null, { status: 204 });
}

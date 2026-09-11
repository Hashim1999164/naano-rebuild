import { NextResponse } from "next/server";
import { loadDb, publicState } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const db = loadDb();
  return NextResponse.json(publicState(db), {
    headers: { "cache-control": "no-store" },
  });
}

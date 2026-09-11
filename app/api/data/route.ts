import { NextResponse } from "next/server";
import { loadDb, publicState } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const db = loadDb();
  return new NextResponse(JSON.stringify(publicState(db), null, 2), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

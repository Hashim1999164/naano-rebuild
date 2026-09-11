import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { loadDb, saveDb } from "@/lib/db";
import { COOKIE } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (token) {
    const db = loadDb();
    db.sessions = db.sessions.filter((s) => s.token !== token);
    saveDb(db);
  }
  (await cookies()).set(COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return NextResponse.json({ ok: true });
}

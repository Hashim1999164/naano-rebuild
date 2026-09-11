import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { hashPassword, loadDb, saveDb, uid } from "@/lib/db";
import { COOKIE, publicUser } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const db = loadDb();
  const user = db.users.find((u) => u.email === email && u.verified);
  if (!user || user.passwordHash !== hashPassword(password)) {
    return NextResponse.json({ error: "Email or password is wrong." }, { status: 401 });
  }
  const token = uid("s");
  db.sessions.push({ token, userId: user.id, createdAt: new Date().toISOString() });
  saveDb(db);
  (await cookies()).set(COOKIE, token, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 14 });
  return NextResponse.json({ ok: true, user: publicUser(user) });
}

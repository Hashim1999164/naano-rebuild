import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { hashPassword, loadDb, saveDb, uid } from "@/lib/db";
import { COOKIE } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const first = String(body.first || "").trim();
  const last = String(body.last || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const role = body.role === "creator" ? "creator" : "brand";
  const source = String(body.source || "LinkedIn");
  const company = role === "brand" ? String(body.company || "My company") : null;

  if (!email || !password || password.length < 4 || !first) {
    return NextResponse.json({ error: "Fill in your name, email and a password." }, { status: 400 });
  }

  const db = loadDb();
  if (db.users.some((u) => u.email === email && u.verified)) {
    return NextResponse.json({ error: "That email already has an account. Sign in instead." }, { status: 409 });
  }

  const code = String(Math.floor(100000 + Math.random() * 900000));
  db.codes = db.codes.filter((c) => c.email !== email);
  db.codes.push({
    email,
    code,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    payload: {
      name: `${first} ${last}`.trim(),
      email,
      passwordHash: hashPassword(password),
      role,
      company,
      source,
      wallet: role === "brand" ? 0 : 0,
      price: role === "creator" ? 180 : undefined,
      verified: true,
    },
  });
  saveDb(db);

  return NextResponse.json({
    ok: true,
    email,
    code,
    hint: "Code is stored in data/db.json. Use it on the next screen.",
  });
}

export async function PUT(req: Request) {
  const body = await req.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();
  const code = String(body.code || "").replace(/\D/g, "");
  if (!email || code.length !== 6) {
    return NextResponse.json({ error: "Enter the 6-digit code." }, { status: 400 });
  }

  const db = loadDb();
  const pending = db.codes.find((c) => c.email === email && c.code === code && new Date(c.expiresAt) > new Date());
  if (!pending) {
    return NextResponse.json({ error: "That code is wrong or expired." }, { status: 400 });
  }

  let user = db.users.find((u) => u.email === email);
  if (!user) {
    user = {
      id: uid("u"),
      name: pending.payload.name || email,
      email,
      passwordHash: pending.payload.passwordHash,
      role: pending.payload.role || "brand",
      company: pending.payload.company,
      source: pending.payload.source,
      wallet: pending.payload.wallet ?? 0,
      price: pending.payload.price,
      verified: true,
      createdAt: new Date().toISOString(),
    };
    db.users.push(user);
  } else {
    user.verified = true;
    user.passwordHash = pending.payload.passwordHash;
  }

  db.codes = db.codes.filter((c) => c.email !== email);
  const token = uid("s");
  db.sessions.push({ token, userId: user.id, createdAt: new Date().toISOString() });
  saveDb(db);

  (await cookies()).set(COOKIE, token, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 14 });
  return NextResponse.json({ ok: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
}

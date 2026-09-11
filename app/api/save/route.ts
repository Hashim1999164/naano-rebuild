import { NextResponse } from "next/server";
import { loadDb, saveDb, uid } from "@/lib/db";
import { getSessionUser } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const db = loadDb();
  return NextResponse.json({
    bookings: db.bookings.filter((b) => b.userId === user.id || (user.role === "creator" && true)),
    campaigns: db.campaigns.filter((c) => c.userId === user.id),
    messages: db.messages.filter((m) => m.userId === user.id),
    collabs: db.collabs.filter((c) => c.creatorId === user.id || user.role === "brand"),
    wallet: user.wallet,
  });
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const kind = String(body.kind || "booking");
  const db = loadDb();

  if (kind === "booking") {
    const creatorId = String(body.creatorId || "");
    const campaignId = String(body.campaignId || "q4-revenue");
    const fee = Number(body.fee || 0);
    if (!creatorId) return NextResponse.json({ error: "Pick a creator." }, { status: 400 });
    const booking = {
      id: uid("b"),
      userId: user.id,
      creatorId,
      campaignId,
      status: "Invited",
      fee,
      createdAt: new Date().toISOString(),
    };
    db.bookings.push(booking);
    saveDb(db);
    return NextResponse.json({ ok: true, booking });
  }

  if (kind === "campaign") {
    const campaign = {
      id: uid("camp"),
      userId: user.id,
      name: String(body.name || "New campaign"),
      product: String(body.product || "Untitled"),
      creators: Number(body.creators || 0),
      status: "Draft",
      budget: Number(body.budget || 0),
      progress: 8,
      method: String(body.method || "ai"),
      brief: String(body.brief || ""),
      createdAt: new Date().toISOString(),
    };
    db.campaigns.unshift(campaign);
    saveDb(db);
    return NextResponse.json({ ok: true, campaign });
  }

  if (kind === "wallet") {
    const amount = Math.max(0, Number(body.amount || 0));
    const found = db.users.find((u) => u.id === user.id);
    if (found) found.wallet += amount;
    saveDb(db);
    return NextResponse.json({ ok: true, wallet: found?.wallet || 0 });
  }

  if (kind === "collab") {
    const collab = db.collabs.find((c) => c.id === body.id);
    if (collab) {
      if (body.ready) { collab.ready = true; collab.status = "Draft ready"; }
      if (body.accept) collab.status = "Accepted";
      if (body.decline) collab.status = "Declined";
    }
    const creator = db.users.find((u) => u.id === user.id && u.role === "creator");
    if (creator && body.price != null) creator.price = Number(body.price);
    saveDb(db);
    return NextResponse.json({ ok: true, collabs: db.collabs.filter((c) => c.creatorId === user.id), price: creator?.price });
  }

  return NextResponse.json({ error: "Unknown save." }, { status: 400 });
}

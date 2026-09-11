import { cookies } from "next/headers";
import { loadDb, publicUser, type User } from "./db";

export const COOKIE = "naano_session";

export async function getSessionUser(): Promise<User | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const db = loadDb();
  const session = db.sessions.find((s) => s.token === token);
  if (!session) return null;
  return db.users.find((u) => u.id === session.userId && u.verified) || null;
}

export async function requireUser() {
  const user = await getSessionUser();
  if (!user) throw new Error("unauthorized");
  return user;
}

export { publicUser };

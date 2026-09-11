import { createHash, randomBytes } from "crypto";
import fs from "fs";
import path from "path";
import seed from "../data/db.json";

export type Role = "brand" | "creator";

export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  company?: string | null;
  source?: string;
  wallet: number;
  price?: number;
  verified: boolean;
  createdAt: string;
};

export type Session = { token: string; userId: string; createdAt: string };
export type Code = { email: string; code: string; expiresAt: string; payload: Partial<User> & { passwordHash: string } };
export type Booking = { id: string; userId: string; creatorId: string; campaignId: string; status: string; fee: number; createdAt: string };
export type Campaign = { id: string; userId: string; name: string; product: string; creators: number; status: string; budget: number; progress: number; method: string; brief: string; createdAt: string };
export type Message = { id: string; userId: string; from: string; body: string; createdAt: string };
export type Collab = { id: string; creatorId: string; brand: string; title: string; brief: string; fee: number; status: string; ready: boolean };

export type Database = {
  users: User[];
  sessions: Session[];
  codes: Code[];
  bookings: Booking[];
  campaigns: Campaign[];
  messages: Message[];
  collabs: Collab[];
};

const SALT = "naano-demo-salt-v1";
const SEED_PATH = path.join(process.cwd(), "data", "db.json");

declare global {
  var __naanoDb: Database | undefined;
  var __naanoDataFile: string | undefined;
}

export function hashPassword(password: string) {
  return createHash("sha256").update(SALT + password).digest("hex");
}

export function uid(prefix: string) {
  return `${prefix}_${randomBytes(6).toString("hex")}`;
}

function cloneSeed(): Database {
  return JSON.parse(JSON.stringify(seed)) as Database;
}

function canWrite(dir: string) {
  try {
    fs.mkdirSync(dir, { recursive: true });
    const probe = path.join(dir, ".write-test");
    fs.writeFileSync(probe, "ok");
    fs.unlinkSync(probe);
    return true;
  } catch {
    return false;
  }
}

function resolveFile() {
  if (global.__naanoDataFile) return global.__naanoDataFile;
  const dirs = [path.join(process.cwd(), "data"), path.join("/tmp", "naano", "data")];
  const dir = dirs.find(canWrite) || dirs[1];
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, "db.json");
  global.__naanoDataFile = file;
  return file;
}

function readDisk(file: string): Database | null {
  try {
    if (!fs.existsSync(file)) return null;
    return JSON.parse(fs.readFileSync(file, "utf8")) as Database;
  } catch {
    return null;
  }
}

export function publicState(db: Database) {
  return {
    path: "/data/db.json",
    savedAt: new Date().toISOString(),
    users: db.users.map((u) => {
      const { passwordHash, ...rest } = u;
      void passwordHash;
      return rest;
    }),
    bookings: db.bookings,
    campaigns: db.campaigns,
    messages: db.messages,
    collabs: db.collabs,
    sessions: db.sessions.length,
  };
}

export function loadDb(): Database {
  if (global.__naanoDb) return global.__naanoDb;
  const file = resolveFile();
  const fromDisk = readDisk(file) || (file !== SEED_PATH ? readDisk(SEED_PATH) : null);
  const db = fromDisk || cloneSeed();
  global.__naanoDb = db;
  if (!fromDisk || file !== SEED_PATH) saveDb(db);
  return db;
}

export function saveDb(db: Database) {
  global.__naanoDb = db;
  const file = resolveFile();
  const json = JSON.stringify(db, null, 2);
  const tmp = file + ".tmp";
  fs.writeFileSync(tmp, json);
  fs.renameSync(tmp, file);
  // Keep a public copy on the same web path when the filesystem allows it.
  const publicFile = path.join(process.cwd(), "public", "data", "db.json");
  try {
    fs.mkdirSync(path.dirname(publicFile), { recursive: true });
    fs.writeFileSync(publicFile, JSON.stringify(publicState(db), null, 2));
  } catch {
    // Vercel production is read-only outside /tmp. /data/db.json is served from the API instead.
  }
}

export function publicUser(user: User) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    company: user.company || undefined,
    wallet: user.wallet,
    price: user.price,
    initials: user.name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase(),
  };
}

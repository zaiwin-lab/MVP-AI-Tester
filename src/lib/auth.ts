import crypto from "node:crypto";
import { redirect } from "next/navigation";
import { getUser, getUserByEmail, insertUser, listUsers, newId } from "./db";
import type { UserRecord, UserRole } from "./domain";
import { readSession } from "./session";

const SCRYPT_KEYLEN = 64;

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, SCRYPT_KEYLEN).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const derived = crypto.scryptSync(password, salt, SCRYPT_KEYLEN);
  const expected = Buffer.from(hash, "hex");
  if (derived.length !== expected.length) return false;
  return crypto.timingSafeEqual(derived, expected);
}

/**
 * Seed the first admin account from env on first run. Idempotent: does nothing
 * once any user exists. Safe to call at the top of admin entry points.
 */
export async function ensureSeedUser(): Promise<void> {
  const users = await listUsers();
  if (users.length > 0) return;
  const email = process.env.ADMIN_EMAIL || "admin@kobis.example";
  const password = process.env.ADMIN_PASSWORD || "changeme-admin-2026";
  const name = process.env.ADMIN_NAME || "KAPT Administrator";
  const user: UserRecord = {
    id: newId("usr_"),
    email,
    name,
    role: "admin",
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
    active: true,
  };
  await insertUser(user);
}

export async function authenticate(email: string, password: string): Promise<UserRecord | null> {
  await ensureSeedUser();
  const user = await getUserByEmail(email.trim());
  if (!user || !user.active) return null;
  if (!verifyPassword(password, user.passwordHash)) return null;
  return user;
}

export interface SessionUser {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}

/** Returns the signed-in user, or null. Never throws. */
export async function currentUser(): Promise<SessionUser | null> {
  const session = await readSession();
  if (!session) return null;
  const user = await getUser(session.uid);
  if (!user || !user.active) return null;
  return { id: user.id, name: user.name, role: user.role, email: user.email };
}

/** Guard for admin routes; redirects to login when unauthenticated. */
export async function requireUser(): Promise<SessionUser> {
  const user = await currentUser();
  if (!user) redirect("/admin/login");
  return user;
}

import crypto from "node:crypto";
import { cookies } from "next/headers";

/**
 * Stateless signed-cookie sessions. The cookie holds a small JSON payload
 * signed with HMAC-SHA256 using SESSION_SECRET. No session data is trusted
 * without a valid signature, and the cookie is httpOnly + sameSite=lax so it
 * is never readable from client JS.
 */

const COOKIE = "cap_session";
const MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (s && s.length >= 16) return s;
  // Deterministic fallback keeps local/demo runs working without config.
  // Production MUST set SESSION_SECRET (see .env.example).
  return "cap-digital-clinic-dev-secret-do-not-use-in-production";
}

interface Payload {
  uid: string;
  role: string;
  name: string;
  exp: number;
}

function sign(data: string): string {
  return crypto.createHmac("sha256", secret()).update(data).digest("base64url");
}

function encode(payload: Payload): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body)}`;
}

function decode(token: string): Payload | null {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = sign(body);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as Payload;
    if (typeof payload.exp !== "number" || payload.exp < Date.now() / 1000) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function createSession(user: { id: string; role: string; name: string }) {
  const payload: Payload = {
    uid: user.id,
    role: user.role,
    name: user.name,
    exp: Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS,
  };
  const store = await cookies();
  store.set(COOKIE, encode(payload), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function readSession(): Promise<Payload | null> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;
  return decode(token);
}

export async function destroySession() {
  const store = await cookies();
  store.delete(COOKIE);
}

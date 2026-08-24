import { createHmac, timingSafeEqual } from "node:crypto";
import type { Request } from "express";

/**
 * Minimal stateless admin gate — no user accounts. The site owner sets
 * ADMIN_PASSCODE in the environment; /admin asks for it once and remembers
 * a signed (HMAC) cookie for 30 days.
 */
export const ADMIN_COOKIE = "tp_admin";
const DEFAULT_PASSCODE = "peeplz-admin";

export function adminPasscode(): string {
  return process.env.ADMIN_PASSCODE || DEFAULT_PASSCODE;
}

export function adminToken(): string {
  return createHmac("sha256", adminPasscode())
    .update("tranquil-peeplz-admin")
    .digest("hex");
}

function parseCookies(req: Request): Record<string, string> {
  const header = req.headers.cookie ?? "";
  const out: Record<string, string> = {};
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx > -1) {
      out[part.slice(0, idx).trim()] = decodeURIComponent(part.slice(idx + 1).trim());
    }
  }
  return out;
}

export function isAdmin(req: Request): boolean {
  const token = parseCookies(req)[ADMIN_COOKIE];
  if (!token) return false;
  const expected = adminToken();
  if (token.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  } catch {
    return false;
  }
}

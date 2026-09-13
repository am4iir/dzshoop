import { NextResponse } from "next/server";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

/**
 * Returns the admin secret from environment variable.
 * In production, the secret must be provided explicitly via environment configuration.
 */
export function getAdminSecret(): string {
  const secret = process.env.ADMIN_SECRET;

  if (secret && secret.trim()) {
    return secret.trim();
  }

  if (process.env.NODE_ENV === "development") {
    return "dev-admin-change-me";
  }

  throw new Error("ADMIN_SECRET environment variable is not set");
}

export function createAdminSessionToken(): string {
  const issuedAt = Math.floor(Date.now() / 1000);
  const payload = String(issuedAt);
  const signature = createHmac("sha256", getAdminSecret()).update(payload).digest("hex");
  return `${payload}.${signature}`;
}

export function createCsrfToken(): string {
  return randomBytes(32).toString("hex");
}

function isValidSessionToken(token: string): boolean {
  const [issuedAt, signature] = token.split(".");
  if (!issuedAt || !signature || !/^\d+$/.test(issuedAt) || !/^[a-f0-9]{64}$/.test(signature)) return false;

  const age = Math.floor(Date.now() / 1000) - Number(issuedAt);
  if (!Number.isFinite(age) || age < 0 || age > SESSION_MAX_AGE_SECONDS) return false;

  const expected = createHmac("sha256", getAdminSecret()).update(issuedAt).digest("hex");
  return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export function getAdminSessionToken(req: Request): string | null {
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(/(?:^|;\s*)axb_admin_session=([^;]+)/);
  if (!match) return null;

  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1] || null;
  }
}

/**
 * Checks whether the incoming API request carries a valid admin token via either the Authorization header or an HttpOnly cookie.
 */
export function isAdminAuthorized(req: Request): boolean {
  const token = getAdminSessionToken(req);
  return Boolean(token && isValidSessionToken(token));
}

export function isSameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === new URL(req.url).host;
  } catch {
    return false;
  }
}

function getCookie(req: Request, name: string): string | null {
  const match = (req.headers.get("cookie") || "").match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function isCsrfProtectedRequest(req: Request): boolean {
  const cookieToken = getCookie(req, "axb_admin_csrf");
  const headerToken = req.headers.get("x-csrf-token");
  if (!cookieToken || !headerToken || cookieToken.length !== headerToken.length) return false;
  return timingSafeEqual(Buffer.from(cookieToken), Buffer.from(headerToken));
}

/**
 * Returns a 401 Unauthorized JSON response.
 */
export function unauthorizedResponse() {
  return NextResponse.json(
    { success: false, error: "Unauthorized — admin access required" },
    { status: 401 }
  );
}

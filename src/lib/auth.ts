import { NextResponse } from "next/server";

/**
 * Returns the admin secret from environment variable.
 * Falls back to default only in development — in production set ADMIN_SECRET on Vercel.
 */
export function getAdminSecret(): string {
  return process.env.ADMIN_SECRET || "abxabx202625";
}

/**
 * Checks whether the incoming API request carries a valid admin Bearer token.
 */
export function isAdminAuthorized(req: Request): boolean {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return false;
  const token = authHeader.substring(7).trim();
  return token === getAdminSecret();
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

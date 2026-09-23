import { after, NextResponse } from "next/server";
import { createAdminSessionToken, createCsrfToken, getAdminSecret } from "@/lib/auth";
import { sendAdminSecurityAlertEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
import { extractClientDetails } from "@/lib/geo";

export async function POST(req: Request) {
  const client = extractClientDetails(req);
  const nowStr = new Date().toLocaleString("fr-FR", { timeZone: "Africa/Algiers" }) + " (Algerian Time)";

  const rate = checkRateLimit(req, { maxRequests: 5, windowMs: 60 * 1000 });
  if (!rate.allowed) {
    logger.warn("admin_login_rate_limited", { retryAfterMs: rate.retryAfterMs, ip: client.ip });

    after(() =>
      sendAdminSecurityAlertEmail({
        eventType: "LOGIN_FAILED",
        client,
        timestamp: nowStr,
        attemptedPasscode: "BLOCKED_BY_RATE_LIMIT",
      })
    );

    return NextResponse.json(
      { success: false, error: "Too many attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rate.retryAfterMs ?? 0) / 1000)) } }
    );
  }

  try {
    const body = await req.json();
    const passcode = typeof body?.passcode === "string" ? body.passcode.trim() : "";

    if (!passcode || passcode !== getAdminSecret()) {
      logger.warn("admin_login_failed", { ip: client.ip, location: client.location });

      // Send immediate email alert to Barae on wrong passcode!
      after(() =>
        sendAdminSecurityAlertEmail({
          eventType: "LOGIN_FAILED",
          client,
          attemptedPasscode: passcode ? passcode.slice(0, 8) : "EMPTY",
          timestamp: nowStr,
        })
      );

      return NextResponse.json({ success: false, error: "Invalid admin credentials" }, { status: 401 });
    }

    // Successful login
    const response = NextResponse.json({ success: true });
    response.cookies.set("axb_admin_session", createAdminSessionToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 8,
    });
    response.cookies.set("axb_admin_csrf", createCsrfToken(), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    after(() =>
      sendAdminSecurityAlertEmail({
        eventType: "LOGIN_SUCCESS",
        client,
        timestamp: nowStr,
      })
    );

    return response;
  } catch {
    logger.warn("admin_login_invalid_request");
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }
}

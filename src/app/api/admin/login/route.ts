import { after, NextResponse } from "next/server";
import UAParser from "ua-parser-js";
import { createAdminSessionToken, createCsrfToken, getAdminSecret } from "@/lib/auth";
import { sendAdminLoginEmailNotification } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export async function POST(req: Request) {
  const rate = checkRateLimit(req, { maxRequests: 5, windowMs: 60 * 1000 });
  if (!rate.allowed) {
    logger.warn("admin_login_rate_limited", { retryAfterMs: rate.retryAfterMs });
    return NextResponse.json(
      { success: false, error: "Too many attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rate.retryAfterMs ?? 0) / 1000)) } }
    );
  }

  try {
    const body = await req.json();
    const passcode = typeof body?.passcode === "string" ? body.passcode.trim() : "";

    if (!passcode || passcode !== getAdminSecret()) {
      logger.warn("admin_login_failed");
      return NextResponse.json({ success: false, error: "Invalid admin credentials" }, { status: 401 });
    }

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

    const userAgent = new UAParser(req.headers.get("user-agent") || "").getResult();
    const operatingSystem = userAgent.os.name === "Windows"
      ? `Windows ${userAgent.os.version || "10/11"}`
      : [userAgent.os.name, userAgent.os.version].filter(Boolean).join(" ") || "Unknown";
    const browser = [userAgent.browser.name, userAgent.browser.version].filter(Boolean).join(" ") || "Unknown";
    const deviceType = userAgent.device.type === "mobile"
      ? "Mobile"
      : userAgent.device.type === "tablet"
        ? "Tablet"
        : "Desktop";

    after(() => sendAdminLoginEmailNotification({
      loggedInAt: new Date().toISOString(),
      operatingSystem,
      browser,
      deviceType,
    }));

    return response;
  } catch {
    logger.warn("admin_login_invalid_request");
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }
}

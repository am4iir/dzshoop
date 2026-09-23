import { after, NextResponse } from "next/server";
import { sendAdminSecurityAlertEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";
import { extractClientDetails } from "@/lib/geo";
import { logger } from "@/lib/logger";

export async function POST(req: Request) {
  const client = extractClientDetails(req);
  const nowStr = new Date().toLocaleString("fr-FR", { timeZone: "Africa/Algiers" }) + " (Algerian Time)";

  // Rate limit: 1 visit notification per 5 minutes per IP to avoid inbox spamming on page refreshes
  const rate = checkRateLimit(req, { maxRequests: 1, windowMs: 5 * 60 * 1000 });
  if (!rate.allowed) {
    return NextResponse.json({ success: true, throttled: true });
  }

  logger.info("admin_page_visit_detected", { ip: client.ip, location: client.location });

  after(() =>
    sendAdminSecurityAlertEmail({
      eventType: "PAGE_VISITED",
      client,
      timestamp: nowStr,
    })
  );

  return NextResponse.json({ success: true });
}

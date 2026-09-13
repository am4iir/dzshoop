import { NextResponse } from "next/server";
import { isAdminAuthorized, isCsrfProtectedRequest, isSameOrigin, unauthorizedResponse } from "@/lib/auth";

export async function POST(req: Request) {
  if (!isSameOrigin(req) || !isAdminAuthorized(req) || !isCsrfProtectedRequest(req)) return unauthorizedResponse();
  const response = NextResponse.json({ success: true });
  response.cookies.set("axb_admin_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  response.cookies.set("axb_admin_csrf", "", {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  return response;
}

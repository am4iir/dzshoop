import { NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/auth";

export async function GET(req: Request) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true });
}

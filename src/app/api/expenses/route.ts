import { NextResponse } from "next/server";
import { sql, initDbTables } from "@/lib/db";
import { isAdminAuthorized, unauthorizedResponse } from "@/lib/auth";

export async function GET(req: Request) {
  if (!isAdminAuthorized(req)) return unauthorizedResponse();
  try {
    await initDbTables();
    const rows = await sql`
      SELECT 
        id, 
        title, 
        amount::float as amount, 
        category, 
        type, 
        notes, 
        created_at as "createdAt"
      FROM expenses
      ORDER BY created_at DESC
    `;
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Fetch expenses error:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!isAdminAuthorized(req)) return unauthorizedResponse();
  try {
    await initDbTables();
    const body = await req.json();

    const title = (body.title || "").trim();
    const amount = Number(body.amount) || 0;
    const category = body.category || "other";
    const type = body.type === "income" ? "income" : "expense";
    const notes = (body.notes || "").trim();

    if (!title || amount <= 0) {
      return NextResponse.json(
        { success: false, error: "يرجى كتابة عنوان المعاملة والمبلغ بشكل صحيح" },
        { status: 400 }
      );
    }

    const id = "txn-" + Date.now();

    await sql`
      INSERT INTO expenses (id, title, amount, category, type, notes)
      VALUES (${id}, ${title}, ${amount}, ${category}, ${type}, ${notes})
    `;

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Create expense error:", error);
    return NextResponse.json({ success: false, error: "Failed to record expense" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!isAdminAuthorized(req)) return unauthorizedResponse();
  try {
    await initDbTables();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 });
    }

    await sql`DELETE FROM expenses WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete expense error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete expense" }, { status: 500 });
  }
}
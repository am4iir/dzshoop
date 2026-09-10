import { NextResponse } from "next/server";
import { sql, initDbTables } from "@/lib/db";

export async function GET(req: Request) {
  try {
    await initDbTables();
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim() || "";

    if (!query) {
      return NextResponse.json({ success: false, message: "يرجى إدخال رقم الطلبية أو رقم الهاتف" }, { status: 400 });
    }

    let rows;
    if (query.toUpperCase().startsWith("DZ-")) {
      // Search by exact order ID
      rows = await sql`
        SELECT 
          id, 
          product_title as "productTitle", 
          product_id as "productId", 
          selected_size as "selectedSize", 
          selected_color as "selectedColor", 
          quantity, 
          full_name as "fullName", 
          phone, 
          wilaya_name as "wilayaName", 
          commune, 
          delivery_type as "deliveryType", 
          delivery_price::float as "deliveryPrice", 
          total_price::float as "totalPrice", 
          status, 
          created_at as "createdAt"
        FROM orders
        WHERE UPPER(id) = UPPER(${query})
        ORDER BY created_at DESC
      `;
    } else {
      // Clean phone string (remove spaces, hyphens)
      const cleanPhone = query.replace(/\s+/g, "").replace(/-/g, "");
      rows = await sql`
        SELECT 
          id, 
          product_title as "productTitle", 
          product_id as "productId", 
          selected_size as "selectedSize", 
          selected_color as "selectedColor", 
          quantity, 
          full_name as "fullName", 
          phone, 
          wilaya_name as "wilayaName", 
          commune, 
          delivery_type as "deliveryType", 
          delivery_price::float as "deliveryPrice", 
          total_price::float as "totalPrice", 
          status, 
          created_at as "createdAt"
        FROM orders
        WHERE REPLACE(REPLACE(phone, ' ', ''), '-', '') LIKE ${'%' + cleanPhone + '%'}
        ORDER BY created_at DESC
      `;
    }

    return NextResponse.json({ success: true, orders: rows });
  } catch (error) {
    console.error("Track order error:", error);
    return NextResponse.json({ success: false, message: "حدث خطأ أثناء البحث عن الطلبية" }, { status: 500 });
  }
}

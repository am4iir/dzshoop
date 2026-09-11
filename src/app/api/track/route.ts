import { NextResponse } from "next/server";
import { sql, initDbTables } from "@/lib/db";

export async function GET(req: Request) {
  try {
    await initDbTables();
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get("q") || "").trim();

    if (!query) {
      return NextResponse.json({ success: false, error: "يرجى إدخال رقم الطلبية أو رقم الهاتف" }, { status: 400 });
    }

    let rows;
    if (query.toUpperCase().startsWith("DZ-")) {
      rows = await sql`
        SELECT 
          id, 
          product_title as "productTitle", 
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
        WHERE UPPER(id) = ${query.toUpperCase()}
        LIMIT 5
      `;
    } else {
      const cleanPhone = query.replace(/\s+/g, "");
      rows = await sql`
        SELECT 
          id, 
          product_title as "productTitle", 
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
        WHERE REPLACE(phone, ' ', '') LIKE ${'%' + cleanPhone + '%'}
        ORDER BY created_at DESC
        LIMIT 5
      `;
    }

    return NextResponse.json({ success: true, orders: rows });
  } catch (error) {
    console.error("Track order error:", error);
    return NextResponse.json({ success: false, error: "حدث خطأ في النظام" }, { status: 500 });
  }
}
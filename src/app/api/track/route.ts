import { NextResponse } from "next/server";
import { sql, initDbTables } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

function maskName(name: string): string {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  return parts
    .map((part) => (part.length > 2 ? `${part[0]}***${part[part.length - 1]}` : `${part[0]}*`))
    .join(" ");
}

function maskPhone(phone: string): string {
  if (!phone || phone.length < 6) return phone;
  return `${phone.slice(0, 3)}****${phone.slice(-3)}`;
}

export async function GET(req: Request) {
  const rate = checkRateLimit(req, { maxRequests: 20, windowMs: 60 * 1000 });
  if (!rate.allowed) {
    logger.warn("track_rate_limited", { retryAfterMs: rate.retryAfterMs });
    return NextResponse.json(
      { success: false, error: "Too many tracking requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rate.retryAfterMs ?? 0) / 1000)) } }
    );
  }

  try {
    await initDbTables();
    const { searchParams } = new URL(req.url);
    const rawQuery = (searchParams.get("q") || "").trim();

    if (!rawQuery || rawQuery.length < 3) {
      return NextResponse.json(
        { success: false, error: "يرجى إدخال رقم الطلبية (DZ-XXXXXX) أو رقم الهاتف للبحث" },
        { status: 400 }
      );
    }

    let rows: any[] = [];

    if (rawQuery.toUpperCase().startsWith("DZ-") || rawQuery.toUpperCase().startsWith("DZ")) {
      const orderId = rawQuery.toUpperCase();
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
        WHERE UPPER(id) = ${orderId}
        ORDER BY created_at DESC
        LIMIT 5
      `;
    } else {
      let cleanPhone = rawQuery.replace(/[\s\-\.\(\)]/g, "");
      if (cleanPhone.startsWith("+213")) cleanPhone = "0" + cleanPhone.slice(4);
      else if (cleanPhone.startsWith("00213")) cleanPhone = "0" + cleanPhone.slice(5);
      else if (cleanPhone.startsWith("213") && cleanPhone.length === 11) cleanPhone = "0" + cleanPhone.slice(3);

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
        WHERE phone LIKE ${"%" + cleanPhone + "%"}
        ORDER BY created_at DESC
        LIMIT 5
      `;
    }

    if (rows.length === 0) {
      return NextResponse.json({
        success: true,
        orders: [],
        message: "لم يتم العثور على أي طلبية بهذا الرقم. يرجى التأكد من البيانات.",
      });
    }

    const safeOrders = rows.map((order) => ({
      id: order.id,
      productTitle: order.productTitle,
      selectedSize: order.selectedSize,
      selectedColor: order.selectedColor,
      quantity: order.quantity,
      customerNameMasked: maskName(order.fullName),
      customerPhoneMasked: maskPhone(order.phone),
      wilayaName: order.wilayaName,
      commune: order.commune,
      deliveryType: order.deliveryType,
      deliveryPrice: order.deliveryPrice,
      totalPrice: order.totalPrice,
      status: order.status || "pending",
      createdAt: order.createdAt,
    }));

    return NextResponse.json({
      success: true,
      orders: safeOrders,
    });
  } catch (err) {
    logger.error("track_orders_failed");
    return NextResponse.json({ success: false, error: "فشل استرجاع بيانات التتبع" }, { status: 500 });
  }
}

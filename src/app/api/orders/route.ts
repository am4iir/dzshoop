import { NextResponse } from "next/server";
import { sql, initDbTables } from "@/lib/db";
import { isAdminAuthorized, unauthorizedResponse } from "@/lib/auth";
import { sendOrderEmailNotification } from "@/lib/email";

async function autoCleanupCompletedOrders() {
  try {
    await sql`
      DELETE FROM orders 
      WHERE (status = 'shipped' OR status = 'cancelled') 
      AND created_at < NOW() - INTERVAL '48 hours'
    `;
  } catch (err) {
    console.error("Auto cleanup error:", err);
  }
}

async function sendTelegramNotification(orderData: {
  id: string;
  fullName: string;
  phone: string;
  wilayaName: string;
  commune: string;
  productTitle: string;
  deliveryType: string;
  deliveryPrice: number;
  totalPrice: number;
}) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  try {
    const text = `🛍️ *طلبية جديدة في المتجر!*\n━━━━━━━━━━━━━━━\n🆔 *رقم الطلب:* \`${orderData.id}\`\n👤 *العميل:* ${orderData.fullName}\n📞 *الهاتف:* \`${orderData.phone}\`\n📍 *العنوان:* ${orderData.wilayaName} - ${orderData.commune} (${orderData.deliveryType === "home" ? "توصيل للمنزل" : "استلام من المكتب"})\n📦 *المنتجات:* ${orderData.productTitle}\n💰 *المبلغ الإجمالي:* ${orderData.totalPrice} دج (شامل التوصيل ${orderData.deliveryPrice} دج)\n━━━━━━━━━━━━━━━\n⚡ *اتصل بالزبون فوراً لتأكيد الشحن!*`;
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown" }),
    });
  } catch (err) {
    console.error("Telegram notification error:", err);
  }
}

export async function GET(req: Request) {
  if (!isAdminAuthorized(req)) return unauthorizedResponse();
  try {
    await initDbTables();
    await autoCleanupCompletedOrders();
    const rows = await sql`
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
      ORDER BY created_at DESC
    `;
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Fetch orders error:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await initDbTables();
    const body = await req.json();

    const productId = body.productId || "";
    const productTitle = body.productTitle || "منتج";
    const selectedSize = body.selectedSize || "M";
    const selectedColor = body.selectedColor || "";
    const quantity = Math.max(1, Number(body.quantity) || 1);
    const fullName = (body.fullName || "").trim();
    let phone = (body.phone || "").trim().replace(/[\s\-\.\(\)]/g, "");
    if (phone.startsWith("+213")) {
      phone = "0" + phone.slice(4);
    } else if (phone.startsWith("00213")) {
      phone = "0" + phone.slice(5);
    } else if (phone.startsWith("213") && phone.length === 11) {
      phone = "0" + phone.slice(3);
    }
    const wilayaName = (body.wilayaName || "").trim();
    const commune = (body.commune || "").trim();
    const deliveryType = body.deliveryType === "desk" ? "desk" : "home";
    const deliveryPrice = Math.max(0, Number(body.deliveryPrice) || 0);

    if (!fullName || !phone || !wilayaName) {
      return NextResponse.json(
        { success: false, error: "بيانات ناقصة - يرجى إدخال الاسم ورقم الهاتف والولاية" },
        { status: 400 }
      );
    }
    if (!/^0[5-7]\d{8}$/.test(phone)) {
      return NextResponse.json(
        { success: false, error: "رقم الهاتف غير صحيح! يرجى إدخال رقم جزائري يبدأ بـ 05 أو 06 أو 07 ويتكون من 10 أرقام (مثلاً: 0555123456)" },
        { status: 400 }
      );
    }

    if (productId && (!body.cartItems || body.cartItems.length <= 1)) {
      const productRows = await sql`
        SELECT price::float as price, in_stock, is_deleted 
        FROM products 
        WHERE id = ${productId}
      `;
      if (!productRows || productRows.length === 0) {
        return NextResponse.json({ success: false, error: "المنتج غير موجود" }, { status: 400 });
      }
      const product = productRows[0];
      if (product.is_deleted) {
        return NextResponse.json({ success: false, error: "هذا المنتج غير متوفر حالياً" }, { status: 400 });
      }
      if (product.in_stock === false) {
        return NextResponse.json({ success: false, error: "نفدت كمية هذا المنتج حالياً" }, { status: 400 });
      }
    }

    const totalPrice = Number(body.totalPrice) || 0;
    const id = "DZ-" + Math.floor(100000 + Math.random() * 900000);

    await sql`
      INSERT INTO orders (id, product_title, product_id, selected_size, selected_color, quantity, full_name, phone, wilaya_name, commune, delivery_type, delivery_price, total_price, status)
      VALUES (${id}, ${productTitle}, ${productId}, ${selectedSize}, ${selectedColor}, ${quantity}, ${fullName}, ${phone}, ${wilayaName}, ${commune}, ${deliveryType}, ${deliveryPrice}, ${totalPrice}, 'pending')
    `;

    // Trigger instant Email notification to axbwear@gmail.com
    try {
      await sendOrderEmailNotification({
        id,
        fullName,
        phone,
        wilayaName,
        commune,
        productTitle,
        selectedSize,
        selectedColor,
        quantity,
        deliveryType,
        deliveryPrice,
        totalPrice,
      });
    } catch (err) {
      console.error("Email notification trigger error:", err);
    }

    // Trigger instant Telegram notification to phone if configured
    sendTelegramNotification({ id, fullName, phone, wilayaName, commune, productTitle, deliveryType, deliveryPrice, totalPrice });

    return NextResponse.json({ success: true, order: { id, fullName, totalPrice } });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  if (!isAdminAuthorized(req)) return unauthorizedResponse();
  try {
    await initDbTables();
    const { orderId, status } = await req.json();
    const validStatuses = ["pending", "confirmed", "shipped", "cancelled"];
    if (!orderId || !validStatuses.includes(status)) {
      return NextResponse.json({ success: false, error: "Invalid orderId or status" }, { status: 400 });
    }
    await sql`UPDATE orders SET status = ${status} WHERE id = ${orderId}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update order status error:", error);
    return NextResponse.json({ success: false, error: "Failed to update order" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!isAdminAuthorized(req)) return unauthorizedResponse();
  try {
    await initDbTables();
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");
    if (!orderId) {
      return NextResponse.json({ success: false, error: "Missing orderId" }, { status: 400 });
    }
    if (orderId === "all") {
      await sql`DELETE FROM orders`;
      return NextResponse.json({ success: true, message: "All orders deleted" });
    }
    await sql`DELETE FROM orders WHERE id = ${orderId}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete order error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete order" }, { status: 500 });
  }
}
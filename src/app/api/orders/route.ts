import { NextResponse } from "next/server";
import { sql, initDbTables } from "@/lib/db";
import { isAdminAuthorized, isCsrfProtectedRequest, isSameOrigin, unauthorizedResponse } from "@/lib/auth";
import { sendOrderEmailNotification } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";
import { WILAYAS } from "@/data/wilayas";
import { logger } from "@/lib/logger";

async function autoCleanupCompletedOrders() {
  try {
    await sql`
      DELETE FROM orders 
      WHERE (status = 'shipped' OR status = 'cancelled') 
      AND created_at < NOW() - INTERVAL '48 hours'
    `;
  } catch (err) {
    logger.error("orders_cleanup_failed");
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
    logger.error("telegram_notification_failed");
  }
}

export async function GET(req: Request) {
  if (!isSameOrigin(req) || !isAdminAuthorized(req)) return unauthorizedResponse();
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
  const rate = checkRateLimit(req, { maxRequests: 15, windowMs: 60 * 1000 });
  if (!rate.allowed) {
    logger.warn("order_rate_limited", { retryAfterMs: rate.retryAfterMs });
    return NextResponse.json(
      { success: false, error: "Too many requests. Please wait a moment and try again." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rate.retryAfterMs ?? 0) / 1000)) } }
    );
  }

  try {
    await initDbTables();
    const body = await req.json();
    if (body.totalPrice !== undefined || body.deliveryPrice !== undefined || body.productTitle !== undefined || body.unitPrice !== undefined) {
      logger.warn("order_client_pricing_fields_ignored");
    }

    const requestedItems = Array.isArray(body.cartItems) && body.cartItems.length > 0
      ? body.cartItems
      : [{
          productId: body.productId,
          quantity: body.quantity,
          selectedSize: body.selectedSize,
          selectedColor: body.selectedColor,
        }];
    if (requestedItems.length > 20) {
      logger.warn("order_rejected", { reason: "too_many_items" });
      return NextResponse.json({ success: false, error: "عدد المنتجات في الطلب غير صالح" }, { status: 400 });
    }

    const items: Array<{ productId: string; quantity: number; selectedSize: string; selectedColor: string }> = requestedItems.map((item: any) => ({
      productId: typeof item?.productId === "string" ? item.productId.trim() : "",
      quantity: Number.isInteger(Number(item?.quantity)) ? Math.max(1, Math.min(20, Number(item.quantity))) : 0,
      selectedSize: typeof item?.selectedSize === "string" ? item.selectedSize.trim().slice(0, 50) : "",
      selectedColor: typeof item?.selectedColor === "string" ? item.selectedColor.trim().slice(0, 50) : "",
    }));
    if (items.some((item) => !item.productId || item.quantity < 1) || items.reduce((sum, item) => sum + item.quantity, 0) > 20) {
      logger.warn("order_rejected", { reason: "invalid_items" });
      return NextResponse.json({ success: false, error: "بيانات المنتجات أو الكمية غير صالحة" }, { status: 400 });
    }
    const fullName = (String(body.fullName || "").trim()).slice(0, 120);
    let phone = (String(body.phone || "").trim()).replace(/[\s\-\.\(\)]/g, "");
    if (phone.startsWith("+213")) {
      phone = "0" + phone.slice(4);
    } else if (phone.startsWith("00213")) {
      phone = "0" + phone.slice(5);
    } else if (phone.startsWith("213") && phone.length === 11) {
      phone = "0" + phone.slice(3);
    }
    const wilayaCode = typeof body.wilayaCode === "string" ? body.wilayaCode.trim() : "";
    const wilaya = WILAYAS.find((item) => item.code === wilayaCode);
    const wilayaName = wilaya?.name || "";
    const requestedCommune = typeof body.commune === "string" ? body.commune.trim() : "";
    const commune = wilaya?.communes.includes(requestedCommune) ? requestedCommune : (wilaya?.communes[0] || "");
    const deliveryType = body.deliveryType === "desk" ? "desk" : "home";
    const deliveryPrice = wilaya ? (deliveryType === "home" ? wilaya.homeDelivery : wilaya.deskDelivery) : 0;

    if (!fullName || !phone || !wilaya) {
      logger.warn("order_rejected", { reason: "invalid_customer_or_zone" });
      return NextResponse.json(
        { success: false, error: "بيانات ناقصة - يرجى إدخال الاسم ورقم الهاتف والولاية" },
        { status: 400 }
      );
    }
    if (!/^0[5-7]\d{8}$/.test(phone)) {
      logger.warn("order_rejected", { reason: "invalid_phone" });
      return NextResponse.json(
        { success: false, error: "رقم الهاتف غير صحيح! يرجى إدخال رقم جزائري يبدأ بـ 05 أو 06 أو 07 ويتكون من 10 أرقام (مثلاً: 0555123456)" },
        { status: 400 }
      );
    }

    const productIds = [...new Set(items.map((item) => item.productId))];
    const productRows = await sql`
      SELECT id, name, price::float as price, sizes, colors, in_stock, is_deleted
      FROM products
      WHERE id = ANY(${productIds})
    `;
    if (productRows.length !== productIds.length) {
      logger.warn("order_rejected", { reason: "unknown_product" });
      return NextResponse.json({ success: false, error: "أحد المنتجات غير موجود" }, { status: 400 });
    }

    const productsById = new Map(productRows.map((product) => [product.id, product]));
    const pricedItems = items.map((item) => {
      const product = productsById.get(item.productId);
      if (!product || product.is_deleted || product.in_stock === false) return null;
      if (item.selectedSize && Array.isArray(product.sizes) && !product.sizes.includes(item.selectedSize)) return null;
      if (item.selectedColor && Array.isArray(product.colors) && !product.colors.includes(item.selectedColor)) return null;
      return { ...item, product };
    });
    if (pricedItems.some((item) => !item)) {
      logger.warn("order_rejected", { reason: "unavailable_product_or_option" });
      return NextResponse.json({ success: false, error: "أحد المنتجات أو خياراته غير متوفر" }, { status: 400 });
    }

    const validItems = pricedItems as Array<{ productId: string; quantity: number; selectedSize: string; selectedColor: string; product: any }>;
    const productTitle = validItems.map((item) => `${item.product.name} (${item.selectedSize || "M"}) ×${item.quantity}`).join(" + ").slice(0, 200);
    const itemsTotal = validItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const promoCode = typeof body.promoCode === "string" ? body.promoCode.trim().toUpperCase() : "";
    const discount = ["AB10", "DZ10", "JWI10"].includes(promoCode)
      ? Math.round(itemsTotal * 0.1)
      : promoCode === "PROMO500" ? 500 : 0;
    const totalPrice = Math.max(0, itemsTotal - discount + deliveryPrice);
    const productId = validItems[0].productId;
    const selectedSize = validItems[0].selectedSize || "M";
    const selectedColor = validItems[0].selectedColor;
    const quantity = validItems.reduce((sum, item) => sum + item.quantity, 0);

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
      logger.error("email_notification_failed");
    }

    // Trigger instant Telegram notification to phone if configured
    sendTelegramNotification({ id, fullName, phone, wilayaName, commune, productTitle, deliveryType, deliveryPrice, totalPrice });

    return NextResponse.json({ success: true, order: { id, fullName, totalPrice } });
  } catch (error) {
    logger.error("order_creation_failed");
    return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  if (!isSameOrigin(req) || !isAdminAuthorized(req) || !isCsrfProtectedRequest(req)) return unauthorizedResponse();
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
  if (!isSameOrigin(req) || !isAdminAuthorized(req) || !isCsrfProtectedRequest(req)) return unauthorizedResponse();
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
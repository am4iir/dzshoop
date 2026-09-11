import nodemailer from "nodemailer";

export interface OrderNotificationData {
  id: string;
  fullName: string;
  phone: string;
  wilayaName: string;
  commune: string;
  productTitle: string;
  selectedSize?: string;
  selectedColor?: string;
  quantity: number;
  deliveryType: string;
  deliveryPrice: number;
  totalPrice: number;
}

export async function sendOrderEmailNotification(order: OrderNotificationData) {
  const emailUser = process.env.EMAIL_USER || "axbwear@gmail.com";
  const emailPass = process.env.EMAIL_PASS; // Google App Password (mot de passe d'application)
  const targetEmail = process.env.ADMIN_EMAIL || "axbwear@gmail.com";

  // If EMAIL_PASS is not yet configured, log and exit safely without throwing
  if (!emailPass) {
    console.log(`[Email Notification] EMAIL_PASS not set. Order #${order.id} notification queued for ${targetEmail}.`);
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    const cleanPhone = order.phone.replace(/\D/g, "").replace(/^0/, "213");
    const waText = encodeURIComponent(
      `السلام عليكم ${order.fullName}، معك متجر axb.wear بخصوص طلبيتك رقم ${order.id} (${order.productTitle}) بمبلغ ${order.totalPrice} دج. هل أنت متفرغ لتأكيد الشحن؟`
    );
    const waLink = `https://wa.me/${cleanPhone}?text=${waText}`;

    const htmlContent = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 20px; color: #18181b; }
    .container { max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e4e4e7; }
    .header { background-color: #09090b; padding: 30px 24px; text-align: center; color: #ffffff; }
    .logo { font-size: 24px; font-weight: 900; font-family: monospace; letter-spacing: 2px; }
    .logo span { color: #fbbf24; }
    .badge { display: inline-block; background: rgba(251, 191, 36, 0.15); border: 1px solid rgba(251, 191, 36, 0.3); color: #fbbf24; padding: 4px 12px; border-radius: 999px; font-size: 11px; font-weight: bold; margin-top: 8px; }
    .content { padding: 28px 24px; }
    .order-title { font-size: 18px; font-weight: 800; margin-bottom: 20px; text-align: center; color: #09090b; }
    .info-card { background-color: #f8fafc; border-radius: 16px; padding: 16px 20px; margin-bottom: 16px; border: 1px solid #e2e8f0; }
    .row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 13px; }
    .row:last-child { margin-bottom: 0; }
    .label { color: #64748b; font-weight: 500; }
    .value { color: #0f172a; font-weight: 700; }
    .total-row { border-top: 2px dashed #cbd5e1; padding-top: 12px; margin-top: 12px; font-size: 16px; }
    .total-price { color: #16a34a; font-weight: 900; }
    .buttons { display: flex; gap: 10px; margin-top: 24px; flex-wrap: wrap; }
    .btn { flex: 1; min-width: 140px; padding: 12px; text-align: center; border-radius: 12px; font-size: 12px; font-weight: 800; text-decoration: none; display: inline-block; }
    .btn-phone { background-color: #09090b; color: #ffffff !important; }
    .btn-wa { background-color: #16a34a; color: #ffffff !important; }
    .btn-admin { background-color: #f4f4f5; color: #18181b !important; border: 1px solid #d4d4d8; }
    .footer { text-align: center; font-size: 11px; color: #a1a1aa; padding: 20px; background-color: #fafafa; border-top: 1px solid #f4f4f5; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">axb<span>.wear</span></div>
      <div class="badge">🛍️ طلبية جديدة في المتجر!</div>
    </div>

    <div class="content">
      <div class="order-title">وصلتك طلبية جديدة برقم: <span style="color:#09090b; font-family: monospace;">${order.id}</span></div>

      <!-- Customer Info -->
      <div class="info-card">
        <div style="font-weight: 800; font-size: 13px; margin-bottom: 10px; color: #334155;">👤 معلومات الزبون:</div>
        <div class="row">
          <span class="label">الاسم الكامل:</span>
          <span class="value">${order.fullName}</span>
        </div>
        <div class="row">
          <span class="label">رقم الهاتف:</span>
          <span class="value" dir="ltr">${order.phone}</span>
        </div>
        <div class="row">
          <span class="label">العنوان والولاية:</span>
          <span class="value">${order.wilayaName} - ${order.commune}</span>
        </div>
        <div class="row">
          <span class="label">نوع التوصيل:</span>
          <span class="value">${order.deliveryType === "home" ? "توصيل للمنزل 🏠" : "استلام من المكتب 🏢"}</span>
        </div>
      </div>

      <!-- Product Info -->
      <div class="info-card">
        <div style="font-weight: 800; font-size: 13px; margin-bottom: 10px; color: #334155;">📦 تفاصيل السلعة:</div>
        <div class="row">
          <span class="label">المنتج:</span>
          <span class="value">${order.productTitle}</span>
        </div>
        <div class="row">
          <span class="label">المقاس / اللون:</span>
          <span class="value">${order.selectedSize || "قياسي"}${order.selectedColor ? " / " + order.selectedColor : ""}</span>
        </div>
        <div class="row">
          <span class="label">الكمية:</span>
          <span class="value">${order.quantity} قطعة</span>
        </div>
        <div class="row">
          <span class="label">سعر التوصيل:</span>
          <span class="value">${order.deliveryPrice} دج</span>
        </div>
        <div class="row total-row">
          <span class="label" style="font-weight: 800; color: #09090b;">المبلغ الكلي عند الاستلام:</span>
          <span class="total-price">${order.totalPrice} دج</span>
        </div>
      </div>

      <!-- Quick Actions -->
      <div style="text-align: center; margin-top: 20px;">
        <div style="font-size: 12px; font-weight: 700; margin-bottom: 10px; color: #64748b;">إجراءات سريعة لتأكيد الشحن:</div>
        <div class="buttons">
          <a href="tel:${order.phone}" class="btn btn-phone">📞 اتصل بالزبون</a>
          <a href="${waLink}" target="_blank" class="btn btn-wa">💬 محادثة واتساب</a>
          <a href="https://abx-wear.vercel.app/admin" target="_blank" class="btn btn-admin">⚙️ لوحة الأدمن</a>
        </div>
      </div>
    </div>

    <div class="footer">
      متجر axb.wear • إشعار تلقائي بالطلبات الجديدة<br>
      © 2026 axb.wear • barae × amir
    </div>
  </div>
</body>
</html>
    `;

    await transporter.sendMail({
      from: `"axb.wear Store" <${emailUser}>`,
      to: targetEmail,
      subject: `🛍️ طلبية جديدة في axb.wear! (#${order.id}) - ${order.fullName} - ${order.totalPrice} دج`,
      text: `وصلتك طلبية جديدة رقم ${order.id} من ${order.fullName} (${order.phone}) - المنتج: ${order.productTitle} - المبلغ: ${order.totalPrice} دج.`,
      html: htmlContent,
    });

    console.log(`[Email Notification] Successfully sent order #${order.id} notification to ${targetEmail}`);
    return true;
  } catch (error) {
    console.error("[Email Notification] Failed to send email notification:", error);
    return false;
  }
}
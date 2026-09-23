import nodemailer from "nodemailer";
import { logger } from "@/lib/logger";
import { ClientDetails } from "@/lib/geo";

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

export interface AdminSecurityAlertData {
  eventType: "PAGE_VISITED" | "LOGIN_FAILED" | "LOGIN_SUCCESS";
  client: ClientDetails;
  attemptedPasscode?: string;
  timestamp: string;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] || character);
}

function getTransporter() {
  const emailUser = process.env.EMAIL_USER || "barae213xp@gmail.com";
  const emailPass = process.env.EMAIL_PASS || "";

  if (!emailUser || !emailPass) {
    return null;
  }

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: emailUser,
      pass: emailPass.replace(/\s+/g, ""),
    },
  });
}

/**
 * 🛍️ Send new order email notification to Barae
 */
export async function sendOrderEmailNotification(order: OrderNotificationData) {
  const emailUser = process.env.EMAIL_USER || "barae213xp@gmail.com";
  const targetEmail = process.env.ADMIN_EMAIL || "barae213xp@gmail.com";
  const transporter = getTransporter();

  if (!transporter) {
    logger.warn("email_disabled_missing_configuration");
    return false;
  }

  try {
    const cleanPhone = order.phone.replace(/\D/g, "").replace(/^0/, "213");
    const htmlOrder = {
      id: escapeHtml(order.id),
      fullName: escapeHtml(order.fullName),
      phone: escapeHtml(order.phone),
      wilayaName: escapeHtml(order.wilayaName),
      commune: escapeHtml(order.commune),
      productTitle: escapeHtml(order.productTitle),
      selectedSize: escapeHtml(order.selectedSize || "قياسي"),
      selectedColor: escapeHtml(order.selectedColor || ""),
    };
    const waText = encodeURIComponent(
      `السلام عليكم ${order.fullName}، معك متجر bx.wear.dz بخصوص طلبيتك رقم ${order.id} (${order.productTitle}) بمبلغ ${order.totalPrice} دج. هل أنت متفرغ لتأكيد الشحن؟`
    );
    const waLink = `https://wa.me/${cleanPhone}?text=${waText}`;

    const htmlContent = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #09090b; margin: 0; padding: 20px; color: #18181b; }
    .container { max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.3); border: 1px solid #27272a; }
    .header { background: linear-gradient(135deg, #09090b 0%, #18181b 100%); padding: 32px 24px; text-align: center; color: #ffffff; border-bottom: 2px solid #fbbf24; }
    .logo { font-size: 26px; font-weight: 900; font-family: monospace; letter-spacing: 2px; }
    .logo span { color: #fbbf24; }
    .badge { display: inline-block; background: rgba(251, 191, 36, 0.15); border: 1px solid rgba(251, 191, 36, 0.4); color: #fbbf24; padding: 6px 14px; border-radius: 999px; font-size: 12px; font-weight: 800; margin-top: 10px; }
    .content { padding: 28px 24px; }
    .order-title { font-size: 19px; font-weight: 900; margin-bottom: 20px; text-align: center; color: #09090b; }
    .info-card { background-color: #f8fafc; border-radius: 16px; padding: 18px 20px; margin-bottom: 16px; border: 1px solid #e2e8f0; }
    .row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 13px; }
    .row:last-child { margin-bottom: 0; }
    .label { color: #64748b; font-weight: 600; }
    .value { color: #0f172a; font-weight: 800; }
    .total-row { border-top: 2px dashed #cbd5e1; padding-top: 12px; margin-top: 12px; font-size: 16px; }
    .total-price { color: #16a34a; font-weight: 900; }
    .buttons { display: flex; gap: 10px; margin-top: 24px; flex-wrap: wrap; }
    .btn { flex: 1; min-width: 140px; padding: 14px; text-align: center; border-radius: 12px; font-size: 13px; font-weight: 800; text-decoration: none; display: inline-block; }
    .btn-phone { background-color: #09090b; color: #ffffff !important; }
    .btn-wa { background-color: #16a34a; color: #ffffff !important; }
    .btn-admin { background-color: #f4f4f5; color: #18181b !important; border: 1px solid #d4d4d8; }
    .footer { text-align: center; font-size: 11px; color: #71717a; padding: 20px; background-color: #f4f4f5; border-top: 1px solid #e4e4e7; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">bx<span>.wear.dz</span></div>
      <div class="badge">🛍️ طلبيـة جديدة في المتجر!</div>
    </div>

    <div class="content">
      <div class="order-title">وصلتك طلبية جديدة برقم: <span style="color:#09090b; font-family: monospace; background:#fef3c7; padding:2px 8px; border-radius:6px;">${htmlOrder.id}</span></div>

      <!-- Customer Info -->
      <div class="info-card">
        <div style="font-weight: 900; font-size: 14px; margin-bottom: 12px; color: #0f172a;">👤 معلومات الزبون:</div>
        <div class="row">
          <span class="label">الاسم الكامل:</span>
          <span class="value">${htmlOrder.fullName}</span>
        </div>
        <div class="row">
          <span class="label">رقم الهاتف:</span>
          <span class="value" dir="ltr" style="font-family: monospace; font-size: 14px;">${htmlOrder.phone}</span>
        </div>
        <div class="row">
          <span class="label">الولاية والبلدية:</span>
          <span class="value">${htmlOrder.wilayaName} - ${htmlOrder.commune}</span>
        </div>
        <div class="row">
          <span class="label">نوع التوصيل:</span>
          <span class="value">${order.deliveryType === "home" ? "توصيل للمنزل 🏠" : "استلام من المكتب 🏢"}</span>
        </div>
      </div>

      <!-- Product Info -->
      <div class="info-card">
        <div style="font-weight: 900; font-size: 14px; margin-bottom: 12px; color: #0f172a;">📦 تفاصيل السلعة:</div>
        <div class="row">
          <span class="label">المنتج:</span>
          <span class="value">${htmlOrder.productTitle}</span>
        </div>
        <div class="row">
          <span class="label">المقاس / اللون:</span>
          <span class="value">${htmlOrder.selectedSize}${htmlOrder.selectedColor ? " / " + htmlOrder.selectedColor : ""}</span>
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
          <span class="label" style="font-weight: 900; color: #09090b; font-size: 15px;">المبلغ الإجمالي عند الاستلام:</span>
          <span class="total-price" style="font-size: 18px;">${order.totalPrice} دج</span>
        </div>
      </div>

      <!-- Quick Actions -->
      <div style="text-align: center; margin-top: 24px;">
        <div style="font-size: 12px; font-weight: 700; margin-bottom: 12px; color: #64748b;">إجراءات سريعة لتأكيد الشحن:</div>
        <div class="buttons">
          <a href="tel:${encodeURIComponent(order.phone)}" class="btn btn-phone">📞 اتصل بالزبون</a>
          <a href="${waLink}" target="_blank" class="btn btn-wa">💬 محادثة واتساب</a>
          <a href="https://bx-wear-dz.vercel.app/brx-panel-ctrl-7k4m" target="_blank" class="btn btn-admin">⚙️ لوحة الأدمن</a>
        </div>
      </div>
    </div>

    <div class="footer">
      متجر bx.wear.dz • إشعار فوري بالطلبيات<br>
      © 2026 bx.wear.dz • barae
    </div>
  </div>
</body>
</html>
    `;

    await transporter.sendMail({
      from: `"bx.wear.dz Store" <${emailUser}>`,
      to: targetEmail,
      subject: `🛍️ طلبية جديدة في bx.wear.dz! (#${order.id}) - ${order.fullName} - ${order.totalPrice} دج`,
      text: `وصلتك طلبية جديدة رقم ${order.id} من ${order.fullName} (${order.phone}) - السلعة: ${order.productTitle} - المبلغ الإجمالي: ${order.totalPrice} دج.`,
      html: htmlContent,
    });

    logger.info("email_notification_sent", { orderId: order.id });
    return true;
  } catch (error) {
    logger.error("email_notification_failed", { orderId: order.id });
    return false;
  }
}

/**
 * 🚨 Send Admin Security Alert (Page Visit / Failed Login / Successful Login)
 */
export async function sendAdminSecurityAlertEmail(alert: AdminSecurityAlertData) {
  const emailUser = process.env.EMAIL_USER || "barae213xp@gmail.com";
  const targetEmail = process.env.ADMIN_EMAIL || "barae213xp@gmail.com";
  const transporter = getTransporter();

  if (!transporter) {
    logger.warn("admin_alert_email_disabled_missing_configuration");
    return false;
  }

  const { eventType, client, timestamp, attemptedPasscode } = alert;

  let headerColor = "#09090b";
  let badgeText = "";
  let badgeColor = "#fbbf24";
  let badgeBg = "rgba(251, 191, 36, 0.15)";
  let subject = "";
  let alertTitle = "";
  let alertMessage = "";

  if (eventType === "PAGE_VISITED") {
    headerColor = "#18181b";
    badgeText = "🚨 زائر فتح صفحة الأدمن!";
    badgeColor = "#f59e0b";
    badgeBg = "rgba(245, 158, 11, 0.15)";
    subject = `🚨 تنبيه أمني: شخص فتح صفحة الأدمن - ${client.location} (${client.deviceModel})`;
    alertTitle = "تم رصد شخص قام بفتح صفحة تسجيل الدخول للأدمن!";
    alertMessage = "قام شخص بالدخول إلى رابط لوحة الإدارة السري الخاص بك. إليك التفاصيل الكاملة لجهازه وموقعه:";
  } else if (eventType === "LOGIN_FAILED") {
    headerColor = "#450a0a";
    badgeText = "❌ محاولة فاشلة لكلمة السر!";
    badgeColor = "#ef4444";
    badgeBg = "rgba(239, 68, 68, 0.15)";
    subject = `❌ تحذير أمني: محاولة فاشلة لدخول الأدمن - ${client.location} (${client.ip})`;
    alertTitle = "تحذير: محاولة فاشلة للدخول بكلمة سر غير صحيحة!";
    alertMessage = "قام شخص بمحاولة إدخال كلمة سر خاطئة في لوحة الإدارة الخاصة بك. يرجى الحذر:";
  } else {
    headerColor = "#064e3b";
    badgeText = "✅ تسجيل دخول ناجح للأدمن";
    badgeColor = "#10b981";
    badgeBg = "rgba(16, 185, 129, 0.15)";
    subject = `✅ تسجيل دخول ناجح إلى الأدمن - ${client.location} (${client.deviceModel})`;
    alertTitle = "تم تسجيل الدخول بنجاح إلى لوحة التحكم!";
    alertMessage = "تم التحقق من كلمة السر بنجاح وتسجيل جلسة دخول جديدة للوحة التحكم:";
  }

  const htmlContent = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #09090b; margin: 0; padding: 20px; color: #18181b; }
    .container { max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.3); border: 1px solid #27272a; }
    .header { background-color: ${headerColor}; padding: 30px 24px; text-align: center; color: #ffffff; }
    .logo { font-size: 24px; font-weight: 900; font-family: monospace; letter-spacing: 2px; }
    .logo span { color: #fbbf24; }
    .badge { display: inline-block; background: ${badgeBg}; border: 1px solid ${badgeColor}; color: ${badgeColor}; padding: 6px 14px; border-radius: 999px; font-size: 13px; font-weight: 800; margin-top: 10px; }
    .content { padding: 28px 24px; }
    .title { font-size: 17px; font-weight: 900; margin-bottom: 12px; text-align: center; color: #09090b; }
    .desc { font-size: 13px; color: #64748b; text-align: center; margin-bottom: 20px; line-height: 1.6; }
    .card { background-color: #f8fafc; border-radius: 16px; padding: 18px 20px; margin-bottom: 16px; border: 1px solid #e2e8f0; }
    .row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 13px; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px; }
    .row:last-child { margin-bottom: 0; border-bottom: none; padding-bottom: 0; }
    .label { color: #64748b; font-weight: 600; }
    .value { color: #0f172a; font-weight: 800; }
    .footer { text-align: center; font-size: 11px; color: #71717a; padding: 20px; background-color: #f4f4f5; border-top: 1px solid #e4e4e7; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">bx<span>.wear.dz</span></div>
      <div class="badge">${badgeText}</div>
    </div>

    <div class="content">
      <div class="title">${alertTitle}</div>
      <div class="desc">${alertMessage}</div>

      <div class="card">
        <div class="row">
          <span class="label">🌐 عنوان الآيبي (IP):</span>
          <span class="value" dir="ltr" style="font-family: monospace; font-size: 14px; color: #2563eb;">${escapeHtml(client.ip)}</span>
        </div>
        <div class="row">
          <span class="label">📍 الموقع / البلاصة:</span>
          <span class="value" style="color: #059669;">${escapeHtml(client.location)}</span>
        </div>
        <div class="row">
          <span class="label">💻 نوع الجهاز:</span>
          <span class="value">${escapeHtml(client.deviceModel)} (${client.deviceType})</span>
        </div>
        <div class="row">
          <span class="label">⚙️ نظام التشغيل:</span>
          <span class="value">${escapeHtml(client.operatingSystem)}</span>
        </div>
        <div class="row">
          <span class="label">🌍 المتصفح (Browser):</span>
          <span class="value">${escapeHtml(client.browser)}</span>
        </div>
        <div class="row">
          <span class="label">⏰ التوقيت والتاريخ:</span>
          <span class="value" dir="ltr" style="font-family: monospace;">${escapeHtml(timestamp)}</span>
        </div>
        ${
          attemptedPasscode
            ? `<div class="row" style="background:#fee2e2; padding:8px 12px; border-radius:8px;">
                <span class="label" style="color:#b91c1c;">🔑 كلمة السر التي جربها:</span>
                <span class="value" style="color:#b91c1c; font-family: monospace;">${escapeHtml(attemptedPasscode.slice(0, 3) + "***")}</span>
              </div>`
            : ""
        }
      </div>

      <div style="text-align: center; margin-top: 20px;">
        <a href="https://bx-wear-dz.vercel.app/brx-panel-ctrl-7k4m" target="_blank" style="display:inline-block; padding:12px 24px; background:#09090b; color:#ffffff !important; border-radius:12px; font-size:13px; font-weight:800; text-decoration:none;">
          🔐 فحص لوحة التحكم الآن
        </a>
      </div>
    </div>

    <div class="footer">
      نظام الأمان الذكي • متجر bx.wear.dz<br>
      © 2026 bx.wear.dz • barae
    </div>
  </div>
</body>
</html>
  `;

  try {
    await transporter.sendMail({
      from: `"bx.wear.dz Security" <${emailUser}>`,
      to: targetEmail,
      subject,
      text: `${alertTitle}\nIP: ${client.ip}\nLocation: ${client.location}\nDevice: ${client.deviceModel}\nOS: ${client.operatingSystem}\nBrowser: ${client.browser}\nTime: ${timestamp}`,
      html: htmlContent,
    });

    logger.info("admin_security_alert_email_sent", { eventType, ip: client.ip });
    return true;
  } catch (error) {
    logger.error("admin_security_alert_email_failed", {
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return false;
  }
}
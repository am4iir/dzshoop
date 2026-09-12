"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { useCart } from "@/components/CartContext";
import { WILAYAS } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { CheckCircle2, ShoppingBag, ArrowLeft, MapPin, Phone, User, Tag, Check } from "lucide-react";
import confetti from "canvas-confetti";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [wilayaCode, setWilayaCode] = useState("16");
  const [commune, setCommune] = useState("الجزائر الوسطى");
  const [deliveryType, setDeliveryType] = useState<"home" | "desk">("home");

  // Hydrate checkout fields from localStorage across refreshes
  useEffect(() => {
    try {
      const saved = localStorage.getItem("axb_checkout_data");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.fullName) setFullName(parsed.fullName);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.wilayaCode) setWilayaCode(parsed.wilayaCode);
        if (parsed.commune) setCommune(parsed.commune);
        if (parsed.deliveryType) setDeliveryType(parsed.deliveryType);
      }
    } catch (e) {}
  }, []);

  // Persist checkout fields to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("axb_checkout_data", JSON.stringify({
        fullName,
        phone,
        wilayaCode,
        commune,
        deliveryType
      }));
    } catch (e) {}
  }, [fullName, phone, wilayaCode, commune, deliveryType]);

  // Promo Code State
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);
  const [promoError, setPromoError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderId, setOrderId] = useState("");

  // Hydrate confirmed order from sessionStorage across refreshes
  useEffect(() => {
    try {
      const savedOrder = sessionStorage.getItem("axb_confirmed_checkout_order");
      if (savedOrder) {
        const parsed = JSON.parse(savedOrder);
        if (parsed.orderId) {
          setOrderId(parsed.orderId);
          setOrderConfirmed(true);
        }
      }
    } catch (e) {}
  }, []);

  const currentWilaya = WILAYAS.find((w) => w.code === wilayaCode) || WILAYAS[0];
  const deliveryCost = deliveryType === "home" ? currentWilaya.homeDelivery : currentWilaya.deskDelivery;

  const discountAmount = appliedPromo ? appliedPromo.discount : 0;
  const grandTotal = Math.max(0, totalPrice - discountAmount + deliveryCost);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError("");
    const cleanCode = promoInput.trim().toUpperCase();

    if (!cleanCode) return;

    if (cleanCode === "AB10" || cleanCode === "DZ10" || cleanCode === "JWI10") {
      const disc = Math.round(totalPrice * 0.1);
      setAppliedPromo({ code: cleanCode, discount: disc });
    } else if (cleanCode === "PROMO500") {
      setAppliedPromo({ code: cleanCode, discount: 500 });
    } else {
      setPromoError("كود التخفيض غير صالح أو منتهي الصلاحية");
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      alert("يرجى إدخال الاسم الكامل لإكمال الطلب");
      return;
    }

    let cleanPhone = phone.trim().replace(/[\s\-\.\(\)]/g, "");
    if (cleanPhone.startsWith("+213")) cleanPhone = "0" + cleanPhone.slice(4);
    else if (cleanPhone.startsWith("00213")) cleanPhone = "0" + cleanPhone.slice(5);
    else if (cleanPhone.startsWith("213") && cleanPhone.length === 11) cleanPhone = "0" + cleanPhone.slice(3);

    if (!cleanPhone || !/^0[5-7]\d{8}$/.test(cleanPhone)) {
      alert("رقم الهاتف غير صحيح! يرجى إدخال رقم هاتف جزائري يبدأ بـ 05 أو 06 أو 07 مكون من 10 أرقام (مثال: 0555123456)");
      return;
    }

    if (items.length === 0) {
      alert("سلتك فارغة! يرجى إضافة منتجات قبل إتمام الطلب");
      return;
    }

    setIsSubmitting(true);

    try {
      const summaryTitle = items.map((i) => `${i.productName} (${i.selectedSize || "M"}) ×${i.quantity}`).join(" + ");

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productTitle: summaryTitle + (appliedPromo ? ` [خصم ${appliedPromo.code}]` : ""),
          productId: items[0]?.productId || "",
          selectedSize: items[0]?.selectedSize || "",
          selectedColor: items[0]?.selectedColor || "",
          quantity: items.reduce((sum, i) => sum + i.quantity, 0),
          fullName: fullName.trim(),
          phone: cleanPhone,
          wilayaName: currentWilaya.name,
          commune: commune || currentWilaya.communes[0] || "",
          deliveryType,
          deliveryPrice: deliveryCost,
          totalPrice: grandTotal,
          cartItems: items,
        }),
      });

      const data = await res.json();
      setIsSubmitting(false);

      if (data.success) {
        setOrderId(data.order.id);
        setOrderConfirmed(true);
        clearCart();
        try {
          sessionStorage.setItem("axb_confirmed_checkout_order", JSON.stringify({ orderId: data.order.id }));
        } catch (e) {}
        try {
          localStorage.removeItem("axb_checkout_data");
        } catch (e) {}

        try {
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        } catch (e) {}
      } else {
        alert(data.error || "حدث خطأ أثناء حفظ الطلب. يرجى المحاولة ثانية");
      }
    } catch (err) {
      setIsSubmitting(false);
      alert("حدث خطأ في الاتصال، يرجى المحاولة ثانية");
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-20 transition-colors duration-200" dir="rtl">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-8">
        {orderConfirmed ? (
          <div className="max-w-md mx-auto bg-white dark:bg-zinc-900 border border-emerald-200 dark:border-emerald-800 rounded-3xl p-8 text-center shadow-xl">
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-zinc-900 dark:text-white mb-1">تم إرسال طلبك بنجاح!</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6">
              رقم الطلبية: <span className="font-bold text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded font-mono">{orderId}</span>
              <br />سنتصل بك هاتفياً لتأكيد الشحن فوراً.
            </p>

            <div className="bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-700/60 rounded-2xl p-4 text-xs space-y-2 text-right mb-6">
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">الاسم:</span>
                <span className="font-bold text-zinc-900 dark:text-white">{fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">رقم الهاتف:</span>
                <span className="font-bold text-zinc-900 dark:text-white" dir="ltr">{phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">العنوان:</span>
                <span className="font-bold text-zinc-900 dark:text-white">{currentWilaya.name} - {commune}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-zinc-200 dark:border-zinc-700 font-extrabold text-sm text-zinc-900 dark:text-white">
                <span>المبلغ الكلي عند الاستلام:</span>
                <span className="text-emerald-600 dark:text-emerald-400">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <Link
              href="/"
              onClick={() => {
                try {
                  sessionStorage.removeItem("axb_confirmed_checkout_order");
                } catch (e) {}
              }}
              className="inline-flex items-center gap-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 px-5 py-2.5 rounded-xl transition cursor-pointer"
            >
              العودة للرئيسية
            </Link>
          </div>
        ) : items.length === 0 ? (
          <div className="py-20 text-center max-w-md mx-auto">
            <ShoppingBag className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
            <h2 className="text-xl font-extrabold text-zinc-900 dark:text-white mb-2">سلتك فارغة</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6">يرجى إضافة منتجات إلى السلة قبل الدخول لصفحة التأكيد</p>
            <Link
              href="/"
              className="inline-flex items-center justify-center bg-zinc-900 dark:bg-amber-400 text-white dark:text-zinc-950 font-bold px-6 py-3 rounded-xl text-xs hover:bg-black dark:hover:bg-amber-300 transition"
            >
              تصفح الكوليكشن
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form Column */}
            <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-black text-zinc-900 dark:text-white mb-6">معلومات التوصيل والاستلام</h2>

              <form onSubmit={handleSubmitOrder} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1.5 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-zinc-400" /> الاسم الكامل *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="اسمك الكامل"
                    className="w-full bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 focus:border-zinc-900 dark:focus:border-amber-400 focus:bg-white dark:focus:bg-zinc-800 rounded-xl py-3 px-4 text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-zinc-400" /> رقم الهاتف *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="05 / 06 / 07 XX XX XX XX"
                    className="w-full bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 focus:border-zinc-900 dark:focus:border-amber-400 focus:bg-white dark:focus:bg-zinc-800 rounded-xl py-3 px-4 text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none transition text-right dir-ltr"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1.5 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-zinc-400" /> الولاية *
                    </label>
                    <select
                      value={wilayaCode}
                      onChange={(e) => {
                        const newCode = e.target.value;
                        setWilayaCode(newCode);
                        const w = WILAYAS.find((item) => item.code === newCode);
                        if (w && w.communes.length > 0) {
                          setCommune(w.communes[0]);
                        }
                      }}
                      className="w-full bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 focus:border-zinc-900 dark:focus:border-amber-400 focus:bg-white dark:focus:bg-zinc-800 rounded-xl py-3 px-3 text-xs text-zinc-900 dark:text-white outline-none transition cursor-pointer"
                    >
                      {WILAYAS.map((w) => (
                        <option key={w.code} value={w.code} className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
                          {w.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1.5">البلدية *</label>
                    <select
                      value={commune}
                      onChange={(e) => setCommune(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 focus:border-zinc-900 dark:focus:border-amber-400 focus:bg-white dark:focus:bg-zinc-800 rounded-xl py-3 px-3 text-xs text-zinc-900 dark:text-white outline-none transition cursor-pointer"
                    >
                      {currentWilaya.communes.map((c) => (
                        <option key={c} value={c} className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Delivery Choice */}
                <div className="pt-3">
                  <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-2">طريقة التوصيل:</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDeliveryType("home")}
                      className={`p-3 rounded-xl border text-right transition-all cursor-pointer ${
                        deliveryType === "home"
                          ? "border-zinc-900 dark:border-white bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 shadow-sm"
                          : "border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-600"
                      }`}
                    >
                      <span className="text-xs font-bold block">توصيل للمنزل</span>
                      <span className="text-[11px] opacity-80 mt-0.5 block">
                        +{formatPrice(currentWilaya.homeDelivery)}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryType("desk")}
                      className={`p-3 rounded-xl border text-right transition-all cursor-pointer ${
                        deliveryType === "desk"
                          ? "border-zinc-900 dark:border-white bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 shadow-sm"
                          : "border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-600"
                      }`}
                    >
                      <span className="text-xs font-bold block">استلام من المكتب</span>
                      <span className="text-[11px] opacity-80 mt-0.5 block">
                        +{formatPrice(currentWilaya.deskDelivery)}
                      </span>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-zinc-950 dark:bg-amber-400 hover:bg-black dark:hover:bg-amber-300 text-white dark:text-zinc-950 font-extrabold py-4 px-6 rounded-xl text-sm transition shadow-md mt-6 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? "جاري تسجيل الطلب..." : "تأكيد الطلب الآن"}
                </button>
              </form>
            </div>

            {/* Cart Summary Column */}
            <div className="lg:col-span-5 bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4">
              <h2 className="text-base font-black text-zinc-900 dark:text-white pb-3 border-b border-zinc-100 dark:border-zinc-800">
                ملخص السلة ({items.length} منتجات)
              </h2>

              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {items.map((item, idx) => (
                  <div key={idx} className="flex gap-3 text-xs border-b border-zinc-100 dark:border-zinc-800 pb-3">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-14 h-16 object-cover rounded-lg bg-zinc-100 dark:bg-zinc-800 shrink-0"
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-zinc-900 dark:text-white">{item.productName}</h4>
                      <p className="text-zinc-500 dark:text-zinc-400 text-[11px]">
                        المقاس: {item.selectedSize} | الكمية: {item.quantity}
                      </p>
                      <p className="font-black text-zinc-900 dark:text-white mt-1">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code Input */}
              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="كود التخفيض (مثلاً AB10)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl py-2 px-3 pr-8 text-xs outline-none focus:border-zinc-900 dark:focus:border-amber-400 text-zinc-900 dark:text-white uppercase font-mono"
                    />
                    <Tag className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-2.5 pointer-events-none" />
                  </div>
                  <button
                    type="submit"
                    className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 px-4 py-2 rounded-xl text-xs font-bold hover:bg-black dark:hover:bg-zinc-200 transition cursor-pointer"
                  >
                    تطبيق
                  </button>
                </form>

                {appliedPromo && (
                  <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-lg border border-emerald-200 dark:border-emerald-800/60">
                    <Check className="w-3.5 h-3.5" />
                    <span>تم تطبيق الخصم ({appliedPromo.code}): -{formatPrice(appliedPromo.discount)}</span>
                  </div>
                )}

                {promoError && (
                  <p className="mt-1 text-[11px] text-red-500 font-medium">{promoError}</p>
                )}
              </div>

              <div className="space-y-2 pt-2 text-xs">
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>مجموع المنتجات</span>
                  <span className="font-bold text-zinc-900 dark:text-white">{formatPrice(totalPrice)}</span>
                </div>

                {appliedPromo && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                    <span>قيمة الخصم</span>
                    <span>-{formatPrice(appliedPromo.discount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>مصاريف التوصيل</span>
                  <span className="font-bold text-zinc-900 dark:text-white">{formatPrice(deliveryCost)}</span>
                </div>
                <div className="flex justify-between text-base font-black text-emerald-600 dark:text-emerald-400 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                  <span>المبلغ الإجمالي</span>
                  <span>{formatPrice(grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

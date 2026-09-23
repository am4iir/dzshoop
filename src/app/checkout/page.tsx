"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { useCart } from "@/components/CartContext";
import { useLanguage } from "@/components/LanguageContext";
import { WILAYAS } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { CheckCircle2, ShoppingBag, ArrowLeft, MapPin, Phone, User, Tag, Check, Copy } from "lucide-react";
import confetti from "canvas-confetti";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { t, dir, lang } = useLanguage();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [wilayaCode, setWilayaCode] = useState("16");
  const [commune, setCommune] = useState("الجزائر الوسطى");
  const [deliveryType, setDeliveryType] = useState<"home" | "desk">("home");
  const [copiedOrderId, setCopiedOrderId] = useState(false);

  const handleCopyOrderId = () => {
    if (!orderId) return;
    try {
      navigator.clipboard.writeText(orderId);
      setCopiedOrderId(true);
      setTimeout(() => setCopiedOrderId(false), 2000);
    } catch (e) {}
  };

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
          wilayaCode,
          commune: commune || currentWilaya.communes[0] || "",
          deliveryType,
          promoCode: appliedPromo?.code || "",
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
    <div className="min-h-screen bg-[#fafafa] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-20 transition-colors duration-200" dir={dir}>
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-8">
        {orderConfirmed ? (
          <div className="max-w-md mx-auto bg-white dark:bg-zinc-900 border border-emerald-200 dark:border-emerald-800 rounded-3xl p-8 text-center shadow-xl">
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-zinc-900 dark:text-white mb-2">{t("checkout", "confirmSuccess")}</h2>
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-xs text-zinc-500 dark:text-zinc-400">{t("checkout", "orderNumber")}</span>
              <span className="font-bold text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-lg font-mono text-sm border border-zinc-200 dark:border-zinc-700">
                {orderId}
              </span>
              <button
                type="button"
                onClick={handleCopyOrderId}
                className="text-[11px] font-bold text-violet-700 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/50 hover:bg-violet-100 dark:hover:bg-violet-900/60 border border-violet-200 dark:border-violet-800 px-2 py-1 rounded-lg transition flex items-center gap-1 cursor-pointer"
                title="نسخ رقم الطلبية"
              >
                {copiedOrderId ? <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedOrderId ? t("checkout", "copied") : t("checkout", "copyId")}</span>
              </button>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6">
              {t("checkout", "contactSoon")}
            </p>

            <div className={`bg-zinc-50 dark:bg-[#08080f] border border-zinc-100 dark:border-white/10 rounded-2xl p-4 text-xs space-y-2 ${dir === "rtl" ? "text-right" : "text-left"} mb-6`}>
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">{t("checkout", "fullName")}:</span>
                <span className="font-bold text-zinc-900 dark:text-white">{fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">{t("checkout", "phone")}:</span>
                <span className="font-bold text-zinc-900 dark:text-white" dir="ltr">{phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">{t("checkout", "wilaya")}:</span>
                <span className="font-bold text-zinc-900 dark:text-white">{currentWilaya.name} - {commune}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-zinc-200 dark:border-white/10 font-extrabold text-sm text-zinc-900 dark:text-white">
                <span>{t("checkout", "total")}:</span>
                <span className="text-violet-400">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <Link
              href="/"
              onClick={() => {
                try {
                  sessionStorage.removeItem("axb_confirmed_checkout_order");
                } catch (e) {}
              }}
              className="inline-flex items-center gap-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white border border-zinc-200 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-zinc-800 px-5 py-2.5 rounded-xl transition cursor-pointer"
            >
              {t("checkout", "backToStore")}
            </Link>
          </div>
        ) : items.length === 0 ? (
          <div className="py-20 text-center max-w-md mx-auto">
            <ShoppingBag className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
            <h2 className="text-xl font-extrabold text-zinc-900 dark:text-white mb-2">{t("checkout", "cartEmpty")}</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6">{t("checkout", "cartEmptyDesc")}</p>
            <Link
              href="/"
              className="inline-flex items-center justify-center bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold px-6 py-3 rounded-xl text-xs hover:from-violet-500 hover:to-indigo-500 transition shadow-lg shadow-violet-600/30"
            >
              {t("checkout", "backToStore")}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form Column */}
            <div className="lg:col-span-7 bg-white dark:bg-[#0c0d14] border border-zinc-200/90 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-black text-zinc-900 dark:text-white mb-6">{t("checkout", "title")}</h2>

              <form onSubmit={handleSubmitOrder} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1.5 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-zinc-400" /> {t("checkout", "fullName")}
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t("checkout", "fullName")}
                    className="w-full bg-zinc-50 dark:bg-[#07070a] border border-zinc-200 dark:border-white/10 focus:border-violet-500 focus:bg-white dark:focus:bg-[#07070a] rounded-xl py-3 px-4 text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-zinc-400" /> {t("checkout", "phone")}
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="05 / 06 / 07 XX XX XX XX"
                    className={`w-full bg-zinc-50 dark:bg-[#07070a] border border-zinc-200 dark:border-white/10 focus:border-violet-500 focus:bg-white dark:focus:bg-[#07070a] rounded-xl py-3 px-4 text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none transition ${dir === "rtl" ? "text-right" : "text-left"} dir-ltr`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1.5 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-zinc-400" /> {t("checkout", "wilaya")}
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
                      className="w-full bg-zinc-50 dark:bg-[#07070a] border border-zinc-200 dark:border-white/10 focus:border-violet-500 focus:bg-white dark:focus:bg-[#07070a] rounded-xl py-3 px-3 text-xs text-zinc-900 dark:text-white outline-none transition cursor-pointer"
                    >
                      {WILAYAS.map((w) => (
                        <option key={w.code} value={w.code} className="bg-white dark:bg-[#07070a] text-zinc-900 dark:text-white">
                          {w.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1.5">{t("checkout", "commune")}</label>
                    <select
                      value={commune}
                      onChange={(e) => setCommune(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-[#07070a] border border-zinc-200 dark:border-white/10 focus:border-violet-500 focus:bg-white dark:focus:bg-[#07070a] rounded-xl py-3 px-3 text-xs text-zinc-900 dark:text-white outline-none transition cursor-pointer"
                    >
                      {currentWilaya.communes.map((c) => (
                        <option key={c} value={c} className="bg-white dark:bg-[#07070a] text-zinc-900 dark:text-white">
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Delivery Choice */}
                <div className="pt-3">
                  <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-2">{t("checkout", "deliveryCost")}</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDeliveryType("home")}
                      className={`p-3 rounded-xl border ${dir === "rtl" ? "text-right" : "text-left"} transition-all cursor-pointer ${
                        deliveryType === "home"
                          ? "border-violet-500 bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/30"
                          : "border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-[#07070a] text-zinc-700 dark:text-zinc-300 hover:border-violet-500/40"
                      }`}
                    >
                      <span className="text-xs font-bold block">{t("checkout", "deliveryHome")}</span>
                      <span className="text-[11px] opacity-80 mt-0.5 block">
                        +{formatPrice(currentWilaya.homeDelivery)}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryType("desk")}
                      className={`p-3 rounded-xl border ${dir === "rtl" ? "text-right" : "text-left"} transition-all cursor-pointer ${
                        deliveryType === "desk"
                          ? "border-violet-500 bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/30"
                          : "border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-[#07070a] text-zinc-700 dark:text-zinc-300 hover:border-violet-500/40"
                      }`}
                    >
                      <span className="text-xs font-bold block">{t("checkout", "deliveryDesk")}</span>
                      <span className="text-[11px] opacity-80 mt-0.5 block">
                        +{formatPrice(currentWilaya.deskDelivery)}
                      </span>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-extrabold py-4 px-6 rounded-xl text-sm transition shadow-lg shadow-violet-600/30 mt-6 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? t("checkout", "processing") : t("checkout", "confirmOrder")}
                </button>
              </form>
            </div>

            {/* Cart Summary Column */}
            <div className="lg:col-span-5 bg-white dark:bg-[#0c0d14] border border-zinc-200/90 dark:border-white/10 rounded-3xl p-6 shadow-sm space-y-4">
              <h2 className="text-base font-black text-zinc-900 dark:text-white pb-3 border-b border-zinc-100 dark:border-white/10">
                {t("checkout", "orderSummary")} ({items.length})
              </h2>

              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {items.map((item, idx) => (
                  <div key={idx} className="flex gap-3 text-xs border-b border-zinc-100 dark:border-white/10 pb-3">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-14 h-16 object-cover rounded-lg bg-zinc-100 dark:bg-[#07070a] shrink-0"
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-zinc-900 dark:text-white">{item.productName}</h4>
                      <p className="text-zinc-500 dark:text-zinc-400 text-[11px]">
                        {item.selectedSize ? `${item.selectedSize} • ` : ""}x{item.quantity}
                      </p>
                      <p className="font-black text-zinc-900 dark:text-white mt-1">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code Input */}
              <div className="pt-2 border-t border-zinc-100 dark:border-white/10">
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder={t("checkout", "promoCode")}
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className={`w-full bg-zinc-50 dark:bg-[#07070a] border border-zinc-200 dark:border-white/10 rounded-xl py-2 px-3 ${dir === "rtl" ? "pr-8" : "pl-8"} text-xs outline-none focus:border-violet-500 dark:focus:border-violet-500 text-zinc-900 dark:text-white uppercase font-mono`}
                    />
                    <Tag className={`w-3.5 h-3.5 text-zinc-400 absolute ${dir === "rtl" ? "right-2.5" : "left-2.5"} top-2.5 pointer-events-none`} />
                  </div>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                  >
                    {t("checkout", "applyPromo")}
                  </button>
                </form>

                {appliedPromo && (
                  <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-lg border border-emerald-200 dark:border-emerald-800/60">
                    <Check className="w-3.5 h-3.5" />
                    <span>({appliedPromo.code}): -{formatPrice(appliedPromo.discount)}</span>
                  </div>
                )}

                {promoError && (
                  <p className="mt-1 text-[11px] text-red-500 font-medium">{promoError}</p>
                )}
              </div>

              <div className="space-y-2 pt-2 text-xs">
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>{t("checkout", "subtotal")}</span>
                  <span className="font-bold text-zinc-900 dark:text-white">{formatPrice(totalPrice)}</span>
                </div>

                {appliedPromo && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                    <span>{t("checkout", "discount")}</span>
                    <span>-{formatPrice(appliedPromo.discount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>{t("checkout", "deliveryCost")}</span>
                  <span className="font-bold text-zinc-900 dark:text-white">{formatPrice(deliveryCost)}</span>
                </div>
                <div className="flex justify-between text-base font-black text-emerald-600 dark:text-emerald-400 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                  <span>{t("checkout", "total")}</span>
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

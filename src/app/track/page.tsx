"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { useLanguage } from "@/components/LanguageContext";
import { formatPrice } from "@/lib/utils";
import {
  Search,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
  MapPin,
  ArrowRight,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";

interface TrackedOrder {
  id: string;
  productTitle: string;
  selectedSize?: string;
  selectedColor?: string;
  quantity: number;
  customerNameMasked: string;
  customerPhoneMasked: string;
  wilayaName: string;
  commune?: string;
  deliveryType: "home" | "desk";
  deliveryPrice: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "shipped" | "cancelled";
  createdAt: string;
}

export default function TrackOrderPage() {
  const { dir, lang } = useLanguage();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [orders, setOrders] = useState<TrackedOrder[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = query.trim();
    if (!clean) return;

    setLoading(true);
    setErrorMsg("");
    setSearched(true);

    try {
      const res = await fetch(`/api/track?q=${encodeURIComponent(clean)}`);
      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setOrders(data.orders || []);
        if ((data.orders || []).length === 0) {
          setErrorMsg(data.message || "لم يتم العثور على أي طلبية بهذا الرقم.");
        }
      } else {
        setErrorMsg(data.error || "حدث خطأ أثناء البحث، يرجى المحاولة ثانية.");
        setOrders([]);
      }
    } catch {
      setLoading(false);
      setErrorMsg("تعذر الاتصال بالسيرفر. يرجى التحقق من اتصالك بالإنترنت.");
      setOrders([]);
    }
  };

  const getStatusBadge = (status: TrackedOrder["status"]) => {
    switch (status) {
      case "pending":
        return {
          label: lang === "ar" ? "قيد المراجعة والتأكيد" : lang === "fr" ? "En attente" : "Pending confirmation",
          color: "bg-amber-400/15 text-amber-500 border-amber-400/30",
          icon: Clock,
          step: 1,
        };
      case "confirmed":
        return {
          label: lang === "ar" ? "تم تأكيد الطلب بنجاح" : lang === "fr" ? "Confirmée" : "Confirmed",
          color: "bg-blue-500/15 text-blue-500 border-blue-500/30",
          icon: CheckCircle2,
          step: 2,
        };
      case "shipped":
        return {
          label: lang === "ar" ? "في مرحلة الشحن والتوصيل" : lang === "fr" ? "En cours de livraison" : "Shipped / In transit",
          color: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
          icon: Truck,
          step: 3,
        };
      case "cancelled":
        return {
          label: lang === "ar" ? "ملغاة" : lang === "fr" ? "Annulée" : "Cancelled",
          color: "bg-red-500/15 text-red-500 border-red-500/30",
          icon: AlertCircle,
          step: 0,
        };
      default:
        return {
          label: status,
          color: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
          icon: Clock,
          step: 1,
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-20 transition-colors duration-200" dir={dir}>
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-amber-400/10 text-amber-500 border border-amber-400/20 font-mono lowercase">
            <Package className="w-3.5 h-3.5" />
            <span>bx.wear.dz • live order tracking</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
            {lang === "ar" ? "تتبع حالة طلبيتك مباشرة" : lang === "fr" ? "Suivi en direct de votre commande" : "Track Your Order Live"}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto">
            {lang === "ar"
              ? "أدخل رقم الطلبية (مثال: DZ-123456) أو رقم الهاتف الذي سجلت به الطلب للاطلاع على حالة التوصيل الفورية."
              : lang === "fr"
              ? "Entrez votre numéro de commande (ex: DZ-123456) ou votre numéro de téléphone pour voir l'état de livraison."
              : "Enter your order ID (e.g., DZ-123456) or your phone number to check current delivery status."}
          </p>
        </div>

        {/* Search Bar Form */}
        <div className="max-w-xl mx-auto">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={lang === "ar" ? "أدخل رقم الطلب DZ-XXXXXX أو رقم الهاتف..." : "Enter Order ID or phone number..."}
              className={`w-full bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 focus:border-amber-400 focus:bg-white dark:focus:bg-zinc-900 rounded-2xl py-3.5 ${
                dir === "rtl" ? "pr-11 pl-28" : "pl-11 pr-28"
              } text-xs sm:text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none shadow-sm transition`}
            />
            <Search className={`w-5 h-5 text-zinc-400 absolute top-4 pointer-events-none ${dir === "rtl" ? "right-4" : "left-4"}`} />

            <button
              type="submit"
              disabled={loading || !query.trim()}
              className={`absolute top-2 ${dir === "rtl" ? "left-2" : "right-2"} px-5 py-2 rounded-xl bg-zinc-900 dark:bg-amber-400 text-white dark:text-zinc-950 font-bold text-xs hover:bg-black dark:hover:bg-amber-300 transition disabled:opacity-40 cursor-pointer shadow-sm`}
            >
              {loading ? (lang === "ar" ? "جاري البحث..." : "Searching...") : lang === "ar" ? "تتبع الآن" : "Track"}
            </button>
          </form>
        </div>

        {/* Results Section */}
        {loading && (
          <div className="text-center py-12 space-y-3">
            <div className="w-9 h-9 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-zinc-500 font-bold">
              {lang === "ar" ? "جاري استرجاع تفاصيل الطلب..." : "Fetching order details..."}
            </p>
          </div>
        )}

        {!loading && searched && orders.length === 0 && errorMsg && (
          <div className="max-w-lg mx-auto bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 rounded-2xl p-6 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
            <p className="text-xs sm:text-sm font-bold text-amber-900 dark:text-amber-200">
              {errorMsg}
            </p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              {lang === "ar"
                ? "إذا قمت بالطلب مؤخراً ولم تجده، تأكد من صحة رقم الهاتف أو تواصل معنا عبر الواتساب لتأكيد طلبك يدوياً."
                : "If you just placed an order, please double check your number or contact us via WhatsApp."}
            </p>
            <a
              href="https://wa.me/213555000000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{lang === "ar" ? "تواصل معنا عبر واتساب" : "Contact on WhatsApp"}</span>
            </a>
          </div>
        )}

        {/* Orders list */}
        {!loading && orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => {
              const badge = getStatusBadge(order.status);
              const BadgeIcon = badge.icon;

              return (
                <div
                  key={order.id}
                  className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 sm:p-7 shadow-md space-y-6"
                >
                  {/* Order Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                    <div>
                      <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">
                        {lang === "ar" ? "رقم الطلبية" : "Order ID"}
                      </span>
                      <span className="text-base sm:text-lg font-black font-mono text-zinc-900 dark:text-white">
                        {order.id}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.color}`}
                      >
                        <BadgeIcon className="w-3.5 h-3.5" />
                        <span>{badge.label}</span>
                      </span>
                    </div>
                  </div>

                  {/* Progress Timeline (if not cancelled) */}
                  {order.status !== "cancelled" && (
                    <div className="pt-2">
                      <div className="grid grid-cols-3 gap-2 text-center text-[10px] sm:text-xs">
                        <div className="flex flex-col items-center gap-1.5">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                              badge.step >= 1
                                ? "bg-amber-400 text-zinc-950 font-black shadow-md"
                                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                            }`}
                          >
                            1
                          </div>
                          <span className={`font-bold ${badge.step >= 1 ? "text-zinc-900 dark:text-white" : "text-zinc-400"}`}>
                            {lang === "ar" ? "استلام الطلب" : "Received"}
                          </span>
                        </div>

                        <div className="flex flex-col items-center gap-1.5">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                              badge.step >= 2
                                ? "bg-amber-400 text-zinc-950 font-black shadow-md"
                                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                            }`}
                          >
                            2
                          </div>
                          <span className={`font-bold ${badge.step >= 2 ? "text-zinc-900 dark:text-white" : "text-zinc-400"}`}>
                            {lang === "ar" ? "تأكيد الهاتف" : "Confirmed"}
                          </span>
                        </div>

                        <div className="flex flex-col items-center gap-1.5">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                              badge.step >= 3
                                ? "bg-emerald-500 text-white font-black shadow-md"
                                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                            }`}
                          >
                            3
                          </div>
                          <span className={`font-bold ${badge.step >= 3 ? "text-emerald-500 font-extrabold" : "text-zinc-400"}`}>
                            {lang === "ar" ? "مع الموصّل" : "With Courier"}
                          </span>
                        </div>
                      </div>

                      {/* Progress bar line */}
                      <div className="relative mt-3 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-500"
                          style={{
                            width: badge.step === 1 ? "33%" : badge.step === 2 ? "66%" : "100%",
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Order Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 text-xs">
                    <div className="space-y-1.5">
                      <span className="text-zinc-400 text-[11px] block">{lang === "ar" ? "المنتج:" : "Product:"}</span>
                      <p className="font-bold text-zinc-900 dark:text-white">
                        {order.productTitle}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                        {order.selectedSize && <span>المقاس: {order.selectedSize}</span>}
                        {order.selectedColor && <span>• اللون: {order.selectedColor}</span>}
                        <span>• الكمية: {order.quantity}</span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-zinc-400 text-[11px] block">{lang === "ar" ? "عنوان التوصيل:" : "Delivery Address:"}</span>
                      <div className="flex items-center gap-1.5 font-bold text-zinc-900 dark:text-white">
                        <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>{order.wilayaName} {order.commune ? `- ${order.commune}` : ""}</span>
                      </div>
                      <span className="text-[11px] text-zinc-500 block">
                        {order.deliveryType === "home" ? "توصيل للمنزل (Home Delivery)" : "استلام من مكتب التوصيل (Desk Delivery)"}
                      </span>
                    </div>

                    <div className="space-y-1 sm:col-span-2 pt-2 border-t border-zinc-200/60 dark:border-zinc-700/60 flex justify-between items-center">
                      <span className="text-zinc-500 font-medium">{lang === "ar" ? "المبلغ الإجمالي عند الاستلام:" : "Total upon delivery:"}</span>
                      <span className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">
                        {formatPrice(order.totalPrice)}
                      </span>
                    </div>
                  </div>

                  {/* Trust footer note */}
                  <div className="flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>
                      {lang === "ar"
                        ? "حق المعاينة مضمون: افحص الطرد عند استلامه من الموصّل قبل دفع أي دينار."
                        : "Parcel inspection guaranteed before payment."}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Back Link */}
        <div className="text-center pt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white transition"
          >
            <ArrowRight className={`w-4 h-4 ${dir === "rtl" ? "rotate-180" : ""}`} />
            <span>{lang === "ar" ? "العودة لتصفح منتجات المتجر" : "Back to store"}</span>
          </Link>
        </div>
      </main>
    </div>
  );
}

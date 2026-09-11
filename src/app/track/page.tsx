"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { formatPrice } from "@/lib/utils";
import { 
  Search, 
  Clock, 
  CheckCircle, 
  Truck, 
  Package, 
  MapPin, 
  Phone, 
  User, 
  ShoppingBag,
  ArrowRight,
  AlertCircle
} from "lucide-react";

interface TrackedOrder {
  id: string;
  productTitle: string;
  selectedSize?: string;
  selectedColor?: string;
  quantity: number;
  fullName: string;
  phone: string;
  wilayaName: string;
  commune: string;
  deliveryType: "home" | "desk";
  deliveryPrice: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}

const STEPS = [
  { key: "pending", label: "قيد المراجعة", icon: Clock },
  { key: "confirmed", label: "تم التأكيد", icon: CheckCircle },
  { key: "shipped", label: "قيد التوصيل", icon: Truck },
  { key: "delivered", label: "تم الاستلام", icon: Package },
];

function getStepIndex(status: string) {
  if (status === "cancelled") return -1;
  if (status === "delivered") return 3;
  if (status === "shipped") return 2;
  if (status === "confirmed") return 1;
  return 0; // pending
}

export default function TrackPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<TrackedOrder[] | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/track?q=${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
      } else {
        setOrders([]);
      }
    } catch (err) {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-20 transition-colors duration-200" dir="rtl">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center space-y-3 mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400/10 text-amber-500 dark:text-amber-400 border border-amber-400/20">
            تتبع الشحنة المباشر
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">
            أين هي طلبيتي؟ 📦
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
            أدخل رقم هاتفك أو رقم الطلبية (مثل DZ-123456) لمعرفة حالة شحن وتوصيل طردك في الوقت الفعلي.
          </p>
        </div>

        {/* Search Box */}
        <form onSubmit={handleSearch} className="mb-10">
          <div className="relative flex items-center bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm focus-within:border-zinc-900 dark:focus-within:border-amber-400 transition p-1.5">
            <input
              type="text"
              placeholder="رقم الهاتف (05/06/07...) أو رقم الطلبية (DZ-XXXXXX)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent px-4 py-3 text-xs sm:text-sm text-zinc-900 dark:text-white outline-none placeholder:text-zinc-400 font-medium"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="bg-zinc-950 dark:bg-amber-400 hover:bg-black dark:hover:bg-amber-300 text-white dark:text-zinc-950 font-bold px-5 sm:px-6 py-3 rounded-xl text-xs sm:text-sm transition flex items-center gap-2 shrink-0 disabled:opacity-50 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? "جاري البحث..." : "تتبع"}</span>
            </button>
          </div>
        </form>

        {/* Results */}
        {searched && (
          <div className="space-y-6">
            {orders === null || loading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full mx-auto mb-3" />
                <p className="text-xs text-zinc-400">جاري البحث في قاعدة البيانات...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 text-center space-y-3 shadow-sm">
                <AlertCircle className="w-12 h-12 text-zinc-400 mx-auto" />
                <h3 className="font-bold text-base text-zinc-900 dark:text-white">لم يتم العثور على أي طلبية</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                  تأكد من كتابة رقم الهاتف نفسه الذي استخدمته عند الشراء، أو تواصل معنا عبر واتساب للمساعدة.
                </p>
              </div>
            ) : (
              orders.map((ord) => {
                const currentIdx = getStepIndex(ord.status);
                const isCancelled = ord.status === "cancelled";

                return (
                  <div 
                    key={ord.id}
                    className="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6"
                  >
                    {/* Top Row: Order ID & Date */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                      <div>
                        <span className="text-[10px] text-zinc-400 block">رقم الطلبية:</span>
                        <span className="font-mono font-black text-sm sm:text-base text-zinc-900 dark:text-white">
                          {ord.id}
                        </span>
                      </div>
                      <div className="text-left">
                        <span className="text-[10px] text-zinc-400 block">تاريخ التسجيل:</span>
                        <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                          {new Date(ord.createdAt).toLocaleDateString("ar-DZ")}
                        </span>
                      </div>
                    </div>

                    {/* Timeline */}
                    {isCancelled ? (
                      <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-center">
                        <span className="text-red-600 dark:text-red-400 font-extrabold text-sm">
                          ❌ تم إلغاء هذه الطلبية
                        </span>
                      </div>
                    ) : (
                      <div className="py-2">
                        <div className="grid grid-cols-4 gap-2 text-center relative">
                          {/* Horizontal connecting line */}
                          <div className="absolute top-5 right-6 left-6 h-0.5 bg-zinc-200 dark:bg-zinc-800 -z-0" />
                          
                          {STEPS.map((step, idx) => {
                            const isReached = idx <= currentIdx;
                            const isCurrent = idx === currentIdx;
                            const IconComponent = step.icon;

                            return (
                              <div key={step.key} className="flex flex-col items-center relative z-10">
                                <div
                                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                    isReached
                                      ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border border-zinc-200 dark:border-zinc-700"
                                  } ${isCurrent ? "ring-4 ring-emerald-500/20 scale-110" : ""}`}
                                >
                                  <IconComponent className="w-5 h-5" />
                                </div>
                                <span
                                  className={`text-[11px] mt-2 font-bold ${
                                    isReached
                                      ? "text-zinc-900 dark:text-white"
                                      : "text-zinc-400 dark:text-zinc-600"
                                  }`}
                                >
                                  {step.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Order Details */}
                    <div className="bg-zinc-50 dark:bg-zinc-800/60 rounded-2xl p-4 sm:p-5 text-xs space-y-2.5">
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-500 dark:text-zinc-400">المنتج:</span>
                        <span className="font-bold text-zinc-900 dark:text-white">{ord.productTitle}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-500 dark:text-zinc-400">المستلم:</span>
                        <span className="font-bold text-zinc-900 dark:text-white">{ord.fullName}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-500 dark:text-zinc-400">العنوان:</span>
                        <span className="font-bold text-zinc-900 dark:text-white">
                          {ord.wilayaName} - {ord.commune} ({ord.deliveryType === "home" ? "توصيل للمنزل" : "استلام من المكتب"})
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-zinc-200 dark:border-zinc-700 font-extrabold text-sm text-zinc-900 dark:text-white">
                        <span>المبلغ الإجمالي عند الاستلام:</span>
                        <span className="text-emerald-600 dark:text-emerald-400">{formatPrice(ord.totalPrice)}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Back Link */}
        <div className="text-center pt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition"
          >
            <span>العودة لمتجر axb.wear</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
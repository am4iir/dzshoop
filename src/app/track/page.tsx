"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { formatPrice } from "@/lib/utils";
import {
  Search,
  Clock,
  CheckCircle2,
  Truck,
  Package,
  MapPin,
  Phone,
  User,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface OrderResult {
  id: string;
  productTitle: string;
  quantity: number;
  selectedSize: string;
  selectedColor?: string;
  fullName: string;
  phone: string;
  wilayaName: string;
  commune: string;
  deliveryType: "home" | "desk";
  deliveryPrice: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "shipped" | "cancelled";
  createdAt: string;
}

const STATUS_STEPS = [
  { key: "pending", title: "قيد المعالجة", icon: Clock, desc: "تم استلام الطلب وبانتظار التأكيد الهاتفي" },
  { key: "confirmed", title: "تم التأكيد", icon: CheckCircle2, desc: "تم تأكيد طلبك وتجهيز الطرد للشحن" },
  { key: "shipped", title: "قيد الشحن", icon: Truck, desc: "الطرد في الطريق إليك مع عون التوصيل" },
  { key: "delivered", title: "تم التوصيل", icon: Package, desc: "تم تسليم الطلبية بنجاح" },
];

export default function TrackOrderPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [orders, setOrders] = useState<OrderResult[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setErrorMsg("");
    setSearched(true);

    try {
      const res = await fetch(`/api/track?q=${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setOrders(data.orders || []);
      } else {
        setErrorMsg(data.message || "لم نتمكن من العثور على أية طلبية بهذه البيانات");
        setOrders([]);
      }
    } catch (err) {
      setLoading(false);
      setErrorMsg("حدث خطأ في الاتصال بالسيرفر. يرجى المحاولة لاحقاً");
      setOrders([]);
    }
  };

  const getStepIndex = (status: string) => {
    switch (status) {
      case "pending":
        return 0;
      case "confirmed":
        return 1;
      case "shipped":
        return 2;
      case "delivered":
        return 3;
      case "cancelled":
        return -1;
      default:
        return 0;
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 pb-20">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
            تتبع حالة طلبيتك 🚚
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            أدخل رقم الطلبية (مثلاً DZ-123456) أو رقم الهاتف لمتابعة الشحن
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto mb-10">
          <div className="relative flex items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="رقم الطلبية أو رقم الهاتف..."
              className="w-full bg-white border border-zinc-300 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 rounded-2xl py-3.5 pr-11 pl-28 text-sm text-zinc-900 outline-none transition shadow-sm"
              dir="ltr"
            />
            <Search className="w-5 h-5 text-zinc-400 absolute right-3.5 pointer-events-none" />

            <button
              type="submit"
              disabled={loading}
              className="absolute left-1.5 bg-zinc-900 hover:bg-black text-white px-5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "بحث"}
            </button>
          </div>
        </form>

        {/* Results */}
        {loading && (
          <div className="py-16 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-zinc-400 mx-auto mb-3" />
            <p className="text-xs text-zinc-500">جاري البحث عن طلبيتك...</p>
          </div>
        )}

        {!loading && errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-center text-xs flex items-center justify-center gap-2 max-w-md mx-auto">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {!loading && searched && orders.length === 0 && !errorMsg && (
          <div className="bg-white border border-zinc-200 rounded-3xl p-8 text-center max-w-md mx-auto shadow-sm">
            <Package className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-zinc-800">لم يتم العثور على طلبية</h3>
            <p className="text-xs text-zinc-500 mt-1">
              تأكد من رقم الطلبية أو رقم الهاتف المستخدم عند التسجيل
            </p>
          </div>
        )}

        {!loading && orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => {
              const currentStep = getStepIndex(order.status);
              const isCancelled = order.status === "cancelled";

              return (
                <div
                  key={order.id}
                  className="bg-white border border-zinc-200/90 rounded-3xl p-6 shadow-sm space-y-6"
                >
                  {/* Order Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-zinc-400">رقم الطلبية:</span>
                        <span className="font-mono font-extrabold text-sm text-zinc-900 bg-zinc-100 px-2.5 py-0.5 rounded-md">
                          {order.id}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-1">
                        تاريخ الطلب: {new Date(order.createdAt).toLocaleDateString("ar-DZ")}
                      </p>
                    </div>

                    {isCancelled ? (
                      <span className="bg-red-50 text-red-600 text-xs font-bold px-3 py-1 rounded-full border border-red-200">
                        ملغاة
                      </span>
                    ) : (
                      <span className="bg-emerald-50 text-emerald-600 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
                        {STATUS_STEPS[currentStep]?.title || "قيد المعالجة"}
                      </span>
                    )}
                  </div>

                  {/* Status Timeline */}
                  {!isCancelled && (
                    <div className="py-2">
                      <div className="relative flex justify-between items-center max-w-lg mx-auto">
                        {/* Connecting Line */}
                        <div className="absolute top-5 left-8 right-8 h-0.5 bg-zinc-200 -z-0">
                          <div
                            className="h-full bg-emerald-500 transition-all duration-500"
                            style={{
                              width: `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%`,
                            }}
                          />
                        </div>

                        {STATUS_STEPS.map((step, idx) => {
                          const Icon = step.icon;
                          const isPassed = idx <= currentStep;
                          const isCurrent = idx === currentStep;

                          return (
                            <div key={step.key} className="flex flex-col items-center text-center relative z-10">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                  isCurrent
                                    ? "bg-emerald-600 text-white ring-4 ring-emerald-100 scale-110 shadow-md"
                                    : isPassed
                                    ? "bg-emerald-500 text-white"
                                    : "bg-zinc-100 text-zinc-400 border border-zinc-200"
                                }`}
                              >
                                <Icon className="w-5 h-5" />
                              </div>
                              <span
                                className={`text-[11px] font-bold mt-2 ${
                                  isPassed ? "text-zinc-900" : "text-zinc-400"
                                }`}
                              >
                                {step.title}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Order Details */}
                  <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-4 text-xs space-y-2">
                    <div className="flex justify-between pb-2 border-b border-zinc-200/60 font-semibold text-zinc-800">
                      <span>المنتج:</span>
                      <span>
                        {order.productTitle} ({order.quantity} قطعة)
                      </span>
                    </div>

                    <div className="flex justify-between text-zinc-600">
                      <span>العميل:</span>
                      <span className="font-medium text-zinc-800">{order.fullName}</span>
                    </div>

                    <div className="flex justify-between text-zinc-600">
                      <span>موقع التوصيل:</span>
                      <span className="font-medium text-zinc-800">
                        {order.wilayaName} - {order.commune} ({order.deliveryType === "home" ? "للمنزل" : "المكتب"})
                      </span>
                    </div>

                    <div className="flex justify-between pt-2 border-t border-zinc-200/60 font-extrabold text-sm text-zinc-900">
                      <span>المبلغ الإجمالي عند الاستلام:</span>
                      <span className="text-emerald-600">{formatPrice(order.totalPrice)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

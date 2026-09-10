"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product, Order } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { 
  Package, 
  ShoppingBag, 
  Plus, 
  CheckCircle, 
  Clock, 
  Truck, 
  XCircle, 
  Phone, 
  MapPin, 
  Layers, 
  ArrowRight,
  Lock,
  LogOut,
  Trash2,
  RotateCcw,
  RefreshCw
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState(false);

  // Dashboard state
  const [activeTab, setActiveTab] = useState<"orders" | "products" | "new-product">("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [productFilter, setProductFilter] = useState<"all" | "active" | "deleted">("all");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // New product form
  const [name, setName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [description, setDescription] = useState("");
  const [badge, setBadge] = useState("-20%");
  const [sizesStr, setSizesStr] = useState("S, M, L, XL");
  const [colorsStr, setColorsStr] = useState("أسود, رمادي");
  const [imageUrl, setImageUrl] = useState("");
  const [submittingProduct, setSubmittingProduct] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem("axb_admin_auth_2026");
    if (saved === "verified") {
      setIsAuthenticated(true);
      loadData();
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === "abxabx202625") {
      setIsAuthenticated(true);
      sessionStorage.setItem("axb_admin_auth_2026", "verified");
      setAuthError(false);
      loadData();
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("axb_admin_auth_2026");
    localStorage.removeItem("axb_admin_auth_2026");
    sessionStorage.removeItem("store_admin_auth");
    localStorage.removeItem("store_admin_auth");
    setIsAuthenticated(false);
    setPasscode("");
    router.push("/");
  };

  const loadData = () => {
    setLoading(true);
    Promise.all([
      fetch("/api/orders").then((r) => r.json()),
      fetch("/api/products?all=true").then((r) => r.json())
    ]).then(([ordersData, productsData]) => {
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setProducts(Array.isArray(productsData) ? productsData : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  const handleToggleDelete = async (productId: string, currentDeleted: boolean) => {
    const action = currentDeleted ? "restore" : "delete";
    const confirmMsg = currentDeleted
      ? "هل تريد استرجاع هذا المنتج ليعود للعرض في المتجر للزبائن؟"
      : "هل أنت متأكد من حذف هذا المنتج وإخفائه من المتجر؟ (يمكنك استرجاعه في أي وقت)";
    
    if (!confirm(confirmMsg)) return;

    setActionLoadingId(productId);
    try {
      const res = await fetch("/api/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: productId, action })
      });
      const data = await res.json();
      if (data.success) {
        loadData();
      } else {
        alert("تعذر تحديث حالة المنتج");
      }
    } catch (e) {
      alert("حدث خطأ أثناء تعديل المنتج");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handlePermanentDelete = async (productId: string, productName: string) => {
    if (!confirm(`تحذير نهائي: هل تريد حذف "${productName}" نهائياً وبشكل كامل من قاعدة البيانات؟ لا يمكن التراجع عن هذا الإجراء.`)) {
      return;
    }

    setActionLoadingId(productId);
    try {
      const res = await fetch(`/api/products?id=${productId}&permanent=true`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        loadData();
      } else {
        alert("تعذر حذف المنتج نهائياً");
      }
    } catch (e) {
      alert("حدث خطأ أثناء الحذف النهائي");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRestoreDefaults = async () => {
    if (!confirm("هل تريد استرجاع وتفعيل المنتجات الأصلية الافتراضية للمتجر؟")) return;
    setLoading(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "restore-defaults" })
      });
      const data = await res.json();
      if (data.success) {
        alert("تم استرجاع وتفعيل المنتجات الافتراضية بنجاح!");
        loadData();
      } else {
        alert("تعذر استرجاع المنتجات الافتراضية");
      }
    } catch (e) {
      alert("حدث خطأ في النظام");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus })
      });
      loadData();
    } catch (e) {
      alert("تعذر تحديث الحالة");
    }
  };

  const deleteOrderImmediately = async (orderId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الطلبية نهائياً من الداتابيز؟")) return;
    try {
      await fetch(`/api/orders?orderId=${orderId}`, { method: "DELETE" });
      loadData();
    } catch (e) {
      alert("تعذر حذف الطلبية");
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) {
      alert("يرجى إدخال اسم وسعر المنتج");
      return;
    }

    setSubmittingProduct(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          subtitle,
          price: Number(price),
          originalPrice: originalPrice ? Number(originalPrice) : Number(price),
          description,
          badge,
          sizes: sizesStr.split(",").map((s) => s.trim()).filter(Boolean),
          colors: colorsStr.split(",").map((c) => c.trim()).filter(Boolean),
          images: imageUrl ? [imageUrl] : [
            "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=900&auto=format&fit=crop"
          ]
        })
      });
      const data = await res.json();
      setSubmittingProduct(false);

      if (data.success) {
        alert("تمت إضافة المنتج بنجاح ويظهر الآن للزبائن في المتجر!");
        setName("");
        setSubtitle("");
        setPrice("");
        setOriginalPrice("");
        setDescription("");
        setImageUrl("");
        loadData();
        setActiveTab("products");
      }
    } catch (err) {
      setSubmittingProduct(false);
      alert("حدث خطأ أثناء إضافة المنتج");
    }
  };

  // Lock Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4">
        <div className="max-w-sm w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-center shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-zinc-800 border border-zinc-700/80 flex items-center justify-center mx-auto mb-5 text-amber-400 shadow-inner">
            <Lock className="w-6 h-6" />
          </div>

          <h2 className="text-xl font-bold tracking-tight text-white mb-1">
            لوحة تحكم المتجر المحمية
          </h2>
          <p className="text-xs text-zinc-400 mb-6">
            أدخل رمز المرور السري (Passcode) للوصول إلى الطلبيات وإدارة المنتجات
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                required
                autoFocus
                placeholder="رمز المرور (Passcode)"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setAuthError(false);
                }}
                className={`w-full bg-zinc-950 border ${
                  authError ? "border-red-500" : "border-zinc-800 focus:border-white"
                } rounded-xl py-3 px-4 text-center text-sm font-mono tracking-widest text-white outline-none transition`}
              />
              {authError && (
                <span className="text-[11px] text-red-400 block mt-1.5 font-medium">
                  رمز المرور غير صحيح!
                </span>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-white hover:bg-zinc-200 text-black font-extrabold py-3 px-4 rounded-xl text-xs transition shadow-md cursor-pointer"
            >
              تسجيل الدخول للأدمن
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-zinc-800/80">
            <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-300">
              ← العودة لمتجر الزبائن
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const confirmedCount = orders.filter((o) => o.status === "confirmed").length;
  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((acc, curr) => acc + curr.totalPrice, 0);
  const activeProductsCount = products.filter((p) => !p.isDeleted).length;
  const deletedProductsCount = products.filter((p) => p.isDeleted).length;

  const displayedProducts = products.filter((p) => {
    if (productFilter === "active") return !p.isDeleted;
    if (productFilter === "deleted") return Boolean(p.isDeleted);
    return true;
  });

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 pb-20">
      {/* Top Header */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-zinc-900 text-white font-black flex items-center justify-center text-xs">
              AD
            </span>
            <div>
              <h1 className="font-extrabold text-sm sm:text-base text-zinc-900 leading-tight">
                لوحة تحكم المتجر (Admin)
              </h1>
              <p className="text-[10px] text-zinc-400">إدارة الطلبات والمنتجات الفورية</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-600 hover:text-black bg-zinc-100 hover:bg-zinc-200 px-3.5 py-2 rounded-xl transition"
            >
              <span>زيارة المتجر كزبون</span>
              <ArrowRight className="w-3.5 h-3.5 rotate-180" />
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-white bg-red-50 hover:bg-red-600 border border-red-200 hover:border-red-600 px-3.5 py-2 rounded-xl transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Notice for 48h auto purge */}
        <div className="mb-6 bg-blue-50 border border-blue-200/80 rounded-2xl p-4 text-xs text-blue-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span>
              <strong>نظام التنظيف التلقائي مفعّل:</strong> الطلبيات المشحونة أو الملغاة تُحذف تلقائياً وبشكل نهائي من قاعدة البيانات بعد مرور 48 ساعة.
            </span>
          </div>
        </div>

        {/* Analytics Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-zinc-200/90 shadow-sm">
            <span className="text-[11px] font-bold text-zinc-400 block mb-1">الطلبات الجديدة (Pending)</span>
            <span className="text-2xl font-black text-amber-600">{pendingCount}</span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-zinc-200/90 shadow-sm">
            <span className="text-[11px] font-bold text-zinc-400 block mb-1">الطلبات المؤكدة</span>
            <span className="text-2xl font-black text-emerald-600">{confirmedCount}</span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-zinc-200/90 shadow-sm">
            <span className="text-[11px] font-bold text-zinc-400 block mb-1">المنتجات المعروضة</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-zinc-900">{activeProductsCount}</span>
              {deletedProductsCount > 0 && (
                <span className="text-[11px] text-red-500 font-bold">({deletedProductsCount} محذوف)</span>
              )}
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-zinc-200/90 shadow-sm">
            <span className="text-[11px] font-bold text-zinc-400 block mb-1">إجمالي المبيعات المحتمل</span>
            <span className="text-lg sm:text-2xl font-black text-zinc-900">{formatPrice(totalRevenue)}</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-zinc-200 pb-3 mb-6">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "orders"
                ? "bg-zinc-900 text-white shadow-sm"
                : "text-zinc-600 hover:bg-zinc-200/60"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>قائمة الطلبيات ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "products"
                ? "bg-zinc-900 text-white shadow-sm"
                : "text-zinc-600 hover:bg-zinc-200/60"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>المنتجات ({activeProductsCount})</span>
          </button>

          <button
            onClick={() => setActiveTab("new-product")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "new-product"
                ? "bg-zinc-900 text-white shadow-sm"
                : "text-zinc-600 hover:bg-zinc-200/60"
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>إضافة منتج جديد</span>
          </button>
        </div>

        {/* TAB 1: ORDERS LIST */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center text-zinc-400 text-xs">
                لا توجد طلبيات حالياً في قاعدة البيانات.
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-zinc-200/90 p-5 shadow-sm space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs bg-zinc-100 px-2.5 py-1 rounded-md text-zinc-800">
                        {order.id}
                      </span>
                      <span className="text-[11px] text-zinc-400">
                        {new Date(order.createdAt).toLocaleString("ar-DZ")}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div>
                      {order.status === "pending" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full">
                          <Clock className="w-3 h-3" /> بانتظار التأكيد
                        </span>
                      )}
                      {order.status === "confirmed" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                          <CheckCircle className="w-3 h-3" /> مؤكدة للشحن
                        </span>
                      )}
                      {order.status === "shipped" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full">
                          <Truck className="w-3 h-3" /> تم الإرسال (تُحذف بعد 48h)
                        </span>
                      )}
                      {order.status === "cancelled" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-red-50 text-red-700 border border-red-200 px-2.5 py-0.5 rounded-full">
                          <XCircle className="w-3 h-3" /> ملغاة
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Order Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="space-y-1">
                      <span className="text-zinc-400 text-[11px] block">معلومات الزبون:</span>
                      <p className="font-bold text-zinc-900 text-sm">{order.fullName}</p>
                      <a
                        href={`tel:${order.phone}`}
                        className="inline-flex items-center gap-1.5 text-zinc-700 font-semibold hover:text-black mt-1"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span dir="ltr">{order.phone}</span>
                      </a>
                    </div>

                    <div className="space-y-1">
                      <span className="text-zinc-400 text-[11px] block">العنوان والتوصيل:</span>
                      <p className="font-semibold text-zinc-800 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                        {order.wilayaName} - {order.commune || "وسط المدينة"}
                      </p>
                      <p className="text-zinc-500 text-[11px]">
                        {order.deliveryType === "home" ? "توصيل للمنزل (+ " + order.deliveryPrice + " دج)" : "استلام من مكتب التوصيل (+ " + order.deliveryPrice + " دج)"}
                      </p>
                    </div>

                    <div className="space-y-1 md:text-left">
                      <span className="text-zinc-400 text-[11px] block">المنتج والمبلغ:</span>
                      <p className="font-bold text-zinc-900">
                        {order.productTitle} ({order.quantity} قطعة)
                      </p>
                      <p className="text-zinc-500 text-[11px]">
                        المقاس: <span className="font-semibold text-zinc-800">{order.selectedSize}</span>
                        {order.selectedColor ? " | اللون: " + order.selectedColor : ""}
                      </p>
                      <p className="text-sm font-black text-emerald-600 mt-1">
                        المجموع: {formatPrice(order.totalPrice)}
                      </p>
                    </div>
                  </div>

                  {/* Actions to change status + Delete */}
                  <div className="pt-3 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex gap-2 items-center">
                      <span className="text-[11px] text-zinc-400">تغيير الحالة:</span>
                      <button
                        onClick={() => updateOrderStatus(order.id, "confirmed")}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition"
                      >
                        تأكيد الطلب
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, "shipped")}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition"
                      >
                        تم الشحن
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, "cancelled")}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-zinc-100 text-zinc-700 hover:bg-zinc-200 transition"
                      >
                        إلغاء
                      </button>
                    </div>

                    {/* Immediate Delete Button */}
                    <button
                      onClick={() => deleteOrderImmediately(order.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition border border-transparent hover:border-red-200"
                      title="حذف نهائي الآن من الداتابيز"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>حذف فوري</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: PRODUCTS LIST */}
        {activeTab === "products" && (
          <div className="space-y-5">
            {/* Filter & Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setProductFilter("all")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    productFilter === "all"
                      ? "bg-zinc-900 text-white shadow-sm"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                  }`}
                >
                  جميع المنتجات ({products.length})
                </button>
                <button
                  onClick={() => setProductFilter("active")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    productFilter === "active"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  المعروضة للزبائن ({activeProductsCount})
                </button>
                <button
                  onClick={() => setProductFilter("deleted")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    productFilter === "deleted"
                      ? "bg-red-600 text-white shadow-sm"
                      : "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  المحذوفة ({deletedProductsCount})
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRestoreDefaults}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-700 hover:text-black bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 px-3.5 py-2 rounded-xl transition cursor-pointer"
                  title="استرجاع وتفعيل المنتجات الأصلية الافتراضية"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-zinc-600" />
                  <span>استرجاع الافتراضية</span>
                </button>
                <button
                  onClick={() => setActiveTab("new-product")}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-zinc-900 hover:bg-zinc-800 px-3.5 py-2 rounded-xl transition cursor-pointer shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة منتج جديد</span>
                </button>
              </div>
            </div>

            {/* Empty state */}
            {displayedProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center text-zinc-400 text-xs shadow-sm">
                لا توجد منتجات مطابقة لهذا الفلتر حالياً.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedProducts.map((prod) => {
                  const isDeleted = Boolean(prod.isDeleted);
                  const isBusy = actionLoadingId === prod.id;

                  return (
                    <div
                      key={prod.id}
                      className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col p-4 shadow-sm relative ${
                        isDeleted ? "border-red-200 bg-red-50/10 ring-1 ring-red-100" : "border-zinc-200"
                      }`}
                    >
                      {/* Status header badge */}
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        {isDeleted ? (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold bg-red-100 text-red-700 px-2.5 py-0.5 rounded-lg border border-red-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                            محذوف من المتجر
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                            معروض للزبائن
                          </span>
                        )}

                        <span className="text-[10px] font-mono text-zinc-400">
                          {prod.id}
                        </span>
                      </div>

                      <div className="aspect-square bg-zinc-100 rounded-xl overflow-hidden mb-3 relative group">
                        <img
                          src={prod.images?.[0] || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=900&auto=format&fit=crop"}
                          alt={prod.name}
                          className={`w-full h-full object-cover transition duration-200 ${isDeleted ? "grayscale opacity-70" : ""}`}
                        />
                      </div>

                      <h4 className="font-bold text-sm text-zinc-900 line-clamp-1">{prod.name}</h4>
                      <p className="text-xs text-zinc-400 mb-2 line-clamp-1">{prod.subtitle || "بدون وصف فرعي"}</p>

                      <div className="pt-2 border-t border-zinc-100 flex items-center justify-between mb-3">
                        <span className="text-sm font-black text-zinc-900">{formatPrice(prod.price)}</span>
                        {!isDeleted ? (
                          <Link
                            href={`/products/${prod.id}`}
                            target="_blank"
                            className="text-xs text-zinc-600 hover:text-black font-semibold underline"
                          >
                            معاينة في المتجر ↗
                          </Link>
                        ) : (
                          <span className="text-[11px] text-red-500 font-bold">مخفي من الزبائن</span>
                        )}
                      </div>

                      {/* Action buttons: Delete & Restore & Permanent Delete right next to each product */}
                      <div className="mt-auto pt-3 border-t border-zinc-100 flex items-center gap-2">
                        {!isDeleted ? (
                          <button
                            onClick={() => handleToggleDelete(prod.id, false)}
                            disabled={isBusy}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold text-red-600 hover:text-white bg-red-50 hover:bg-red-600 border border-red-200 hover:border-red-600 transition active:scale-95 cursor-pointer disabled:opacity-50"
                            title="حذف وإخفاء المنتج من المتجر"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>حذف (Delete)</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleToggleDelete(prod.id, true)}
                            disabled={isBusy}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold text-emerald-700 hover:text-white bg-emerald-50 hover:bg-emerald-600 border border-emerald-300 hover:border-emerald-600 transition active:scale-95 cursor-pointer disabled:opacity-50"
                            title="استرجاع المنتج ليعود للعرض في المتجر"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>استرجاع (Restore)</span>
                          </button>
                        )}

                        <button
                          onClick={() => handlePermanentDelete(prod.id, prod.name)}
                          disabled={isBusy}
                          className="inline-flex items-center justify-center gap-1 py-2.5 px-2.5 rounded-xl text-xs font-bold text-zinc-400 hover:text-red-600 hover:bg-red-50 border border-zinc-200 hover:border-red-200 transition cursor-pointer disabled:opacity-50"
                          title="حذف نهائي لا يمكن استرجاعه من الداتابيز"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-zinc-400 hover:text-red-500" />
                          <span className="text-[10px] hidden sm:inline">نهائي</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ADD NEW PRODUCT FORM */}
        {activeTab === "new-product" && (
          <div className="max-w-2xl mx-auto bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-black text-zinc-900 mb-1">إضافة منتج جديد للمتجر</h2>
            <p className="text-xs text-zinc-400 mb-6">
              بمجرد حفظ هذا النموذج، سيظهر المنتج تلقائياً في الصفحة الرئيسية لجميع الزبائن.
            </p>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-700 font-bold mb-1.5">اسم المنتج *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: Oversized Vintage Hoodie"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white rounded-xl px-4 py-3 text-xs text-zinc-900 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-zinc-700 font-bold mb-1.5">وصف فرعي / Subtitle</label>
                <input
                  type="text"
                  placeholder="مثال: قطن 100% ثقيل 400 GSM"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white rounded-xl px-4 py-3 text-xs text-zinc-900 outline-none transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-700 font-bold mb-1.5">السعر للبيع (دج) *</label>
                  <input
                    type="number"
                    required
                    placeholder="2800"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white rounded-xl px-4 py-3 text-xs text-zinc-900 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-zinc-700 font-bold mb-1.5">السعر الأصلي قبل التخفيض (اختياري)</label>
                  <input
                    type="number"
                    placeholder="3500"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white rounded-xl px-4 py-3 text-xs text-zinc-900 outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-700 font-bold mb-1.5">المقاسات (مفصولة بفاصلة)</label>
                  <input
                    type="text"
                    value={sizesStr}
                    onChange={(e) => setSizesStr(e.target.value)}
                    placeholder="S, M, L, XL, XXL"
                    className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white rounded-xl px-4 py-3 text-xs text-zinc-900 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-zinc-700 font-bold mb-1.5">شعار الخصم (Badge)</label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="-20% أو جديد 🔥"
                    className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white rounded-xl px-4 py-3 text-xs text-zinc-900 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-700 font-bold mb-1.5">رابط صورة المنتج (Image URL)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... (أو اترك فارغاً لاستخدام صورة افتراضية)"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white rounded-xl px-4 py-3 text-xs text-zinc-900 outline-none transition dir-ltr text-right"
                />
              </div>

              <div>
                <label className="block text-zinc-700 font-bold mb-1.5">وصف وتفاصيل المنتج</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="اكتب تفاصيل القماش وطريقة الغسيل..."
                  className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white rounded-xl px-4 py-3 text-xs text-zinc-900 outline-none transition"
                />
              </div>

              <button
                type="submit"
                disabled={submittingProduct}
                className="w-full bg-zinc-950 hover:bg-black text-white font-black py-3.5 px-6 rounded-xl text-xs sm:text-sm tracking-wide transition shadow-sm disabled:opacity-50 mt-4 cursor-pointer"
              >
                {submittingProduct ? "جاري الإضافة..." : "حفظ المنتج وعرضه في المتجر"}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
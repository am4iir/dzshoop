"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
  Sparkles
} from "lucide-react";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<"orders" | "products" | "new-product">("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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

  const loadData = () => {
    setLoading(true);
    Promise.all([
      fetch("/api/orders").then((r) => r.json()),
      fetch("/api/products").then((r) => r.json())
    ]).then(([ordersData, productsData]) => {
      setOrders(ordersData);
      setProducts(productsData);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

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

  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const confirmedCount = orders.filter((o) => o.status === "confirmed").length;
  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((acc, curr) => acc + curr.totalPrice, 0);

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

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-600 hover:text-black bg-zinc-100 hover:bg-zinc-200 px-3.5 py-2 rounded-xl transition"
          >
            <span>زيارة المتجر كزبون</span>
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
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
            <span className="text-2xl font-black text-zinc-900">{products.length}</span>
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
            <span>المنتجات الحالية ({products.length})</span>
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
                لا توجد طلبيات حتى الآن. عند قيام الزبون بالطلب من المتجر ستظهر هنا مباشرة!
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
                          <Truck className="w-3 h-3" /> تم الإرسال
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
                    {/* Customer */}
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

                    {/* Address & Delivery */}
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

                    {/* Item & Price */}
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

                  {/* Actions to change status */}
                  <div className="pt-3 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] text-zinc-400">تغيير حالة الطلب:</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateOrderStatus(order.id, "confirmed")}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition"
                      >
                        تأكيد الطلب
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, "shipped")}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition"
                      >
                        تم الشحن
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, "cancelled")}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition"
                      >
                        إلغاء
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: PRODUCTS LIST */}
        {activeTab === "products" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-2xl border border-zinc-200 overflow-hidden flex flex-col p-4 shadow-sm"
              >
                <div className="aspect-square bg-zinc-100 rounded-xl overflow-hidden mb-3">
                  <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover" />
                </div>
                <h4 className="font-bold text-sm text-zinc-900 line-clamp-1">{prod.name}</h4>
                <p className="text-xs text-zinc-400 mb-2 line-clamp-1">{prod.subtitle}</p>
                <div className="mt-auto pt-2 border-t border-zinc-100 flex items-center justify-between">
                  <span className="text-sm font-black text-zinc-900">{formatPrice(prod.price)}</span>
                  <Link
                    href={`/products/${prod.id}`}
                    target="_blank"
                    className="text-xs text-zinc-600 hover:text-black font-semibold underline"
                  >
                    معاينة في المتجر ↗
                  </Link>
                </div>
              </div>
            ))}
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
"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Product } from "@/lib/db";
import { WILAYAS } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/components/CartContext";
import { TrustBadges } from "@/components/TrustBadges";
import { SizeCalculatorModal } from "@/components/SizeCalculatorModal";
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  User,
  Phone,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Ruler,
  Copy,
  Check,
} from "lucide-react";
import confetti from "canvas-confetti";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { addItem, openCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [wilayaCode, setWilayaCode] = useState("16");
  const [commune, setCommune] = useState("الجزائر الوسطى");
  const [deliveryType, setDeliveryType] = useState<"home" | "desk">("home");

  // Hydrate customer fields from localStorage across refreshes & across pages
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

  // Persist customer fields to localStorage
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [copiedOrderId, setCopiedOrderId] = useState(false);

  const handleCopyOrderId = () => {
    if (!orderId) return;
    try {
      navigator.clipboard.writeText(orderId);
      setCopiedOrderId(true);
      setTimeout(() => setCopiedOrderId(false), 2000);
    } catch (e) {}
  };

  // Hydrate confirmed order from sessionStorage across refreshes
  useEffect(() => {
    try {
      const savedOrder = sessionStorage.getItem(`axb_confirmed_order_${resolvedParams.id}`);
      if (savedOrder) {
        const parsed = JSON.parse(savedOrder);
        if (parsed.orderId) {
          setOrderId(parsed.orderId);
          setOrderConfirmed(true);
        }
      }
    } catch (e) {}
  }, [resolvedParams.id]);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((products: Product[]) => {
        const found = products.find((p) => p.id === resolvedParams.id);
        if (found) {
          setProduct(found);
          if (found.sizes && found.sizes.length > 0) {
            setSelectedSize(found.sizes[0]);
          }
          if (found.colors && found.colors.length > 0) {
            setSelectedColor(found.colors[0]);
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] text-zinc-900">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <div className="w-10 h-10 border-4 border-zinc-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs text-zinc-500 font-bold">جاري تحميل تفاصيل المنتج...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#fafafa] text-zinc-900">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <h2 className="text-xl font-bold mb-2">المنتج غير موجود</h2>
          <Link href="/" className="text-xs text-zinc-500 underline font-bold">
            العودة للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  const currentWilaya = WILAYAS.find((w) => w.code === wilayaCode) || WILAYAS[0];
  const deliveryCost = deliveryType === "home" ? currentWilaya.homeDelivery : currentWilaya.deskDelivery;
  const itemsTotal = product.price * quantity;
  const grandTotal = itemsTotal + deliveryCost;

  const handleAddToCart = () => {
    if (product.inStock === false) {
      alert("عذراً، هذا المنتج غير متوفر في المخزن حالياً (نفدت الكمية)");
      return;
    }
    addItem({
      productId: product.id,
      productName: product.name,
      productImage: product.images[0] || "",
      selectedSize,
      selectedColor,
      quantity,
      unitPrice: product.price,
    });
    openCart();
  };

  const handleBuyNow = () => {
    if (product.inStock === false) {
      alert("عذراً، هذا المنتج غير متوفر في المخزن حالياً (نفدت الكمية)");
      return;
    }
    addItem({
      productId: product.id,
      productName: product.name,
      productImage: product.images[0] || "",
      selectedSize,
      selectedColor,
      quantity,
      unitPrice: product.price,
    });
    router.push("/checkout");
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (product.inStock === false) {
      alert("عذراً، هذا المنتج غير متوفر في المخزن حالياً (نفدت الكمية)");
      return;
    }
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

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          productTitle: product.name,
          selectedSize,
          selectedColor,
          quantity,
          fullName: fullName.trim(),
          phone: cleanPhone,
          wilayaName: currentWilaya.name,
          commune: commune || currentWilaya.communes[0] || "",
          deliveryType,
          deliveryPrice: deliveryCost,
          totalPrice: grandTotal,
        }),
      });
      const data = await res.json();
      setIsSubmitting(false);

      if (data.success) {
        setOrderId(data.order.id);
        setOrderConfirmed(true);
        try {
          sessionStorage.setItem(`axb_confirmed_order_${resolvedParams.id}`, JSON.stringify({ orderId: data.order.id }));
        } catch (e) {}
        try {
          localStorage.removeItem("axb_checkout_data");
        } catch (e) {}
        try {
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        } catch (e) {}
      } else {
        alert(data.error || "حدث خطأ أثناء إرسال الطلب، يرجى المحاولة ثانية");
      }
    } catch (err) {
      setIsSubmitting(false);
      alert("حدث خطأ أثناء إرسال الطلب، يرجى المحاولة ثانية");
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-20 transition-colors duration-200">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-12">
        {orderConfirmed ? (
          <div className="max-w-md mx-auto bg-white dark:bg-zinc-900 border border-emerald-200 dark:border-emerald-800 rounded-3xl p-8 text-center shadow-xl">
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-zinc-900 dark:text-white mb-2">تم تأكيد طلبك بنجاح!</h2>
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-xs text-zinc-500 dark:text-zinc-400">رقم الطلبية:</span>
              <span className="font-bold text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-lg font-mono text-sm border border-zinc-200 dark:border-zinc-700">
                {orderId}
              </span>
              <button
                type="button"
                onClick={handleCopyOrderId}
                className="text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800 px-2 py-1 rounded-lg transition flex items-center gap-1 cursor-pointer"
                title="نسخ رقم الطلبية"
              >
                {copiedOrderId ? <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedOrderId ? "تم النسخ!" : "نسخ"}</span>
              </button>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6">
              سنتصل بك هاتفياً لتأكيد الشحن فوراً.
            </p>

            <div className="bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-700/60 rounded-2xl p-4 text-xs space-y-2 text-right mb-6">
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">المنتج:</span>
                <span className="font-bold text-zinc-900 dark:text-white">{product.name} ({quantity})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">المقاس:</span>
                <span className="font-bold text-zinc-900 dark:text-white">{selectedSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">العنوان:</span>
                <span className="font-bold text-zinc-900 dark:text-white">{currentWilaya.name}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-zinc-200 dark:border-zinc-700 font-extrabold text-sm text-zinc-900 dark:text-white">
                <span>المبلغ الكلي:</span>
                <span className="text-emerald-600 dark:text-emerald-400">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <Link
              href="/"
              onClick={() => {
                try {
                  sessionStorage.removeItem(`axb_confirmed_order_${resolvedParams.id}`);
                } catch (e) {}
              }}
              className="inline-flex items-center gap-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 px-5 py-2.5 rounded-xl transition cursor-pointer"
            >
              العودة لقائمة المنتجات
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Product Info & Form Column */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white leading-tight">
                    {product.name}
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-1">{product.subtitle}</p>

                  <div className="flex items-baseline gap-3 mt-3 flex-wrap">
                    <span className="text-2xl sm:text-3xl font-black text-red-600 dark:text-red-500">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-zinc-400 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                    {product.badge && (
                      <span className="bg-red-500 text-white font-bold text-xs px-2.5 py-0.5 rounded-full shadow-xs">
                        {product.badge}
                      </span>
                    )}
                    {product.inStock === false && (
                      <span className="bg-zinc-950/90 dark:bg-zinc-800 text-amber-400 border border-amber-400/40 font-black text-xs px-3 py-1 rounded-full shadow-sm tracking-widest uppercase">
                        SOLD OUT
                      </span>
                    )}
                  </div>
                </div>

                {/* Out of stock warning banner */}
                {product.inStock === false && (
                  <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-2xl p-4 text-amber-900 dark:text-amber-300 text-xs flex items-center gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div>
                      <p className="font-extrabold text-sm tracking-wide uppercase">This product is currently SOLD OUT</p>
                      <p className="text-[11px] text-amber-700/90 dark:text-amber-400/90 mt-0.5">
                        Orders for this item are temporarily suspended until new stock arrives.
                      </p>
                    </div>
                  </div>
                )}

                {/* Description */}
                {product.description && (
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed bg-zinc-100/70 dark:bg-zinc-900 p-3.5 rounded-xl border border-zinc-200/50 dark:border-zinc-800">
                    {product.description}
                  </p>
                )}

                {/* Sizes Selection */}
                {product.sizes && product.sizes.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300">المقاس المتوفر</label>
                      <button
                        type="button"
                        onClick={() => setIsSizeModalOpen(true)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100/80 dark:hover:bg-amber-900/50 px-2.5 py-1 rounded-lg border border-amber-200/80 dark:border-amber-800/80 transition cursor-pointer"
                      >
                        <Ruler className="w-3.5 h-3.5" />
                        <span>احسب مقاسك المناسب 📏</span>
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          className={`min-w-[48px] py-2 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                            selectedSize === size
                              ? "border-zinc-900 dark:border-white bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 shadow-sm"
                              : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:border-zinc-400 dark:hover:border-zinc-500"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>

                    <SizeCalculatorModal
                      isOpen={isSizeModalOpen}
                      onClose={() => setIsSizeModalOpen(false)}
                      onSelectSize={(size) => setSelectedSize(size)}
                    />
                  </div>
                )}

                {/* Colors Selection */}
                {product.colors && product.colors.length > 0 && (
                  <div>
                    <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-2">اللون</label>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setSelectedColor(color)}
                          className={`py-1.5 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                            selectedColor === color
                              ? "border-zinc-900 dark:border-white bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 shadow-sm"
                              : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:border-zinc-400 dark:hover:border-zinc-500"
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Add To Cart / Buy Now Action Buttons */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      disabled={product.inStock === false}
                      className="flex-1 bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-700 text-zinc-900 dark:text-white hover:bg-zinc-900 dark:hover:bg-zinc-800 hover:text-white font-extrabold py-3.5 px-4 rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>{product.inStock === false ? "Sold Out" : "أضف إلى السلة"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleBuyNow}
                      disabled={product.inStock === false}
                      className="flex-1 bg-zinc-950 dark:bg-amber-400 hover:bg-black dark:hover:bg-amber-300 text-white dark:text-zinc-950 font-extrabold py-3.5 px-4 rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-md disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <span>{product.inStock === false ? "⚠️ SOLD OUT" : "الشراء الآن ⚡"}</span>
                    </button>
                  </div>
                </div>

                {/* Direct Order Form Accordion Card */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-sm">
                  <h3 className="text-sm font-black text-center text-zinc-900 dark:text-white mb-5">
                    أو اطلب المباشر السريع أدناه
                  </h3>

                  <form onSubmit={handleOrderSubmit} className="space-y-4">
                    <div className="space-y-3">
                      <div className="relative">
                        <input
                          type="text"
                          required
                          placeholder="الاسم واللقب *"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 focus:border-zinc-900 dark:focus:border-amber-400 focus:bg-white dark:focus:bg-zinc-800 rounded-xl py-3 pr-9 pl-3 text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none transition"
                        />
                        <User className="w-4 h-4 text-zinc-400 absolute right-3 top-3.5 pointer-events-none" />
                      </div>

                      <div className="relative">
                        <input
                          type="tel"
                          required
                          placeholder="رقم الهاتف *"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 focus:border-zinc-900 dark:focus:border-amber-400 focus:bg-white dark:focus:bg-zinc-800 rounded-xl py-3 pr-9 pl-3 text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none transition dir-ltr text-right"
                        />
                        <Phone className="w-4 h-4 text-zinc-400 absolute right-3 top-3.5 pointer-events-none" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="relative">
                        <select
                          value={wilayaCode}
                          onChange={(e) => {
                            const newCode = e.target.value;
                            setWilayaCode(newCode);
                            const w = WILAYAS.find((item) => item.code === newCode);
                            if (w && w.communes.length > 0) {
                              setCommune(w.communes[0]);
                            } else {
                              setCommune("");
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

                      <div className="relative">
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

                    {/* Delivery Location */}
                    <div className="pt-2">
                      <span className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-300 mb-2">مكان التوصيل</span>
                      <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="delivery"
                            checked={deliveryType === "home"}
                            onChange={() => setDeliveryType("home")}
                            className="w-4 h-4 accent-zinc-900 dark:accent-amber-400"
                          />
                          <span className="text-xs text-zinc-700 dark:text-zinc-300">توصيل للمنزل</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="delivery"
                            checked={deliveryType === "desk"}
                            onChange={() => setDeliveryType("desk")}
                            className="w-4 h-4 accent-zinc-900 dark:accent-amber-400"
                          />
                          <span className="text-xs text-zinc-700 dark:text-zinc-300">استلام من المكتب</span>
                        </label>
                      </div>
                    </div>

                    {/* Price breakdown */}
                    <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-1 text-xs">
                      <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                        <span>سعر التوصيل</span>
                        <span className="font-semibold text-zinc-900 dark:text-zinc-200">{formatPrice(deliveryCost)}</span>
                      </div>
                      <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                        <span>سعر المنتجات</span>
                        <span className="font-semibold text-zinc-900 dark:text-zinc-200">{formatPrice(itemsTotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-black text-emerald-600 dark:text-emerald-400 pt-1">
                        <span>التكلفة الإجمالية</span>
                        <span>{formatPrice(grandTotal)}</span>
                      </div>
                    </div>

                    {/* Submit Button & Quantity Bar */}
                    <div className="flex items-center gap-3 pt-3">
                      <button
                        type="submit"
                        disabled={isSubmitting || product.inStock === false}
                        className="flex-1 bg-zinc-950 dark:bg-amber-400 hover:bg-black dark:hover:bg-amber-300 text-white dark:text-zinc-950 font-black py-3.5 px-6 rounded-xl text-xs sm:text-sm tracking-wide transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {product.inStock === false
                          ? "⚠️ SOLD OUT — Orders Unavailable"
                          : isSubmitting
                          ? "جاري الإرسال..."
                          : "تأكيد الطلب الفوري"}
                      </button>

                      <div className="flex items-center border border-zinc-200 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-800 px-2 h-11">
                        <button
                          type="button"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-7 h-7 text-zinc-600 dark:text-zinc-300 font-bold hover:text-black dark:hover:text-white flex items-center justify-center text-sm cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-bold text-xs text-zinc-900 dark:text-white">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => setQuantity(quantity + 1)}
                          className="w-7 h-7 text-zinc-600 dark:text-zinc-300 font-bold hover:text-black dark:hover:text-white flex items-center justify-center text-sm cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              {/* Image Showcase Column */}
              <div className="lg:col-span-6 space-y-4">
                <div className="relative aspect-[4/5] bg-zinc-100 dark:bg-zinc-800 rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm">
                  <img
                    src={product.images[activeImage] || product.images[0]}
                    alt={product.name}
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-cover object-center"
                  />

                  {product.images.length > 1 && (
                    <div className="absolute inset-y-0 inset-x-3 flex items-center justify-between pointer-events-none">
                      <button
                        type="button"
                        onClick={() => setActiveImage((prev) => (prev > 0 ? prev - 1 : product.images.length - 1))}
                        className="w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center pointer-events-auto hover:bg-black transition"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveImage((prev) => (prev < product.images.length - 1 ? prev + 1 : 0))}
                        className="w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center pointer-events-auto hover:bg-black transition"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>

                {product.images.length > 1 && (
                  <div className="flex gap-2.5 justify-center">
                    {product.images.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImage(idx)}
                        className={`w-16 h-20 rounded-xl overflow-hidden border-2 transition cursor-pointer ${
                          activeImage === idx ? "border-zinc-900 dark:border-amber-400 shadow-sm scale-105" : "border-zinc-200 dark:border-zinc-800 opacity-60"
                        }`}
                      >
                        <img src={img} alt="thumb" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Trust Badges Section Below Product */}
            <TrustBadges />
          </>
        )}
      </main>
    </div>
  );
}
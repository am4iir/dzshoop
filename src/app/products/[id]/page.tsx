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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderId, setOrderId] = useState("");

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
    if (!fullName || !phone) {
      alert("يرجى إدخال الاسم ورقم الهاتف لإكمال الطلب");
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
          fullName,
          phone,
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
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        } catch (e) {}
      }
    } catch (err) {
      setIsSubmitting(false);
      alert("حدث خطأ أثناء إرسال الطلب، يرجى المحاولة ثانية");
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 pb-20">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-12">
        {orderConfirmed ? (
          <div className="max-w-md mx-auto bg-white border border-emerald-200 rounded-3xl p-8 text-center shadow-xl">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-zinc-900 mb-1">تم تأكيد طلبك بنجاح!</h2>
            <p className="text-xs text-zinc-500 mb-6">
              رقم الطلبية: <span className="font-bold text-zinc-900 bg-zinc-100 px-2 py-1 rounded font-mono">{orderId}</span>
              <br />سنتصل بك هاتفياً لتأكيد الشحن فوراً.
            </p>

            <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-4 text-xs space-y-2 text-right mb-6">
              <div className="flex justify-between">
                <span className="text-zinc-500">المنتج:</span>
                <span className="font-bold">{product.name} ({quantity})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">المقاس:</span>
                <span className="font-bold">{selectedSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">العنوان:</span>
                <span className="font-bold">{currentWilaya.name}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-zinc-200 font-extrabold text-sm text-zinc-900">
                <span>المبلغ الكلي:</span>
                <span className="text-emerald-600">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-zinc-700 hover:text-black"
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
                  <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 leading-tight">
                    {product.name}
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-1">{product.subtitle}</p>

                  <div className="flex items-baseline gap-3 mt-3">
                    <span className="text-2xl sm:text-3xl font-black text-red-600">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-sm text-zinc-400 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                    {product.badge && (
                      <span className="bg-red-500 text-white font-bold text-xs px-2 py-0.5 rounded-full">
                        {product.badge}
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                {product.description && (
                  <p className="text-xs text-zinc-600 leading-relaxed bg-zinc-100/70 p-3.5 rounded-xl border border-zinc-200/50">
                    {product.description}
                  </p>
                )}

                {/* Sizes Selection */}
                {product.sizes && product.sizes.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold text-zinc-600">المقاس المتوفر</label>
                      <button
                        type="button"
                        onClick={() => setIsSizeModalOpen(true)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100/80 px-2.5 py-1 rounded-lg border border-amber-200/80 transition"
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
                          className={`min-w-[48px] py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                            selectedSize === size
                              ? "border-zinc-900 bg-zinc-900 text-white shadow-sm"
                              : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400"
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
                    <label className="block text-xs font-bold text-zinc-600 mb-2">اللون</label>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setSelectedColor(color)}
                          className={`py-1.5 px-3 text-xs font-bold rounded-xl border transition-all ${
                            selectedColor === color
                              ? "border-zinc-900 bg-zinc-900 text-white shadow-sm"
                              : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400"
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
                      className="flex-1 bg-white border-2 border-zinc-900 text-zinc-900 hover:bg-zinc-900 hover:text-white font-extrabold py-3.5 px-4 rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-sm"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>أضف إلى السلة</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleBuyNow}
                      className="flex-1 bg-zinc-950 hover:bg-black text-white font-extrabold py-3.5 px-4 rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-md"
                    >
                      <span>الشراء الآن ⚡</span>
                    </button>
                  </div>
                </div>

                {/* Direct Order Form Accordion Card */}
                <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 sm:p-6 shadow-sm">
                  <h3 className="text-sm font-black text-center text-zinc-900 mb-5">
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
                          className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white rounded-xl py-3 pr-9 pl-3 text-xs text-zinc-900 placeholder:text-zinc-400 outline-none transition"
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
                          className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white rounded-xl py-3 pr-9 pl-3 text-xs text-zinc-900 placeholder:text-zinc-400 outline-none transition dir-ltr text-right"
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
                          className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white rounded-xl py-3 px-3 text-xs text-zinc-900 outline-none transition cursor-pointer"
                        >
                          {WILAYAS.map((w) => (
                            <option key={w.code} value={w.code}>
                              {w.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="relative">
                        <select
                          value={commune}
                          onChange={(e) => setCommune(e.target.value)}
                          className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white rounded-xl py-3 px-3 text-xs text-zinc-900 outline-none transition cursor-pointer"
                        >
                          {currentWilaya.communes.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Delivery Location */}
                    <div className="pt-2">
                      <span className="block text-[11px] font-bold text-zinc-600 mb-2">مكان التوصيل</span>
                      <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="delivery"
                            checked={deliveryType === "home"}
                            onChange={() => setDeliveryType("home")}
                            className="w-4 h-4 accent-zinc-900"
                          />
                          <span className="text-xs text-zinc-700">توصيل للمنزل</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="delivery"
                            checked={deliveryType === "desk"}
                            onChange={() => setDeliveryType("desk")}
                            className="w-4 h-4 accent-zinc-900"
                          />
                          <span className="text-xs text-zinc-700">استلام من المكتب</span>
                        </label>
                      </div>
                    </div>

                    {/* Price breakdown */}
                    <div className="pt-3 border-t border-zinc-100 space-y-1 text-xs">
                      <div className="flex justify-between text-zinc-600">
                        <span>سعر التوصيل</span>
                        <span className="font-semibold">{formatPrice(deliveryCost)}</span>
                      </div>
                      <div className="flex justify-between text-zinc-600">
                        <span>سعر المنتجات</span>
                        <span className="font-semibold">{formatPrice(itemsTotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-black text-emerald-600 pt-1">
                        <span>التكلفة الإجمالية</span>
                        <span>{formatPrice(grandTotal)}</span>
                      </div>
                    </div>

                    {/* Submit Button & Quantity Bar */}
                    <div className="flex items-center gap-3 pt-3">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-zinc-950 hover:bg-black text-white font-black py-3.5 px-6 rounded-xl text-xs sm:text-sm tracking-wide transition shadow-sm disabled:opacity-50 cursor-pointer"
                      >
                        {isSubmitting ? "جاري الإرسال..." : "تأكيد الطلب الفوري"}
                      </button>

                      <div className="flex items-center border border-zinc-200 rounded-xl bg-zinc-50 px-2 h-11">
                        <button
                          type="button"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-7 h-7 text-zinc-600 font-bold hover:text-black flex items-center justify-center text-sm"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-bold text-xs">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => setQuantity(quantity + 1)}
                          className="w-7 h-7 text-zinc-600 font-bold hover:text-black flex items-center justify-center text-sm"
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
                <div className="relative aspect-[4/5] bg-zinc-100 rounded-3xl overflow-hidden border border-zinc-200 shadow-sm">
                  <img
                    src={product.images[activeImage] || product.images[0]}
                    alt={product.name}
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
                        className={`w-16 h-20 rounded-xl overflow-hidden border-2 transition ${
                          activeImage === idx ? "border-zinc-900 shadow-sm scale-105" : "border-zinc-200 opacity-60"
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
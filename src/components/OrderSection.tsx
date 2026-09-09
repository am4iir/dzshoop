"use client";

import { useState } from "react";
import { Product, WILAYAS } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { CheckCircle2, Truck, ShieldCheck, ShoppingBag, ArrowLeft, RefreshCw, Sparkles, MapPin, Phone, User, MessageSquare } from "lucide-react";
import confetti from "canvas-confetti";

interface OrderFormProps {
  product: Product;
}

export function OrderSection({ product }: OrderFormProps) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[1] || product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || "");
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  
  // Checkout Form State
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [wilayaCode, setWilayaCode] = useState("16");
  const [commune, setCommune] = useState("");
  const [deliveryType, setDeliveryType] = useState<"home" | "desk">("home");
  const [notes, setNotes] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderId, setOrderId] = useState("");

  const currentWilaya = WILAYAS.find((w) => w.code === wilayaCode) || WILAYAS[0];
  const deliveryCost = deliveryType === "home" ? currentWilaya.homeDelivery : currentWilaya.deskDelivery;
  const itemsTotal = product.price * quantity;
  const grandTotal = itemsTotal + deliveryCost;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) {
      alert("يرجى ملء الاسم ورقم الهاتف لإكمال الطلب");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const generatedId = "DZ-" + Math.floor(100000 + Math.random() * 900000);
      setOrderId(generatedId);
      setOrderConfirmed(true);

      // Trigger Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // Confetti fallback
      }
    }, 900);
  };

  return (
    <div id="order-section" className="py-12 border-t border-zinc-800/80">
      <div className="max-w-6xl mx-auto px-4">
        {orderConfirmed ? (
          <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border border-emerald-500/30 rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto shadow-2xl">
            <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-400">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <span className="inline-block px-4 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 mb-3 border border-emerald-500/20">
              تم تسجيل طلبيتك بنجاح!
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
              شكراً لثقتك بنا يا {fullName}!
            </h3>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
              رقم الطلبية الخاص بك هو: <span className="text-white font-mono font-bold bg-zinc-800 px-2.5 py-1 rounded-md">{orderId}</span>
              <br />سيتصل بك فريق العمل هاتفياً لتأكيد التفاصيل وشحن الطرد فوراً.
            </p>

            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 mb-6 text-right space-y-2 text-sm text-zinc-300">
              <div className="flex justify-between pb-2 border-b border-zinc-800 font-medium">
                <span>المنتج:</span>
                <span className="text-white">{product.name} ({quantity} قطعة)</span>
              </div>
              <div className="flex justify-between">
                <span>المقاس واللون:</span>
                <span className="text-white">{selectedSize} / {selectedColor}</span>
              </div>
              <div className="flex justify-between">
                <span>الولاية:</span>
                <span className="text-white">{currentWilaya.name}</span>
              </div>
              <div className="flex justify-between font-bold text-base text-amber-400 pt-2 border-t border-zinc-800">
                <span>المبلغ الإجمالي عند الاستلام:</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <button
              onClick={() => setOrderConfirmed(false)}
              className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> طلب منتج آخر
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Gallery + Product specs (Left on RTL) */}
            <div className="lg:col-span-6 space-y-6">
              <div className="relative rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 aspect-square shadow-xl group">
                <img
                  src={product.images[activeImage]}
                  alt={product.name}
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                {product.badge && (
                  <div className="absolute top-4 right-4 bg-amber-500 text-black font-bold text-xs px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    {product.badge}
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                      activeImage === idx ? "border-amber-500 scale-105 shadow-md" : "border-zinc-800 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="preview" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Product highlights */}
              <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-5 space-y-3">
                <h4 className="text-sm font-semibold text-zinc-300">مميزات هذا الإصدار:</h4>
                <ul className="space-y-2 text-sm text-zinc-400">
                  {product.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-zinc-900/30 border border-zinc-800/60 flex items-center gap-3">
                  <Truck className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <div className="text-xs">
                    <p className="font-semibold text-zinc-200">توصيل لـ 58 ولاية</p>
                    <p className="text-zinc-500">من 24 إلى 48 ساعة</p>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-900/30 border border-zinc-800/60 flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <div className="text-xs">
                    <p className="font-semibold text-zinc-200">الدفع عند الاستلام</p>
                    <p className="text-zinc-500">معاينة قبل الشراء</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Order Form (Right on RTL) */}
            <div className="lg:col-span-6 bg-zinc-900 border border-zinc-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <div className="border-b border-zinc-800 pb-5 mb-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">طلب مباشر سريع</span>
                <h2 className="text-2xl font-bold text-white mt-1">{product.name}</h2>
                <p className="text-zinc-400 text-sm mt-1">{product.subtitle}</p>
                
                <div className="flex items-baseline gap-3 mt-4">
                  <span className="text-3xl font-extrabold text-white tracking-tight">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-lg text-zinc-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="bg-red-500/10 text-red-400 text-xs font-bold px-2 py-0.5 rounded border border-red-500/20">
                    وفر {formatPrice(product.originalPrice - product.price)}
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmitOrder} className="space-y-6">
                {/* Variant: Size Selection */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2.5">
                    اختر المقاس (Size):
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`py-2.5 text-center text-sm font-bold rounded-xl border transition-all ${
                          selectedSize === size
                            ? "bg-white text-black border-white shadow-lg"
                            : "bg-zinc-950/60 text-zinc-400 border-zinc-800 hover:border-zinc-700"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Variant: Color Selection */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2.5">
                    اختر اللون: <span className="text-amber-400 font-normal">({selectedColor})</span>
                  </label>
                  <div className="flex gap-3">
                    {product.colors.map((color) => (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => setSelectedColor(color.name)}
                        className={`group relative flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-medium transition-all ${
                          selectedColor === color.name
                            ? "border-amber-400 bg-amber-400/10 text-white"
                            : "border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700"
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/30"
                          style={{ backgroundColor: color.hex }}
                        />
                        {color.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2.5">
                    الكمية:
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-zinc-800 rounded-xl bg-zinc-950/80 px-2">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-white text-lg font-bold"
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-bold text-white text-sm">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-white text-lg font-bold"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-xs text-zinc-500">
                      (المجموع الفرعي: {formatPrice(itemsTotal)})
                    </span>
                  </div>
                </div>

                <div className="h-px bg-zinc-800/80 my-2" />

                {/* Customer Info Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-zinc-400" /> الاسم واللقب الكامل *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="مثال: أمين عبادة"
                      className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-zinc-400" /> رقم الهاتف *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="05 / 06 / 07 XX XX XX XX"
                      className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition dir-ltr text-right"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-zinc-400" /> الولاية *
                      </label>
                      <select
                        value={wilayaCode}
                        onChange={(e) => setWilayaCode(e.target.value)}
                        className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-amber-400 rounded-xl px-3 py-3 text-sm text-white outline-none transition"
                      >
                        {WILAYAS.map((w) => (
                          <option key={w.code} value={w.code} className="bg-zinc-900 text-white">
                            {w.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                        البلدية / العنوان *
                      </label>
                      <input
                        type="text"
                        value={commune}
                        onChange={(e) => setCommune(e.target.value)}
                        placeholder="اسم البلدية أو الحي"
                        className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Delivery Option */}
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-2">طريقة التوصيل:</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setDeliveryType("home")}
                        className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between ${
                          deliveryType === "home"
                            ? "border-amber-400 bg-amber-400/10 text-white"
                            : "border-zinc-800 bg-zinc-950/50 text-zinc-400 hover:border-zinc-700"
                        }`}
                      >
                        <span className="text-xs font-semibold text-zinc-200">توصيل للباب (المنزل)</span>
                        <span className="text-xs font-bold text-amber-400 mt-1">+{formatPrice(currentWilaya.homeDelivery)}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeliveryType("desk")}
                        className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between ${
                          deliveryType === "desk"
                            ? "border-amber-400 bg-amber-400/10 text-white"
                            : "border-zinc-800 bg-zinc-950/50 text-zinc-400 hover:border-zinc-700"
                        }`}
                      >
                        <span className="text-xs font-semibold text-zinc-200">استلام من المكتب (Stop Desk)</span>
                        <span className="text-xs font-bold text-amber-400 mt-1">+{formatPrice(currentWilaya.deskDelivery)}</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-zinc-400" /> ملاحظة للطلبية (اختياري)
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="مثال: يرجى الاتصال بعد الساعة الرابعة مساءً"
                      className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-amber-400 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-zinc-600 outline-none transition"
                    />
                  </div>
                </div>

                {/* Total Summary */}
                <div className="bg-zinc-950 border border-zinc-800/90 rounded-2xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between text-zinc-400">
                    <span>قيمة المشتريات:</span>
                    <span>{formatPrice(itemsTotal)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>تكلفة التوصيل:</span>
                    <span>{formatPrice(deliveryCost)}</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-zinc-800">
                    <span>المجموع الإجمالي:</span>
                    <span className="text-amber-400 text-lg">{formatPrice(grandTotal)}</span>
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full relative group overflow-hidden bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-base py-4 px-6 rounded-2xl shadow-xl shadow-amber-500/20 hover:shadow-amber-400/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      <span>تأكيد الطلب الآن (الدفع عند الاستلام)</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

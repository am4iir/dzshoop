"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { useLanguage } from "@/components/LanguageContext";
import { Product } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import {
  Sparkles,
  Truck,
  ShieldCheck,
  RotateCcw,
  Package,
  ArrowDown,
  Flame,
  Star,
  ShoppingBag,
  MessageCircle,
  Gem,
} from "lucide-react";

export default function HomePage() {
  const { t, dir, lang } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  const categories = useMemo(
    () => [
      { id: "all", label: lang === "ar" ? "🔥 جميع المنتجات" : "All Products" },
      { id: "t-shirt", label: lang === "ar" ? "👕 T-Shirts & Polos" : "T-Shirts & Polos" },
      { id: "pants", label: lang === "ar" ? "👖 Jeans & Cargos" : "Jeans & Cargos" },
      { id: "ensemble", label: lang === "ar" ? "🧥 Ensembles & Hoodies" : "Ensembles & Hoodies" },
    ],
    [lang]
  );

  useEffect(() => {
    let isMounted = true;
    fetch("/api/products")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (isMounted) {
          setProducts(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      const nameMatch = p.name?.toLowerCase().includes(q) || false;
      const subMatch = p.subtitle?.toLowerCase().includes(q) || false;
      const matchesSearch = !q || nameMatch || subMatch;

      if (selectedCategory === "all") return matchesSearch;

      const catMatch =
        p.name?.toLowerCase().includes(selectedCategory) ||
        p.subtitle?.toLowerCase().includes(selectedCategory) ||
        p.id?.includes(selectedCategory);

      return matchesSearch && catMatch;
    });
  }, [products, search, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#07070a] text-zinc-900 dark:text-zinc-100 pb-20 transition-colors duration-200" dir={dir}>
      <Navbar searchQuery={search} onSearchChange={setSearch} />

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-12">
        {/* ==================== HIGH-FASHION EDITORIAL HERO BANNER ==================== */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c0d17] via-[#08080f] to-[#040407] text-white p-7 sm:p-14 shadow-2xl border border-white/10">
          <div className="relative z-10 max-w-2xl space-y-6">
            {/* Tag Badge */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-violet-500/15 text-violet-300 border border-violet-500/30 shadow-sm lowercase font-mono">
                <Flame className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
                <span>bx.wear.dz • drop 2026</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-white/5 text-zinc-300 border border-white/10">
                <Sparkles className="w-3 h-3 text-violet-400" />
                <span>HAUTE STREETWEAR ALGERIA</span>
              </span>
            </div>

            {/* Hero Main Heading */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-6xl font-black tracking-tight leading-tight lowercase font-mono">
                bx<span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-400">.wear.dz</span>
              </h1>
              <p className="text-xs sm:text-sm font-black tracking-[0.25em] text-violet-400/90 uppercase">
                L'Atelier du Streetwear Algérien
              </p>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-medium max-w-xl">
              {lang === "ar"
                ? "أرقى تشكيلة ستريت وير في الجزائر بخامات قطنية 100% ثقيلة فاخرة (Heavyweight 340 GSM). شحن سريع لجميع الولايات الـ 58 مع الدفع عند الاستلام بعد معاينة وفحص الطرد."
                : "Exclusive heavyweight streetwear atelier in Algeria. Premium 100% cotton with nationwide fast shipping and parcel inspection before payment."}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#collection"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-violet-600/30 hover:scale-105 transition-all duration-200 cursor-pointer"
              >
                <span>{lang === "ar" ? "تصفح الكوليكشن الحصرية" : "Explore Collection"}</span>
                <ArrowDown className="w-4 h-4" />
              </a>

              <a
                href="https://wa.me/213555000000"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-[#0e0f17] hover:bg-zinc-800 border border-violet-500/30 text-violet-200 hover:text-white font-bold text-xs sm:text-sm transition duration-200"
              >
                <MessageCircle className="w-4 h-4 text-violet-400" />
                <span>{lang === "ar" ? "خدمة VIP واتساب" : "VIP WhatsApp"}</span>
              </a>
            </div>

            {/* Micro Trust Pointers */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-3 text-[11px] sm:text-xs font-bold border-t border-white/10 text-zinc-400">
              <div className="flex items-center gap-1.5 text-zinc-300">
                <Truck className="w-4 h-4 text-violet-400" />
                <span>{lang === "ar" ? "توصيل سريع 58 ولاية" : "58 Wilayas Fast Delivery"}</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{lang === "ar" ? "معاينة وفحص قبل الدفع" : "Inspect Before Payment"}</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-300">
                <RotateCcw className="w-4 h-4 text-violet-400" />
                <span>{lang === "ar" ? "استبدال المقاس مضمون" : "Easy Size Exchange"}</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-300">
                <Gem className="w-4 h-4 text-violet-400" />
                <span>{lang === "ar" ? "قطن 100% ثقيل 340 GSM" : "Heavyweight Cotton"}</span>
              </div>
            </div>
          </div>

          {/* Ambient Lighting Background Accents */}
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
        </section>

        {/* ==================== CATEGORIES FILTER BAR ==================== */}
        <div id="collection" className="pt-2">
          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/30 scale-105 border border-violet-400/40"
                    : "bg-white dark:bg-[#0c0d14] border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-300 hover:border-violet-500/40"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* ==================== PRODUCT GRID HEADER ==================== */}
        <div className="flex items-center justify-between border-b border-zinc-200/80 dark:border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
              {t("home", "collectionTitle")}
            </h2>
            <span className="bg-violet-500/15 text-violet-600 dark:text-violet-300 text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-violet-500/30">
              {filtered.length} {t("home", "products")}
            </span>
          </div>

          <span className="text-xs text-zinc-400 font-medium hidden sm:inline">
            {lang === "ar" ? "الدفع عند الاستلام بعد المعاينة" : "Cash on delivery"}
          </span>
        </div>

        {/* ==================== PRODUCT GRID ==================== */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse bg-zinc-200/70 dark:bg-zinc-800/50 rounded-3xl h-96" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-[#0c0d14] rounded-3xl border border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 space-y-3">
            <Package className="w-10 h-10 mx-auto text-zinc-400 stroke-1" />
            <p className="text-xs sm:text-sm font-bold">{t("home", "noResults")}</p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory("all");
              }}
              className="text-xs font-bold text-violet-500 underline cursor-pointer"
            >
              {lang === "ar" ? "إعادة تعيين الفلاتر" : "Reset filters"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filtered.map((prod) => (
              <div
                key={prod.id}
                className="group flex flex-col bg-white dark:bg-[#0c0d14] rounded-3xl border border-zinc-200/90 dark:border-white/10 overflow-hidden hover:shadow-2xl hover:border-violet-500/50 hover:shadow-violet-500/10 transition-all duration-300 relative"
              >
                {/* Product Image Showcase */}
                <div className="relative aspect-[3/4] bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
                  <img
                    src={
                      prod.images[0] ||
                      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=900&auto=format&fit=crop"
                    }
                    alt={prod.name}
                    loading="lazy"
                    decoding="async"
                    className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ${
                      prod.inStock === false ? "opacity-75 grayscale-30" : ""
                    }`}
                  />

                  {/* Badges Overlay */}
                  <div
                    className={`absolute top-3 ${
                      dir === "rtl" ? "right-3" : "left-3"
                    } flex flex-col items-start gap-1.5 z-10`}
                  >
                    {prod.inStock === false ? (
                      <span className="bg-black/90 text-violet-400 border border-violet-500/40 font-black text-[10px] px-2.5 py-0.5 rounded-full shadow-md backdrop-blur-xs tracking-wider uppercase">
                        SOLD OUT
                      </span>
                    ) : prod.badge ? (
                      <span className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-black text-[10px] px-2.5 py-0.5 rounded-full shadow-sm tracking-wide uppercase">
                        {prod.badge}
                      </span>
                    ) : (
                      <span className="bg-black/80 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full backdrop-blur-xs border border-violet-500/30">
                        COTTON 100%
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 sm:p-5 flex flex-col flex-1 text-center justify-between space-y-3">
                  <div className="space-y-1.5">
                    <h3 className="text-xs sm:text-sm font-extrabold text-zinc-900 dark:text-zinc-100 line-clamp-2 leading-snug group-hover:text-violet-400 transition-colors">
                      {prod.name}
                    </h3>
                    {prod.subtitle && (
                      <p className="text-[11px] text-zinc-400 line-clamp-1">
                        {prod.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-center gap-2 pt-1">
                    <span className="text-base sm:text-lg font-black text-zinc-950 dark:text-white font-mono">
                      {formatPrice(prod.price)}
                    </span>
                    {prod.originalPrice && prod.originalPrice > prod.price && (
                      <span className="text-xs text-zinc-400 line-through">
                        {formatPrice(prod.originalPrice)}
                      </span>
                    )}
                  </div>

                  {/* Sizes pill preview */}
                  {prod.sizes && prod.sizes.length > 0 && (
                    <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-zinc-400">
                      {prod.sizes.slice(0, 4).map((s) => (
                        <span key={s} className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-white/10">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Order Button */}
                  <div className="pt-2">
                    {prod.inStock === false ? (
                      <Link
                        href={`/products/${prod.id}`}
                        className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 font-extrabold text-xs uppercase tracking-wider transition"
                      >
                        SOLD OUT
                      </Link>
                    ) : (
                      <Link
                        href={`/products/${prod.id}`}
                        className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm shadow-md shadow-violet-600/25 hover:shadow-lg hover:shadow-violet-600/40 transition-all duration-200 cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{t("home", "orderNow")}</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ==================== THE BRAND GUARANTEES (L'EXPÉRIENCE BX.WEAR) ==================== */}
        <section className="bg-gradient-to-br from-[#0c0d17] via-[#08080f] to-[#040407] text-white rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold text-violet-400 uppercase tracking-widest block">
              {lang === "ar" ? "معايير الفخامة والضمان" : "Haute Quality Standards"}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              {lang === "ar" ? "لماذا يفضل الجميع براند bx.wear.dz؟" : "Why Choose bx.wear.dz?"}
            </h3>
            <p className="text-xs text-zinc-400">
              {lang === "ar"
                ? "نحن لا نبيع الملابس فقط، بل نقدم تجربة ستريت وير راقية مع حماية وضمان 100% للزبون الجزائري."
                : "Premium streetwear experience with 100% customer protection in Algeria."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#0e0f17]/90 border border-white/10 rounded-2xl p-5 space-y-3 hover:border-violet-500/40 transition">
              <div className="w-10 h-10 rounded-xl bg-violet-500/15 text-violet-400 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-white">
                {lang === "ar" ? "خامات قطنية 100% ثقيلة" : "100% Heavy Cotton"}
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {lang === "ar"
                  ? "أقمشة Heavyweight 340 GSM عالية الكثافة لا تتغير مع الغسيل المتكرر ومريحة في كل فصول السنة."
                  : "Durable high-density heavyweight fabrics that maintain their shape."}
              </p>
            </div>

            <div className="bg-[#0e0f17]/90 border border-white/10 rounded-2xl p-5 space-y-3 hover:border-emerald-500/40 transition">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-white">
                {lang === "ar" ? "معاينة الطرد قبل الدفع" : "Inspect Before Pay"}
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {lang === "ar"
                  ? "افحص طلبك وتأكد من القماش والمقاس قبل دفع أي دينار. حق المعاينة مكفول لجميع الزبائن."
                  : "Open and inspect your parcel with the delivery courier before paying."}
              </p>
            </div>

            <div className="bg-[#0e0f17]/90 border border-white/10 rounded-2xl p-5 space-y-3 hover:border-violet-500/40 transition">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center font-bold">
                <Truck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-white">
                {lang === "ar" ? "شحن سريع لـ 58 ولاية" : "58 Wilayas Shipping"}
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {lang === "ar"
                  ? "توصيل آمن وسريع حتى باب منزلك أو إلى مكاتب التوصيل في جميع الولايات بأسعار مدروسة."
                  : "Fast home or desk delivery across Algeria with full tracking."}
              </p>
            </div>

            <div className="bg-[#0e0f17]/90 border border-white/10 rounded-2xl p-5 space-y-3 hover:border-purple-500/40 transition">
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center font-bold">
                <RotateCcw className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-white">
                {lang === "ar" ? "ضمان المقاس والاستبدال" : "Size Exchange Guarantee"}
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {lang === "ar"
                  ? "إذا لم يناسبك المقاس، نوفر خدمة الاستبدال السريع عبر التواصل المباشر مع فريق الدعم."
                  : "Easy exchange if the size does not fit you perfectly."}
              </p>
            </div>
          </div>

          {/* Social Proof Bar */}
          <div className="bg-[#08080f] border border-white/10 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex text-violet-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-violet-400" />
                ))}
              </div>
              <span className="text-xs font-bold text-white">
                4.9 / 5.0
              </span>
              <span className="text-xs text-zinc-400">
                {lang === "ar" ? "(أكثر من 1,500 زبون فخور بالماركة في الجزائر 🇩🇿)" : "(1,500+ happy customers in Algeria)"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="https://wa.me/213555000000"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-400 hover:text-violet-300"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{lang === "ar" ? "خدمة الزبائن عبر الواتساب" : "WhatsApp Support"}</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ==================== HIGH-FASHION FOOTER ==================== */}
      <footer className="mt-16 border-t border-white/10 bg-[#07070a] py-12 text-zinc-400 text-xs">
        <div className={`max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center ${dir === "rtl" ? "md:text-right" : "md:text-left"}`}>
          {/* Col 1: Brand Info */}
          <div className="space-y-3">
            <div className="font-mono font-black text-xl text-white tracking-widest lowercase">
              bx<span className="text-violet-400">.wear.dz</span>
            </div>
            <p className="text-zinc-400 text-[11px] leading-relaxed max-w-sm">
              {t("home", "footerBrandDesc")}
            </p>
            <div className="pt-1 flex items-center justify-center md:justify-start gap-2">
              <span className="inline-block bg-[#0e0f17] border border-white/10 text-violet-400 px-3 py-1 rounded-full text-[11px] font-mono font-bold">
                Instagram: @bx.wear.dz
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-2">
            <h5 className="font-bold text-white text-xs uppercase tracking-wider">{t("home", "footerQuickLinks")}</h5>
            <ul className="space-y-2 text-[11px]">
              <li>
                <Link href="/" className="hover:text-white transition">{t("home", "footerHome")}</Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-white transition">{t("home", "footerCart")}</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition">شروط الخدمة والضمان</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Support & WhatsApp */}
          <div className="space-y-2">
            <h5 className="font-bold text-white text-xs uppercase tracking-wider">{t("home", "footerSupport")}</h5>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              {t("home", "footerSupportDesc")}
            </p>
            <div className="pt-2">
              <a
                href="https://wa.me/213555000000"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-violet-600/30 transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{lang === "ar" ? "طلب مساعدة أو استفسار" : "WhatsApp Inquiries"}</span>
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 mt-8 pt-6 border-t border-white/5 text-center text-[11px] text-zinc-500">
          <p>{t("home", "footerCopyright")}</p>
        </div>
      </footer>
    </div>
  );
}

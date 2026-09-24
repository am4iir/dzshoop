"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { useLanguage } from "@/components/LanguageContext";
import { Product } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import {
  Truck,
  ShieldCheck,
  RotateCcw,
  Package,
  ShoppingBag,
  MessageCircle,
  Gem,
  Flame,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

export default function HomePage() {
  const { dir, lang } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const productsScrollRef = useRef<HTMLDivElement>(null);

  const categories = useMemo(
    () => [
      { id: "all", label: lang === "ar" ? "كل السلعة" : "All Products" },
      { id: "t-shirt", label: lang === "ar" ? "تريكوات (T-Shirts)" : "T-Shirts" },
      { id: "pants", label: lang === "ar" ? "سراول وكارغو" : "Jeans & Cargos" },
      { id: "ensemble", label: lang === "ar" ? "هوديز وأطقم" : "Hoodies" },
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

  const scrollProducts = (direction: "left" | "right") => {
    if (productsScrollRef.current) {
      const scrollAmount = 350;
      productsScrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#07070a] text-zinc-900 dark:text-zinc-100 transition-colors duration-200" dir={dir}>
      <Navbar searchQuery={search} onSearchChange={setSearch} />

      {/* ==================== CINEMATIC HERO SECTION ==================== */}
      <section className="relative w-full min-h-[85vh] sm:min-h-[90vh] flex items-center overflow-hidden bg-black text-white">
        {/* Background Image with Cinematic Figure & Sunset */}
        <div
          className="absolute inset-0 bg-cover bg-center sm:bg-[center_top] no-repeat scale-105 transform duration-1000"
          style={{ backgroundImage: "url('/hero-cinematic.jpg')" }}
        />

        {/* Ambient Dark Gradient Overlays for High Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-black/30 lg:to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#fafafa] dark:from-[#07070a] via-transparent to-black/50 z-10" />

        {/* Hero Content Container */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-12 py-20 w-full">
          <div className="max-w-2xl space-y-6">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wider uppercase text-zinc-200">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === "ar" ? "سلعة جديدة • دروب 2026" : "New Drop 2026"}</span>
            </div>

            {/* Main Headline (Direct & Natural, Matching Reference) */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1]">
              {lang === "ar" ? (
                <>
                  اللبسة لي توقف عليك <br />
                  <span className="text-white">ستريت وير أصلي</span>
                </>
              ) : (
                <>
                  Adventure Begins With <br />
                  <span className="text-white">Every Purchase</span>
                </>
              )}
            </h1>

            {/* Subtitle - Real Human Algerian Tone */}
            <p className="text-sm sm:text-base text-zinc-300 max-w-xl font-normal leading-relaxed">
              {lang === "ar"
                ? "سلعة نقية ومخدومة بالشان. قطن 100% ثقيل 340 GSM، خياطة متقونة، وتوصيل سريع حتى لباب دارك في 69 ولاية. حل كوليك، أفحص سلعتك وتأكد بعينك عاد تخلص."
                : "Real heavyweight streetwear. 100% pure thick cotton (340 GSM), nationwide fast shipping across 69 wilayas, with full parcel inspection before payment."}
            </p>

            {/* Pill CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <a
                href="#featured"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-white text-black font-black text-sm sm:text-base hover:bg-zinc-200 hover:scale-105 transition-all duration-200 shadow-[0_0_25px_rgba(255,255,255,0.3)] cursor-pointer"
              >
                {lang === "ar" ? "أشري درك" : "Shop Now"}
              </a>

              <a
                href="#categories"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-transparent border-2 border-white text-white font-black text-sm sm:text-base hover:bg-white/10 hover:border-white transition-all duration-200 cursor-pointer"
              >
                {lang === "ar" ? "شوف السلعة كاملة" : "Explore Collection"}
              </a>
            </div>

            {/* Micro Highlights - Strictly 69 Wilayas */}
            <div className="pt-8 flex flex-wrap items-center gap-6 text-xs text-zinc-300 font-medium">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-white" />
                <span>{lang === "ar" ? "توصيل سريع لـ 69 ولاية" : "69 Wilayas Delivery"}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{lang === "ar" ? "افحص قبل ما تخلص" : "Inspect Before Paying"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Gem className="w-4 h-4 text-amber-400" />
                <span>{lang === "ar" ? "قطن 100% ثقيل 340 GSM" : "100% Heavy Cotton"}</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-white" />
                <span>{lang === "ar" ? "التبديل ساهل وفوري" : "Easy Exchange"}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FEATURED PRODUCTS SECTION ==================== */}
      <section id="featured" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 space-y-8">
        {/* Section Header with Navigation Arrows */}
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-white/10 pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
              {lang === "ar" ? "السلعة لي راهي دايرة حالة" : "Featured Products"}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              {lang === "ar" ? "أقوى القطع لي عليها الطلب حالياً — كميات محدودة" : "Our most demanded exclusive pieces — limited stock"}
            </p>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollProducts("left")}
              className="p-2.5 rounded-full bg-zinc-200 hover:bg-zinc-300 dark:bg-white/5 dark:hover:bg-white/20 border border-zinc-300 dark:border-white/10 text-zinc-800 dark:text-white transition cursor-pointer"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scrollProducts("right")}
              className="p-2.5 rounded-full bg-zinc-200 hover:bg-zinc-300 dark:bg-white/5 dark:hover:bg-white/20 border border-zinc-300 dark:border-white/10 text-zinc-800 dark:text-white transition cursor-pointer"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div id="categories" className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-zinc-950 text-white dark:bg-white dark:text-black font-black shadow-md"
                  : "bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/10"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse bg-zinc-200/80 dark:bg-white/5 rounded-2xl h-96 border border-zinc-200 dark:border-white/10" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-white/5 rounded-3xl border border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 space-y-3">
            <Package className="w-10 h-10 mx-auto text-zinc-400" />
            <p className="text-sm font-bold">{lang === "ar" ? "ما كانش منتجات بهاد الاسم حالياً" : "No products found"}</p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory("all");
              }}
              className="text-xs font-bold text-zinc-900 dark:text-white underline cursor-pointer"
            >
              {lang === "ar" ? "إعادة ضبط الفلاتر" : "Reset filters"}
            </button>
          </div>
        ) : (
          <div
            ref={productsScrollRef}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {filtered.map((prod) => (
              <div
                key={prod.id}
                className="group flex flex-col bg-white dark:bg-[#0e0f17] rounded-2xl border border-zinc-200 dark:border-white/10 overflow-hidden hover:border-zinc-400 dark:hover:border-white/30 hover:shadow-xl transition-all duration-300 relative"
              >
                {/* Product Image */}
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

                  {/* Badge */}
                  <div
                    className={`absolute top-3 ${
                      dir === "rtl" ? "right-3" : "left-3"
                    } flex flex-col items-start gap-1.5 z-10`}
                  >
                    {prod.inStock === false ? (
                      <span className="bg-black/90 text-red-400 border border-red-500/40 font-black text-[10px] px-2.5 py-0.5 rounded-full shadow-md uppercase">
                        خلاصت الكمية
                      </span>
                    ) : prod.badge ? (
                      <span className="bg-zinc-950 text-white dark:bg-white dark:text-black font-black text-[10px] px-2.5 py-0.5 rounded-full shadow-sm uppercase">
                        {prod.badge}
                      </span>
                    ) : (
                      <span className="bg-black/80 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full border border-white/20">
                        قطن 100%
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between space-y-3">
                  <div className="space-y-1">
                    <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white line-clamp-2 leading-snug group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">
                      {prod.name}
                    </h3>
                    {prod.subtitle && (
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1">
                        {prod.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-base sm:text-lg font-black text-zinc-950 dark:text-white font-mono">
                      {formatPrice(prod.price)}
                    </span>
                    {prod.originalPrice && prod.originalPrice > prod.price && (
                      <span className="text-xs text-zinc-400 line-through">
                        {formatPrice(prod.originalPrice)}
                      </span>
                    )}
                  </div>

                  {/* Sizes */}
                  {prod.sizes && prod.sizes.length > 0 && (
                    <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-600 dark:text-zinc-400">
                      {prod.sizes.slice(0, 4).map((s) => (
                        <span key={s} className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="pt-2">
                    {prod.inStock === false ? (
                      <Link
                        href={`/products/${prod.id}`}
                        className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-400 font-bold text-xs uppercase transition"
                      >
                        خلاصت الكمية
                      </Link>
                    ) : (
                      <Link
                        href={`/products/${prod.id}`}
                        className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 font-extrabold text-xs sm:text-sm transition shadow-sm cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{lang === "ar" ? "كوموندي درك" : "Order Now"}</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ==================== ABOUT / BRAND STORY SECTION (#about) ==================== */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 border-t border-zinc-200 dark:border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-mono font-bold text-amber-500 dark:text-amber-400 uppercase tracking-widest block">
              {lang === "ar" ? "علاش درنا bx.wear.dz؟" : "Brand Philosophy"}
            </span>
            <h3 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
              {lang === "ar"
                ? "ستريت وير جزائري مخدوم من القلب"
                : "Crafted for Distinction, Comfort & Bold Presence"}
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              {lang === "ar"
                ? "بدينا bx.wear.dz بحاجة بسيطة: كنا نحوسو على حوايج ستريت وير شابة، قطنها ثقيل وما تتبهدلش بعد أول غسلة وما لقيناش حاجة مقنعة بسعر معقول. قررنا نخدمو سلعة على قوسطونا — أقمشة 340 GSM ثقيلة، تفصال مريح ومتقون، ومعاملة صادقة مع الزبون: تطلب، يوصلك الطرد لباب دارك، تفحصه بيدك وتشوف الجودة عاد تمد دراهمك. ثقتك هي الصح عندنا."
                : "bx.wear.dz was created to offer real heavyweight streetwear in Algeria. Heavy 340 GSM cotton, honest customer experience, and inspection before payment."}
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 shadow-xs">
                <div className="text-2xl font-black text-zinc-900 dark:text-white font-mono">340 GSM</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  {lang === "ar" ? "قطن بيور ثقيل وواقف" : "Heavyweight Pure Cotton"}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 shadow-xs">
                <div className="text-2xl font-black text-zinc-900 dark:text-white font-mono">69 ولاية</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  {lang === "ar" ? "توصيل مع حق فحص الطرد" : "Wilayas Fast Shipping"}
                </div>
              </div>
            </div>
          </div>

          {/* Visual Showcase Card */}
          <div className="relative rounded-3xl overflow-hidden border border-zinc-200 dark:border-white/10 shadow-xl aspect-[4/3] bg-zinc-900">
            <img
              src="/hero-cinematic.jpg"
              alt="Brand Vision"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex items-end p-6">
              <div className="space-y-1">
                <span className="text-white font-black text-lg">BX.WEAR.DZ</span>
                <p className="text-xs text-zinc-300">
                  {lang === "ar" ? "ستريت وير جزائري أصلي • توصيل 69 ولاية" : "Official Algerian Streetwear Atelier"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="border-t border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-black py-12 text-zinc-600 dark:text-zinc-400 text-xs transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Col 1 */}
          <div className="space-y-3">
            <div className="font-mono font-black text-xl text-zinc-900 dark:text-white tracking-widest uppercase">
              BX.WEAR<span className="text-amber-500 dark:text-amber-400">.DZ</span>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 text-xs leading-relaxed max-w-sm">
              {lang === "ar"
                ? "براند ستريت وير جزائري. نخدمو السلعة لي نلبسوها حنا قبل ما نبيعوها. حق المعاينة مكفول في 69 ولاية."
                : "Premium Algerian streetwear brand engineered for individuality and maximum comfort."}
            </p>
            <div className="pt-2">
              <span className="inline-block bg-white dark:bg-white/10 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white px-3 py-1 rounded-full text-xs font-mono font-bold">
                Instagram: @bx.wear.dz
              </span>
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-2">
            <h5 className="font-bold text-zinc-900 dark:text-white text-xs uppercase tracking-wider">
              {lang === "ar" ? "روابط سريعة" : "Quick Links"}
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-black dark:hover:text-white transition">
                  {lang === "ar" ? "الرئيسية" : "Home"}
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-black dark:hover:text-white transition">
                  {lang === "ar" ? "سلة المشتريات" : "Cart"}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-black dark:hover:text-white transition">
                  {lang === "ar" ? "شروط الخدمة والضمان" : "Terms & Guarantees"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-3">
            <h5 className="font-bold text-zinc-900 dark:text-white text-xs uppercase tracking-wider">
              {lang === "ar" ? "خدمة الزبائن VIP" : "VIP Customer Service"}
            </h5>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {lang === "ar"
                ? "فريق الدعم متاح طيلة أيام الأسبوع لمساعدتك في اختيار المقاس أو الإجابة عن أي استفسار."
                : "Direct support available 7 days a week to help with sizing and orders."}
            </p>
            <a
              href="https://wa.me/213555000000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-black font-extrabold text-xs shadow-md hover:opacity-90 transition"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{lang === "ar" ? "تواصل معنا عبر الواتساب" : "Contact via WhatsApp"}</span>
            </a>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-10 pt-6 border-t border-zinc-200 dark:border-white/5 text-center text-xs text-zinc-500">
          <p>© 2026 bx.wear.dz — جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}

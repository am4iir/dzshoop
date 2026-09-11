"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Product } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { Sparkles, Truck, ShieldCheck, RotateCcw, Package } from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "جميع المنتجات" },
  { id: "t-shirt", label: "T-Shirts & Polos" },
  { id: "pants", label: "Jeans & Cargos" },
  { id: "ensemble", label: "Ensembles & Sweatshirts" },
];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

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
    <div className="min-h-screen bg-[#fafafa] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-20 transition-colors duration-200" dir="rtl">
      <Navbar searchQuery={search} onSearchChange={setSearch} />

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-10">
        {/* Minimalist Lowercase axb.wear Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white p-8 sm:p-14 shadow-2xl border border-zinc-800">
          <div className="relative z-10 max-w-xl space-y-5">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-amber-400/10 text-amber-400 border border-amber-400/20 shadow-sm lowercase font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>axb.wear • drop 2026</span>
            </span>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight font-mono lowercase">
              axb<span className="text-amber-400">.wear</span>
            </h1>

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-medium">
              أفضل الخامات القطنية 100% بتصاميم عصرية ومريحة من تصميم barae × amir. نوفر التوصيل السريع لـ 69 ولاية مع الدفع عند الاستلام وإمكانية المعاينة قبل الدفع.
            </p>

            <div className="flex flex-wrap items-center gap-5 pt-2 text-xs font-bold">
              <div className="flex items-center gap-1.5 text-zinc-300">
                <Truck className="w-4 h-4 text-emerald-400" />
                <span>توصيل لـ 69 ولاية</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>معاينة الطرد قبل الدفع</span>
              </div>
            </div>
          </div>

          {/* Ambient Glow */}
          <div className="absolute top-0 left-0 -mt-10 -ml-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Category Filters Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? "bg-zinc-900 dark:bg-amber-400 text-white dark:text-zinc-950 shadow-md scale-105"
                  : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-600"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Product Grid Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-white">تشكيلة axb الحصرية</h2>
          <span className="text-xs font-semibold text-zinc-400">({filtered.length} منتج)</span>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse bg-zinc-200/70 dark:bg-zinc-800/70 rounded-2xl h-80" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 text-xs">
            لا توجد منتجات مطابقة لبحثك حالياً.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filtered.map((prod) => (
              <div
                key={prod.id}
                className="group flex flex-col bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 overflow-hidden hover:shadow-lg hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300"
              >
                <div className="relative aspect-[4/5] bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  <img
                    src={prod.images[0] || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=900&auto=format&fit=crop"}
                    alt={prod.name}
                    loading="lazy"
                    decoding="async"
                    className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ${
                      prod.inStock === false ? "opacity-75 grayscale-30" : ""
                    }`}
                  />

                  {/* Badges */}
                  <div className="absolute top-2.5 right-2.5 flex flex-col items-end gap-1.5 z-10">
                    {prod.inStock === false && (
                      <span className="bg-zinc-950/90 text-amber-400 border border-amber-400/40 font-black text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-full shadow-md backdrop-blur-xs tracking-wider uppercase">
                        SOLD OUT
                      </span>
                    )}
                    {prod.badge && (
                      <span className="bg-red-500 text-white font-black text-[11px] px-2.5 py-0.5 rounded-full shadow-sm tracking-wide uppercase">
                        {prod.badge}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-3.5 sm:p-4 flex flex-col flex-1 text-center">
                  <h3 className="text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-200 line-clamp-2 leading-snug group-hover:text-black dark:group-hover:text-white transition">
                    {prod.name}
                  </h3>

                  <div className="mt-2.5 flex items-center justify-center gap-2">
                    <span className="text-sm sm:text-base font-extrabold text-zinc-900 dark:text-white">
                      {formatPrice(prod.price)}
                    </span>
                    {prod.originalPrice && prod.originalPrice > prod.price && (
                      <span className="text-xs text-zinc-400 line-through">
                        {formatPrice(prod.originalPrice)}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 pt-2">
                    {prod.inStock === false ? (
                      <Link
                        href={`/products/${prod.id}`}
                        className="w-full inline-flex items-center justify-center py-2 sm:py-2.5 px-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 font-extrabold text-xs sm:text-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors duration-200 uppercase tracking-wider"
                      >
                        SOLD OUT
                      </Link>
                    ) : (
                      <Link
                        href={`/products/${prod.id}`}
                        className="w-full inline-flex items-center justify-center py-2 sm:py-2.5 px-4 rounded-xl border border-zinc-900 dark:border-zinc-700 text-zinc-900 dark:text-zinc-200 font-bold text-xs sm:text-sm hover:bg-zinc-900 dark:hover:bg-amber-400 hover:text-white dark:hover:text-zinc-950 transition-colors duration-200"
                      >
                        أطلب الآن
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Trust Badges Strip */}
      <div className="max-w-6xl mx-auto px-4 pt-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-500 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-zinc-900 dark:text-white">توصيل لـ 69 ولاية</h4>
              <p className="text-[10px] text-zinc-400">سريع وبأسعار مناسبة</p>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-400/10 text-emerald-500 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-zinc-900 dark:text-white">معاينة قبل الدفع</h4>
              <p className="text-[10px] text-zinc-400">افحص طلبك ثم ادفع</p>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-400/10 text-blue-500 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-zinc-900 dark:text-white">إمكانية الاستبدال</h4>
              <p className="text-[10px] text-zinc-400">تبديل المقاس بكل سهولة</p>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-400/10 text-purple-500 flex items-center justify-center shrink-0">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-zinc-900 dark:text-white">الدفع عند الاستلام</h4>
              <p className="text-[10px] text-zinc-400">يد بيد مع الموصّل</p>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-16 border-t border-zinc-800 bg-zinc-950 py-12 text-zinc-400 text-xs">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-right">
          {/* Col 1: Brand Info */}
          <div className="space-y-3">
            <div className="font-mono font-black text-lg text-white tracking-widest lowercase">
              axb<span className="text-amber-400">.wear</span>
            </div>
            <p className="text-zinc-400 text-[11px] leading-relaxed max-w-sm">
              العلامة الرسمية لـ barae × amir في الجزائر. قطن طبيعي عالي الجودة وتصاميم ستريت وير عصرية لكل الشباب.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-2">
            <h5 className="font-bold text-white text-xs">روابط سريعة</h5>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <Link href="/" className="hover:text-white transition">الرئيسية والكوليكشن</Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-white transition">سلة المشتريات والتأكيد</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Support & Instagram */}
          <div className="space-y-2">
            <h5 className="font-bold text-white text-xs">خدمة الزبائن</h5>
            <p className="text-[11px] text-zinc-400">متواجدون للإجابة على استفساراتكم وتأكيد طلبياتكم طيلة أيام الأسبوع.</p>
            <div className="pt-1">
              <span className="inline-block bg-zinc-900 border border-zinc-800 text-amber-400 px-3 py-1 rounded-full text-[11px] font-mono font-bold">
                Instagram: @axb.wear
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 mt-8 pt-6 border-t border-zinc-900 text-center text-[11px] text-zinc-500">
          <p>© 2026 axb.wear • barae × amir. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}

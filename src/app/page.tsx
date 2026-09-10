"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Product } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { Sparkles, Truck, ShieldCheck, ShoppingBag, ArrowLeft } from "lucide-react";

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
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(search.toLowerCase());

    if (selectedCategory === "all") return matchesSearch;
    return (
      matchesSearch &&
      (p.name.toLowerCase().includes(selectedCategory) ||
        p.subtitle.toLowerCase().includes(selectedCategory) ||
        p.id.includes(selectedCategory))
    );
  });

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 pb-20" dir="rtl">
      <Navbar searchQuery={search} onSearchChange={setSearch} />

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-10">
        {/* Streetwear Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 text-white p-8 sm:p-12 shadow-2xl border border-zinc-800">
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400/10 text-amber-400 border border-amber-400/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>NEW DROP 2026 - الكوليكشن الجديدة</span>
            </span>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              AB.SHOP <br />
              <span className="text-zinc-400 text-2xl sm:text-3xl font-extrabold">OFFICIAL STREETWEAR</span>
            </h1>

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              أفضل الخامات القطنية 100% بتصاميم عصرية ومريحة. اطلب الآن مع التوصيل السريع لـ 69 ولاية والدفع عند الاستلام مع إمكانية المعاينة قبل الدفع!
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-bold">
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

          {/* Decorative Subtle Background Elements */}
          <div className="absolute top-0 left-0 -mt-10 -ml-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
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
                  ? "bg-zinc-900 text-white shadow-md scale-105"
                  : "bg-white border border-zinc-200 text-zinc-600 hover:border-zinc-400"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Product Grid Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-black text-zinc-900">المنتجات المعروضة</h2>
          <span className="text-xs font-semibold text-zinc-400">({filtered.length} منتج)</span>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse bg-zinc-200/70 rounded-2xl h-80" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-zinc-200 text-zinc-500 text-xs">
            لا توجد منتجات مطابقة لبحثك حالياً.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filtered.map((prod) => (
              <div
                key={prod.id}
                className="group flex flex-col bg-white rounded-2xl border border-zinc-200/80 overflow-hidden hover:shadow-lg hover:border-zinc-300 transition-all duration-300"
              >
                <div className="relative aspect-[4/5] bg-zinc-100 overflow-hidden">
                  <img
                    src={prod.images[0] || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=900&auto=format&fit=crop"}
                    alt={prod.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />

                  {prod.badge && (
                    <span className="absolute top-2.5 right-2.5 bg-red-500 text-white font-black text-[11px] px-2.5 py-0.5 rounded-full shadow-sm">
                      {prod.badge}
                    </span>
                  )}
                </div>

                <div className="p-3.5 sm:p-4 flex flex-col flex-1 text-center">
                  <h3 className="text-xs sm:text-sm font-semibold text-zinc-800 line-clamp-2 leading-snug group-hover:text-black transition">
                    {prod.name}
                  </h3>

                  <div className="mt-2.5 flex items-center justify-center gap-2">
                    <span className="text-sm sm:text-base font-extrabold text-zinc-900">
                      {formatPrice(prod.price)}
                    </span>
                    {prod.originalPrice > prod.price && (
                      <span className="text-xs text-zinc-400 line-through">
                        {formatPrice(prod.originalPrice)}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 pt-2">
                    <Link
                      href={`/products/${prod.id}`}
                      className="w-full inline-flex items-center justify-center py-2 sm:py-2.5 px-4 rounded-xl border border-zinc-900 text-zinc-900 font-bold text-xs sm:text-sm hover:bg-zinc-900 hover:text-white transition-colors duration-200"
                    >
                      أطلب الآن
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="mt-20 border-t border-zinc-200/80 bg-white py-8 text-center text-xs text-zinc-400">
        <p>© 2026 AB.SHOP. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
}

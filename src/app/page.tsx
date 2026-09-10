"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Product } from "@/lib/db";
import { formatPrice } from "@/lib/utils";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
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

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.subtitle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900">
      <Navbar searchQuery={search} onSearchChange={setSearch} />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-right mb-8">
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-zinc-900">
            OUR PRODUCTS
          </h1>
          <p className="text-xs text-zinc-400 font-medium tracking-wide mt-0.5">AB.SHOP</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse bg-zinc-200/70 rounded-2xl h-80" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-zinc-500 text-sm">
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
                    <span className="absolute top-2.5 right-2.5 bg-red-500 text-white font-black text-[11px] px-2 py-0.5 rounded-full shadow-sm">
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
                      أطلب
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

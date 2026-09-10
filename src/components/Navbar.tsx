"use client";

import Link from "next/link";
import { Search, Instagram, ShoppingBag, Truck } from "lucide-react";
import { useCart } from "./CartContext";

interface NavbarProps {
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

export function Navbar({ searchQuery = "", onSearchChange }: NavbarProps) {
  const { totalItems, openCart } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-zinc-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)]" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3 sm:gap-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 text-zinc-900 group shrink-0">
          <span className="w-8 h-8 rounded-lg bg-zinc-900 text-white font-black flex items-center justify-center text-xs tracking-tighter shadow-sm group-hover:bg-zinc-800 transition">
            AB
          </span>
          <div className="leading-tight">
            <span className="font-extrabold tracking-wider text-base text-zinc-900">AB.SHOP</span>
            <span className="text-[10px] text-zinc-400 block -mt-0.5">OFFICIAL STORE</span>
          </div>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <input
              type="text"
              placeholder="ابحث عن منتج..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200/80 focus:border-zinc-900 focus:bg-white rounded-full py-2 pr-10 pl-4 text-xs text-zinc-800 placeholder:text-zinc-400 outline-none transition"
            />
            <Search className="w-4 h-4 text-zinc-400 absolute right-3.5 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Track Order Link */}
          <Link
            href="/track"
            className="flex items-center gap-1.5 text-xs font-bold text-zinc-600 hover:text-zinc-900 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/80 px-3 py-1.5 rounded-full transition"
          >
            <Truck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">تتبع الطلب</span>
          </Link>

          {/* Cart Icon Button */}
          <button
            type="button"
            onClick={openCart}
            className="relative p-2 rounded-full text-zinc-800 hover:bg-zinc-100 transition flex items-center justify-center"
            aria-label="سلة المشتريات"
          >
            <ShoppingBag className="w-5 h-5 text-zinc-900" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
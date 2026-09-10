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
    <header className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur border-b border-zinc-800 shadow-md text-white" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3 sm:gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <span className="w-9 h-9 rounded-xl bg-white text-zinc-950 font-black flex items-center justify-center text-xs tracking-tighter shadow-md group-hover:bg-zinc-200 transition">
            SV
          </span>
          <div className="leading-tight">
            <span className="font-black tracking-widest text-base text-white font-mono block">
              SOVEREIGN<span className="text-amber-400">.WEAR</span>
            </span>
            <span className="text-[9px] text-zinc-400 font-bold tracking-widest block -mt-0.5 uppercase">
              LUXURY STREETWEAR
            </span>
          </div>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <input
              type="text"
              placeholder="ابحث عن منتج في SOVEREIGN..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-400 focus:bg-zinc-900 rounded-full py-2 pr-10 pl-4 text-xs text-white placeholder:text-zinc-500 outline-none transition"
            />
            <Search className="w-4 h-4 text-zinc-400 absolute right-3.5 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Instagram Account */}
          <a
            href="https://instagram.com/sovereign.wear"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-3 py-1.5 rounded-full transition"
          >
            <Instagram className="w-3.5 h-3.5 text-pink-500" />
            <span className="font-mono text-[11px]">@sovereign.wear</span>
          </a>

          {/* Track Order Link */}
          <Link
            href="/track"
            className="flex items-center gap-1.5 text-xs font-bold text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-3 py-1.5 rounded-full transition"
          >
            <Truck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">تتبع الطلب</span>
          </Link>

          {/* Cart Icon Button */}
          <button
            type="button"
            onClick={openCart}
            className="relative p-2 rounded-full text-white hover:bg-zinc-800 transition flex items-center justify-center"
            aria-label="سلة المشتريات"
          >
            <ShoppingBag className="w-5 h-5 text-white" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-400 text-zinc-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
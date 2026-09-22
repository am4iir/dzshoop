"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingBag, Sun, Moon, Package, X } from "lucide-react";
import { useCart } from "./CartContext";
import { useTheme } from "./ThemeContext";
import { useLanguage } from "./LanguageContext";

interface NavbarProps {
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

export function Navbar({ searchQuery = "", onSearchChange }: NavbarProps) {
  const { totalItems, openCart } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang, t, dir } = useLanguage();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/80 shadow-lg text-white" dir={dir}>
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Minimalist Lowercase Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <span className="w-9 h-9 rounded-xl bg-white text-zinc-950 font-black flex items-center justify-center text-xs tracking-tighter shadow-md group-hover:bg-amber-400 group-hover:scale-105 transition-all duration-300">
            bx
          </span>
          <div className="leading-tight">
            <span className="font-black tracking-wider text-base text-white font-mono lowercase block group-hover:text-zinc-200 transition">
              bx<span className="text-amber-400">.wear.dz</span>
            </span>
            <span className="text-[9px] text-zinc-400 font-bold tracking-widest block -mt-0.5 lowercase">
              official streetwear dz
            </span>
          </div>
        </Link>

        {/* Desktop Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <input
              type="text"
              placeholder={t("nav", "searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full bg-zinc-900/90 border border-zinc-800 focus:border-amber-400 focus:bg-zinc-900 rounded-full py-2 pr-10 pl-9 text-xs text-white placeholder:text-zinc-500 outline-none transition shadow-inner"
            />
            <Search className={`w-4 h-4 text-zinc-400 absolute top-2.5 pointer-events-none ${dir === "rtl" ? "right-3.5" : "left-3.5"}`} />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange?.("")}
                className={`absolute top-2.5 text-zinc-400 hover:text-white ${dir === "rtl" ? "left-3" : "right-3"}`}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Actions - Track link, Mobile Search, Language, Theme, Cart */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Track order quick link button */}
          <Link
            href="/track"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-[11px] font-bold text-zinc-300 hover:text-white transition group"
            title="تتبع طلبيتك"
          >
            <Package className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition" />
            <span className="hidden sm:inline">
              {lang === "ar" ? "تتبع الطلب" : lang === "fr" ? "Suivi" : "Track"}
            </span>
          </Link>

          {/* Mobile Search Toggle */}
          <button
            type="button"
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="p-2 rounded-full text-zinc-300 hover:text-white bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 md:hidden transition cursor-pointer"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Language Switcher: AR | EN | FR */}
          <div className="flex items-center bg-zinc-900/90 border border-zinc-800 rounded-full p-0.5 text-[11px] font-bold">
            <button
              type="button"
              onClick={() => setLang("ar")}
              className={`px-2 py-1 rounded-full transition cursor-pointer ${
                lang === "ar"
                  ? "bg-amber-400 text-zinc-950 font-black shadow-xs"
                  : "text-zinc-400 hover:text-white"
              }`}
              title="العربية"
            >
              AR
            </button>
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`px-2 py-1 rounded-full transition cursor-pointer ${
                lang === "en"
                  ? "bg-amber-400 text-zinc-950 font-black shadow-xs"
                  : "text-zinc-400 hover:text-white"
              }`}
              title="English"
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLang("fr")}
              className={`px-2 py-1 rounded-full transition cursor-pointer ${
                lang === "fr"
                  ? "bg-amber-400 text-zinc-950 font-black shadow-xs"
                  : "text-zinc-400 hover:text-white"
              }`}
              title="Français"
            >
              FR
            </button>
          </div>

          {/* Black / White Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 sm:px-2.5 sm:py-1.5 rounded-full text-zinc-300 hover:text-white bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 transition flex items-center justify-center gap-1 cursor-pointer"
            title={theme === "dark" ? "White" : "Black"}
            aria-label="تبديل المظهر"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-zinc-300" />
            )}
          </button>

          {/* Shopping Cart Button */}
          <button
            type="button"
            onClick={openCart}
            className="relative p-2.5 rounded-full bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-white transition flex items-center justify-center cursor-pointer shadow-sm group"
            aria-label="سلة المشتريات"
          >
            <ShoppingBag className="w-4 h-4 text-white group-hover:scale-110 transition" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-400 text-zinc-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-pulse">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar Dropdown */}
      {mobileSearchOpen && (
        <div className="md:hidden px-4 pb-3 pt-1 border-t border-zinc-800/80 bg-zinc-950">
          <div className="relative">
            <input
              type="text"
              autoFocus
              placeholder={t("nav", "searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-400 rounded-full py-2.5 pr-10 pl-9 text-xs text-white placeholder:text-zinc-500 outline-none"
            />
            <Search className={`w-4 h-4 text-zinc-400 absolute top-3 pointer-events-none ${dir === "rtl" ? "right-3.5" : "left-3.5"}`} />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange?.("")}
                className={`absolute top-3 text-zinc-400 hover:text-white ${dir === "rtl" ? "left-3" : "right-3"}`}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
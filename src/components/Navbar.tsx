"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingBag, Sun, Moon, X, Menu } from "lucide-react";
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
  const { lang, setLang, dir } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("home");

  const navLinks = [
    { id: "home", label: lang === "ar" ? "الرئيسية" : "Home", href: "/" },
    { id: "shop", label: lang === "ar" ? "المتجر" : "Shop", href: "#featured" },
    { id: "categories", label: lang === "ar" ? "التصنيفات" : "Categories", href: "#categories" },
    { id: "best", label: lang === "ar" ? "الأكثر طلباً" : "Best products", href: "#featured" },
    { id: "about", label: lang === "ar" ? "عن البراند" : "About", href: "#about" },
    { id: "contact", label: lang === "ar" ? "تواصل معنا" : "Contact", href: "https://wa.me/213555000000" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#07070a]/95 backdrop-blur-xl border-b border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white transition-colors duration-200" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
        {/* Left: Brand Logo with Luffy/Pirate Monogram Badge */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 dark:bg-gradient-to-br dark:from-zinc-800 dark:to-black border border-zinc-300 dark:border-white/20 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-all duration-300">
            <svg
              className="w-6 h-6 text-white group-hover:text-amber-400 transition-colors"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="11" r="5" fill="currentColor" fillOpacity="0.15" />
              <path d="M12 2a7 7 0 0 0-7 7c0 2.5 1.5 4.8 3.5 6v3a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1v-3c2-1.2 3.5-3.5 3.5-6a7 7 0 0 0-7-7z" />
              <circle cx="9.5" cy="10" r="1.2" fill="currentColor" />
              <circle cx="14.5" cy="10" r="1.2" fill="currentColor" />
              <path d="M10 16h4" />
              <path d="M4 19l4-2M20 19l-4-2" />
            </svg>
          </div>

          <div className="flex flex-col">
            <span className="font-black text-xl tracking-wider text-zinc-900 dark:text-white font-mono uppercase group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">
              BX.WEAR
            </span>
            <span className="text-[9px] text-zinc-500 dark:text-zinc-400 tracking-[0.25em] -mt-1 uppercase font-semibold">
              Official DZ
            </span>
          </div>
        </Link>

        {/* Center / Desktop Nav Menu */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-zinc-600 dark:text-zinc-300">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              onClick={() => setActiveNav(link.id)}
              className={`relative py-1 hover:text-black dark:hover:text-white transition-colors duration-200 ${
                activeNav === link.id
                  ? "text-black dark:text-white font-bold"
                  : "text-zinc-500 dark:text-zinc-400"
              }`}
            >
              {link.label}
              {activeNav === link.id && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-black dark:bg-white rounded-full shadow-[0_0_8px_rgba(0,0,0,0.3)] dark:shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              )}
            </a>
          ))}
        </nav>

        {/* Right Actions: Search, Languages, Theme Toggle, Cart, Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Desktop Search */}
          <div className="relative hidden md:block w-48 xl:w-60">
            <input
              type="text"
              placeholder={lang === "ar" ? "حوس على أي حاجة..." : "Search products..."}
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full bg-zinc-100 dark:bg-[#11121a] border border-zinc-200 dark:border-white/10 focus:border-zinc-400 dark:focus:border-white/40 rounded-full py-1.5 pr-8 pl-8 text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none transition"
            />
            <Search className={`w-3.5 h-3.5 text-zinc-400 absolute top-2.5 pointer-events-none ${dir === "rtl" ? "right-3" : "left-3"}`} />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange?.("")}
                className={`absolute top-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white ${dir === "rtl" ? "left-2.5" : "right-2.5"}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Mobile Search Button */}
          <button
            type="button"
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="p-2 rounded-full text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 md:hidden transition"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Language Switcher: AR / EN */}
          <div className="flex items-center bg-zinc-100 dark:bg-[#11121a] border border-zinc-200 dark:border-white/10 rounded-full p-0.5 text-[11px] font-bold">
            <button
              type="button"
              onClick={() => setLang("ar")}
              className={`px-2 py-0.5 rounded-full transition cursor-pointer ${
                lang === "ar"
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-black font-black shadow-xs"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white"
              }`}
            >
              AR
            </button>
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`px-2 py-0.5 rounded-full transition cursor-pointer ${
                lang === "en"
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-black font-black shadow-xs"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white"
              }`}
            >
              EN
            </button>
          </div>

          {/* White / Black Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-full text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition cursor-pointer"
            title={theme === "dark" ? "التبديل إلى الأبيض (White)" : "التبديل إلى الأسود (Black)"}
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-zinc-700" />
            )}
          </button>

          {/* Cart Button */}
          <button
            type="button"
            onClick={openCart}
            className="relative p-2.5 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-black hover:opacity-90 transition flex items-center justify-center font-bold shadow-md cursor-pointer group"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-[#07070a] animate-pulse">
                {totalItems}
              </span>
            )}
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 lg:hidden transition ml-1"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Search Dropdown */}
      {mobileSearchOpen && (
        <div className="md:hidden px-4 pb-3 pt-1 border-t border-zinc-200 dark:border-white/10 bg-white dark:bg-[#07070a]">
          <div className="relative">
            <input
              type="text"
              autoFocus
              placeholder={lang === "ar" ? "حوس على أي حاجة..." : "Search products..."}
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full bg-zinc-100 dark:bg-[#11121a] border border-zinc-200 dark:border-white/10 focus:border-zinc-400 dark:focus:border-white/40 rounded-full py-2.5 pr-10 pl-9 text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none"
            />
            <Search className={`w-4 h-4 text-zinc-400 absolute top-3 pointer-events-none ${dir === "rtl" ? "right-3.5" : "left-3.5"}`} />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange?.("")}
                className={`absolute top-3 text-zinc-400 hover:text-zinc-900 dark:hover:text-white ${dir === "rtl" ? "left-3" : "right-3"}`}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Mobile Navigation Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-zinc-200 dark:border-white/10 bg-white dark:bg-[#07070a] px-6 py-6 space-y-4 shadow-xl">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => {
                  setActiveNav(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-base font-semibold py-2 px-3 rounded-xl transition ${
                  activeNav === link.id
                    ? "bg-zinc-100 dark:bg-white/10 text-black dark:text-white font-bold"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-white/5"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
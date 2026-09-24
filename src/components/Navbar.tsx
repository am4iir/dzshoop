"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag, Sun, Moon, X, Menu } from "lucide-react";
import { useCart } from "./CartContext";
import { useTheme } from "./ThemeContext";
import { useLanguage } from "./LanguageContext";

interface NavbarProps {
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

export function Navbar({ searchQuery = "", onSearchChange }: NavbarProps) {
  const pathname = usePathname();
  const { totalItems, openCart } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang, dir } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHome = pathname === "/" || pathname === "";
  const isTransparent = isHome && !scrolled;

  const navLinks = [
    { id: "home", label: lang === "ar" ? "الرئيسية" : "Home", href: "/" },
    { id: "shop", label: lang === "ar" ? "المتجر" : "Shop", href: "/#featured" },
    { id: "categories", label: lang === "ar" ? "التصنيفات" : "Categories", href: "/#categories" },
    { id: "best", label: lang === "ar" ? "الأكثر طلباً" : "Best products", href: "/#featured" },
    { id: "about", label: lang === "ar" ? "عن البراند" : "About", href: "/#about" },
    { id: "contact", label: lang === "ar" ? "تواصل معنا" : "Contact", href: "https://wa.me/213555000000" },
  ];

  return (
    <header
      className={`fixed top-[36px] left-0 right-0 z-40 transition-all duration-300 ${
        isTransparent
          ? "bg-transparent border-b border-transparent text-white"
          : "bg-white/95 dark:bg-[#07070a]/95 backdrop-blur-xl border-b border-zinc-200 dark:border-white/10 shadow-sm text-zinc-900 dark:text-white"
      }`}
      style={{ top: "36px" }}
      dir={dir}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between gap-4">
        {/* Left: Brand Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-all duration-300 border ${
            isTransparent
              ? "bg-white/10 backdrop-blur-md border-white/20 text-white"
              : "bg-zinc-900 dark:bg-gradient-to-br dark:from-zinc-800 dark:to-black border-zinc-300 dark:border-white/20 text-white"
          }`}>
            <svg
              className="w-6 h-6 group-hover:text-amber-400 transition-colors"
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
            <span className={`font-black text-2xl tracking-wider font-mono uppercase group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors ${
              isTransparent ? "text-white" : "text-zinc-900 dark:text-white"
            }`}>
              BX.WEAR
            </span>
            <span className={`text-[9px] tracking-[0.25em] -mt-1 uppercase font-semibold ${
              isTransparent ? "text-white/60" : "text-zinc-500 dark:text-zinc-400"
            }`}>
              Official DZ
            </span>
          </div>
        </Link>

        {/* Center / Desktop Nav Menu */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              onClick={() => setActiveNav(link.id)}
              className={`relative py-1 transition-colors duration-200 ${
                activeNav === link.id
                  ? isTransparent
                    ? "text-white font-bold"
                    : "text-black dark:text-white font-bold"
                  : isTransparent
                    ? "text-white/70 hover:text-white"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white"
              }`}
            >
              {link.label}
              {activeNav === link.id && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#F59E0B] rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
              )}
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Desktop Search */}
          <div className="relative hidden md:block w-48 xl:w-60">
            <input
              type="text"
              placeholder={lang === "ar" ? "حوس على أي حاجة..." : "Search products..."}
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className={`w-full rounded-full py-1.5 pr-8 pl-8 text-xs outline-none transition-all duration-200 ${
                isTransparent
                  ? "bg-white/10 backdrop-blur-md border border-white/30 focus:border-white/60 text-white placeholder:text-white/50"
                  : "bg-zinc-100 dark:bg-[#11121a] border border-zinc-200 dark:border-white/10 focus:border-zinc-400 dark:focus:border-white/40 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
              }`}
            />
            <Search className={`w-3.5 h-3.5 absolute top-2.5 pointer-events-none ${isTransparent ? "text-white/60" : "text-zinc-400"} ${dir === "rtl" ? "right-3" : "left-3"}`} />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange?.("")}
                className={`absolute top-2 ${isTransparent ? "text-white/60 hover:text-white" : "text-zinc-400 hover:text-zinc-900 dark:hover:text-white"} ${dir === "rtl" ? "left-2.5" : "right-2.5"}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Mobile Search Button */}
          <button
            type="button"
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className={`p-2 rounded-full md:hidden transition ${
              isTransparent
                ? "text-white/80 hover:text-white hover:bg-white/10"
                : "text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Language Switcher */}
          <div className={`flex items-center rounded-full p-0.5 text-[11px] font-bold border ${
            isTransparent
              ? "bg-white/10 backdrop-blur-md border-white/20"
              : "bg-zinc-100 dark:bg-[#11121a] border-zinc-200 dark:border-white/10"
          }`}>
            <button
              type="button"
              onClick={() => setLang("ar")}
              className={`px-2 py-0.5 rounded-full transition cursor-pointer ${
                lang === "ar"
                  ? isTransparent
                    ? "bg-white text-black font-black shadow-xs"
                    : "bg-zinc-900 text-white dark:bg-white dark:text-black font-black shadow-xs"
                  : isTransparent
                    ? "text-white/60 hover:text-white"
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
                  ? isTransparent
                    ? "bg-white text-black font-black shadow-xs"
                    : "bg-zinc-900 text-white dark:bg-white dark:text-black font-black shadow-xs"
                  : isTransparent
                    ? "text-white/60 hover:text-white"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white"
              }`}
            >
              EN
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className={`p-2 rounded-full transition cursor-pointer border ${
              isTransparent
                ? "text-white/80 hover:text-white bg-white/10 border-white/20 hover:bg-white/20"
                : "text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800"
            }`}
            title={theme === "dark" ? "التبديل إلى الأبيض (White)" : "التبديل إلى الأسود (Black)"}
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className={`w-4 h-4 ${isTransparent ? "text-white" : "text-zinc-700"}`} />
            )}
          </button>

          {/* Cart Button */}
          <button
            type="button"
            onClick={openCart}
            className={`relative p-2.5 rounded-full transition flex items-center justify-center font-bold shadow-md cursor-pointer group ${
              isTransparent
                ? "bg-white text-black hover:bg-white/90"
                : "bg-zinc-900 text-white dark:bg-white dark:text-black hover:opacity-90"
            }`}
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#F59E0B] text-black text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-[#07070a] animate-pulse">
                {totalItems}
              </span>
            )}
          </button>

          {/* Mobile Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-xl lg:hidden transition ml-1 ${
              isTransparent
                ? "text-white/80 hover:text-white hover:bg-white/10"
                : "text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
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

      {/* Mobile Navigation Menu */}
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
                    ? "bg-amber-50 dark:bg-amber-500/10 text-[#F59E0B] font-bold border-r-2 border-[#F59E0B]"
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
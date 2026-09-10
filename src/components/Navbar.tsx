"use client";

import Link from "next/link";
import { Search, Instagram } from "lucide-react";

interface NavbarProps {
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

export function Navbar({ searchQuery = "", onSearchChange }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-zinc-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 text-zinc-900 group">
          <span className="w-8 h-8 rounded-lg bg-zinc-900 text-white font-black flex items-center justify-center text-xs tracking-tighter shadow-sm group-hover:bg-zinc-800 transition">
            NB
          </span>
          <div className="leading-tight">
            <span className="font-extrabold tracking-wider text-base text-zinc-900">AB.SHOP</span>
            <span className="text-[10px] text-zinc-400 block -mt-0.5">OFFICIAL STORE</span>
          </div>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-md hidden sm:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Ø§Ø¨Ø­Ø« Ø¹Ù† Ù…Ù†ØªØ¬..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200/80 focus:border-zinc-900 focus:bg-white rounded-full py-2 pr-10 pl-4 text-xs text-zinc-800 placeholder:text-zinc-400 outline-none transition"
            />
            <Search className="w-4 h-4 text-zinc-400 absolute right-3.5 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Instagram Social link for clients */}
        <div className="flex items-center gap-3">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-black bg-zinc-50 border border-zinc-200/80 px-3.5 py-1.5 rounded-full transition"
          >
            <Instagram className="w-3.5 h-3.5 text-pink-500" />
            <span className="hidden sm:inline">Ø¥Ù†Ø³ØªØºØ±Ø§Ù… Ø§Ù„Ù…ØªØ¬Ø±</span>
          </a>
        </div>
      </div>
    </header>
  );
}
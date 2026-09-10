"use client";

import React from "react";
import { Truck, ShieldCheck, Handshake, RotateCcw } from "lucide-react";

export interface TrustBadgeItem {
  icon: React.ElementType;
  text: string;
  description?: string;
}

export interface TrustBadgesProps {
  className?: string;
  badges?: TrustBadgeItem[];
  variant?: "card" | "grid";
}

export const DEFAULT_TRUST_BADGES: TrustBadgeItem[] = [
  {
    icon: Truck,
    text: "توصيل سريع لـ 69 ولاية",
    description: "شحن سريع وموثوق إلى جميع الولايات",
  },
  {
    icon: ShieldCheck,
    text: "جودة مضمونة 100%",
    description: "منتجات أصلية وبأفضل جودة مختارة بعناية",
  },
  {
    icon: Handshake,
    text: "الدفع عند الاستلام",
    description: "تسوق بكل راحة وأمان وادفع عند باب منزلك",
  },
  {
    icon: RotateCcw,
    text: "إمكانية الإرجاع",
    description: "إمكانية الاستبدال والإرجاع بكل سهولة",
  },
];

export function TrustBadges({
  className = "",
  badges = DEFAULT_TRUST_BADGES,
  variant = "card",
}: TrustBadgesProps) {
  const containerClasses =
    variant === "card"
      ? "p-4 sm:p-6 bg-white border border-zinc-200/80 rounded-2xl shadow-sm"
      : "p-2 sm:p-4";

  return (
    <section
      aria-label="ميزات وضمانات المتجر"
      className={`w-full ${containerClasses} ${className}`}
      dir="rtl"
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {badges.map((badge, idx) => {
          const IconComponent = badge.icon;
          return (
            <div
              key={idx}
              className="flex flex-col items-center text-center p-3 sm:p-4 bg-zinc-50 hover:bg-zinc-100/80 border border-zinc-200 rounded-xl transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2.5 group-hover:scale-110 group-hover:bg-emerald-100/80 transition-all duration-200 shrink-0">
                <IconComponent className="w-5 h-5" strokeWidth={2.2} />
              </div>
              <span className="text-xs font-semibold text-zinc-700 leading-tight">
                {badge.text}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

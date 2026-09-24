"use client";

import React from "react";
import { Truck, ShieldCheck, Handshake, RotateCcw } from "lucide-react";
import { useLanguage } from "./LanguageContext";

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

export function TrustBadges({
  className = "",
  badges,
  variant = "card",
}: TrustBadgesProps) {
  const { t, dir } = useLanguage();

  const activeBadges: TrustBadgeItem[] = badges || [
    {
      icon: Truck,
      text: t("home", "trustDelivery"),
    },
    {
      icon: ShieldCheck,
      text: t("home", "trustInspect"),
    },
    {
      icon: Handshake,
      text: t("home", "trustCOD"),
    },
    {
      icon: RotateCcw,
      text: t("home", "trustReturn"),
    },
  ];

  const containerClasses =
    variant === "card"
      ? "p-4 sm:p-6 bg-white dark:bg-[#0c0d14] border border-zinc-200/80 dark:border-white/10 rounded-2xl shadow-sm"
      : "p-2 sm:p-4";

  return (
    <section
      aria-label="Features and guarantees"
      className={`w-full ${containerClasses} ${className}`}
      dir={dir}
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {activeBadges.map((badge, idx) => {
          const IconComponent = badge.icon;
          return (
            <div
              key={idx}
              className="flex flex-col items-center text-center p-3 sm:p-4 bg-zinc-50 dark:bg-[#08080f] hover:bg-zinc-100/80 dark:hover:bg-[#12131e] border border-zinc-200 dark:border-white/10 rounded-xl transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-500/10 text-[#F59E0B] flex items-center justify-center mb-2.5 group-hover:scale-110 group-hover:bg-amber-100 dark:group-hover:bg-amber-500/20 transition-all duration-200 shrink-0">
                <IconComponent className="w-5 h-5" strokeWidth={2.2} />
              </div>
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-200 leading-tight">
                {badge.text}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

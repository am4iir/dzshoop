"use client";

import React, { memo } from "react";
import { useLanguage } from "./LanguageContext";
import { getAnnouncementMessages } from "@/lib/i18n";

interface AnnouncementBarProps {
  messages?: string[];
  className?: string;
  speedSeconds?: number;
}

export const AnnouncementBar = memo(function AnnouncementBar({
  messages,
  className = "",
  speedSeconds = 35,
}: AnnouncementBarProps) {
  const { lang, dir } = useLanguage();
  const activeMessages = messages || getAnnouncementMessages(lang);
  const repeatedMessages = [...activeMessages, ...activeMessages, ...activeMessages, ...activeMessages];

  const icons = [
    // Cash on delivery — wallet icon
    <svg key="cash" className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M12 12a3 3 0 1 0 0-.01" /><path d="M2 10h2M20 10h2M2 14h2M20 14h2" /></svg>,
    // Delivery — truck icon
    <svg key="truck" className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 18H3a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h10v11" /><path d="M14 6h4l4 4v7a1 1 0 0 1-1 1h-2" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></svg>,
    // Inspect — eye/check icon
    <svg key="inspect" className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" /><circle cx="12" cy="12" r="3" /></svg>,
  ];

  return (
    <div
      className={`relative w-full overflow-hidden bg-[#07070a] text-zinc-400 select-none ${className}`}
      dir={dir}
    >
      <style>{`
        @keyframes announcement-scroll {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(50%, 0, 0);
          }
        }
        .announcement-track {
          display: flex;
          width: max-content;
          will-change: transform;
          animation: announcement-scroll ${speedSeconds}s linear infinite;
        }
        .announcement-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Subtle edge fade */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-12 bg-gradient-to-l from-[#07070a] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-12 bg-gradient-to-r from-[#07070a] to-transparent z-10" />

      {/* Marquee Content */}
      <div className="py-2 overflow-hidden">
        <div className="announcement-track flex items-center">
          {repeatedMessages.map((msg, index) => (
            <div
              key={index}
              className="inline-flex items-center gap-1.5 text-[10px] font-medium text-zinc-400 px-5 shrink-0 tracking-wide"
            >
              <span className="text-[#F59E0B]/70">{icons[index % icons.length]}</span>
              <span>{msg}</span>
              <span
                className="mr-5 text-zinc-600 select-none text-[8px]"
                aria-hidden="true"
              >
                •
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

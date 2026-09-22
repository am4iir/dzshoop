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
  speedSeconds = 25,
}: AnnouncementBarProps) {
  const { lang, dir } = useLanguage();
  const activeMessages = messages || getAnnouncementMessages(lang);
  const repeatedMessages = [...activeMessages, ...activeMessages, ...activeMessages, ...activeMessages];

  return (
    <div
      className={`relative w-full overflow-hidden bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-300 border-b border-zinc-800/80 select-none ${className}`}
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

      {/* Subtle edge fade gradients */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-16 bg-gradient-to-l from-zinc-950 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-zinc-950 to-transparent z-10" />

      {/* Marquee Content */}
      <div className="py-2 overflow-hidden">
        <div className="announcement-track flex items-center">
          {repeatedMessages.map((msg, index) => (
            <div
              key={index}
              className="inline-flex items-center text-[11px] sm:text-xs font-medium text-zinc-300 hover:text-white transition-colors duration-150 px-4 shrink-0"
            >
              <span>{msg}</span>
              <span
                className="mr-4 text-zinc-700 select-none font-bold"
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

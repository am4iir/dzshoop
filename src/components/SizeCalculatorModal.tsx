"use client";

import React, { useState } from "react";
import { X, Ruler, Sparkles, CheckCircle2 } from "lucide-react";

interface SizeCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSize?: (size: string) => void;
}

export function SizeCalculatorModal({
  isOpen,
  onClose,
  onSelectSize,
}: SizeCalculatorModalProps) {
  const [height, setHeight] = useState<string>("175");
  const [weight, setWeight] = useState<string>("70");
  const [recommendedSize, setRecommendedSize] = useState<string | null>(null);

  if (!isOpen) return null;

  const calculateSize = (e: React.FormEvent) => {
    e.preventDefault();
    const h = Number(height);
    const w = Number(weight);

    if (!h || !w) return;

    let size = "M";
    if (w < 60 || h < 165) {
      size = "S";
    } else if (w <= 72 && h <= 176) {
      size = "M";
    } else if (w <= 84 && h <= 184) {
      size = "L";
    } else if (w <= 95 && h <= 190) {
      size = "XL";
    } else {
      size = "XXL";
    }

    setRecommendedSize(size);
  };

  const handleApply = () => {
    if (recommendedSize && onSelectSize) {
      onSelectSize(recommendedSize);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4" dir="rtl">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="relative bg-white dark:bg-zinc-900 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl z-10 border border-zinc-200 dark:border-zinc-800 transition-colors duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute left-4 top-4 text-zinc-400 hover:text-zinc-900 dark:hover:text-white p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 dark:bg-zinc-800 text-white dark:text-amber-400 flex items-center justify-center mx-auto mb-3 shadow-md border border-transparent dark:border-zinc-700">
            <Ruler className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-zinc-900 dark:text-white">حاسبة المقاس المناسب 📏</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">أدخل طولك ووزنك لمعرفة مقاسك المثالي بدقة</p>
        </div>

        {/* Form */}
        <form onSubmit={calculateSize} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
              الطول (بالسنتيمتر cm)
            </label>
            <input
              type="number"
              min="140"
              max="220"
              required
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="مثلاً: 175"
              className="w-full bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl py-3 px-4 text-xs font-bold text-zinc-900 dark:text-white outline-none focus:border-zinc-900 dark:focus:border-amber-400 transition text-center"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
              الوزن (بالكيلوغرام kg)
            </label>
            <input
              type="number"
              min="40"
              max="160"
              required
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="مثلاً: 70"
              className="w-full bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl py-3 px-4 text-xs font-bold text-zinc-900 dark:text-white outline-none focus:border-zinc-900 dark:focus:border-amber-400 transition text-center"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-zinc-900 dark:bg-amber-400 hover:bg-black dark:hover:bg-amber-300 text-white dark:text-zinc-950 font-extrabold py-3 px-4 rounded-xl text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-400 dark:text-zinc-950" />
            <span>احسب المقاس</span>
          </button>
        </form>

        {/* Recommended Result */}
        {recommendedSize && (
          <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl text-center space-y-3">
            <div className="flex items-center justify-center gap-1.5 text-xs font-extrabold text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>المقاس المقترح لك:</span>
            </div>
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono tracking-wider">
              {recommendedSize}
            </div>

            <button
              type="button"
              onClick={handleApply}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition shadow-sm cursor-pointer"
            >
              تحديد المقاس ({recommendedSize}) تلقائياً
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

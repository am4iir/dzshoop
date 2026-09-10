"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "./CartContext";
import { formatPrice } from "@/lib/utils";
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from "lucide-react";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice, totalItems } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" dir="rtl">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-zinc-900" />
              <h2 className="text-base font-extrabold text-zinc-900">سلة المشتريات</h2>
              <span className="bg-zinc-900 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {totalItems}
              </span>
            </div>
            <button
              type="button"
              onClick={closeCart}
              className="p-2 rounded-full text-zinc-400 hover:text-zinc-900 hover:bg-zinc-200/60 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-zinc-400 py-12">
                <ShoppingBag className="w-16 h-16 stroke-1 text-zinc-300 mb-3" />
                <p className="text-sm font-bold text-zinc-600">سلتك فارغة حالياً</p>
                <p className="text-xs text-zinc-400 mt-1 max-w-xs">
                  اختر منتجاتك المفضلة وأضفها للسلة لمواصلة الطلب
                </p>
                <button
                  type="button"
                  onClick={closeCart}
                  className="mt-6 px-6 py-2.5 bg-zinc-900 text-white rounded-xl text-xs font-bold hover:bg-black transition"
                >
                  تصفح المنتجات
                </button>
              </div>
            ) : (
              items.map((item, idx) => (
                <div
                  key={`${item.productId}-${item.selectedSize}-${item.selectedColor}-${idx}`}
                  className="flex gap-3 p-3 bg-zinc-50 border border-zinc-100 rounded-2xl relative group"
                >
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-20 h-24 object-cover rounded-xl bg-zinc-200 shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-xs font-extrabold text-zinc-900 line-clamp-1">
                          {item.productName}
                        </h3>
                        <button
                          type="button"
                          onClick={() => removeItem(item.productId, item.selectedSize, item.selectedColor)}
                          className="text-zinc-400 hover:text-red-500 transition p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-zinc-500 mt-1">
                        {item.selectedSize && (
                          <span className="bg-zinc-200/70 text-zinc-800 px-2 py-0.5 rounded font-bold">
                            {item.selectedSize}
                          </span>
                        )}
                        {item.selectedColor && (
                          <span className="bg-zinc-200/70 text-zinc-800 px-2 py-0.5 rounded">
                            {item.selectedColor}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-200/60">
                      <span className="text-xs font-black text-zinc-900">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </span>

                      <div className="flex items-center border border-zinc-300 rounded-lg bg-white h-7">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.selectedSize,
                              item.selectedColor,
                              item.quantity - 1
                            )
                          }
                          className="w-6 h-full flex items-center justify-center text-zinc-600 hover:text-black"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.selectedSize,
                              item.selectedColor,
                              item.quantity + 1
                            )
                          }
                          className="w-6 h-full flex items-center justify-center text-zinc-600 hover:text-black"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / Checkout Button */}
          {items.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-zinc-100 bg-white space-y-4">
              <div className="flex justify-between items-center text-sm font-black text-zinc-900">
                <span>المجموع الجزئي:</span>
                <span className="text-base text-red-600">{formatPrice(totalPrice)}</span>
              </div>

              <p className="text-[11px] text-zinc-400 text-center">
                يتم احتساب مصاريف التوصيل في الصفحة التالية حسب الولاية
              </p>

              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full bg-zinc-950 hover:bg-black text-white font-extrabold py-3.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-md"
              >
                <span>متابعة الشراء والتأكيد</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

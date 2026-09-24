import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  if (typeof price !== "number" || isNaN(price)) return "0 د.ج";
  return `${price.toLocaleString("en-US")} د.ج`;
}

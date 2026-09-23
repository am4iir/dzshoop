import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartContext";
import { CartDrawer } from "@/components/CartDrawer";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { ThemeProvider } from "@/components/ThemeContext";
import { LanguageProvider } from "@/components/LanguageContext";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700", "800"],
  variable: "--font-tajawal",
});

export const metadata: Metadata = {
  description: "bx.wear.dz official store - barae streetwear brand in algeria. exclusive premium cotton collection with cash on delivery nationwide.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "bx.wear.dz | official streetwear store",
    template: "%s | bx.wear.dz",
  },
  openGraph: {
    title: "bx.wear.dz | barae streetwear",
    description: "new collection, premium heavyweight fabrics and fast shipping to 69 wilayas.",
    type: "website",
    siteName: "bx.wear.dz",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.variable} suppressHydrationWarning>
      <body className="font-sans antialiased bg-[#f8fafc] dark:bg-[#07070a] text-zinc-900 dark:text-zinc-100 min-h-screen selection:bg-violet-600 selection:text-white transition-colors duration-200">
        <LanguageProvider>
          <ThemeProvider>
            <CartProvider>
              <AnnouncementBar />
              {children}
              <CartDrawer />
            </CartProvider>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

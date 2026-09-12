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
  title: "axb.wear | official streetwear store",
  description: "axb.wear official store - barae × amir streetwear brand in algeria. exclusive premium cotton collection with cash on delivery nationwide.",
  openGraph: {
    title: "axb.wear | barae × amir streetwear",
    description: "new collection, premium heavyweight fabrics and fast shipping to 69 wilayas.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.variable} suppressHydrationWarning>
      <body className="font-sans antialiased bg-[#fafafa] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 min-h-screen selection:bg-amber-400 selection:text-zinc-950 transition-colors duration-200">
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

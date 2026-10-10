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
  description: "axb.wear official store - streetwear brand in algeria. exclusive premium cotton collection with cash on delivery nationwide.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "axb.wear | official streetwear store",
    template: "%s | axb.wear",
  },
  openGraph: {
    title: "axb.wear | streetwear",
    description: "new collection, premium heavyweight fabrics and fast shipping to 69 wilayas.",
    type: "website",
    siteName: "axb.wear",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.variable}>
      <body className="font-sans antialiased bg-[#fafafa] text-zinc-900 min-h-screen selection:bg-amber-400 selection:text-zinc-950">
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

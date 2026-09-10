import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartContext";
import { CartDrawer } from "@/components/CartDrawer";
import { AnnouncementBar } from "@/components/AnnouncementBar";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700", "800"],
  variable: "--font-tajawal",
});

export const metadata: Metadata = {
  title: "axb.wear | official streetwear store",
  description: "axb.wear official store - amir × barae streetwear brand in algeria. exclusive premium cotton collection with cash on delivery nationwide.",
  openGraph: {
    title: "axb.wear | amir × barae streetwear",
    description: "new collection, premium heavyweight fabrics and fast shipping to 69 wilayas.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.variable}>
      <body className="font-sans antialiased bg-[#fafafa] text-zinc-900 min-h-screen selection:bg-zinc-900 selection:text-white">
        <CartProvider>
          <AnnouncementBar />
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}

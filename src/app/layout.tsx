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
  title: "AB.SHOP | Official Store",
  description: "Modern clothing store with exclusive designs and premium quality. Order now with cash on delivery.",
  openGraph: {
    title: "AB.SHOP | Official Store",
    description: "New collection, high quality fabrics and fast shipping nationwide.",
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

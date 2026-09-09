import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700", "800"],
  variable: "--font-tajawal",
});

export const metadata: Metadata = {
  title: "NOIR & BLANC | Official Drop Store",
  description: "متجر ملابس عصري بتصاميم حصرية وجودة عالية. اطلب الآن والدفع عند الاستلام مع معاينة المنتج.",
  openGraph: {
    title: "NOIR & BLANC | المتجر الرسمي",
    description: "كولكشن جديد، قماش عالي الجودة وتوصيل سريع لكامل التراب الوطني.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.variable}>
      <body className="font-sans antialiased bg-[#0b0c10] text-zinc-100 min-h-screen selection:bg-amber-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}

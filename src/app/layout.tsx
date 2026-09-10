import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700", "800"],
  variable: "--font-tajawal",
});

export const metadata: Metadata = {
  title: "AB.SHOP | Official Drop Store",
  description: "Ù…ØªØ¬Ø± Ù…Ù„Ø§Ø¨Ø³ Ø¹ØµØ±ÙŠ Ø¨ØªØµØ§Ù…ÙŠÙ… Ø­ØµØ±ÙŠØ© ÙˆØ¬ÙˆØ¯Ø© Ø¹Ø§Ù„ÙŠØ©. Ø§Ø·Ù„Ø¨ Ø§Ù„Ø¢Ù† ÙˆØ§Ù„Ø¯ÙØ¹ Ø¹Ù†Ø¯ Ø§Ù„Ø§Ø³ØªÙ„Ø§Ù… Ù…Ø¹ Ù…Ø¹Ø§ÙŠÙ†Ø© Ø§Ù„Ù…Ù†ØªØ¬.",
  openGraph: {
    title: "NOIR & BLANC | Ø§Ù„Ù…ØªØ¬Ø± Ø§Ù„Ø±Ø³Ù…ÙŠ",
    description: "ÙƒÙˆÙ„ÙƒØ´Ù† Ø¬Ø¯ÙŠØ¯ØŒ Ù‚Ù…Ø§Ø´ Ø¹Ø§Ù„ÙŠ Ø§Ù„Ø¬ÙˆØ¯Ø© ÙˆØªÙˆØµÙŠÙ„ Ø³Ø±ÙŠØ¹ Ù„ÙƒØ§Ù…Ù„ Ø§Ù„ØªØ±Ø§Ø¨ Ø§Ù„ÙˆØ·Ù†ÙŠ.",
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

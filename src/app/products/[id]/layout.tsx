import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تفاصيل المنتج",
  description: "اكتشف تفاصيل منتجات axb.wear، المقاسات، الألوان، والأسعار مع التوصيل في الجزائر.",
  openGraph: {
    title: "تفاصيل المنتج | axb.wear",
    description: "منتجات streetwear أصلية من axb.wear مع التوصيل في الجزائر.",
    type: "website",
  },
};

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تفاصيل المنتج",
  description: "اكتشف تفاصيل منتجات bx.wear.dz، المقاسات، الألوان، والأسعار مع التوصيل في الجزائر.",
  openGraph: {
    title: "تفاصيل المنتج | bx.wear.dz",
    description: "منتجات streetwear أصلية من bx.wear.dz مع التوصيل في الجزائر.",
    type: "website",
  },
};

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return children;
}

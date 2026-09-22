import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "إتمام الطلب",
  description: "أكمل طلبك من axb.wear مع عرض السعر النهائي وتكلفة التوصيل قبل التأكيد.",
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}

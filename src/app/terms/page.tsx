import type { Metadata } from "next";

export const metadata: Metadata = { title: "شروط الاستخدام | bx.wear.dz", description: "شروط استخدام متجر bx.wear.dz والشراء عند الاستلام." };

export default function TermsPage() {
  return <LegalPage title="شروط الاستخدام" sections={["يتم تأكيد الطلبات هاتفياً قبل الشحن.", "الأسعار المعروضة بالدينار الجزائري وتشمل تفاصيل التوصيل الموضحة في صفحة الدفع.", "يمنع استخدام المتجر لأي نشاط غير قانوني أو احتيالي."]} />;
}

function LegalPage({ title, sections }: { title: string; sections: string[] }) {
  return <main dir="rtl" className="min-h-screen bg-[#fafafa] px-6 py-16 text-zinc-900"><article className="mx-auto max-w-2xl space-y-6"><h1 className="text-3xl font-black">{title}</h1>{sections.map((section) => <p key={section} className="leading-8 text-zinc-600">{section}</p>)}</article></main>;
}

import type { Metadata } from "next";

export const metadata: Metadata = { title: "سياسة الخصوصية | axb.wear", description: "سياسة الخصوصية لمتجر axb.wear." };

export default function PrivacyPage() {
  return <main dir="rtl" className="min-h-screen bg-[#fafafa] px-6 py-16 text-zinc-900"><article className="mx-auto max-w-2xl space-y-6"><h1 className="text-3xl font-black">سياسة الخصوصية</h1><p className="leading-8 text-zinc-600">نستخدم الاسم ورقم الهاتف ومعلومات التوصيل فقط لمعالجة الطلب والتواصل بشأنه. لا نبيع بيانات العملاء، ويجب تأمين بيانات الإنتاج وقاعدة البيانات ونسخها الاحتياطية.</p></article></main>;
}

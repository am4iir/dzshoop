"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center gap-4 p-6 text-center text-zinc-900">
      <h1 className="text-xl font-black">تعذر تحميل الصفحة</h1>
      <p className="text-sm text-zinc-500">حدث خطأ مؤقت. يرجى المحاولة مرة أخرى.</p>
      <button type="button" onClick={() => reset()} className="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-bold text-white">
        إعادة المحاولة
      </button>
    </main>
  );
}

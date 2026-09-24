import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#07070a] flex flex-col items-center justify-center text-center px-4 relative overflow-hidden" dir="rtl">
      {/* Background glowing effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-[#F59E0B]/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="relative z-10 space-y-6">
        <h1 className="text-[140px] sm:text-[190px] leading-none font-black text-white tracking-tighter font-mono">
          4<span className="text-[#F59E0B]">0</span>4
        </h1>
        
        <div className="space-y-4 relative -top-6">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide uppercase font-mono">
            This page could not be found
          </h2>
          <p className="text-zinc-400 max-w-md mx-auto text-xs sm:text-sm leading-relaxed">
            الصفحة التي تحاول الوصول إليها غير موجودة أو ربما تم تغيير الرابط.
          </p>
        </div>

        <div className="pt-4">
          <Link 
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#F59E0B] text-black font-black rounded-full hover:bg-amber-400 hover:scale-105 transition-all duration-300 shadow-xl shadow-[#F59E0B]/30 text-xs sm:text-sm"
          >
            العودة للمتجر
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="rotate-180">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </Link>
        </div>
      </div>
      
      {/* Brand watermark */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 font-mono text-xl sm:text-2xl font-black lowercase text-zinc-800">
        bx<span className="text-[#F59E0B]/30">.wear.dz</span>
      </div>
    </div>
  );
}

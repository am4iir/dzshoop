import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-center px-4 relative overflow-hidden" dir="rtl">
      {/* Background glowing effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="relative z-10 space-y-6">
        <h1 className="text-[150px] sm:text-[200px] leading-none font-black text-white tracking-tighter font-mono">
          4<span className="text-amber-400">0</span>4
        </h1>
        
        <div className="space-y-4 relative -top-6">
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-wide uppercase font-mono">
            This page could not be found
          </h2>
          <p className="text-zinc-400 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
            الصفحة التي تحاول الوصول إليها غير موجودة أو ربما تم تغيير الرابط.
          </p>
        </div>

        <div className="pt-6">
          <Link 
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-amber-400 text-zinc-950 font-black rounded-full hover:bg-amber-300 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(251,191,36,0.3)]"
          >
            العودة للمتجر
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="rotate-180">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </Link>
        </div>
      </div>
      
      {/* Brand water mark */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 font-mono text-2xl font-black lowercase text-zinc-800">
        bx<span className="text-amber-400/20">.wear.dz</span>
      </div>
    </div>
  );
}

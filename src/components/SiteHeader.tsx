export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <a href="#" className="justify-self-start group">
          <span className="text-lg sm:text-xl font-bold tracking-tight bg-gradient-to-r from-slate-950 via-slate-700 to-slate-500 bg-clip-text text-transparent group-hover:from-slate-800 group-hover:via-slate-600 group-hover:to-slate-400 transition-all">
            Treever
          </span>
        </a>

        <div className="justify-self-center hidden sm:block">
          <div className="bg-slate-100/80 backdrop-blur-md border border-slate-200/60 rounded-full px-4 py-1.5 text-xs font-medium text-slate-600 shadow-sm whitespace-nowrap">
            Made for NIS &amp; Public Schools in KZ
          </div>
        </div>

        <nav className="justify-self-end flex items-center gap-4 sm:gap-6">
          <a
            href="#problem"
            className="text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-950 transition-colors"
          >
            Проблема
          </a>
          <a
            href="#demo"
            className="text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-950 transition-colors"
          >
            Демонстрация
          </a>
        </nav>
      </div>
    </header>
  );
}

"use client";

import { useDemoMode } from "@/lib/demoMode";

export default function SiteFooter() {
  const { isDemo, toggleDemo } = useDemoMode();

  return (
    <footer className="border-t border-slate-100 py-6 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="order-2 sm:order-1">© 2026 Treever. Все права защищены.</div>

        <div className="order-1 sm:order-2 inline-flex items-center px-3 py-1.5 rounded-full border border-slate-200/70 bg-slate-50/80 text-slate-500 font-medium tracking-tight">
          AI-Powered Knowledge Gap Analysis
        </div>

        <div className="order-3 font-mono text-slate-500">
          Site is working
        </div>
      </div>

      {/* Inconspicuous clickable text in the corner */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-3 flex justify-end">
        <button
          type="button"
          onClick={toggleDemo}
          className="text-[10px] font-mono text-slate-300 hover:text-slate-500 transition-colors cursor-pointer select-none bg-transparent p-0 border-0 outline-none"
        >
          {isDemo ? "it is demo mode" : "turn on demo mode"}
        </button>
      </div>
    </footer>
  );
}


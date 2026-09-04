"use client";

import { useEffect } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { CheckCircle2, History, Sparkles, X } from "lucide-react";
import { MathText } from "@/components/MathText";
import { DEMO_SCAN_MOCKS } from "@/lib/demoMode";
import type { ScanAnalysis } from "@/types/scan";

type RecentScansModalProps = {
  open: boolean;
  onClose: () => void;
  onSelectScan: (item: { imagePreview: string; analysis: ScanAnalysis }) => void;
};

const spring = { type: "spring" as const, stiffness: 260, damping: 20 };

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const panelVariants: Variants = {
  hidden: { scale: 0.9, opacity: 0, y: 16 },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 26 },
  },
  exit: {
    scale: 0.94,
    opacity: 0,
    y: 10,
    transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1] },
  },
};

export const RECENT_SAMPLE_SCANS: {
  id: string;
  title: string;
  topic: string;
  grade: string;
  imagePath: string;
  description: string;
  analysis: ScanAnalysis;
}[] = [
  {
    id: "sample-irrat",
    title: "√(2x - 1) + 1 = x",
    topic: "Иррациональные уравнения",
    grade: "8 класс",
    imagePath: "/images/sample-math.png",
    description: "Ошибка в знаке при переносе слагаемого: корень проблемы в 7 классе",
    analysis: DEMO_SCAN_MOCKS[0],
  },
  {
    id: "sample-frac",
    title: "(x² - 9) / (x - 3) = 6",
    topic: "Дробно-рациональные уравнения",
    grade: "8 класс",
    imagePath: "/images/sample-math.png",
    description: "Корень x = 3 обращает знаменатель в ноль: потеря ОДЗ из 6 класса",
    analysis: DEMO_SCAN_MOCKS[1],
  },
  {
    id: "sample-quad",
    title: "2x² - 7x + 3 = 0",
    topic: "Квадратные уравнения",
    grade: "8 класс",
    imagePath: "/images/sample-math.png",
    description: "Забыт множитель a=2 в знаменателе формулы корней (-b ± √D)/2a",
    analysis: DEMO_SCAN_MOCKS[2],
  },
];

export function RecentScansModal({
  open,
  onClose,
  onSelectScan,
}: RecentScansModalProps) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm"
          />

          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-black/5 bg-white p-6 shadow-2xl sm:p-8"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-800">
                  <History className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-slate-950 sm:text-xl">
                    Выбрать из последних сканов
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Готовые образцы решений для быстрой демонстрации жюри
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
                title="Закрыть"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* List of sample scans */}
            <div className="mt-5 space-y-3.5">
              {RECENT_SAMPLE_SCANS.map((item, index) => {
                const isPrimary = index === 0;
                return (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.01, y: -2 }}
                    whileTap={{ scale: 0.99 }}
                    transition={spring}
                    onClick={() =>
                      onSelectScan({
                        imagePreview: item.imagePath,
                        analysis: item.analysis,
                      })
                    }
                    className={`group relative flex flex-col sm:flex-row items-stretch sm:items-center gap-4 rounded-2xl border p-4 transition-all cursor-pointer ${
                      isPrimary
                        ? "border-slate-900/15 bg-gradient-to-r from-slate-50/90 to-white shadow-sm hover:border-slate-900/30 hover:shadow-md"
                        : "border-black/5 bg-white hover:border-black/15 hover:bg-slate-50/50 hover:shadow-sm"
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="relative h-28 sm:h-20 sm:w-24 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                      <img
                        src={item.imagePath}
                        alt={item.title}
                        className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-slate-900/5 group-hover:opacity-0 transition-opacity" />
                    </div>

                    {/* Meta info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                          {item.grade}
                        </span>
                        <span className="text-xs text-slate-500 font-medium truncate">
                          {item.topic}
                        </span>
                        {isPrimary && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200/60 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                            <Sparkles className="h-2.5 w-2.5" />
                            Основной демо-скан
                          </span>
                        )}
                      </div>

                      <div className="mt-1 text-sm sm:text-base font-semibold text-slate-950 tracking-tight">
                        <MathText text={item.title} />
                      </div>

                      <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Action pill */}
                    <div className="shrink-0 flex items-center justify-end sm:justify-center">
                      <span className="inline-flex items-center gap-1.5 rounded-xl bg-black group-hover:bg-slate-800 px-3.5 py-2 text-xs font-semibold text-white transition-colors">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        Выбрать
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Footer tip */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>Загрузится фото из ресурсов с эмуляцией анализа 2 секунды</span>
              <button
                type="button"
                onClick={onClose}
                className="text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                Отмена
              </button>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}

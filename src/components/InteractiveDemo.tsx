"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Scan, Check, X, Loader2 } from "lucide-react";

const STROKE = "#1e293b";
const EASE = [0.25, 0.1, 0.25, 1] as const;

const ROOT5 = { cx: 870, cy: 110 };

const SCARLET_DELAY_MS = 1400;
const BADGE_DELAY_MS = 1550;

const TRUNK_PATH = `
  M 482 700
  C 486 640, 489 570, 492 500
  C 497 485, 503 485, 508 500
  C 511 570, 514 640, 518 700
  Z
`;

const ROOT_PATHS = [
  { d: "M 480 660 C 450 680, 410 695, 370 700", width: 4.0 },
  { d: "M 520 660 C 550 680, 590 695, 630 700", width: 4.0 },
] as const;

type Branch = {
  d: string;
  width: number;
  delay: number;
  duration: number;
  tip?: { x: number; y: number };
  scarlet?: boolean;
};

const MAIN_BRANCHES: Branch[] = [
  {
    d: "M 490 500 C 450 440, 360 400, 270 340",
    width: 7.5,
    delay: 0.2,
    duration: 1.0,
  },
  {
    d: "M 510 500 C 550 440, 640 400, 730 340",
    width: 7.5,
    delay: 0.2,
    duration: 1.0,
  },
];

const SIDE_BRANCHES: Branch[] = [
  {
    d: "M 360 400 C 280 430, 200 440, 120 420",
    width: 4.5,
    delay: 0.6,
    duration: 1.0,
    tip: { x: 120, y: 420 },
  },
  {
    d: "M 200 440 C 180 380, 160 330, 140 280",
    width: 3.2,
    delay: 0.65,
    duration: 1.0,
    tip: { x: 140, y: 280 },
  },
  {
    d: "M 270 340 C 220 270, 170 190, 130 110",
    width: 5.0,
    delay: 0.6,
    duration: 1.1,
    tip: { x: 130, y: 110 },
  },
  {
    d: "M 270 340 C 270 240, 250 170, 230 90",
    width: 4.0,
    delay: 0.65,
    duration: 1.05,
    tip: { x: 230, y: 90 },
  },
  {
    d: "M 250 170 C 300 150, 330 120, 350 80",
    width: 3.0,
    delay: 0.75,
    duration: 0.9,
    tip: { x: 350, y: 80 },
  },
  {
    d: "M 640 400 C 720 430, 800 440, 880 420",
    width: 4.5,
    delay: 0.6,
    duration: 1.0,
    tip: { x: 880, y: 420 },
  },
  {
    d: "M 800 440 C 820 380, 840 330, 860 280",
    width: 3.2,
    delay: 0.65,
    duration: 1.0,
    tip: { x: 860, y: 280 },
  },
  {
    d: "M 730 340 C 740 295, 745 270, 750 250",
    width: 5.5,
    delay: 0.6,
    duration: 0.85,
  },
  {
    d: "M 730 340 C 780 270, 830 190, 870 110",
    width: 5.0,
    delay: 0.6,
    duration: 0.8,
    tip: { x: ROOT5.cx, y: ROOT5.cy },
    scarlet: true,
  },
  {
    d: "M 750 250 C 730 175, 710 125, 680 80",
    width: 3.5,
    delay: 0.75,
    duration: 0.9,
    tip: { x: 680, y: 80 },
  },
];

function StaticTrunkAndRoots() {
  return (
    <>
      <path d={TRUNK_PATH} fill={STROKE} />
      {ROOT_PATHS.map((r, i) => (
        <path
          key={`root-${i}`}
          d={r.d}
          stroke={STROKE}
          strokeWidth={r.width}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      ))}
    </>
  );
}

function DemoTreeSvg({
  hasScanned,
  showScarlet,
  showBadge,
  isModalOpen,
  onScarletClick,
}: {
  hasScanned: boolean;
  showScarlet: boolean;
  showBadge: boolean;
  isModalOpen: boolean;
  onScarletClick: () => void;
}) {
  const glowScale = isModalOpen ? [1.15, 1.55, 1.15] : [1, 1.35, 1];
  const glowOpacity = isModalOpen
    ? [0.75, 1, 0.75]
    : [0.45, 0.85, 0.45];
  const ringScale = isModalOpen ? [1.1, 1.45, 1.1] : [1, 1.28, 1];
  const coreScale = isModalOpen ? [1.05, 1.22, 1.05] : [1, 1.12, 1];

  return (
    <svg
      viewBox="0 0 1000 700"
      preserveAspectRatio="xMidYMid meet"
      className="w-full h-full max-h-[420px] relative z-10 overflow-visible"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="demoPulseRed" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#EF4444" stopOpacity="0.9" />
          <stop offset="55%" stopColor="#EF4444" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
        </radialGradient>
      </defs>

      <StaticTrunkAndRoots />

      {hasScanned && (
        <>
          {[...MAIN_BRANCHES, ...SIDE_BRANCHES].map((b, i) => (
            <motion.path
              key={`branch-${i}`}
              d={b.d}
              stroke={STROKE}
              strokeWidth={b.width}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                pathLength: {
                  duration: b.duration,
                  delay: b.delay,
                  ease: EASE,
                },
                opacity: { duration: 0.35, delay: b.delay },
              }}
            />
          ))}

          {isModalOpen && (
            <motion.path
              d="M 730 340 C 780 270, 830 190, 870 110"
              stroke="#ef4444"
              strokeWidth={6}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.55 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
            />
          )}

          {SIDE_BRANCHES.filter((b) => b.tip && !b.scarlet).map((b, i) => {
            const tip = b.tip!;
            const landAt = b.delay + b.duration;
            return (
              <motion.circle
                key={`tip-${i}`}
                cx={tip.x}
                cy={tip.y}
                r="5"
                fill="#94a3b8"
                stroke="#FFFFFF"
                strokeWidth="1.5"
                className="transition-all duration-200"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.35, fill: "#64748b" }}
                transition={{
                  duration: 0.45,
                  delay: landAt,
                  ease: "backOut",
                }}
                style={{ transformOrigin: `${tip.x}px ${tip.y}px` }}
              />
            );
          })}

          {showScarlet && (
            <motion.g
              onClick={onScarletClick}
              className="cursor-pointer transition-all duration-200"
              role="button"
              tabIndex={0}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
              animate={{ y: [0, -5, 0] }}
              transition={{
                y: { duration: 3.6, repeat: Infinity, ease: "easeInOut" },
                scale: { type: "spring", stiffness: 400, damping: 25 },
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onScarletClick();
                }
              }}
              style={{ transformOrigin: `${ROOT5.cx}px ${ROOT5.cy}px` }}
            >
              <motion.circle
                cx={ROOT5.cx}
                cy={ROOT5.cy}
                r={36}
                fill="url(#demoPulseRed)"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: glowScale,
                  opacity: glowOpacity,
                  x: [0, 2, -1.5, 0],
                  y: [0, -2, 1.5, 0],
                }}
                transition={{
                  scale: { duration: 3.2, repeat: Infinity, ease: "easeInOut" },
                  opacity: { duration: 3.2, repeat: Infinity, ease: "easeInOut" },
                  x: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
                  y: { duration: 5.2, repeat: Infinity, ease: "easeInOut" },
                }}
                style={{ transformOrigin: `${ROOT5.cx}px ${ROOT5.cy}px` }}
              />
              <motion.circle
                cx={ROOT5.cx}
                cy={ROOT5.cy}
                r={14}
                fill="none"
                stroke="#ef4444"
                strokeWidth={isModalOpen ? 1.8 : 1.3}
                strokeDasharray="3 3"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: ringScale,
                  opacity: isModalOpen ? [0.55, 1, 0.55] : [0.35, 0.8, 0.35],
                }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ transformOrigin: `${ROOT5.cx}px ${ROOT5.cy}px` }}
              />
              <motion.circle
                cx={ROOT5.cx}
                cy={ROOT5.cy}
                r={6.5}
                fill="#ef4444"
                stroke="#FFFFFF"
                strokeWidth="2"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: coreScale, opacity: 1 }}
                transition={{
                  scale: {
                    duration: 2.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                  opacity: { duration: 0.3 },
                }}
                style={{ transformOrigin: `${ROOT5.cx}px ${ROOT5.cy}px` }}
              />

              {showBadge && (
                <motion.g
                  initial={{ opacity: 0, y: 12, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.55, ease: EASE }}
                  style={{ transformOrigin: `${ROOT5.cx}px ${ROOT5.cy}px` }}
                >
                  <rect
                    x={ROOT5.cx - 92}
                    y={ROOT5.cy - 48}
                    width="184"
                    height="26"
                    rx="8"
                    fill="#ef4444"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                  <text
                    x={ROOT5.cx}
                    y={ROOT5.cy - 31}
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="10"
                    fontFamily="var(--font-geist-sans), sans-serif"
                    fontWeight="600"
                  >
                    5 КЛАСС · Знаки при переносе
                  </text>
                </motion.g>
              )}
            </motion.g>
          )}
        </>
      )}
    </svg>
  );
}

export default function InteractiveDemo() {
  const [mounted, setMounted] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showScarlet, setShowScarlet] = useState(false);
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!hasScanned) {
      setShowScarlet(false);
      setShowBadge(false);
      return;
    }

    const scarletTimer = setTimeout(() => setShowScarlet(true), SCARLET_DELAY_MS);
    const badgeTimer = setTimeout(() => setShowBadge(true), BADGE_DELAY_MS);

    return () => {
      clearTimeout(scarletTimer);
      clearTimeout(badgeTimer);
    };
  }, [hasScanned]);

  const handleStartScan = () => {
    setIsScanning(true);
    setHasScanned(false);
    setIsModalOpen(false);
    setShowScarlet(false);
    setShowBadge(false);

    setTimeout(() => {
      setIsScanning(false);
      setHasScanned(true);
    }, 1100);
  };

  const handleReset = () => {
    setIsScanning(false);
    setHasScanned(false);
    setIsModalOpen(false);
    setShowScarlet(false);
    setShowBadge(false);
  };

  if (!mounted) {
    return (
      <section
        id="demo"
        className="relative bg-white text-slate-950 border-t border-slate-100 overflow-hidden select-none"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-12 text-center">
          <div className="inline-flex items-center px-3.5 py-1 rounded-full border border-slate-200 bg-slate-50/80 text-slate-500 text-xs font-mono font-medium uppercase tracking-wider">
            Интерактивная диагностика
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 sm:pb-32 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm min-h-[280px]" />
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xl shadow-slate-200/60 flex flex-col min-h-[520px]">
            <div className="relative flex-1 w-full rounded-2xl overflow-hidden bg-slate-50/40 border border-slate-100 flex items-center justify-center">
              <svg
                viewBox="0 0 1000 700"
                preserveAspectRatio="xMidYMid meet"
                className="w-full h-full max-h-[420px] relative z-10 overflow-visible"
                fill="none"
              >
                <StaticTrunkAndRoots />
              </svg>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="demo"
      className="relative bg-white text-slate-950 border-t border-slate-100 overflow-hidden select-none"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="inline-flex items-center px-3.5 py-1 rounded-full border border-slate-200 bg-slate-50/80 text-slate-500 text-xs font-mono font-medium uppercase tracking-wider">
            Интерактивная диагностика
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-950 leading-[1.12]">
            Как Treever находит первопричину за секунды
          </h2>
          <p className="text-base sm:text-lg text-slate-500 max-w-2xl leading-relaxed text-balance">
            Запустите сканирование, чтобы увидеть как алый импульс пробегает по дереву и находит пробел в 5 классе.
          </p>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 sm:pb-32 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4 flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                <span className="w-2 h-2 rounded-full bg-slate-900" />
                ФОТО РЕШЕНИЯ
              </span>
              <span>8 класс · Алгебра</span>
            </div>

            <div className="relative w-full h-64 md:h-72 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
              <img
                src="/images/sample-math.png"
                alt="Решение ученика"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-slate-900/5 pointer-events-none" />

              {isScanning && (
                <>
                  <motion.div
                    initial={{ top: "-30%" }}
                    animate={{ top: "120%" }}
                    transition={{ repeat: Infinity, duration: 1.1, ease: "easeInOut" }}
                    className="absolute left-0 right-0 h-32 bg-gradient-to-b from-transparent via-white/50 to-transparent backdrop-blur-[2px] pointer-events-none z-10"
                  />
                  <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="px-4 py-2 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-white/15 text-white text-xs font-mono font-medium flex items-center gap-2 shadow-lg"
                    >
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Анализ математических шагов...
                    </motion.div>
                  </div>
                </>
              )}

              {hasScanned && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute bottom-3 left-3 bg-slate-900/90 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-medium backdrop-blur-sm shadow-sm"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Распознано успешно
                </motion.div>
              )}
            </div>

            <div className="min-h-[90px] rounded-2xl bg-slate-50 border border-slate-100 p-3.5">
              {hasScanned ? (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-1.5"
                >
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    Распознанное уравнение
                  </div>
                  <div className="text-sm font-mono text-slate-800 font-medium">
                    √(2x - 1) + 1 = x
                  </div>
                  <div className="text-xs font-mono text-red-600 bg-red-50 px-2 py-1 rounded border border-red-100">
                    Шаг 2: x² - 4x + 2 = 0{" "}
                    <span className="font-semibold">(Ошибка знака)</span>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400 font-mono py-4">
                  Нажмите «Симулировать сканирование»
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleStartScan}
              disabled={isScanning}
              className="flex-1 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-medium py-3 px-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:active:scale-100 cursor-pointer shadow-sm hover:shadow-md"
            >
              <Scan className="w-4 h-4" />
              {isScanning ? "Сканирование..." : "Симулировать сканирование"}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="p-3 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-600 rounded-2xl transition-all duration-200 cursor-pointer hover:rotate-45"
              title="Сбросить"
            >
              <RefreshCw className="w-4 h-4 transition-transform duration-200" />
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xl shadow-slate-200/60 flex flex-col min-h-[520px]"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono pb-4 mb-2 border-b border-slate-100">
            <span className="font-semibold text-slate-700 uppercase tracking-wider">
              Дерево первопричины (Root-Cause DAG)
            </span>
            <span>
              {hasScanned ? "Кликните на красный узел" : "Ожидание сканирования"}
            </span>
          </div>

          <div className="relative flex-1 w-full rounded-2xl overflow-hidden bg-slate-50/40 border border-slate-100 flex items-center justify-center min-h-[380px]">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:20px_20px] opacity-70 pointer-events-none" />

            <DemoTreeSvg
              hasScanned={hasScanned}
              showScarlet={showScarlet}
              showBadge={showBadge}
              isModalOpen={isModalOpen}
              onScarletClick={() => setIsModalOpen((open) => !open)}
            />

            <AnimatePresence>
              {isModalOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: [0, -5, 0] }}
                  exit={{ opacity: 0, scale: 0.95, y: 5 }}
                  transition={{
                    opacity: { type: "spring", stiffness: 400, damping: 25 },
                    scale: { type: "spring", stiffness: 400, damping: 25 },
                    y: {
                      duration: 3.6,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                  }}
                  className="absolute left-5 top-5 z-30 bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-4 max-w-xs md:max-w-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="bg-red-500/15 text-red-400 border border-red-500/30 text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-full inline-block font-semibold">
                      5 КЛАСС
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="text-slate-400 hover:text-white transition-colors duration-200 cursor-pointer p-0.5"
                      aria-label="Закрыть"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="text-sm font-medium text-white mt-2">
                    Знаки при переносе через «=»
                  </h3>

                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    При переносе -1 знак сохранен вместо смены на +1.
                  </p>

                  <div className="mt-3 p-2.5 rounded-xl bg-white/5 border-l-2 border-red-500 text-[11px] text-slate-400 backdrop-blur-sm leading-relaxed">
                    При переносе слагаемого через «=» знак всегда меняется на противоположный
                    (+ → −, − → +).
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
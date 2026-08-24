"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useMotionTemplate,
  type Variants,
} from "framer-motion";
import {
  Users,
  Coins,
  AlertCircle,
  Clock,
  ArrowRight,
} from "lucide-react";

export default function ProblemSection() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 28, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 18,
      },
    },
  };

  const duelRows = [
    {
      category: "ДЕНЬГИ",
      left: {
        value: "32 000 ₸ / мес",
        isStrikethrough: true,
        sub: "288 000 ₸ в год из бюджета семьи",
        meta: "Ежемесячный расход",
      },
      right: {
        value: "0 ₸",
        sub: "Бесплатный базовый доступ",
        meta: "Без скрытых подписок",
      },
    },
    {
      category: "ВРЕМЯ И СКОРОСТЬ",
      left: {
        value: "2–3 ч / неделю",
        isStrikethrough: false,
        sub: "Дорога, расписание, отмены занятий",
        meta: "Привязка к графику",
      },
      right: {
        value: "30 секунд",
        sub: "Сканирование по фото 24/7",
        meta: "В любое время со смартфона",
      },
    },
    {
      category: "РЕЗУЛЬТАТ",
      left: {
        value: "Зазубривание ДЗ",
        isStrikethrough: false,
        sub: "Пробел остаётся в 5 классе",
        meta: "Поверхностный эффект",
      },
      right: {
        value: "Точечный корень",
        sub: "100% понятийный фундамент навсегда",
        meta: "Устранение первопричины",
      },
    },
  ];

  return (
    <section
      id="problem"
      className="relative bg-white text-slate-950 py-24 sm:py-32 border-t border-slate-100 overflow-hidden select-none"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16 sm:mb-20"
        >
          <div className="inline-flex items-center px-3.5 py-1 rounded-full border border-slate-200 bg-slate-50/80 text-slate-500 text-xs font-mono font-medium uppercase tracking-wider mb-6">
            <span>Проблема системы</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-950 leading-[1.12]">
            Почему обычные уроки и репетиторы не работают?
          </h2>

          <p className="mt-5 text-base sm:text-lg text-slate-500 font-normal leading-relaxed text-balance">
            Учитель в школе физически не может найти пробел каждого ученика, а репетиторы стоят как второй кредит.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 sm:mb-28"
        >
          <motion.div
            variants={cardVariants}
            className="group relative p-7 sm:p-8 rounded-3xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-2xs group-hover:scale-105 transition-transform">
                  <Users className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider">
                  Школьный класс
                </span>
              </div>

              <div className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-950 font-mono">
                1 / 30
              </div>

              <div className="mt-4 text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                Дефицит внимания
              </div>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                1 учитель на 30 учеников за 45 минут. На диагностику ошибки одного ученика остаётся меньше 90 секунд.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200/60 text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>≤ 90 сек на ученика</span>
            </div>
          </motion.div>

          <motion.div
            variants={cardVariants}
            className="group relative p-7 sm:p-8 rounded-3xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-2xs group-hover:scale-105 transition-transform">
                  <Coins className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider">
                  Цена репетитора
                </span>
              </div>

              <div className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-950 font-mono">
                32 000 ₸
              </div>

              <div className="mt-4 text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                Ежемесячный расход
              </div>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Средняя стоимость репетитора в месяц за один предмет. При этом он часто просто решает ДЗ за ребенка.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200/60 text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <span>× 9 месяцев = 288 000 ₸ в год</span>
            </div>
          </motion.div>

          <motion.div
            variants={cardVariants}
            className="group relative p-7 sm:p-8 rounded-3xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-2xs group-hover:scale-105 transition-transform">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider">
                  ИИ-боты
                </span>
              </div>

              <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 leading-snug">
                Симптом vs Причина
              </div>

              <div className="mt-4 text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                Иллюзия понимания
              </div>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                ИИ-боты дают готовый ответ, но не убирают пробел до 5 класса. В итоге следующая контрольная снова сдана на 3.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200/60 text-xs font-mono text-slate-500 flex items-center gap-1.5 font-medium">
              <span>● Пробел переходит в следующий класс</span>
            </div>
          </motion.div>
        </motion.div>

        <div className="space-y-6 sm:space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between px-2 text-xs font-mono uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-3"
          >
            <span>Обычный репетитор</span>
            <span className="font-semibold text-slate-900">Treever (AI)</span>
          </motion.div>

          {duelRows.map((row, index) => (
            <DuelRow key={`duel-${index}`} row={row} index={index} />
          ))}

        </div>

      </div>
    </section>
  );
}

function DuelRow({
  row,
  index,
}: {
  row: {
    category: string;
    left: { value: string; isStrikethrough?: boolean; sub: string; meta: string };
    right: { value: string; sub: string; meta: string };
  };
  index: number;
}) {
  const rowDelay = index * 0.15;

  return (
    <div className="relative">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-center">
        
        <motion.div
          initial={{ x: -80, opacity: 0, filter: "blur(6px)" }}
          whileInView={{ x: 0, opacity: 1, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{
            type: "spring",
            stiffness: 140,
            damping: 16,
            delay: rowDelay,
          }}
          whileHover={{ scale: 1.01 }}
          className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-slate-50/80 border border-slate-200/80 shadow-2xs hover:border-slate-300 hover:bg-slate-50 transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-3 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            <span>{row.category}</span>
            <span>{row.left.meta}</span>
          </div>

          <div
            className={`text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight font-mono ${
              row.left.isStrikethrough
                ? "line-through text-slate-400 decoration-slate-300 decoration-2"
                : "text-slate-700"
            }`}
          >
            {row.left.value}
          </div>

          <div className="mt-2 text-xs sm:text-sm text-slate-500 font-normal">
            {row.left.sub}
          </div>
        </motion.div>

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{
            type: "spring",
            stiffness: 180,
            damping: 14,
            delay: rowDelay + 0.1,
          }}
          className="lg:col-span-2 flex justify-center py-1 lg:py-0"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-200 bg-white shadow-xs flex items-center justify-center text-[10px] font-mono font-bold text-slate-400 tracking-wider">
            VS
          </div>
        </motion.div>

        <motion.div
          initial={{ x: 80, opacity: 0, filter: "blur(6px)" }}
          whileInView={{ x: 0, opacity: 1, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{
            type: "spring",
            stiffness: 140,
            damping: 16,
            delay: rowDelay,
          }}
          className="lg:col-span-5"
        >
          <SpotlightTreeverDuelCard
            category={row.category}
            meta={row.right.meta}
            value={row.right.value}
            sub={row.right.sub}
          />
        </motion.div>

      </div>
    </div>
  );
}

function SpotlightTreeverDuelCard({
  category,
  meta,
  value,
  sub,
}: {
  category: string;
  meta: string;
  value: string;
  sub: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    mouseX.set(-100);
    mouseY.set(-100);
  };

  const borderLight = useMotionTemplate`radial-gradient(160px circle at ${mouseX}px ${mouseY}px, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.05) 50%, transparent 80%)`;
  const surfaceLight = useMotionTemplate`radial-gradient(200px circle at ${mouseX}px ${mouseY}px, rgba(255, 255, 255, 0.04), transparent 70%)`;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      className="group relative p-[1px] rounded-3xl overflow-hidden cursor-default"
    >
      <motion.div
        className="absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-300 opacity-80 group-hover:opacity-100"
        style={{ background: borderLight }}
      />

      <div className="absolute inset-0 rounded-3xl border border-slate-800 pointer-events-none" />

      <div className="relative p-6 sm:p-8 rounded-3xl bg-slate-950 text-white shadow-xl shadow-slate-950/10">
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{ background: surfaceLight }}
        />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            <span className="text-slate-300 font-semibold">{category}</span>
            <span className="flex items-center gap-1 text-white">
              {meta} <ArrowRight className="w-3 h-3 text-slate-400" />
            </span>
          </div>

          <div className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight font-mono text-white">
            {value}
          </div>

          <div className="mt-2 text-xs sm:text-sm text-slate-400 font-normal">
            {sub}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  Clock,
  TrendingUp,
  Users,
} from "lucide-react";
import { MagneticCard } from "@/components/dashboard/MagneticCard";
import {
  studentStatusMeta,
  type ClassAnalytics,
  type StudentTrafficStatus,
} from "@/data/teacherDashboardMock";

const spring = { type: "spring" as const, stiffness: 260, damping: 20 };

type ClassAnalyticsCardsProps = {
  analytics: ClassAnalytics;
};

function StatusBar({
  distribution,
}: {
  distribution: Record<StudentTrafficStatus, number>;
}) {
  const total =
    distribution.green + distribution.yellow + distribution.red;
  const segments: { key: StudentTrafficStatus; count: number }[] = [
    { key: "green", count: distribution.green },
    { key: "yellow", count: distribution.yellow },
    { key: "red", count: distribution.red },
  ];

  return (
    <div className="mt-4 space-y-3">
      <div className="flex h-2.5 overflow-hidden rounded-full bg-slate-100">
        {segments.map(({ key, count }) => (
          <motion.div
            key={key}
            initial={{ width: 0 }}
            animate={{ width: total > 0 ? `${(count / total) * 100}%` : "0%" }}
            transition={{ ...spring, delay: 0.15 }}
            className={`h-full ${studentStatusMeta[key].dotClass}`}
            style={{ opacity: count > 0 ? 1 : 0 }}
          />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {segments.map(({ key, count }) => (
          <div
            key={key}
            className="flex items-center gap-2 rounded-xl border border-black/5 bg-slate-50/80 px-2.5 py-2"
          >
            <span
              className={`h-2 w-2 shrink-0 rounded-full ${studentStatusMeta[key].dotClass}`}
            />
            <div className="min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                {studentStatusMeta[key].label}
              </p>
              <p className="text-sm font-semibold text-slate-950">{count}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ClassAnalyticsCards({ analytics }: ClassAnalyticsCardsProps) {
  const { mainSystemGap, performance, statusDistribution, timeSaved } =
    analytics;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <MagneticCard tiltMax={5} shiftMax={7} className="rounded-3xl">
        <motion.div
          whileHover={{ y: -2 }}
          transition={spring}
          className="relative overflow-hidden rounded-3xl border border-red-500/15 bg-gradient-to-br from-red-50/90 via-white to-white p-6 shadow-sm backdrop-blur-sm sm:p-7"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-red-400/10 blur-2xl"
          />
          <div className="relative flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-600">
              <AlertTriangle className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-red-600/80">
                Главный системный пробел
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                {mainSystemGap.percentage}%
              </p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">
                {mainSystemGap.summary}
              </p>
              <p className="mt-3 inline-flex rounded-full border border-red-500/20 bg-white/80 px-3 py-1 text-xs font-medium text-red-700 backdrop-blur-sm">
                {mainSystemGap.grade} класс · {mainSystemGap.topic}
              </p>
            </div>
          </div>
        </motion.div>
      </MagneticCard>

      <MagneticCard tiltMax={5} shiftMax={7} className="rounded-3xl">
        <motion.div
          whileHover={{ y: -2 }}
          transition={spring}
          className="h-full rounded-3xl border border-black/5 bg-gradient-to-b from-white to-slate-50/80 p-6 shadow-sm backdrop-blur-sm sm:p-7"
        >
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-black/5 bg-slate-50 text-slate-700">
              <TrendingUp className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <div className="flex-1">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                {performance.label}
              </p>
              <div className="mt-3 flex items-end gap-4">
                <div>
                  <p className="text-3xl font-semibold tracking-tight text-slate-950">
                    {performance.averageScore}%
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">средний балл</p>
                </div>
                <div className="h-10 w-px bg-black/5" />
                <div>
                  <p className="text-3xl font-semibold tracking-tight text-slate-950">
                    {performance.progressPercent}%
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    общий прогресс
                  </p>
                </div>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${performance.progressPercent}%` }}
                  transition={{ ...spring, delay: 0.1 }}
                  className="h-full rounded-full bg-slate-950"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </MagneticCard>

      <MagneticCard tiltMax={5} shiftMax={7} className="rounded-3xl">
        <motion.div
          whileHover={{ y: -2 }}
          transition={spring}
          className="h-full rounded-3xl border border-black/5 bg-white/90 p-6 shadow-sm backdrop-blur-sm sm:p-7"
        >
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-black/5 bg-slate-50 text-slate-700">
              <Users className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <div className="flex-1">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Распределение по статусам
              </p>
              <StatusBar distribution={statusDistribution} />
            </div>
          </div>
        </motion.div>
      </MagneticCard>

      <MagneticCard tiltMax={5} shiftMax={7} className="rounded-3xl">
        <motion.div
          whileHover={{ y: -2 }}
          transition={spring}
          className="h-full rounded-3xl border border-black/5 bg-gradient-to-b from-white to-emerald-50/30 p-6 shadow-sm backdrop-blur-sm sm:p-7"
        >
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-50 text-emerald-700">
              <Clock className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                {timeSaved.label}
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                {timeSaved.hoursPerWeek} ч
                <span className="text-lg font-medium text-slate-500"> / нед</span>
              </p>
              <p className="mt-1 text-sm text-slate-600">
                {timeSaved.checksAutomated} автоматических проверок за месяц
              </p>
            </div>
          </div>
        </motion.div>
      </MagneticCard>
    </div>
  );
}

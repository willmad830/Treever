"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Calendar, Flag } from "lucide-react";
import { buildGoalsFromProfile, type GoalCard } from "@/lib/goalsBuilder";
import { loadGoalProgress } from "@/lib/goalProgressStorage";
import type { StudentProfile } from "@/lib/profileStorage";
import { MagneticCard } from "@/components/dashboard/MagneticCard";

const spring = { type: "spring" as const, stiffness: 260, damping: 20 };

type GoalsDeadlinesWidgetProps = {
  profile: StudentProfile;
};

function progressTone(progress: number, priority: GoalCard["priority"]) {
  if (progress >= 100) {
    return {
      bar: "bg-emerald-500",
      badge: "border-emerald-500/25 bg-emerald-50 text-emerald-700",
      label: "Выполнено",
    };
  }
  if (priority === "high" && progress < 40) {
    return {
      bar: "bg-red-500",
      badge: "border-red-500/20 bg-red-50 text-red-700",
      label: "В фокусе",
    };
  }
  return {
    bar: "bg-slate-950",
    badge: "border-amber-500/20 bg-amber-50 text-amber-800",
    label: "В процессе",
  };
}

function GoalCardItem({
  goal,
  index,
}: {
  goal: GoalCard;
  index: number;
}) {
  const tone = progressTone(goal.progress, goal.priority);

  return (
    <MagneticCard tiltMax={6} shiftMax={8} depth={0.9}>
      <motion.article
        initial={{ opacity: 0, y: 18, filter: "blur(4px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-30px" }}
        transition={{ ...spring, delay: index * 0.07 }}
        whileHover={{ y: -3 }}
        className="flex h-full flex-col rounded-2xl border border-black/5 bg-gradient-to-b from-white to-slate-50/80 p-5 shadow-sm"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <span
              className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${tone.badge}`}
            >
              {tone.label}
            </span>
            <h3 className="mt-2 text-sm font-semibold leading-snug tracking-tight text-slate-950 sm:text-base">
              {goal.title}
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-500 line-clamp-2">
              {goal.subtitle}
            </p>
          </div>
          {goal.moduleSlug ? (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
              <Link
                href={`/modules/${goal.moduleSlug}`}
                className="inline-flex shrink-0 rounded-xl border border-black/10 bg-white p-2 text-slate-600 shadow-sm transition-colors hover:border-black/20 hover:text-slate-950"
                aria-label={`Открыть модуль: ${goal.title}`}
              >
                <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
              </Link>
            </motion.div>
          ) : null}
        </div>

        <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-500">
          <Calendar className="h-3.5 w-3.5 text-slate-400" strokeWidth={1.75} />
          <span>Дедлайн: {goal.deadlineLabel}</span>
        </div>

        <div className="mt-auto pt-4">
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-400">
            <span>Прогресс</span>
            <span className="tabular-nums text-slate-600">{goal.progress}%</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
            <motion.div
              className={`h-full rounded-full ${tone.bar}`}
              initial={{ width: 0 }}
              whileInView={{ width: `${goal.progress}%` }}
              viewport={{ once: true }}
              transition={{ ...spring, delay: 0.1 + index * 0.05 }}
            />
          </div>
        </div>
      </motion.article>
    </MagneticCard>
  );
}

export function GoalsDeadlinesWidget({ profile }: GoalsDeadlinesWidgetProps) {
  const progressMap = loadGoalProgress();
  const goals = buildGoalsFromProfile(profile, progressMap);

  return (
    <section>
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 text-slate-500">
            <Flag className="h-4 w-4" strokeWidth={1.75} />
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em]">
              Персональный план
            </span>
          </div>
          <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
            Мои цели и дедлайны
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Сформировано по диагностике · {profile.goalLabel}
          </p>
        </div>
        <p className="text-sm text-slate-400">{goals.length} целей</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {goals.map((goal, index) => (
          <GoalCardItem key={goal.id} goal={goal} index={index} />
        ))}
      </div>
    </section>
  );
}

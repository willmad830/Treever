"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, type Variants } from "framer-motion";
import {
  CheckCircle2,
  Flame,
  Scan,
  Target,
} from "lucide-react";
import Link from "next/link";
import { MagneticCard } from "@/components/dashboard/MagneticCard";
import { SkillTreeWidget } from "@/components/dashboard/SkillTreeWidget";
import { ScanHistoryPanel } from "@/components/dashboard/ScanHistoryPanel";
import { GoalsDeadlinesWidget } from "@/components/dashboard/GoalsDeadlinesWidget";
import { TaskScannerPanel } from "@/components/dashboard/TaskScannerPanel";
import {
  getProfileInitials,
  loadStudentProfile,
  type StudentProfile,
} from "@/lib/profileStorage";

const spring = { type: "spring" as const, stiffness: 260, damping: 20 };

const loopSoft = {
  ease: "easeInOut" as const,
  duration: 3,
  repeat: Infinity,
  repeatType: "reverse" as const,
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 22, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: spring,
  },
};

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = loadStudentProfile();
    if (!stored) {
      router.replace("/diagnostic");
      return;
    }
    setProfile(stored);
    setReady(true);
  }, [router]);

  const weekStats = useMemo(() => {
    if (!profile) {
      return [
        { label: "Сканов сделано", value: "—", icon: Scan },
        { label: "Закрыто пробелов", value: "—", icon: CheckCircle2 },
        { label: "Точность", value: "—", icon: Target },
      ];
    }
    const accuracy = Math.round(
      (profile.testScore / profile.totalQuestions) * 100,
    );
    return [
      { label: "Сканов сделано", value: "3", icon: Scan },
      {
        label: "Закрыто пробелов",
        value: String(Math.max(0, profile.totalQuestions - profile.gaps.length)),
        icon: CheckCircle2,
      },
      { label: "Диагностика", value: `${accuracy}%`, icon: Target },
    ];
  }, [profile]);

  if (!ready || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-sm text-slate-400">
        Загрузка кабинета...
      </div>
    );
  }

  const initials = getProfileInitials(profile.name);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_rgba(15,23,42,0.04),_transparent_55%),linear-gradient(180deg,#fff_0%,#f8fafc_100%)] text-slate-950">
      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="bg-gradient-to-r from-slate-950 via-slate-700 to-slate-500 bg-clip-text text-lg font-bold tracking-tight text-transparent"
          >
            Treever
          </Link>
          <span className="text-xs font-medium tracking-wide text-slate-400">
            Кабинет ученика
          </span>
        </div>
      </header>

      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12"
        style={{ perspective: 1200 }}
      >
        <motion.section variants={itemVariants}>
          <MagneticCard
            tiltMax={4}
            shiftMax={5}
            className="rounded-3xl border border-black/5 bg-white/90 p-6 shadow-sm backdrop-blur-sm sm:p-8"
          >
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  transition={spring}
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-lg font-semibold text-white shadow-lg shadow-black/10"
                >
                  {initials}
                </motion.div>
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                    {profile.name}
                  </h1>
                  <p className="mt-1 text-sm text-slate-500 sm:text-base">
                    {profile.grade} класс · {profile.subject}
                  </p>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-slate-400">
                    <Target className="h-3.5 w-3.5" strokeWidth={1.75} />
                    {profile.goalLabel}
                  </p>
                </div>
              </div>

              <motion.div
                animate={{ y: [0, -3] }}
                transition={loopSoft}
                className="relative inline-flex self-start"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -inset-2 rounded-full bg-amber-400/25 blur-xl"
                />
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 0 0 rgba(251, 191, 36, 0.0)",
                      "0 0 28px 4px rgba(251, 191, 36, 0.35)",
                    ],
                  }}
                  transition={loopSoft}
                  className="relative inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-50/90 px-3.5 py-2 text-sm font-medium text-amber-800 backdrop-blur-sm"
                >
                  <Flame
                    className="h-4 w-4 text-amber-600"
                    strokeWidth={1.75}
                  />
                  <span>{profile.gaps.length} пробел(ов) в фокусе</span>
                </motion.div>
              </motion.div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {weekStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <MagneticCard
                    key={stat.label}
                    tiltMax={8}
                    shiftMax={10}
                    className="rounded-2xl"
                  >
                    <motion.div
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      transition={spring}
                      className="cursor-default rounded-2xl border border-black/5 bg-gradient-to-b from-white to-slate-50/80 p-4 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/5 bg-slate-50 text-slate-700">
                          <Icon
                            className="h-[18px] w-[18px]"
                            strokeWidth={1.75}
                          />
                        </span>
                        <div>
                          <p className="text-xs font-medium tracking-wide text-slate-400">
                            {stat.label}
                          </p>
                          <p className="mt-0.5 text-xl font-semibold tracking-tight text-slate-950">
                            {stat.value}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </MagneticCard>
                );
              })}
            </div>
          </MagneticCard>
        </motion.section>

        <motion.section variants={itemVariants} className="mt-6">
          <MagneticCard
            tiltMax={3}
            shiftMax={4}
            className="rounded-3xl border border-black/5 bg-white/90 p-6 shadow-sm backdrop-blur-sm sm:p-8"
          >
            <GoalsDeadlinesWidget profile={profile} />
          </MagneticCard>
        </motion.section>

        <motion.section variants={itemVariants} className="mt-6">
          <SkillTreeWidget />
        </motion.section>

        <motion.section variants={itemVariants} className="mt-6">
          <MagneticCard
            tiltMax={3}
            shiftMax={4}
            className="rounded-3xl border border-black/5 bg-white/90 p-6 shadow-sm backdrop-blur-sm sm:p-8"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
                  Сканер задач
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Загрузите решение — AI найдёт корневой пробел
                </p>
              </div>
            </div>

            <div className="mt-6">
              <TaskScannerPanel layoutId="dashboard-scanner-mode-pill" />
            </div>
          </MagneticCard>
        </motion.section>

        <motion.section variants={itemVariants} className="mt-6 pb-4">
          <ScanHistoryPanel />
        </motion.section>
      </motion.main>
    </div>
  );
}

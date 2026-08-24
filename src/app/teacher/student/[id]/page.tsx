"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, type Variants } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { SkillTreeWidget } from "@/components/dashboard/SkillTreeWidget";
import { getStudentById, studentStatusMeta } from "@/data/teacherDashboardMock";

const spring = { type: "spring" as const, stiffness: 260, damping: 20 };

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: spring,
  },
};

export default function TeacherStudentPage() {
  const params = useParams();
  const studentId = typeof params.id === "string" ? params.id : "";
  const student = getStudentById(studentId);

  if (!student) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4 text-slate-950">
        <div className="text-center">
          <p className="text-lg font-semibold">Ученик не найден</p>
          <Link
            href="/teacher"
            className="mt-4 inline-flex text-sm font-medium text-slate-500 hover:text-slate-950"
          >
            Вернуться к классу
          </Link>
        </div>
      </div>
    );
  }

  const meta = studentStatusMeta[student.status];

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_rgba(15,23,42,0.04),_transparent_55%),linear-gradient(180deg,#fff_0%,#f8fafc_100%)] text-slate-950">
      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/teacher"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-950"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
            К классу
          </Link>
          <span className="text-xs font-medium tracking-wide text-slate-400">
            Граф ошибок
          </span>
        </div>
      </header>

      <motion.main
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12"
      >
        <motion.section variants={itemVariants} className="mb-6">
          <div className="rounded-3xl border border-black/5 bg-white/90 p-6 shadow-sm backdrop-blur-sm sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
                  {student.name}
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Корневой пробел: {student.rootGap.grade} класс ·{" "}
                  {student.rootGap.topic}
                </p>
              </div>
              <span
                className={`inline-flex self-start items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide ${meta.badgeClass}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${meta.dotClass}`} />
                {meta.label}
              </span>
            </div>
          </div>
        </motion.section>

        <motion.section variants={itemVariants}>
          <SkillTreeWidget />
        </motion.section>
      </motion.main>
    </div>
  );
}

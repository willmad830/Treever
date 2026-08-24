"use client";

import { motion } from "framer-motion";
import { ChevronDown, GraduationCap, Users } from "lucide-react";
import {
  teacherClasses,
  teacherProfile,
  type TeacherClass,
} from "@/data/teacherDashboardMock";
import { MagneticCard } from "@/components/dashboard/MagneticCard";

const spring = { type: "spring" as const, stiffness: 260, damping: 20 };

type TeacherClassHeaderProps = {
  selectedClass: TeacherClass;
  onClassChange: (classId: string) => void;
};

export function TeacherClassHeader({
  selectedClass,
  onClassChange,
}: TeacherClassHeaderProps) {
  const totalStudents = selectedClass.students.length;

  return (
    <MagneticCard
      tiltMax={4}
      shiftMax={5}
      className="rounded-3xl border border-black/5 bg-white/90 p-6 shadow-sm backdrop-blur-sm sm:p-8"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            transition={spring}
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-lg font-semibold text-white shadow-lg shadow-black/10"
          >
            {teacherProfile.initials}
          </motion.div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              {teacherProfile.subject}
            </p>
            <h1 className="mt-0.5 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
              {teacherProfile.name}
            </h1>
            <p className="mt-1 text-sm text-slate-500 sm:text-base">
              {teacherProfile.school}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative">
            <label htmlFor="class-select" className="sr-only">
              Выбор класса
            </label>
            <GraduationCap
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              strokeWidth={1.75}
            />
            <select
              id="class-select"
              value={selectedClass.id}
              onChange={(e) => onClassChange(e.target.value)}
              className="w-full cursor-pointer appearance-none rounded-2xl border border-black/10 bg-white/90 py-3 pl-10 pr-10 text-sm font-medium text-slate-950 shadow-sm outline-none backdrop-blur-sm transition-[border-color,box-shadow] hover:border-black/20 focus:border-black/25 focus:ring-4 focus:ring-black/5 sm:min-w-[140px]"
            >
              {teacherClasses.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              strokeWidth={1.75}
            />
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={spring}
            className="inline-flex items-center gap-2.5 rounded-2xl border border-black/5 bg-gradient-to-b from-white to-slate-50/80 px-4 py-3 shadow-sm"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/5 bg-slate-50 text-slate-700">
              <Users className="h-[18px] w-[18px]" strokeWidth={1.75} />
            </span>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                Учеников
              </p>
              <p className="text-lg font-semibold tracking-tight text-slate-950">
                {totalStudents}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </MagneticCard>
  );
}

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Clock3,
  Flame,
  GitBranch,
  Search,
} from "lucide-react";
import { MagneticCard } from "@/components/dashboard/MagneticCard";
import {
  studentStatusMeta,
  type ClassStudent,
  type StatusFilter,
  type StudentTrafficStatus,
} from "@/data/teacherDashboardMock";

const spring = { type: "spring" as const, stiffness: 260, damping: 20 };

const filterOptions: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "Все" },
  { id: "green", label: "Green" },
  { id: "yellow", label: "Yellow" },
  { id: "red", label: "Red" },
];

type StudentListPanelProps = {
  students: ClassStudent[];
};

function formatRootGap(gap: ClassStudent["rootGap"]) {
  return `${gap.grade} класс: ${gap.topic}`;
}

export function StudentListPanel({ students }: StudentListPanelProps) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return students.filter((student) => {
      const matchesQuery =
        !q ||
        student.name.toLowerCase().includes(q) ||
        formatRootGap(student.rootGap).toLowerCase().includes(q) ||
        student.lastScan.topic.toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === "all" || student.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [students, query, statusFilter]);

  return (
    <MagneticCard
      tiltMax={3}
      shiftMax={4}
      className="rounded-3xl border border-black/5 bg-white/90 p-6 shadow-sm backdrop-blur-sm sm:p-8"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
            Список учеников
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Поиск, фильтрация и переход к графу ошибок
          </p>
        </div>
        <p className="text-sm text-slate-400">
          {filtered.length} из {students.length}
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-sm">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            strokeWidth={1.75}
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по ФИО, теме..."
            className="w-full rounded-2xl border border-black/10 bg-white py-3 pl-10 pr-4 text-sm text-slate-950 shadow-sm outline-none transition-[border-color,box-shadow] placeholder:text-slate-400 focus:border-black/25 focus:ring-4 focus:ring-black/5"
          />
        </div>

        <div className="inline-flex w-full rounded-2xl border border-black/5 bg-slate-50/90 p-1 backdrop-blur-sm sm:w-auto">
          {filterOptions.map((option) => {
            const active = statusFilter === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setStatusFilter(option.id)}
                className="relative flex-1 cursor-pointer sm:flex-none"
              >
                {active ? (
                  <motion.span
                    layoutId="student-status-filter"
                    className="absolute inset-0 rounded-xl border border-black/5 bg-white shadow-sm"
                    transition={spring}
                  />
                ) : null}
                <span
                  className={`relative z-10 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors ${
                    active ? "text-slate-950" : "text-slate-500"
                  }`}
                >
                  {option.id !== "all" ? (
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${studentStatusMeta[option.id as StudentTrafficStatus].dotClass}`}
                    />
                  ) : null}
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-black/5">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[880px] text-left text-sm">
            <thead>
              <tr className="border-b border-black/5 bg-slate-50/80 text-[11px] font-medium uppercase tracking-wide text-slate-400">
                <th className="px-4 py-3.5 font-medium">ФИО</th>
                <th className="px-4 py-3.5 font-medium">Статус</th>
                <th className="px-4 py-3.5 font-medium">Корневой пробел</th>
                <th className="px-4 py-3.5 font-medium">Последний скан</th>
                <th className="px-4 py-3.5 font-medium">Стрик</th>
                <th className="px-4 py-3.5 font-medium text-right">Граф</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {filtered.map((student, index) => (
                  <StudentRow
                    key={student.id}
                    student={student}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-black/5 md:hidden">
          <AnimatePresence mode="popLayout">
            {filtered.map((student, index) => (
              <StudentCard
                key={student.id}
                student={student}
                index={index}
              />
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-4 py-12 text-center text-sm text-slate-500"
          >
            Нет учеников по выбранным фильтрам
          </motion.div>
        ) : null}
      </div>
    </MagneticCard>
  );
}

function StudentRow({
  student,
  index,
}: {
  student: ClassStudent;
  index: number;
}) {
  const meta = studentStatusMeta[student.status];

  return (
    <motion.tr
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ ...spring, delay: index * 0.03 }}
      className="group border-b border-black/5 bg-white transition-colors last:border-b-0 hover:bg-slate-50/60"
    >
      <td className="px-4 py-4 font-medium text-slate-950">{student.name}</td>
      <td className="px-4 py-4">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${meta.badgeClass}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${meta.dotClass}`} />
          {meta.label}
        </span>
      </td>
      <td className="px-4 py-4 text-slate-600">
        {formatRootGap(student.rootGap)}
      </td>
      <td className="px-4 py-4">
        <p className="text-slate-950">{student.lastScan.topic}</p>
        <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-slate-400">
          <Clock3 className="h-3 w-3" strokeWidth={1.75} />
          {student.lastScan.timeLabel}
        </p>
      </td>
      <td className="px-4 py-4">
        <span className="inline-flex items-center gap-1.5 text-slate-700">
          <Flame className="h-3.5 w-3.5 text-amber-500" strokeWidth={1.75} />
          {student.streak} дн.
        </span>
      </td>
      <td className="px-4 py-4 text-right">
        <GraphLink studentId={student.id} />
      </td>
    </motion.tr>
  );
}

function StudentCard({
  student,
  index,
}: {
  student: ClassStudent;
  index: number;
}) {
  const meta = studentStatusMeta[student.status];

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ ...spring, delay: index * 0.04 }}
      className="bg-white p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-950">{student.name}</h3>
          <span
            className={`mt-2 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${meta.badgeClass}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${meta.dotClass}`} />
            {meta.label}
          </span>
        </div>
        <GraphLink studentId={student.id} compact />
      </div>
      <dl className="mt-4 space-y-2 text-sm">
        <div>
          <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
            Корневой пробел
          </dt>
          <dd className="mt-0.5 text-slate-600">
            {formatRootGap(student.rootGap)}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
            Последний скан
          </dt>
          <dd className="mt-0.5 text-slate-950">{student.lastScan.topic}</dd>
          <dd className="mt-0.5 inline-flex items-center gap-1 text-xs text-slate-400">
            <Clock3 className="h-3 w-3" strokeWidth={1.75} />
            {student.lastScan.timeLabel}
          </dd>
        </div>
        <div className="flex items-center gap-1.5 text-slate-700">
          <Flame className="h-3.5 w-3.5 text-amber-500" strokeWidth={1.75} />
          {student.streak} дней подряд
        </div>
      </dl>
    </motion.article>
  );
}

function GraphLink({
  studentId,
  compact = false,
}: {
  studentId: string;
  compact?: boolean;
}) {
  return (
    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} transition={spring}>
      <Link
        href={`/teacher/student/${studentId}`}
        className={`inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-black/10 bg-white font-medium text-slate-950 shadow-sm transition-[border-color,background-color] hover:border-black/20 hover:bg-slate-50 ${
          compact ? "px-2.5 py-2 text-xs" : "px-3 py-2 text-xs"
        }`}
      >
        <GitBranch className="h-3.5 w-3.5" strokeWidth={1.75} />
        {compact ? null : <span>Граф ошибок</span>}
        <ArrowUpRight className="h-3 w-3 text-slate-400" strokeWidth={1.75} />
      </Link>
    </motion.div>
  );
}

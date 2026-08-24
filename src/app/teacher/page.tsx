"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { Plus } from "lucide-react";
import { TeacherClassHeader } from "@/components/teacher/TeacherClassHeader";
import { ClassAnalyticsCards } from "@/components/teacher/ClassAnalyticsCards";
import { StudentListPanel } from "@/components/teacher/StudentListPanel";
import { AssignMaterialModal } from "@/components/teacher/AssignMaterialModal";
import { SentMaterialsPanel } from "@/components/teacher/SentMaterialsPanel";
import { teacherClasses } from "@/data/teacherDashboardMock";
import {
  loadSentMaterials,
  saveSentMaterials,
  type SentMaterial,
} from "@/lib/materialStorage";

const spring = { type: "spring" as const, stiffness: 260, damping: 20 };

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

export default function TeacherPage() {
  const [classId, setClassId] = useState(teacherClasses[0].id);
  const [sentMaterials, setSentMaterials] = useState<SentMaterial[]>([]);
  const [materialModalOpen, setMaterialModalOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSentMaterials(loadSentMaterials());
    setHydrated(true);
  }, []);

  const selectedClass = useMemo(
    () => teacherClasses.find((cls) => cls.id === classId) ?? teacherClasses[0],
    [classId],
  );

  const classMaterials = useMemo(
    () =>
      [...sentMaterials]
        .filter((m) => m.classId === selectedClass.id)
        .sort((a, b) => b.sentAt - a.sentAt),
    [sentMaterials, selectedClass.id],
  );

  const handleMaterialSubmit = useCallback((material: SentMaterial) => {
    setSentMaterials((prev) => {
      const next = [material, ...prev];
      saveSentMaterials(next);
      return next;
    });
  }, []);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_rgba(15,23,42,0.04),_transparent_55%),linear-gradient(180deg,#fff_0%,#f8fafc_100%)] text-slate-950">
      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="bg-gradient-to-r from-slate-950 via-slate-700 to-slate-500 bg-clip-text text-lg font-bold tracking-tight text-transparent"
          >
            Treever
          </Link>
          <span className="text-xs font-medium tracking-wide text-slate-400">
            Кабинет учителя
          </span>
        </div>
      </header>

      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12"
        style={{ perspective: 1200 }}
      >
        <motion.section variants={itemVariants}>
          <TeacherClassHeader
            selectedClass={selectedClass}
            onClassChange={setClassId}
          />
        </motion.section>

        <motion.section variants={itemVariants} className="mt-6">
          <ClassAnalyticsCards analytics={selectedClass.analytics} />
        </motion.section>

        <motion.section variants={itemVariants} className="mt-6">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
                Работа с классом
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Назначайте материалы и отслеживайте выполнение
              </p>
            </div>
            <motion.button
              type="button"
              onClick={() => setMaterialModalOpen(true)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              transition={spring}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white shadow-2xl hover:shadow-black/20"
            >
              <Plus className="h-4 w-4" strokeWidth={1.75} />
              Назначить материал
            </motion.button>
          </div>
        </motion.section>

        <motion.section variants={itemVariants} className="mt-2">
          <StudentListPanel students={selectedClass.students} />
        </motion.section>

        {hydrated ? (
          <motion.section variants={itemVariants} className="mt-8 pb-4">
            <SentMaterialsPanel
              materials={classMaterials}
              classLabel={selectedClass.label}
            />
          </motion.section>
        ) : null}
      </motion.main>

      <AssignMaterialModal
        open={materialModalOpen}
        onClose={() => setMaterialModalOpen(false)}
        selectedClass={selectedClass}
        onSubmit={handleMaterialSubmit}
      />
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { ArrowLeft, BookOpen, ChevronRight } from "lucide-react";
import { MathText } from "@/components/MathText";
import { MagneticCard } from "@/components/dashboard/MagneticCard";
import { TaskScannerPanel } from "@/components/dashboard/TaskScannerPanel";
import { getModuleBySlug, learningModules } from "@/data/modulesCatalog";

const spring = { type: "spring" as const, stiffness: 260, damping: 20 };

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 22, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: spring,
  },
};

export default function ModulePage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const module = getModuleBySlug(slug);
  const [showPractice, setShowPractice] = useState(false);

  if (!module) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="text-center">
          <p className="text-lg font-semibold text-slate-950">Модуль не найден</p>
          <Link
            href="/dashboard"
            className="mt-4 inline-flex text-sm text-slate-500 hover:text-slate-950"
          >
            В кабинет
          </Link>
        </div>
      </div>
    );
  }

  const moduleIndex = learningModules.findIndex((m) => m.slug === slug) + 1;

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_rgba(15,23,42,0.04),_transparent_55%),linear-gradient(180deg,#fff_0%,#f8fafc_100%)] text-slate-950">
      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-950"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
            К Skill Tree
          </Link>
          <span className="text-xs font-medium tracking-wide text-slate-400">
            Модуль {moduleIndex}
          </span>
        </div>
      </header>

      <motion.main
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12"
      >
        <motion.header variants={itemVariants} className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            <BookOpen className="h-3.5 w-3.5" strokeWidth={1.75} />
            {module.grade} класс · {module.subtitle}
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            {module.title}
          </h1>
        </motion.header>

        <motion.article variants={itemVariants} className="space-y-6">
          {module.sections.map((section, index) => (
            <MagneticCard
              key={section.title}
              tiltMax={3}
              shiftMax={4}
              className="rounded-3xl"
            >
              <motion.section
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ ...spring, delay: index * 0.05 }}
                className="rounded-3xl border border-black/5 bg-white/90 p-6 shadow-sm backdrop-blur-sm sm:p-8"
              >
                <h2 className="text-lg font-semibold tracking-tight text-slate-950">
                  {section.title}
                </h2>
                <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                  {section.body.split("\n\n").map((paragraph, i) => (
                    <p key={i}>
                      <MathText text={paragraph} />
                    </p>
                  ))}
                </div>
              </motion.section>
            </MagneticCard>
          ))}
        </motion.article>

        {!showPractice ? (
          <motion.div variants={itemVariants} className="mt-10">
            <motion.button
              type="button"
              onClick={() => setShowPractice(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={spring}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-black px-6 py-4 text-sm font-semibold text-white shadow-2xl sm:w-auto"
            >
              Проверить усвоение
              <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
            </motion.button>
          </motion.div>
        ) : null}

        <AnimatePresence>
          {showPractice ? (
            <motion.section
              key="practice"
              initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 16, filter: "blur(4px)" }}
              transition={spring}
              className="mt-10"
            >
              <MagneticCard
                tiltMax={3}
                shiftMax={4}
                className="rounded-3xl border border-black/5 bg-white/90 p-6 shadow-sm backdrop-blur-sm sm:p-8"
              >
                <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                  Практика по теме
                </h2>
                <p className="mt-2 text-sm text-slate-500">{module.practiceHint}</p>

                <div className="mt-4 rounded-2xl border border-black/5 bg-slate-50/80 px-4 py-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Задача
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-950 sm:text-base">
                    {module.practiceProblem}
                  </p>
                </div>

                <div className="mt-6">
                  <TaskScannerPanel
                    defaultManualText={module.practiceProblem}
                    manualPlaceholder="Опишите решение или вставьте условие..."
                    submitLabel="Проверить решение"
                    dropzoneLabel="Загрузить фото решения"
                    layoutId="module-scanner-mode-pill"
                    textareaId={`module-practice-${module.slug}`}
                    minHeight={280}
                  />
                </div>
              </MagneticCard>
            </motion.section>
          ) : null}
        </AnimatePresence>
      </motion.main>
    </div>
  );
}

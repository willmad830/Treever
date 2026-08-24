"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  Target,
} from "lucide-react";
import { MathText } from "@/components/MathText";
import { MagneticCard } from "@/components/dashboard/MagneticCard";
import {
  buildGapsFromAnswers,
  diagnosticQuestions,
  studentGoals,
  studentGrades,
  studentSubjects,
} from "@/data/diagnosticMock";
import {
  saveStudentProfile,
  type DiagnosticAnswer,
  type StudentGoalId,
} from "@/lib/profileStorage";

const spring = { type: "spring" as const, stiffness: 260, damping: 20 };

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.06 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: spring,
  },
};

type Step = "profile" | "test" | "result";

export default function DiagnosticPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("profile");
  const [name, setName] = useState("");
  const [grade, setGrade] = useState<number>(8);
  const [subject, setSubject] = useState<(typeof studentSubjects)[number]["id"]>(
    studentSubjects[0].id,
  );
  const [goalId, setGoalId] = useState<StudentGoalId>("catch_up");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const subjectLabel =
    studentSubjects.find((s) => s.id === subject)?.label ?? "Математика";
  const goalLabel =
    studentGoals.find((g) => g.id === goalId)?.label ?? "";

  const testAnswers = useMemo(
    () =>
      diagnosticQuestions.map((q) => ({
        questionId: q.id,
        selectedIndex: answers[q.id] ?? -1,
      })),
    [answers],
  );

  const score = useMemo(
    () =>
      diagnosticQuestions.filter(
        (q) => answers[q.id] === q.correctIndex,
      ).length,
    [answers],
  );

  const gaps = useMemo(
    () =>
      buildGapsFromAnswers(
        testAnswers.filter((a) => a.selectedIndex >= 0),
      ),
    [testAnswers],
  );

  const currentQuestion = diagnosticQuestions[questionIndex];
  const profileValid = grade >= 7 && grade <= 12 && goalId && subject;

  const finishDiagnostic = () => {
    const diagnosticAnswers: DiagnosticAnswer[] = diagnosticQuestions.map(
      (q) => ({
        questionId: q.id,
        selectedIndex: answers[q.id] ?? -1,
        correct: answers[q.id] === q.correctIndex,
      }),
    );

    saveStudentProfile({
      name: name.trim() || "Ученик Treever",
      grade,
      subject: subjectLabel,
      goalId,
      goalLabel,
      completedAt: Date.now(),
      testScore: score,
      totalQuestions: diagnosticQuestions.length,
      gaps,
      answers: diagnosticAnswers,
    });

    router.push("/dashboard");
  };

  const handleAnswer = (optionIndex: number) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionIndex }));

    if (questionIndex < diagnosticQuestions.length - 1) {
      setTimeout(() => setQuestionIndex((i) => i + 1), 280);
    } else {
      setTimeout(() => setStep("result"), 320);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_rgba(15,23,42,0.04),_transparent_55%),linear-gradient(180deg,#fff_0%,#f8fafc_100%)] text-slate-950">
      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-950"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
            На главную
          </Link>
          <span className="text-xs font-medium tracking-wide text-slate-400">
            Экспресс-диагностика
          </span>
        </div>
      </header>

      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12"
      >
        <motion.div variants={itemVariants} className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-white/90 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500 backdrop-blur-sm">
            <Target className="h-3.5 w-3.5" strokeWidth={1.75} />
            3 вопроса · ~2 минуты
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Диагностика пробелов
          </h1>
          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Укажите профиль и пройдите короткий тест — Skill Tree построится под
            вас
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {step === "profile" ? (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
              transition={spring}
            >
              <MagneticCard
                tiltMax={4}
                shiftMax={5}
                className="rounded-3xl border border-black/5 bg-white/90 p-6 shadow-sm backdrop-blur-sm sm:p-8"
              >
                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="student-name"
                      className="text-xs font-medium uppercase tracking-wide text-slate-400"
                    >
                      Имя (необязательно)
                    </label>
                    <input
                      id="student-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Например, Алихан"
                      className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-black/25 focus:ring-4 focus:ring-black/5"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="student-grade"
                      className="text-xs font-medium uppercase tracking-wide text-slate-400"
                    >
                      Класс
                    </label>
                    <div className="relative mt-2">
                      <GraduationCap
                        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                        strokeWidth={1.75}
                      />
                      <select
                        id="student-grade"
                        value={grade}
                        onChange={(e) => setGrade(Number(e.target.value))}
                        className="w-full cursor-pointer appearance-none rounded-2xl border border-black/10 bg-white py-3 pl-10 pr-4 text-sm font-medium shadow-sm outline-none focus:border-black/25 focus:ring-4 focus:ring-black/5"
                      >
                        {studentGrades.map((g) => (
                          <option key={g} value={g}>
                            {g} класс
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Предмет
                    </span>
                    <div className="mt-2 grid gap-2 sm:grid-cols-3">
                      {studentSubjects.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setSubject(s.id)}
                          className={`cursor-pointer rounded-2xl border px-4 py-3 text-sm font-medium transition-colors ${
                            subject === s.id
                              ? "border-black/20 bg-slate-950 text-white shadow-sm"
                              : "border-black/5 bg-slate-50 text-slate-700 hover:bg-white"
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Цель обучения
                    </span>
                    <div className="mt-2 grid gap-2">
                      {studentGoals.map((g) => (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => setGoalId(g.id)}
                          className={`cursor-pointer rounded-2xl border px-4 py-3 text-left transition-colors ${
                            goalId === g.id
                              ? "border-black/20 bg-white shadow-sm ring-4 ring-black/5"
                              : "border-black/5 bg-slate-50/80 hover:bg-white"
                          }`}
                        >
                          <span className="block text-sm font-semibold text-slate-950">
                            {g.label}
                          </span>
                          <span className="mt-0.5 block text-xs text-slate-500">
                            {g.description}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <motion.button
                  type="button"
                  disabled={!profileValid}
                  onClick={() => setStep("test")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  transition={spring}
                  className="mt-8 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-black px-6 py-3.5 text-sm font-semibold text-white shadow-2xl disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Начать экспресс-тест
                  <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                </motion.button>
              </MagneticCard>
            </motion.div>
          ) : null}

          {step === "test" && currentQuestion ? (
            <motion.div
              key={`test-${questionIndex}`}
              initial={{ opacity: 0, x: 24, filter: "blur(4px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: -24, filter: "blur(4px)" }}
              transition={spring}
            >
              <MagneticCard
                tiltMax={3}
                shiftMax={4}
                className="rounded-3xl border border-black/5 bg-white/90 p-6 shadow-sm backdrop-blur-sm sm:p-8"
              >
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>
                    Вопрос {questionIndex + 1} из {diagnosticQuestions.length}
                  </span>
                  <span>{subjectLabel}</span>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <motion.div
                    className="h-full rounded-full bg-slate-950"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${((questionIndex + 1) / diagnosticQuestions.length) * 100}%`,
                    }}
                    transition={spring}
                  />
                </div>

                <h2 className="mt-6 text-lg font-semibold leading-relaxed text-slate-950 sm:text-xl">
                  <MathText text={currentQuestion.prompt} />
                </h2>

                <div className="mt-6 grid gap-3">
                  {currentQuestion.options.map((option, index) => {
                    const selected = answers[currentQuestion.id] === index;
                    return (
                      <motion.button
                        key={index}
                        type="button"
                        onClick={() => handleAnswer(index)}
                        whileHover={{ scale: 1.01, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        transition={spring}
                        className={`cursor-pointer rounded-2xl border px-4 py-4 text-left text-sm transition-colors ${
                          selected
                            ? "border-black/20 bg-slate-950 text-white"
                            : "border-black/5 bg-slate-50/80 hover:border-black/15 hover:bg-white"
                        }`}
                      >
                        <MathText
                          text={option}
                          className={selected ? "text-white" : "text-slate-800"}
                        />
                      </motion.button>
                    );
                  })}
                </div>
              </MagneticCard>
            </motion.div>
          ) : null}

          {step === "result" ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
              transition={spring}
            >
              <MagneticCard
                tiltMax={4}
                shiftMax={5}
                className="rounded-3xl border border-black/5 bg-white/90 p-6 shadow-sm backdrop-blur-sm sm:p-8"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-50 text-emerald-600">
                    <CheckCircle2 className="h-6 w-6" strokeWidth={1.75} />
                  </span>
                  <div>
                    <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                      Диагностика завершена
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Результат: {score} из {diagnosticQuestions.length} ·{" "}
                      {goalLabel}
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Выявленные пробелы
                  </p>
                  {gaps.map((gap) => (
                    <motion.div
                      key={gap.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={spring}
                      className="rounded-2xl border border-red-500/15 bg-red-50/60 px-4 py-3"
                    >
                      <p className="text-sm font-medium text-red-800">
                        {gap.label}
                      </p>
                      <p className="mt-0.5 text-xs text-red-600/80">
                        Модуль: {gap.topic}
                      </p>
                    </motion.div>
                  ))}
                </div>

                <motion.button
                  type="button"
                  onClick={finishDiagnostic}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  transition={spring}
                  className="mt-8 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-black px-6 py-3.5 text-sm font-semibold text-white shadow-2xl"
                >
                  Перейти в кабинет
                  <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                </motion.button>
              </MagneticCard>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.main>
    </div>
  );
}

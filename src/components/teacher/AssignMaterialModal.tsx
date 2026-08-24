"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import {
  CheckCircle2,
  ChevronDown,
  FileText,
  Send,
  Upload,
  X,
} from "lucide-react";
import { kzAssignmentTopicOptions } from "@/data/mockData";
import {
  studentStatusMeta,
  type ClassStudent,
  type StudentTrafficStatus,
  type TeacherClass,
} from "@/data/teacherDashboardMock";
import {
  formatSentAtLabel,
  type SentMaterial,
} from "@/lib/materialStorage";

const spring = { type: "spring" as const, stiffness: 260, damping: 20 };

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const panelVariants: Variants = {
  hidden: { scale: 0.92, opacity: 0, y: 24, filter: "blur(6px)" },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 300, damping: 28 },
  },
  exit: {
    scale: 0.94,
    opacity: 0,
    y: 16,
    filter: "blur(4px)",
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
  },
};

type RecipientMode =
  | { type: "student"; studentId: string }
  | { type: "status"; status: StudentTrafficStatus }
  | { type: "class" }
  | { type: "topic"; topic: string };

type AssignMaterialModalProps = {
  open: boolean;
  onClose: () => void;
  selectedClass: TeacherClass;
  onSubmit: (material: SentMaterial) => void;
};

function formatRootGap(gap: ClassStudent["rootGap"]) {
  return `${gap.grade} класс: ${gap.topic}`;
}

function countByTopic(students: ClassStudent[], topic: string) {
  return students.filter((s) => formatRootGap(s.rootGap) === topic).length;
}

export function AssignMaterialModal({
  open,
  onClose,
  selectedClass,
  onSubmit,
}: AssignMaterialModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [recipientMode, setRecipientMode] = useState<RecipientMode>({
    type: "class",
  });
  const [topic, setTopic] = useState<string>(kzAssignmentTopicOptions[0]);
  const [customTopic, setCustomTopic] = useState("");
  const [useCustomTopic, setUseCustomTopic] = useState(false);
  const [message, setMessage] = useState("");
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const students = selectedClass.students;

  const statusCounts = useMemo(() => {
    const counts: Record<StudentTrafficStatus, number> = {
      green: 0,
      yellow: 0,
      red: 0,
    };
    for (const s of students) counts[s.status] += 1;
    return counts;
  }, [students]);

  const topicGroups = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of students) {
      const key = formatRootGap(s.rootGap);
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    return [...map.entries()]
      .filter(([, count]) => count > 1)
      .sort((a, b) => b[1] - a[1]);
  }, [students]);

  const resetForm = useCallback(() => {
    setRecipientMode({ type: "class" });
    setTopic(kzAssignmentTopicOptions[0]);
    setCustomTopic("");
    setUseCustomTopic(false);
    setMessage("");
    setAttachedFile(null);
    setUploadProgress(0);
    setIsUploading(false);
    setIsSubmitting(false);
    setShowSuccess(false);
    setIsDragging(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubmitting) onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose, isSubmitting]);

  useEffect(() => {
    if (open) resetForm();
  }, [open, resetForm]);

  const simulateUpload = (file: File) => {
    setAttachedFile(null);
    setIsUploading(true);
    setUploadProgress(0);

    let progress = 0;
    const interval = window.setInterval(() => {
      progress += 8 + Math.random() * 12;
      if (progress >= 100) {
        progress = 100;
        window.clearInterval(interval);
        setUploadProgress(100);
        setTimeout(() => {
          setAttachedFile(file);
          setIsUploading(false);
        }, 350);
      } else {
        setUploadProgress(Math.min(progress, 99));
      }
    }, 120);
  };

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    const allowed = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/webp",
    ];
    if (!allowed.includes(file.type) && !file.name.match(/\.(pdf|png|jpe?g|webp)$/i)) {
      return;
    }
    simulateUpload(file);
  };

  const resolvedTopic = useCustomTopic ? customTopic.trim() : topic;

  const buildRecipientLabel = (): string => {
    switch (recipientMode.type) {
      case "student": {
        const s = students.find((st) => st.id === recipientMode.studentId);
        return s?.name ?? "Ученик";
      }
      case "status":
        return `${studentStatusMeta[recipientMode.status].label}-зона (${statusCounts[recipientMode.status]})`;
      case "class":
        return `Весь класс ${selectedClass.label}`;
      case "topic":
        return `Тема «${recipientMode.topic}» (${countByTopic(students, recipientMode.topic)})`;
    }
  };

  const handleSubmit = async () => {
    if (!resolvedTopic || isSubmitting) return;

    setIsSubmitting(true);

    await new Promise((r) => setTimeout(r, 600));

    const now = new Date();
    const material: SentMaterial = {
      id: `mat-${Date.now()}`,
      classId: selectedClass.id,
      classLabel: selectedClass.label,
      topic: resolvedTopic,
      fileName: attachedFile?.name,
      message: message.trim() || undefined,
      recipientLabel: buildRecipientLabel(),
      sentAt: now.getTime(),
      sentAtLabel: formatSentAtLabel(now),
      completion: { kind: "delivered", label: "Доставлено" },
    };

    setShowSuccess(true);
    await new Promise((r) => setTimeout(r, 900));

    onSubmit(material);
    resetForm();
    onClose();
  };

  const recipientOptions: {
    id: string;
    mode: RecipientMode;
    label: string;
    hint?: string;
  }[] = [
    {
      id: "class",
      mode: { type: "class" },
      label: `Весь класс ${selectedClass.label}`,
      hint: `${students.length} учеников`,
    },
    ...(["red", "yellow", "green"] as StudentTrafficStatus[]).map((status) => ({
      id: `status-${status}`,
      mode: { type: "status" as const, status },
      label: `${studentStatusMeta[status].label}-зона (${statusCounts[status]})`,
      hint: "Группа по статусу",
    })),
    ...students.map((s) => ({
      id: `student-${s.id}`,
      mode: { type: "student" as const, studentId: s.id },
      label: s.name,
      hint: formatRootGap(s.rootGap),
    })),
    ...topicGroups.map(([topicKey, count]) => ({
      id: `topic-${topicKey}`,
      mode: { type: "topic" as const, topic: topicKey },
      label: `Одинаковый пробел: ${topicKey}`,
      hint: `${count} учеников`,
    })),
  ];

  const isRecipientActive = (mode: RecipientMode) => {
    if (mode.type !== recipientMode.type) return false;
    if (mode.type === "student" && recipientMode.type === "student")
      return mode.studentId === recipientMode.studentId;
    if (mode.type === "status" && recipientMode.type === "status")
      return mode.status === recipientMode.status;
    if (mode.type === "topic" && recipientMode.type === "topic")
      return mode.topic === recipientMode.topic;
    return mode.type === recipientMode.type;
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6"
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.button
            type="button"
            aria-label="Закрыть"
            variants={backdropVariants}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 cursor-pointer bg-black/20 backdrop-blur-2xl"
            onClick={() => !isSubmitting && onClose()}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="assign-material-title"
            variants={panelVariants}
            className="relative z-10 flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-t-3xl border border-black/5 bg-white shadow-2xl shadow-black/10 sm:rounded-3xl"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />

            <AnimatePresence>
              {showSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm"
                >
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 320, damping: 22 }}
                    className="flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-50 text-emerald-600"
                  >
                    <CheckCircle2 className="h-8 w-8" strokeWidth={1.75} />
                  </motion.div>
                  <p className="mt-4 text-lg font-semibold tracking-tight text-slate-950">
                    Материал отправлен
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {buildRecipientLabel()}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <div className="flex shrink-0 items-start justify-between gap-4 border-b border-black/5 px-6 py-5 sm:px-7">
              <div>
                <h2
                  id="assign-material-title"
                  className="text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl"
                >
                  Назначить материал
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Класс {selectedClass.label} · загрузка файла и инструкция
                </p>
              </div>
              <motion.button
                type="button"
                aria-label="Закрыть окно"
                onClick={onClose}
                disabled={isSubmitting}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                transition={spring}
                className="shrink-0 rounded-full border border-black/5 bg-white p-2 text-slate-400 shadow-sm hover:border-black/15 hover:text-slate-950 disabled:opacity-50"
              >
                <X className="h-4 w-4" strokeWidth={1.75} />
              </motion.button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 sm:px-7">
              <fieldset className="space-y-3">
                <legend className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Адресат
                </legend>
                <div className="max-h-44 space-y-2 overflow-y-auto rounded-2xl border border-black/5 bg-slate-50/60 p-2">
                  {recipientOptions.map((option) => {
                    const active = isRecipientActive(option.mode);
                    return (
                      <label
                        key={option.id}
                        className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-2.5 transition-colors ${
                          active
                            ? "border-black/15 bg-white shadow-sm"
                            : "border-transparent hover:bg-white/70"
                        }`}
                      >
                        <input
                          type="radio"
                          name="recipient"
                          checked={active}
                          onChange={() => setRecipientMode(option.mode)}
                          className="mt-1 h-4 w-4 accent-slate-950"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-medium text-slate-950">
                            {option.label}
                          </span>
                          {option.hint ? (
                            <span className="mt-0.5 block text-xs text-slate-400">
                              {option.hint}
                            </span>
                          ) : null}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <div className="mt-6 space-y-3">
                <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Тема для проработки
                </label>
                {!useCustomTopic ? (
                  <div className="relative">
                    <select
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="w-full cursor-pointer appearance-none rounded-2xl border border-black/10 bg-white py-3 pl-4 pr-10 text-sm font-medium text-slate-950 shadow-sm outline-none focus:border-black/25 focus:ring-4 focus:ring-black/5"
                    >
                      {kzAssignmentTopicOptions.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                      strokeWidth={1.75}
                    />
                  </div>
                ) : (
                  <input
                    type="text"
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    placeholder="Введите тему..."
                    className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-slate-950 shadow-sm outline-none focus:border-black/25 focus:ring-4 focus:ring-black/5"
                  />
                )}
                <button
                  type="button"
                  onClick={() => setUseCustomTopic((v) => !v)}
                  className="cursor-pointer text-xs font-medium text-slate-500 transition-colors hover:text-slate-950"
                >
                  {useCustomTopic
                    ? "Выбрать из списка корневых пробелов"
                    : "Ввести тему вручную"}
                </button>
              </div>

              <div className="mt-6 space-y-2">
                <label
                  htmlFor="teacher-message"
                  className="text-xs font-medium uppercase tracking-wide text-slate-400"
                >
                  Сообщение / инструкция
                </label>
                <textarea
                  id="teacher-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  placeholder="Пройти микро-урок и решить 3 адаптивные задачи..."
                  className="w-full resize-none rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-slate-950 shadow-sm outline-none placeholder:text-slate-400 focus:border-black/25 focus:ring-4 focus:ring-black/5"
                />
              </div>

              <div className="mt-6 space-y-2">
                <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Файл (PDF, изображение)
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => !isUploading && fileInputRef.current?.click()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      fileInputRef.current?.click();
                    }
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    handleFile(e.dataTransfer.files[0]);
                  }}
                  className={`relative flex min-h-[140px] cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed px-4 py-6 transition-[border-color,background-color,transform] ${
                    isDragging
                      ? "scale-[1.01] border-black/25 bg-slate-50"
                      : "border-black/10 bg-gradient-to-b from-slate-50/80 to-white"
                  }`}
                >
                  {isUploading ? (
                    <div className="w-full max-w-xs space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>Загрузка...</span>
                        <span>{Math.round(uploadProgress)}%</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <motion.div
                          className="h-full rounded-full bg-slate-950"
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadProgress}%` }}
                          transition={{ ease: "easeOut", duration: 0.15 }}
                        />
                      </div>
                    </div>
                  ) : attachedFile ? (
                    <>
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-black/5 bg-white text-slate-700 shadow-sm">
                        <FileText className="h-5 w-5" strokeWidth={1.75} />
                      </span>
                      <p className="max-w-full truncate text-sm font-medium text-slate-950">
                        {attachedFile.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        Нажмите, чтобы заменить файл
                      </p>
                    </>
                  ) : (
                    <>
                      <motion.span
                        animate={isDragging ? { scale: 1.06 } : { scale: 1 }}
                        transition={spring}
                        className="flex h-11 w-11 items-center justify-center rounded-xl border border-black/5 bg-white text-slate-700 shadow-sm"
                      >
                        <Upload className="h-5 w-5" strokeWidth={1.75} />
                      </motion.span>
                      <p className="text-sm font-medium text-slate-700">
                        Перетащите файл или нажмите для выбора
                      </p>
                      <p className="text-xs text-slate-400">
                        PDF, PNG, JPG, WebP
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="shrink-0 border-t border-black/5 px-6 py-4 sm:px-7">
              <motion.button
                type="button"
                onClick={() => void handleSubmit()}
                disabled={!resolvedTopic || isSubmitting || isUploading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={spring}
                className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-black px-6 py-3.5 text-sm font-semibold text-white shadow-2xl disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="h-4 w-4" strokeWidth={1.75} />
                {isSubmitting ? "Отправка..." : "Отправить ученикам"}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

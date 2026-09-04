"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { Camera, Edit3, History, Sparkles, Upload } from "lucide-react";
import { analyzeSolutionWithAI } from "@/services/aiService";
import { saveScanResult } from "@/lib/scanStorage";
import { syncGoalsAfterScan } from "@/lib/goalProgressSync";
import { RecentScansModal } from "@/components/dashboard/RecentScansModal";
import type { ScanAnalysis } from "@/types/scan";

const spring = { type: "spring" as const, stiffness: 260, damping: 20 };

const panelVariants: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.98, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: spring,
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.98,
    filter: "blur(4px)",
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
  },
};

type ScannerMode = "camera" | "upload" | "manual";

const modes: {
  id: ScannerMode;
  label: string;
  icon: typeof Camera;
}[] = [
  { id: "camera", label: "Камера", icon: Camera },
  { id: "upload", label: "Загрузить файл", icon: Upload },
  { id: "manual", label: "Ручной ввод", icon: Edit3 },
];

type TaskScannerPanelProps = {
  defaultManualText?: string;
  manualPlaceholder?: string;
  submitLabel?: string;
  dropzoneLabel?: string;
  layoutId?: string;
  minHeight?: number;
  textareaId?: string;
};

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Не удалось прочитать файл"));
    };
    reader.onerror = () => reject(new Error("Не удалось прочитать файл"));
    reader.readAsDataURL(file);
  });
}

async function processImageFile(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    return fileToDataUrl(file);
  }

  return new Promise<string>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      try {
        const maxDim = 1600;
        let { width, height } = img;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          fileToDataUrl(file).then(resolve).catch(reject);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        resolve(dataUrl);
      } catch {
        fileToDataUrl(file).then(resolve).catch(reject);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      fileToDataUrl(file).then(resolve).catch(reject);
    };

    img.src = objectUrl;
  });
}

export function TaskScannerPanel({
  defaultManualText = "",
  manualPlaceholder = "Введите условие задачи или уравнение (например: 2(x - 3) = 10)...",
  submitLabel = "Отправить на анализ",
  dropzoneLabel = "Сфотографировать задачу",
  layoutId = "scanner-mode-pill",
  minHeight = 320,
  textareaId = "manual-problem",
}: TaskScannerPanelProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<ScannerMode>(
    defaultManualText ? "manual" : "camera",
  );
  const [manualText, setManualText] = useState(defaultManualText);
  const [isHoveringDropzone, setIsHoveringDropzone] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [showRecentModal, setShowRecentModal] = useState(false);

  const handleSelectRecentScan = async (item: {
    imagePreview: string;
    analysis: ScanAnalysis;
  }) => {
    setShowRecentModal(false);
    if (isScanning) return;
    setIsScanning(true);
    setScanError(null);

    try {
      // 2-second timeout as requested for jury demonstration
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const id = `scan-${Date.now()}`;
      const stored = {
        id,
        createdAt: Date.now(),
        imagePreview: item.imagePreview,
        analysis: item.analysis,
      };
      saveScanResult(stored);
      syncGoalsAfterScan(stored);
      router.push(`/scan/${id}`);
    } catch (err) {
      setScanError(err instanceof Error ? err.message : "Ошибка анализа");
      setIsScanning(false);
    }
  };

  const runAnalysisAndRedirect = async (input: {
    image?: string;
    text?: string;
    preview?: string | null;
  }) => {
    if (isScanning) return;
    setIsScanning(true);
    setScanError(null);

    try {
      const analysis = await analyzeSolutionWithAI({
        image: input.image,
        text: input.text,
      });
      const id = `scan-${Date.now()}`;
      const stored = {
        id,
        createdAt: Date.now(),
        imagePreview: input.preview ?? null,
        analysis,
      };
      saveScanResult(stored);
      syncGoalsAfterScan(stored);
      router.push(`/scan/${id}`);
    } catch (err) {
      setScanError(err instanceof Error ? err.message : "Ошибка анализа");
      setIsScanning(false);
    }
  };

  const handleDropzoneActivate = () => {
    if (mode === "manual") return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const image = await processImageFile(file);
      await runAnalysisAndRedirect({ image, preview: image });
    } catch (err) {
      setScanError(
        err instanceof Error ? err.message : "Ошибка обработки файла",
      );
    } finally {
      if (event.target) {
        event.target.value = "";
      }
    }
  };

  const handleManualSubmit = async () => {
    const text = manualText.trim();
    if (!text) {
      setScanError("Введите условие задачи");
      return;
    }
    await runAnalysisAndRedirect({ text });
  };

  const handleDropFiles = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    try {
      const image = await processImageFile(file);
      await runAnalysisAndRedirect({ image, preview: image });
    } catch (err) {
      setScanError(
        err instanceof Error ? err.message : "Ошибка обработки файла",
      );
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="inline-flex w-full rounded-2xl border border-black/5 bg-slate-50/90 p-1 backdrop-blur-sm sm:w-auto">
          {modes.map((item) => {
            const Icon = item.icon;
            const active = mode === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setMode(item.id)}
                className="relative flex-1 cursor-pointer sm:flex-none"
              >
                {active ? (
                  <motion.span
                    layoutId={layoutId}
                    className="absolute inset-0 rounded-xl border border-black/5 bg-white shadow-sm"
                    transition={spring}
                  />
                ) : null}
                <span
                  className={`relative z-10 flex items-center justify-center gap-2 px-3.5 py-2.5 text-sm font-medium transition-colors ${
                    active ? "text-slate-950" : "text-slate-500"
                  }`}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                  <span className="whitespace-nowrap">{item.label}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Quick sample scan button for jury */}
        <button
          type="button"
          onClick={() => setShowRecentModal(true)}
          disabled={isScanning}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-black/5 bg-slate-50/90 hover:bg-slate-100/90 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-950 transition-colors shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          title="Выбрать готовый скан решения (для жюри)"
        >
          <History className="h-4 w-4 text-slate-500" strokeWidth={1.75} />
          <span>Выбрать из последних сканов</span>
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={mode === "camera" ? "image/*" : "image/*,.pdf"}
        capture={mode === "camera" ? "environment" : undefined}
        className="hidden"
        onChange={handleFileChange}
      />

      {scanError ? (
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-sm text-red-600"
        >
          {scanError}
        </motion.p>
      ) : null}

      <div className="relative mt-6" style={{ minHeight }}>
        <AnimatePresence mode="wait">
          {mode === "manual" ? (
            <motion.div
              key="manual"
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative flex flex-col gap-4 rounded-3xl border border-black/5 bg-gradient-to-b from-slate-50/80 to-white px-5 py-6 sm:px-6 sm:py-8"
              style={{ minHeight }}
            >
              <AnimatePresence>
                {isScanning ? (
                  <motion.div
                    key="scan-pulse-manual"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="pointer-events-none absolute inset-4 overflow-hidden rounded-2xl"
                  >
                    <motion.div
                      className="absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-slate-950/10 to-transparent"
                      animate={{ y: ["-20%", "120%"] }}
                      transition={{
                        duration: 1.1,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <label
                htmlFor={textareaId}
                className="text-sm font-medium text-slate-700"
              >
                Условие задачи
              </label>

              <textarea
                id={textareaId}
                value={manualText}
                onChange={(event) => setManualText(event.target.value)}
                placeholder={manualPlaceholder}
                rows={7}
                className="relative z-10 w-full resize-none rounded-2xl border border-black/10 bg-white px-4 py-3.5 text-sm text-slate-950 shadow-sm outline-none transition-[border-color,box-shadow] placeholder:text-slate-400 focus:border-black/25 focus:ring-4 focus:ring-black/5 sm:text-base"
              />

              <motion.button
                type="button"
                onClick={handleManualSubmit}
                disabled={isScanning}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                transition={spring}
                className="relative z-10 inline-flex cursor-pointer items-center gap-2.5 self-start rounded-2xl bg-black px-6 py-3.5 text-sm font-semibold text-white shadow-2xl hover:shadow-black/20 disabled:cursor-wait disabled:opacity-70"
              >
                <Sparkles className="h-4 w-4" strokeWidth={1.75} />
                {isScanning ? "Анализ..." : submitLabel}
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="dropzone"
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              role="button"
              tabIndex={0}
              onClick={handleDropzoneActivate}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  handleDropzoneActivate();
                }
              }}
              onDragOver={(event) => {
                event.preventDefault();
                setIsHoveringDropzone(true);
              }}
              onDragLeave={() => setIsHoveringDropzone(false)}
              onDrop={(event) => {
                event.preventDefault();
                setIsHoveringDropzone(false);
                void handleDropFiles(event.dataTransfer.files);
              }}
              onMouseEnter={() => setIsHoveringDropzone(true)}
              onMouseLeave={() => setIsHoveringDropzone(false)}
              className="relative flex cursor-pointer flex-col items-center justify-center gap-5 rounded-3xl border border-dashed border-black/10 bg-gradient-to-b from-slate-50/80 to-white px-6 py-12 outline-none focus-visible:ring-2 focus-visible:ring-black/10"
              style={{
                minHeight,
                scale: isHoveringDropzone ? 1.01 : 1,
                borderColor: isHoveringDropzone
                  ? "rgba(0,0,0,0.22)"
                  : "rgba(0,0,0,0.1)",
                transition:
                  "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.35s ease",
              }}
            >
              <AnimatePresence>
                {isScanning ? (
                  <motion.div
                    key="scan-pulse"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="pointer-events-none absolute inset-4 overflow-hidden rounded-2xl"
                  >
                    <motion.div
                      className="absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-slate-950/10 to-transparent"
                      animate={{ y: ["-20%", "120%"] }}
                      transition={{
                        duration: 1.1,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <motion.div
                animate={
                  isHoveringDropzone
                    ? { rotate: [-6, 6], scale: 1.06 }
                    : { rotate: 0, scale: 1 }
                }
                transition={
                  isHoveringDropzone
                    ? {
                        rotate: {
                          duration: 1.4,
                          repeat: Infinity,
                          repeatType: "reverse",
                          ease: "easeInOut",
                        },
                        scale: spring,
                      }
                    : spring
                }
                className="relative flex h-20 w-20 items-center justify-center rounded-full border border-black/5 bg-white shadow-sm"
              >
                {mode === "camera" ? (
                  <Camera
                    className="relative h-7 w-7 text-slate-800"
                    strokeWidth={1.5}
                  />
                ) : (
                  <Upload
                    className="relative h-7 w-7 text-slate-800"
                    strokeWidth={1.5}
                  />
                )}
              </motion.div>

              <motion.button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  handleDropzoneActivate();
                }}
                disabled={isScanning}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                transition={spring}
                className="relative z-10 inline-flex cursor-pointer items-center gap-2.5 rounded-2xl bg-black px-6 py-3.5 text-sm font-semibold text-white shadow-2xl hover:shadow-black/20 disabled:cursor-wait disabled:opacity-70"
              >
                <Camera className="h-4 w-4" strokeWidth={1.75} />
                {isScanning ? "Анализ..." : dropzoneLabel}
              </motion.button>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setShowRecentModal(true);
                }}
                disabled={isScanning}
                className="relative z-10 inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors underline decoration-slate-300 underline-offset-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <History className="h-3.5 w-3.5" />
                Или выбрать из последних сканов
              </button>

              <p className="max-w-sm text-center text-xs leading-relaxed text-slate-400 sm:text-sm">
                Перетащите фото с решением задачи или введите условие вручную
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <RecentScansModal
        open={showRecentModal}
        onClose={() => setShowRecentModal(false)}
        onSelectScan={handleSelectRecentScan}
      />
    </>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { KnowledgeTreeSvg } from "@/components/KnowledgeTree";
import { MathText } from "@/components/MathText";
import { NodeDetailPopup } from "@/components/NodeDetailPopup";
import { loadScanResultById, type StoredScanResult } from "@/lib/scanStorage";
import { mapAnalysisToTreeNodes } from "@/lib/treeTips";
import type { PlacedTreeNode } from "@/types/scan";

const spring = { type: "spring" as const, stiffness: 260, damping: 20 };
const SCARLET_DELAY_MS = 1400;
const BADGE_DELAY_MS = 1550;

export default function ScanPage() {
  const params = useParams<{ id: string }>();
  const scanId = params?.id ?? "demo-id";

  const [stored, setStored] = useState<StoredScanResult | null>(null);
  const [ready, setReady] = useState(false);
  const [showNodes, setShowNodes] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  useEffect(() => {
    const result = loadScanResultById(scanId);
    setStored(result);
    setReady(true);
  }, [scanId]);

  const analysis = stored?.analysis ?? null;
  const placedNodes = useMemo(
    () => mapAnalysisToTreeNodes(analysis),
    [analysis],
  );

  const selectedNode: PlacedTreeNode | null = useMemo(() => {
    if (!selectedNodeId) return null;
    return placedNodes.find((n) => n.id === selectedNodeId) ?? null;
  }, [placedNodes, selectedNodeId]);

  useEffect(() => {
    if (!analysis || analysis.is_correct) {
      setShowNodes(false);
      setShowBadge(false);
      return;
    }

    const nodesTimer = setTimeout(() => setShowNodes(true), SCARLET_DELAY_MS);
    const badgeTimer = setTimeout(() => setShowBadge(true), BADGE_DELAY_MS);
    return () => {
      clearTimeout(nodesTimer);
      clearTimeout(badgeTimer);
    };
  }, [analysis]);

  if (!ready) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-sm text-slate-400 font-mono">
        Загрузка анализа...
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-white text-slate-950 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
          className="w-full max-w-md rounded-3xl border border-black/5 bg-white p-8 text-center shadow-sm"
        >
          <h1 className="text-2xl font-semibold tracking-tight">
            Результат не найден
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Скан{" "}
            <span className="font-medium text-slate-700">{scanId}</span> не
            найден. Запустите анализ из кабинета ученика или модуля.
          </p>
          <Link
            href="/dashboard"
            className="mt-6 inline-flex rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white"
          >
            В кабинет
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-950 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
            Кабинет
          </Link>
          <span className="text-xs font-medium text-slate-400 tracking-wide font-mono">
            {scanId}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
          className="lg:col-span-5 rounded-3xl border border-black/5 bg-white p-6 shadow-sm space-y-4"
        >
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
            Результат анализа
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {analysis.target_topic || "Разбор задачи"}
          </h1>

          {stored?.imagePreview && (
            <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
              <img
                src={stored.imagePreview}
                alt="Загруженное решение"
                className="w-full h-full object-cover object-top"
              />
            </div>
          )}

          <div className="rounded-2xl bg-slate-50 border border-slate-100 p-3.5 space-y-2">
            {analysis.recognized_data?.problem_statement && (
              <div>
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  Условие
                </div>
                <div className="text-sm text-slate-800 font-medium mt-1 leading-relaxed">
                  <MathText
                    text={analysis.recognized_data.problem_statement}
                  />
                </div>
              </div>
            )}
            {analysis.recognized_data?.student_solution && (
              <div className="text-xs text-slate-600 bg-white px-2 py-1.5 rounded border border-slate-100 leading-relaxed">
                <MathText text={analysis.recognized_data.student_solution} />
              </div>
            )}
            {analysis.feedback_message && (
              <div
                className={`text-xs px-2 py-1.5 rounded border leading-relaxed ${
                  analysis.is_correct
                    ? "text-emerald-700 bg-emerald-50 border-emerald-100"
                    : "text-red-600 bg-red-50 border-red-100"
                }`}
              >
                <MathText text={analysis.feedback_message} />
              </div>
            )}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.05 }}
          className="lg:col-span-7 rounded-3xl border border-black/5 bg-white p-6 shadow-xl shadow-slate-200/50 flex flex-col min-h-[520px]"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono pb-4 mb-2 border-b border-slate-100">
            <span className="font-semibold text-slate-700 uppercase tracking-wider">
              Дерево первопричины (Root-Cause DAG)
            </span>
            <span>
              {analysis.is_correct
                ? "Ошибок не найдено"
                : "Кликните на красный или янтарный узел"}
            </span>
          </div>

          <div className="relative flex-1 w-full rounded-2xl overflow-visible bg-slate-50/40 border border-slate-100 flex items-center justify-center min-h-[380px]">
            <div className="absolute inset-0 rounded-2xl overflow-hidden bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:20px_20px] opacity-70 pointer-events-none" />

            <KnowledgeTreeSvg
              hasScanned
              showNodes={showNodes && !analysis.is_correct}
              showBadge={showBadge && !analysis.is_correct}
              placedNodes={placedNodes}
              selectedNodeId={selectedNodeId}
              onNodeClick={(node) => {
                if (!node.isInteractive) return;
                setSelectedNodeId((current) =>
                  current === node.id ? null : node.id,
                );
              }}
              gradientId="scanPulseRed"
              amberGradientId="scanPulseAmber"
            />

            <NodeDetailPopup
              node={selectedNode}
              onClose={() => setSelectedNodeId(null)}
            />

            {analysis.is_correct && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-5 left-5 right-5 z-20 rounded-2xl bg-white/90 backdrop-blur-md border border-emerald-100 px-4 py-3 text-sm text-emerald-800 shadow-sm"
              >
                <MathText
                  text={
                    analysis.feedback_message ||
                    "Решение верное — пробелов не обнаружено."
                  }
                />
              </motion.div>
            )}
          </div>
        </motion.section>
      </main>
    </div>
  );
}

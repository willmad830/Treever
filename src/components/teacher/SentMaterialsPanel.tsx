"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock3,
  FileText,
  Send,
  Users,
} from "lucide-react";
import { MagneticCard } from "@/components/dashboard/MagneticCard";
import type { SentMaterial } from "@/lib/materialStorage";

const spring = { type: "spring" as const, stiffness: 260, damping: 20 };

type SentMaterialsPanelProps = {
  materials: SentMaterial[];
  classLabel: string;
};

function completionBadge(material: SentMaterial) {
  const { completion } = material;
  if (completion.kind === "delivered") {
    return {
      className: "border-slate-500/20 bg-slate-50 text-slate-600",
      icon: Send,
    };
  }
  if (completion.completed === completion.total) {
    return {
      className: "border-emerald-500/25 bg-emerald-50 text-emerald-700",
      icon: CheckCircle2,
    };
  }
  return {
    className: "border-amber-500/25 bg-amber-50 text-amber-800",
    icon: CheckCircle2,
  };
}

function MaterialCard({
  material,
  index,
}: {
  material: SentMaterial;
  index: number;
}) {
  const badge = completionBadge(material);
  const BadgeIcon = badge.icon;

  return (
    <MagneticCard tiltMax={5} shiftMax={7} depth={0.85}>
      <motion.article
        layout
        initial={{ opacity: 0, y: 18, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ ...spring, delay: index * 0.06 }}
        whileHover={{ y: -3 }}
        className="group h-full overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm"
      >
        <div className="border-b border-black/5 bg-gradient-to-b from-slate-50/80 to-white px-4 py-4 sm:px-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-semibold tracking-tight text-slate-950 sm:text-base">
                {material.topic}
              </h3>
              {material.fileName ? (
                <p className="mt-1 inline-flex max-w-full items-center gap-1.5 truncate text-xs text-slate-500">
                  <FileText className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
                  {material.fileName}
                </p>
              ) : null}
            </div>
            <span
              className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${badge.className}`}
            >
              <BadgeIcon className="h-3 w-3" strokeWidth={1.75} />
              {material.completion.label}
            </span>
          </div>
        </div>

        <div className="space-y-3 px-4 py-4 sm:px-5">
          {material.message ? (
            <p className="text-sm leading-relaxed text-slate-600 line-clamp-2">
              {material.message}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-slate-400" strokeWidth={1.75} />
              {material.recipientLabel}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5 text-slate-400" strokeWidth={1.75} />
              {material.sentAtLabel}
            </span>
          </div>
        </div>
      </motion.article>
    </MagneticCard>
  );
}

export function SentMaterialsPanel({
  materials,
  classLabel,
}: SentMaterialsPanelProps) {
  return (
    <section>
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
            Отправленные материалы
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Архив назначений для класса {classLabel}
          </p>
        </div>
        <p className="text-sm text-slate-400">{materials.length} записей</p>
      </div>

      {materials.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-black/10 bg-white/60 px-6 py-12 text-center text-sm text-slate-500 backdrop-blur-sm">
          Пока нет отправленных материалов для этого класса
        </div>
      ) : (
        <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {materials.map((material, index) => (
            <MaterialCard key={material.id} material={material} index={index} />
          ))}
        </motion.div>
      )}
    </section>
  );
}

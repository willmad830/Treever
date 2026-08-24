"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Clock3, ImageIcon } from "lucide-react";
import {
  mockScanHistory,
  scanStatusMeta,
  type ScanHistoryItem,
} from "@/data/studentDashboardMock";
import { MagneticCard } from "@/components/dashboard/MagneticCard";

const spring = { type: "spring" as const, stiffness: 260, damping: 20 };

function HistoryCard({
  item,
  index,
}: {
  item: ScanHistoryItem;
  index: number;
}) {
  const meta = scanStatusMeta[item.status];

  return (
    <MagneticCard tiltMax={6} shiftMax={8} depth={0.85}>
      <motion.article
        initial={{ opacity: 0, y: 18, filter: "blur(4px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ ...spring, delay: index * 0.08 }}
        whileHover={{ y: -3 }}
        className="group overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
          {item.imagePath ? (
            <Image
              src={item.imagePath}
              alt={`Скан: ${item.title}`}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-300">
              <ImageIcon className="h-8 w-8" strokeWidth={1.5} />
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent" />
          <span
            className={`absolute left-3 top-3 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide backdrop-blur-md ${meta.className}`}
          >
            {meta.label}
          </span>
        </div>

        <div className="p-4">
          <h3 className="truncate text-sm font-semibold tracking-tight text-slate-950">
            {item.title}
          </h3>
          <p className="mt-1 text-xs text-slate-500">{item.topic}</p>
          <div className="mt-3 flex items-center justify-between gap-2 text-[11px] text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5" strokeWidth={1.75} />
              {item.dateLabel}
            </span>
            <span className="font-medium text-slate-500">
              {item.gapsClosed > 0
                ? `−${item.gapsClosed} пробел`
                : "ожидает разбор"}
            </span>
          </div>
        </div>
      </motion.article>
    </MagneticCard>
  );
}

export function ScanHistoryPanel() {
  return (
    <section>
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
            История проверок
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Последние 3 скана — статусы и превью решений
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {mockScanHistory.map((item, index) => (
          <HistoryCard key={item.id} item={item} index={index} />
        ))}
      </div>
    </section>
  );
}

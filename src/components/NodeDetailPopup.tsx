"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { MathText } from "@/components/MathText";
import type { PlacedTreeNode } from "@/types/scan";

type NodeDetailPopupProps = {
  node: PlacedTreeNode | null;
  onClose: () => void;
};

export function NodeDetailPopup({ node, onClose }: NodeDetailPopupProps) {
  return (
    <AnimatePresence>
      {node && (
        <motion.div
          key={node.id}
          initial={{ scale: 0.94, y: 10 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.96, y: 8 }}
          transition={{ type: "spring", stiffness: 420, damping: 28 }}
          className="pointer-events-none absolute inset-0 z-30"
          style={{ opacity: 1 }}
        >
          <motion.div
            animate={{ y: [0, -5] }}
            transition={{
              duration: 3.6,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            className="pointer-events-auto absolute right-4 top-4 max-w-xs rounded-2xl border border-white/10 bg-slate-900/60 p-4 shadow-2xl backdrop-blur-xl md:max-w-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <span
                className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold font-mono uppercase tracking-wider ${
                  node.isRootCause
                    ? "border-red-500/30 bg-red-500/15 text-red-400"
                    : "border-amber-500/30 bg-amber-500/15 text-amber-300"
                }`}
              >
                {node.grade} КЛАСС
              </span>
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer p-0.5 text-slate-400 transition-colors duration-200 hover:text-white"
                aria-label="Закрыть"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <h3 className="mt-2 text-sm font-medium text-white">
              <MathText text={node.title} />
            </h3>

            {node.description && (
              <p className="mt-1 text-xs leading-relaxed text-slate-300">
                <MathText text={node.description} />
              </p>
            )}

            {node.micro_summary_30sec && (
              <div
                className={`mt-3 rounded-xl border-l-2 bg-white/5 p-2.5 text-[11px] leading-relaxed text-slate-400 backdrop-blur-sm ${
                  node.isRootCause ? "border-red-500" : "border-amber-400"
                }`}
              >
                <MathText text={node.micro_summary_30sec} />
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

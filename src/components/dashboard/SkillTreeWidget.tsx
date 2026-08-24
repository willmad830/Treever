"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, GitBranch, Sparkles } from "lucide-react";
import {
  buildSkillTreeFromProfile,
  enrichTreeNodes,
  getModuleBySkillNodeId,
  type EnrichedSkillNode,
} from "@/data/modulesCatalog";
import type { SkillNodeStatus } from "@/data/studentDashboardMock";
import { loadStudentProfile } from "@/lib/profileStorage";
import { MagneticCard } from "@/components/dashboard/MagneticCard";

const VIEW_W = 720;
const VIEW_H = 360;
const springSoft = { type: "spring" as const, stiffness: 280, damping: 22 };

function statusTone(status: SkillNodeStatus) {
  if (status === "mastered") {
    return {
      fill: "#10b981",
      glow: "#34d399",
      ring: "rgba(16, 185, 129, 0.45)",
      badge: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
    };
  }
  if (status === "gap") {
    return {
      fill: "#ef4444",
      glow: "#f87171",
      ring: "rgba(239, 68, 68, 0.55)",
      badge: "bg-red-500/20 text-red-200 border-red-400/40",
    };
  }
  return {
    fill: "#0f172a",
    glow: "#64748b",
    ring: "rgba(15, 23, 42, 0.35)",
    badge: "bg-white/10 text-slate-200 border-white/15",
  };
}

function MagneticNode({
  node,
  selected,
  onSelect,
  pointerX,
  pointerY,
}: {
  node: EnrichedSkillNode;
  selected: boolean;
  onSelect: (node: EnrichedSkillNode) => void;
  pointerX: ReturnType<typeof useMotionValue<number>>;
  pointerY: ReturnType<typeof useMotionValue<number>>;
}) {
  const tone = statusTone(node.status);
  const strength = node.status === "gap" ? 18 : node.status === "active" ? 14 : 10;

  const dx = useTransform(pointerX, (v) => {
    const d = v - node.x;
    return Math.max(-strength, Math.min(strength, d * 0.045));
  });
  const dy = useTransform(pointerY, (v) => {
    const d = v - node.y;
    return Math.max(-strength, Math.min(strength, d * 0.045));
  });

  const sx = useSpring(dx, { stiffness: 160, damping: 18 });
  const sy = useSpring(dy, { stiffness: 160, damping: 18 });

  const displayLabel = node.accentLabel
    ? node.accentLabel.split(": ").pop() ?? node.label
    : node.label;

  return (
    <motion.g
      style={{ x: sx, y: sy }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ ...springSoft, delay: 0.15 }}
    >
      {node.status === "gap" ? (
        <motion.circle
          cx={node.x}
          cy={node.y}
          r={34}
          fill="none"
          stroke="#f87171"
          strokeWidth={1.5}
          strokeOpacity={0.35}
          animate={{ r: [30, 38, 30], strokeOpacity: [0.25, 0.5, 0.25] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ pointerEvents: "none" }}
        />
      ) : null}

      <motion.circle
        cx={node.x}
        cy={node.y}
        r={selected ? 28 : 22}
        fill={tone.glow}
        opacity={0.22}
        animate={{
          r: selected ? [26, 34] : [20, 28],
          opacity: selected ? [0.28, 0.48] : [0.16, 0.32],
        }}
        transition={{
          duration: 2.8,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        style={{ pointerEvents: "none" }}
      />
      <motion.circle
        cx={node.x}
        cy={node.y}
        r={selected ? 12 : 10}
        fill={tone.fill}
        stroke="#fff"
        strokeWidth={2}
        style={{ cursor: "pointer" }}
        whileHover={{ scale: 1.22 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onSelect(node)}
      />
      <motion.circle
        cx={node.x}
        cy={node.y}
        r={selected ? 16 : 14}
        fill="none"
        stroke={tone.ring}
        strokeWidth={1.4}
        strokeDasharray="3 3"
        style={{ pointerEvents: "none" }}
        animate={{ rotate: selected ? 360 : 0 }}
        transition={
          selected
            ? { duration: 8, repeat: Infinity, ease: "linear" }
            : { duration: 0.3 }
        }
      />
      <foreignObject
        x={node.x - 80}
        y={node.y + 18}
        width={160}
        height={node.accentLabel ? 48 : 36}
        style={{ pointerEvents: "none", overflow: "visible" }}
      >
        <div className="flex flex-col items-center gap-1">
          <span
            className={`inline-flex max-w-[150px] items-center truncate rounded-md border px-2 py-0.5 text-[10px] font-semibold backdrop-blur-md ${tone.badge}`}
          >
            {node.grade} · {displayLabel}
          </span>
          {node.accentLabel ? (
            <span className="max-w-[150px] truncate text-[9px] font-medium text-red-300/90">
              {node.accentLabel}
            </span>
          ) : null}
        </div>
      </foreignObject>
    </motion.g>
  );
}

export function SkillTreeWidget() {
  const router = useRouter();
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const pointerX = useMotionValue(VIEW_W / 2);
  const pointerY = useMotionValue(VIEW_H / 2);

  const profile = useMemo(() => {
    if (!hydrated) return null;
    return loadStudentProfile();
  }, [hydrated]);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (profile?.gaps[0]) {
      setSelectedId(profile.gaps[0].skillNodeId);
    }
  }, [profile]);

  const { nodes, edges } = useMemo(
    () => buildSkillTreeFromProfile(profile),
    [profile],
  );

  const enrichedNodes = useMemo(
    () => enrichTreeNodes(nodes, profile?.gaps ?? []),
    [nodes, profile],
  );

  const byId = useMemo(() => {
    const map = new Map<string, EnrichedSkillNode>();
    enrichedNodes.forEach((n) => map.set(n.id, n));
    return map;
  }, [enrichedNodes]);

  const selected = selectedId ? byId.get(selectedId) : null;

  const handleSelect = (node: EnrichedSkillNode) => {
    setSelectedId(node.id);
    const slug =
      node.moduleSlug ?? getModuleBySkillNodeId(node.id)?.slug;
    if (slug && (node.status === "gap" || node.status === "active")) {
      router.push(`/modules/${slug}`);
    }
  };

  const onPointerMove = (e: PointerEvent<SVGSVGElement>) => {
    const el = svgRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * VIEW_W;
    const y = ((e.clientY - rect.top) / rect.height) * VIEW_H;
    pointerX.set(x);
    pointerY.set(y);
  };

  const onPointerLeave = () => {
    pointerX.set(VIEW_W / 2);
    pointerY.set(VIEW_H / 2);
  };

  const selectedModuleSlug =
    selected?.moduleSlug ?? getModuleBySkillNodeId(selected?.id ?? "")?.slug;

  return (
    <MagneticCard
      tiltMax={5}
      shiftMax={6}
      className="rounded-3xl border border-black/5 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-5 sm:p-6 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.55)]"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 text-slate-300">
            <GitBranch className="h-4 w-4" strokeWidth={1.75} />
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em]">
              Граф знаний
            </span>
          </div>
          <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-white sm:text-2xl">
            Skill Tree
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            {profile
              ? `Персонализация по диагностике · ${profile.gaps.length} пробел(ов)`
              : "Пройдите диагностику для персонализации"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-[10px] font-medium">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2.5 py-1 text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Освоено
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-red-400/20 bg-red-500/10 px-2.5 py-1 text-red-300">
            <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
            Пробел
          </span>
        </div>
      </div>

      <div className="relative mt-5 overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,255,255,0.08),transparent_55%),linear-gradient(180deg,rgba(15,23,42,0.4),rgba(2,6,23,0.55))]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #94a3b8 1px, transparent 1px), linear-gradient(to bottom, #94a3b8 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <svg
          ref={svgRef}
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="relative z-10 h-[240px] w-full sm:h-[300px]"
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
        >
          <defs>
            <linearGradient id="skillEdge" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#64748b" stopOpacity="0.15" />
              <stop offset="50%" stopColor="#cbd5e1" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#64748b" stopOpacity="0.15" />
            </linearGradient>
          </defs>

          {edges.map((edge) => {
            const a = byId.get(edge.from);
            const b = byId.get(edge.to);
            if (!a || !b) return null;
            const isHot =
              a.status === "gap" ||
              b.status === "gap" ||
              selectedId === a.id ||
              selectedId === b.id;
            return (
              <motion.line
                key={`${edge.from}-${edge.to}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={isHot ? "#f87171" : "url(#skillEdge)"}
                strokeWidth={isHot ? 2.4 : 1.6}
                strokeOpacity={isHot ? 0.6 : 0.9}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              />
            );
          })}

          {enrichedNodes.map((node) => (
            <MagneticNode
              key={node.id}
              node={node}
              selected={selectedId === node.id}
              onSelect={handleSelect}
              pointerX={pointerX}
              pointerY={pointerY}
            />
          ))}
        </svg>

        {selected ? (
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springSoft}
            className="relative z-10 border-t border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2">
                <Sparkles
                  className="mt-0.5 h-4 w-4 shrink-0 text-amber-300"
                  strokeWidth={1.75}
                />
                <div>
                  <p className="text-sm font-medium text-white">
                    {selected.accentLabel ?? selected.label}
                    <span className="ml-2 text-xs font-normal text-slate-400">
                      {selected.grade} класс
                    </span>
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {selected.status === "gap"
                      ? "Критический пробел — откройте учебный модуль."
                      : selected.status === "mastered"
                        ? "Тема закреплена."
                        : "Фокус текущей цели."}
                  </p>
                </div>
              </div>
              {selectedModuleSlug &&
              (selected.status === "gap" || selected.status === "active") ? (
                <motion.button
                  type="button"
                  onClick={() => router.push(`/modules/${selectedModuleSlug}`)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  transition={springSoft}
                  className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-xl border border-white/15 bg-white/10 px-2.5 py-1.5 text-[11px] font-semibold text-white backdrop-blur-sm"
                >
                  Модуль
                  <ArrowUpRight className="h-3 w-3" strokeWidth={1.75} />
                </motion.button>
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </div>
    </MagneticCard>
  );
}

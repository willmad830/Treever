"use client";

import { motion } from "framer-motion";
import type { PlacedTreeNode } from "@/types/scan";
import { getActiveLimbPathDs } from "@/lib/treeTips";

const VIEW_H = 700;

const STROKE = "#1e293b";
const EASE = [0.25, 0.1, 0.25, 1] as const;
const VIEW_W = 1000;

const TRUNK_PATH = `
  M 482 700
  C 486 640, 489 570, 492 500
  C 497 485, 503 485, 508 500
  C 511 570, 514 640, 518 700
  Z
`;

const ROOT_PATHS = [
  { d: "M 480 660 C 450 680, 410 695, 370 700", width: 4.0 },
  { d: "M 520 660 C 550 680, 590 695, 630 700", width: 4.0 },
] as const;

type Branch = {
  d: string;
  width: number;
  delay: number;
  duration: number;
  tip?: { x: number; y: number };
};

const MAIN_BRANCHES: Branch[] = [
  {
    d: "M 490 500 C 450 440, 360 400, 270 340",
    width: 7.5,
    delay: 0.2,
    duration: 1.0,
  },
  {
    d: "M 510 500 C 550 440, 640 400, 730 340",
    width: 7.5,
    delay: 0.2,
    duration: 1.0,
  },
];

const SIDE_BRANCHES: Branch[] = [
  {
    d: "M 360 400 C 280 430, 200 440, 120 420",
    width: 4.5,
    delay: 0.6,
    duration: 1.0,
    tip: { x: 120, y: 420 },
  },
  {
    d: "M 200 440 C 180 380, 160 330, 140 280",
    width: 3.2,
    delay: 0.65,
    duration: 1.0,
    tip: { x: 140, y: 280 },
  },
  {
    d: "M 270 340 C 220 270, 170 190, 130 110",
    width: 5.0,
    delay: 0.6,
    duration: 1.1,
    tip: { x: 130, y: 110 },
  },
  {
    d: "M 270 340 C 270 240, 250 170, 230 90",
    width: 4.0,
    delay: 0.65,
    duration: 1.05,
    tip: { x: 230, y: 90 },
  },
  {
    d: "M 250 170 C 300 150, 330 120, 350 80",
    width: 3.0,
    delay: 0.75,
    duration: 0.9,
    tip: { x: 350, y: 80 },
  },
  {
    d: "M 640 400 C 720 430, 800 440, 880 420",
    width: 4.5,
    delay: 0.6,
    duration: 1.0,
    tip: { x: 880, y: 420 },
  },
  {
    d: "M 800 440 C 820 380, 840 330, 860 280",
    width: 3.2,
    delay: 0.65,
    duration: 1.0,
    tip: { x: 860, y: 280 },
  },
  {
    d: "M 730 340 C 740 295, 745 270, 750 250",
    width: 5.5,
    delay: 0.6,
    duration: 0.85,
    tip: { x: 750, y: 250 },
  },
  {
    d: "M 730 340 C 780 270, 830 190, 870 110",
    width: 5.0,
    delay: 0.6,
    duration: 0.8,
    tip: { x: 870, y: 110 },
  },
  {
    d: "M 750 250 C 730 175, 710 125, 680 80",
    width: 3.5,
    delay: 0.75,
    duration: 0.9,
    tip: { x: 680, y: 80 },
  },
];

export function StaticTrunkAndRoots() {
  return (
    <>
      <path d={TRUNK_PATH} fill={STROKE} />
      {ROOT_PATHS.map((r, i) => (
        <path
          key={`root-${i}`}
          d={r.d}
          stroke={STROKE}
          strokeWidth={r.width}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      ))}
    </>
  );
}

function tipKey(x: number, y: number) {
  return `${Math.round(x)},${Math.round(y)}`;
}

function estimateBadgeWidth(label: string) {
  return Math.min(320, Math.max(128, label.length * 6.8 + 28));
}

function badgeBox(node: PlacedTreeNode) {
  const width = estimateBadgeWidth(node.label);
  const height = 28;
  const glowClearance = node.isRootCause ? 48 : 40;
  const sideGap = 14;

  let x: number;
  let y = node.y - height / 2;

  if (node.badgeAlign === "end" || node.x >= VIEW_W * 0.55) {
    x = node.x - glowClearance - width - sideGap;
  } else {
    x = node.x + glowClearance + sideGap;
  }

  x = Math.max(8, Math.min(x, VIEW_W - width - 8));
  y = Math.max(8, Math.min(y, VIEW_H - height - 8));
  return { x, y, width, height };
}

type KnowledgeTreeSvgProps = {
  hasScanned: boolean;
  showNodes: boolean;
  showBadge: boolean;
  placedNodes: PlacedTreeNode[];
  selectedNodeId: string | null;
  onNodeClick: (node: PlacedTreeNode) => void;
  gradientId?: string;
  amberGradientId?: string;
};

function NodeBadge({
  node,
  tone,
  delay,
}: {
  node: PlacedTreeNode;
  tone: "root" | "error" | "neutral";
  delay: number;
}) {
  const box = badgeBox(node);
  const bg =
    tone === "root" ? "#ef4444" : tone === "error" ? "#f59e0b" : "#334155";

  return (
    <motion.foreignObject
      x={box.x}
      y={box.y}
      width={box.width}
      height={box.height}
      initial={{ opacity: 0, y: 10, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: EASE }}
      className="pointer-events-none"
      style={{ overflow: "visible", pointerEvents: "none" }}
    >
      <div
        className="pointer-events-none h-full w-full"
        style={{ pointerEvents: "none" }}
      >
        <div
          className="pointer-events-none inline-flex h-full max-w-full items-center rounded-md px-2.5 py-1 text-[10px] font-semibold leading-none text-white shadow-md whitespace-nowrap"
          style={{
            backgroundColor: bg,
            boxShadow: "0 8px 18px -10px rgba(15, 23, 42, 0.55)",
            pointerEvents: "none",
          }}
          title={node.label}
        >
          <span className="block max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
            {node.label}
          </span>
        </div>
      </div>
    </motion.foreignObject>
  );
}

function InteractiveNode({
  node,
  selected,
  gradientId,
  amberGradientId,
  delayIndex,
}: {
  node: PlacedTreeNode;
  selected: boolean;
  gradientId: string;
  amberGradientId: string;
  delayIndex: number;
}) {
  const isRoot = node.isRootCause;
  const glow = isRoot ? gradientId : amberGradientId;
  const stroke = isRoot ? "#ef4444" : "#f59e0b";
  const fill = isRoot ? "#ef4444" : "#f59e0b";

  const glowScale = selected ? [1.15, 1.55] : [1, 1.35];
  const glowOpacity = selected ? [0.75, 1] : [0.45, 0.85];
  const ringScale = selected ? [1.1, 1.45] : [1, 1.28];
  const coreScale = selected ? [1.05, 1.22] : [1, 1.12];

  const glowR = isRoot ? 36 : 28;
  const ringR = isRoot ? 14 : 12;
  const coreR = isRoot ? 6.5 : 6;

  return (
    <motion.g
      style={{ transformOrigin: `${node.x}px ${node.y}px`, pointerEvents: "none" }}
      animate={{ y: [0, -5] }}
      transition={{
        y: {
          duration: 3.6,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: delayIndex * 0.12,
        },
      }}
    >
      <motion.circle
        cx={node.x}
        cy={node.y}
        r={glowR}
        fill={`url(#${glow})`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: glowScale,
          opacity: glowOpacity,
          x: [0, 2],
          y: [0, -2],
        }}
        transition={{
          scale: {
            duration: 3.2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          },
          opacity: {
            duration: 3.2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          },
          x: {
            duration: 4.5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          },
          y: {
            duration: 5.2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          },
        }}
        style={{ transformOrigin: `${node.x}px ${node.y}px`, pointerEvents: "none" }}
      />
      <motion.circle
        cx={node.x}
        cy={node.y}
        r={ringR}
        fill="none"
        stroke={stroke}
        strokeWidth={selected ? 1.8 : 1.3}
        strokeDasharray="3 3"
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: ringScale,
          opacity: selected ? [0.55, 1] : [0.35, 0.8],
        }}
        transition={{
          duration: 2.8,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        style={{ transformOrigin: `${node.x}px ${node.y}px`, pointerEvents: "none" }}
      />
      <motion.circle
        cx={node.x}
        cy={node.y}
        r={coreR}
        fill={fill}
        stroke="#FFFFFF"
        strokeWidth="2"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: coreScale, opacity: 1 }}
        transition={{
          scale: {
            duration: 2.4,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          },
          opacity: { duration: 0.3 },
        }}
        style={{ transformOrigin: `${node.x}px ${node.y}px`, pointerEvents: "none" }}
      />
    </motion.g>
  );
}

export function KnowledgeTreeSvg({
  hasScanned,
  showNodes,
  showBadge,
  placedNodes,
  selectedNodeId,
  onNodeClick,
  gradientId = "knowledgePulseRed",
  amberGradientId = "knowledgePulseAmber",
}: KnowledgeTreeSvgProps) {
  const occupied = new Set(
    placedNodes.map((n) => tipKey(n.x, n.y)),
  );
  const interactive = placedNodes.filter((n) => n.isInteractive);
  const passive = placedNodes.filter((n) => !n.isInteractive);
  const limbPaths = getActiveLimbPathDs(placedNodes);

  return (
    <div
      className="relative z-10 w-full max-h-[420px]"
      style={{ aspectRatio: `${VIEW_W} / ${VIEW_H}` }}
    >
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="xMidYMid meet"
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#EF4444" stopOpacity="0.9" />
            <stop offset="55%" stopColor="#EF4444" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={amberGradientId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.85" />
            <stop offset="55%" stopColor="#F59E0B" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
          </radialGradient>
        </defs>

        <StaticTrunkAndRoots />

        {hasScanned && (
          <>
            {[...MAIN_BRANCHES, ...SIDE_BRANCHES].map((b, i) => (
              <motion.path
                key={`branch-${i}`}
                d={b.d}
                stroke={STROKE}
                strokeWidth={b.width}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  pathLength: {
                    duration: b.duration,
                    delay: b.delay,
                    ease: EASE,
                  },
                  opacity: { duration: 0.35, delay: b.delay },
                }}
              />
            ))}

            {showNodes &&
              limbPaths.map((d, i) => (
                <motion.path
                  key={`limb-hl-${i}`}
                  d={d}
                  stroke={i === 0 ? "#ef4444" : "#f59e0b"}
                  strokeWidth={i === 0 ? 6 : 5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: i === 0 ? 0.35 : 0.22 }}
                  transition={{ duration: 0.6, delay: i * 0.05, ease: EASE }}
                />
              ))}

            {SIDE_BRANCHES.filter(
              (b) => b.tip && !occupied.has(tipKey(b.tip.x, b.tip.y)),
            ).map((b, i) => {
              const tip = b.tip!;
              const landAt = b.delay + b.duration;
              return (
                <motion.circle
                  key={`empty-tip-${i}`}
                  cx={tip.x}
                  cy={tip.y}
                  r="5"
                  fill="#94a3b8"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: showNodes ? 0.55 : 0 }}
                  transition={{
                    duration: 0.45,
                    delay: landAt,
                    ease: "backOut",
                  }}
                  style={{ transformOrigin: `${tip.x}px ${tip.y}px` }}
                />
              );
            })}

            {showNodes &&
              showBadge &&
              placedNodes.map((node, i) => (
                <NodeBadge
                  key={`badge-${node.id}`}
                  node={node}
                  tone={
                    node.isRootCause
                      ? "root"
                      : node.isError
                        ? "error"
                        : "neutral"
                  }
                  delay={0.9 + i * 0.08}
                />
              ))}

            {showNodes &&
              passive.map((node, i) => (
                <motion.circle
                  key={node.id}
                  cx={node.x}
                  cy={node.y}
                  r="6"
                  fill="#94a3b8"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    duration: 0.45,
                    delay: 0.75 + i * 0.08,
                    ease: "backOut",
                  }}
                  style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                />
              ))}

            {showNodes &&
              interactive.map((node, i) => (
                <InteractiveNode
                  key={node.id}
                  node={node}
                  selected={selectedNodeId === node.id}
                  gradientId={gradientId}
                  amberGradientId={amberGradientId}
                  delayIndex={i}
                />
              ))}
          </>
        )}
      </svg>

      {hasScanned &&
        showNodes &&
        interactive.map((node) => {
          const hit = node.isRootCause ? 52 : 44;
          return (
            <button
              key={`hit-${node.id}`}
              type="button"
              aria-label={node.label}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onNodeClick(node);
              }}
              className="absolute z-20 cursor-pointer rounded-full border-0 bg-transparent p-0"
              style={{
                left: `${(node.x / VIEW_W) * 100}%`,
                top: `${(node.y / VIEW_H) * 100}%`,
                width: hit,
                height: hit,
                transform: "translate(-50%, -50%)",
                pointerEvents: "auto",
              }}
            />
          );
        })}
    </div>
  );
}

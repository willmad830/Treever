import type {
  BranchSide,
  PlacedTreeNode,
  ScanAnalysis,
  ScanNode,
} from "@/types/scan";
import {
  NATIVE_LIMB_CHAINS,
  pickLimbChain,
  sampleLimbTipToTrunk,
  tipPathD,
  type NativeLimbChain,
} from "@/lib/nativeLimbPaths";

export type TreeSlot = {
  x: number;
  y: number;
  side: BranchSide;
  tier: number;
  branchId: string;
};

export const TRUNK_SPLIT_SLOT: TreeSlot = {
  x: 500,
  y: 500,
  side: "center",
  tier: 99,
  branchId: "trunk-split",
};

const MIN_GAP_PX = 110;

export function isRootCauseNode(
  node: ScanNode,
  rootErrorNodeId?: string | null,
): boolean {
  if (rootErrorNodeId && node.id === rootErrorNodeId) return true;
  const status = (node.status || "").toLowerCase().replace(/[\s-]+/g, "_");
  return status === "root_cause" || status === "rootcause";
}

export function nodeBadgeLabel(node: ScanNode): string {
  const title = node.title?.trim() || "Пробел";
  const short =
    title.length > 34 ? `${title.slice(0, 32).trimEnd()}…` : title;
  return `${node.grade} КЛАСС — ${short}`;
}

function badgeAlignForX(x: number): PlacedTreeNode["badgeAlign"] {
  if (x >= 720) return "end";
  if (x <= 280) return "start";
  return "center";
}

export function slotsOnLimbChain(
  chain: NativeLimbChain,
  count: number,
): TreeSlot[] {
  if (count <= 0) return [];

  const poly = sampleLimbTipToTrunk(chain, 48);
  if (!poly.length) return [];

  const result: TreeSlot[] = [];
  let idx = 0;

  const pushAt = (i: number, tier: number) => {
    const p = poly[Math.min(i, poly.length - 1)];
    result.push({
      x: Math.round(p.x),
      y: Math.round(p.y),
      side: chain.side,
      tier,
      branchId: chain.id,
    });
  };

  pushAt(0, 0);

  for (let n = 1; n < count; n += 1) {
    const prev = result[n - 1];
    let found = -1;
    for (let j = idx + 1; j < poly.length; j += 1) {
      const d = Math.hypot(poly[j].x - prev.x, poly[j].y - prev.y);
      if (d >= MIN_GAP_PX) {
        found = j;
        break;
      }
    }
    if (found < 0) {
      const remaining = count - n;
      const left = poly.length - 1 - idx;
      found = idx + Math.max(1, Math.floor(left / remaining));
      found = Math.min(found, poly.length - 1);
    }
    idx = found;
    pushAt(idx, n);
  }

  return result;
}

function toPlaced(
  node: ScanNode,
  slot: TreeSlot,
  overrides: {
    isRootCause: boolean;
    isError: boolean;
    isInteractive: boolean;
    label?: string;
  },
): PlacedTreeNode {
  return {
    ...node,
    x: slot.x,
    y: slot.y,
    isRootCause: overrides.isRootCause,
    isError: overrides.isError,
    isInteractive: overrides.isInteractive,
    label: overrides.label ?? nodeBadgeLabel(node),
    branchSide: slot.side,
    branchId: slot.branchId,
    badgeAlign: badgeAlignForX(slot.x),
  };
}

export function mapAnalysisToTreeNodes(
  analysis: ScanAnalysis | null | undefined,
): PlacedTreeNode[] {
  if (!analysis) return [];
  if (!analysis.nodes?.length && !analysis.target_topic) return [];

  const rootId = analysis.root_error_node_id ?? null;
  const nodes = [...(analysis.nodes ?? [])];
  const placed: PlacedTreeNode[] = [];

  const rootNode =
    nodes.find((n) => isRootCauseNode(n, rootId)) ??
    (nodes.length ? [...nodes].sort((a, b) => a.grade - b.grade)[0] : null);

  const rest = nodes
    .filter((n) => n.id !== rootNode?.id)
    .sort((a, b) => a.grade - b.grade);

  const chain: ScanNode[] = [];
  if (rootNode) chain.push(rootNode);
  chain.push(...rest);

  if (chain.length) {
    const seed = `${rootId ?? ""}|${chain.map((n) => n.id).join(",")}`;
    const limb = pickLimbChain(seed);
    const slots = slotsOnLimbChain(limb, chain.length);

    chain.forEach((node, index) => {
      const slot = slots[index];
      if (!slot) return;
      placed.push(
        toPlaced(node, slot, {
          isRootCause: index === 0,
          isError: index !== 0,
          isInteractive: true,
        }),
      );
    });
  }

  const topicTitle = analysis.target_topic?.trim();
  if (topicTitle) {
    const topicGrade =
      [...nodes].sort((a, b) => b.grade - a.grade)[0]?.grade ?? 8;
    placed.push(
      toPlaced(
        {
          id: "current-topic",
          grade: topicGrade,
          title: topicTitle,
          status: "junction",
          description: null,
          micro_summary_30sec: null,
        },
        TRUNK_SPLIT_SLOT,
        {
          isRootCause: false,
          isError: false,
          isInteractive: false,
          label: `${topicGrade} КЛАСС — ${
            topicTitle.length > 34
              ? `${topicTitle.slice(0, 32).trimEnd()}…`
              : topicTitle
          }`,
        },
      ),
    );
  }

  return placed;
}

export function getActiveBranchPathD(
  placed: PlacedTreeNode[],
): string | null {
  const root = placed.find((n) => n.isRootCause);
  if (!root?.branchId) return null;
  const limb = NATIVE_LIMB_CHAINS.find((c) => c.id === root.branchId);
  return limb ? tipPathD(limb) : null;
}

export function getActiveLimbPathDs(placed: PlacedTreeNode[]): string[] {
  const root = placed.find((n) => n.isRootCause);
  if (!root?.branchId) return [];
  const limb = NATIVE_LIMB_CHAINS.find((c) => c.id === root.branchId);
  return limb ? [...limb.pathsTrunkToTip] : [];
}

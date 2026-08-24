"use client";

export type NativeLimbChain = {
  id: string;
  side: "left" | "center" | "right";
  pathsTrunkToTip: string[];
};

export const NATIVE_LIMB_CHAINS: NativeLimbChain[] = [
  {
    id: "right-outer",
    side: "right",
    pathsTrunkToTip: [
      "M 730 340 C 780 270, 830 190, 870 110",
      "M 510 500 C 550 440, 640 400, 730 340",
    ],
  },
  {
    id: "right-inner",
    side: "right",
    pathsTrunkToTip: [
      "M 750 250 C 730 175, 710 125, 680 80",
      "M 730 340 C 740 295, 745 270, 750 250",
      "M 510 500 C 550 440, 640 400, 730 340",
    ],
  },
  {
    id: "left-high",
    side: "left",
    pathsTrunkToTip: [
      "M 270 340 C 220 270, 170 190, 130 110",
      "M 490 500 C 450 440, 360 400, 270 340",
    ],
  },
  {
    id: "left-mid",
    side: "left",
    pathsTrunkToTip: [
      "M 270 340 C 270 240, 250 170, 230 90",
      "M 490 500 C 450 440, 360 400, 270 340",
    ],
  },
  {
    id: "center-canopy",
    side: "center",
    pathsTrunkToTip: [
      "M 250 170 C 300 150, 330 120, 350 80",
      "M 270 340 C 270 240, 250 170, 230 90",
      "M 490 500 C 450 440, 360 400, 270 340",
    ],
  },
];

type Pt = { x: number; y: number };

function cubicAt(p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt {
  const u = 1 - t;
  return {
    x: u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x,
    y: u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y,
  };
}

function parseCubic(d: string): { p0: Pt; p1: Pt; p2: Pt; p3: Pt } | null {
  const m = d.match(
    /M\s*([-\d.]+)\s+([-\d.]+)\s+C\s*([-\d.]+)\s+([-\d.]+)\s*,\s*([-\d.]+)\s+([-\d.]+)\s*,\s*([-\d.]+)\s+([-\d.]+)/i,
  );
  if (!m) return null;
  return {
    p0: { x: +m[1], y: +m[2] },
    p1: { x: +m[3], y: +m[4] },
    p2: { x: +m[5], y: +m[6] },
    p3: { x: +m[7], y: +m[8] },
  };
}

function sampleCubicTrunkToTip(d: string, steps = 40): Pt[] {
  const c = parseCubic(d);
  if (!c) return [];
  const pts: Pt[] = [];
  for (let i = 0; i <= steps; i += 1) {
    pts.push(cubicAt(c.p0, c.p1, c.p2, c.p3, i / steps));
  }
  return pts;
}

export function sampleLimbTipToTrunk(chain: NativeLimbChain, stepsPerSeg = 40): Pt[] {
  const tipToTrunk: Pt[] = [];
  let junction: Pt | null = null;

  chain.pathsTrunkToTip.forEach((d, segIndex) => {
    const trunkToTip = sampleCubicTrunkToTip(d, stepsPerSeg);
    if (!trunkToTip.length) return;

    if (segIndex === 0) {
      const reversed = [...trunkToTip].reverse();
      tipToTrunk.push(...reversed);
      junction = reversed[reversed.length - 1];
      return;
    }

    let best = 0;
    let bestD = Infinity;
    for (let i = 0; i < trunkToTip.length; i += 1) {
      const dist = Math.hypot(
        trunkToTip[i].x - junction!.x,
        trunkToTip[i].y - junction!.y,
      );
      if (dist < bestD) {
        bestD = dist;
        best = i;
      }
    }

    for (let i = best - 1; i >= 0; i -= 1) {
      tipToTrunk.push(trunkToTip[i]);
    }
    junction = tipToTrunk[tipToTrunk.length - 1] ?? junction;
  });

  return tipToTrunk;
}

export function pickLimbChain(seed: string): NativeLimbChain {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return NATIVE_LIMB_CHAINS[hash % NATIVE_LIMB_CHAINS.length];
}

export function tipPathD(chain: NativeLimbChain): string {
  return chain.pathsTrunkToTip[0];
}

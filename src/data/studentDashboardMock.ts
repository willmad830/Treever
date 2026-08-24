export type SkillNodeStatus = "mastered" | "gap" | "active";

export type SkillTreeNodeMock = {
  id: string;
  label: string;
  grade: number;
  status: SkillNodeStatus;
  x: number;
  y: number;
};

export type SkillTreeEdgeMock = {
  from: string;
  to: string;
};

export const mockSkillTree = {
  nodes: [
    {
      id: "s5-signs",
      label: "Знаки при «=»",
      grade: 5,
      status: "gap",
      x: 120,
      y: 210,
    },
    {
      id: "s6-eq",
      label: "Линейные ур-я",
      grade: 6,
      status: "mastered",
      x: 280,
      y: 160,
    },
    {
      id: "s7-quad",
      label: "Квадратные",
      grade: 7,
      status: "mastered",
      x: 440,
      y: 130,
    },
    {
      id: "s8-irr",
      label: "Иррациональные",
      grade: 8,
      status: "gap",
      x: 600,
      y: 170,
    },
    {
      id: "s8-focus",
      label: "Текущая тема",
      grade: 8,
      status: "active",
      x: 520,
      y: 280,
    },
    {
      id: "s7-func",
      label: "Функции",
      grade: 7,
      status: "mastered",
      x: 340,
      y: 280,
    },
  ] satisfies SkillTreeNodeMock[],
  edges: [
    { from: "s5-signs", to: "s6-eq" },
    { from: "s6-eq", to: "s7-quad" },
    { from: "s7-quad", to: "s8-irr" },
    { from: "s6-eq", to: "s7-func" },
    { from: "s7-func", to: "s8-focus" },
    { from: "s8-irr", to: "s8-focus" },
  ] satisfies SkillTreeEdgeMock[],
} as const;

export type ScanHistoryStatus = "gap_found" | "correct" | "partial";

export type ScanHistoryItem = {
  id: string;
  title: string;
  topic: string;
  dateLabel: string;
  status: ScanHistoryStatus;
  imagePath: string;
  gapsClosed: number;
};

export const mockScanHistory: ScanHistoryItem[] = [
  {
    id: "hist-scan-1",
    title: "√(2x − 7) = x + 7",
    topic: "Иррациональные уравнения",
    dateLabel: "Сегодня, 14:20",
    status: "gap_found",
    imagePath: "/images/sample-math.png",
    gapsClosed: 0,
  },
  {
    id: "hist-scan-2",
    title: "x² − 5x + 6 = 0",
    topic: "Квадратные уравнения",
    dateLabel: "Вчера, 19:05",
    status: "correct",
    imagePath: "/images/sample-math.png",
    gapsClosed: 1,
  },
  {
    id: "hist-scan-3",
    title: "2(x − 3) = 10",
    topic: "Линейные уравнения",
    dateLabel: "18 авг, 11:40",
    status: "partial",
    imagePath: "/images/sample-math.png",
    gapsClosed: 1,
  },
];

export const scanStatusMeta: Record<
  ScanHistoryStatus,
  { label: string; className: string }
> = {
  gap_found: {
    label: "Пробел найден",
    className:
      "border-red-500/25 bg-red-50 text-red-700",
  },
  correct: {
    label: "Верно",
    className:
      "border-emerald-500/25 bg-emerald-50 text-emerald-700",
  },
  partial: {
    label: "Частично",
    className:
      "border-amber-500/25 bg-amber-50 text-amber-800",
  },
};

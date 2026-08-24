export type ScanNodeStatus = "error" | "root_cause" | "ok" | "junction" | string;

export type ScanNode = {
  id: string;
  grade: number;
  title: string;
  status: ScanNodeStatus;
  description?: string | null;
  micro_summary_30sec?: string | null;
};

export type ScanEdge = {
  source: string;
  target: string;
};

export type ScanAnalysis = {
  recognized_data?: {
    problem_statement?: string;
    student_solution?: string;
  };
  is_correct: boolean;
  feedback_message?: string;
  target_topic?: string;
  root_error_node_id?: string | null;
  nodes: ScanNode[];
  edges: ScanEdge[];
};

export type BranchSide = "left" | "center" | "right";

export type PlacedTreeNode = ScanNode & {
  x: number;
  y: number;
  isRootCause: boolean;
  isError: boolean;
  isInteractive: boolean;
  label: string;
  branchSide: BranchSide;
  branchId: string;
  badgeAlign: "start" | "center" | "end";
};

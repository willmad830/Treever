export const STUDENT_PROFILE_STORAGE_KEY = "treever:student-profile";

export type StudentGoalId =
  | "ent"
  | "grade_improve"
  | "olympiad"
  | "catch_up";

export type DiagnosticGap = {
  id: string;
  topic: string;
  grade: number;
  label: string;
  moduleSlug: string;
  skillNodeId: string;
};

export type DiagnosticAnswer = {
  questionId: string;
  selectedIndex: number;
  correct: boolean;
};

export type StudentProfile = {
  name: string;
  grade: number;
  subject: string;
  goalId: StudentGoalId;
  goalLabel: string;
  completedAt: number;
  testScore: number;
  totalQuestions: number;
  gaps: DiagnosticGap[];
  answers: DiagnosticAnswer[];
};

export function saveStudentProfile(profile: StudentProfile) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STUDENT_PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch {
  }
}

export function loadStudentProfile(): StudentProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STUDENT_PROFILE_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StudentProfile;
  } catch {
    return null;
  }
}

export function hasCompletedDiagnostic(): boolean {
  return loadStudentProfile() !== null;
}

export function getProfileInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

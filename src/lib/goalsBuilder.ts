import type { DiagnosticGap, StudentGoalId, StudentProfile } from "@/lib/profileStorage";

export type GoalCard = {
  id: string;
  title: string;
  subtitle: string;
  deadline: number;
  deadlineLabel: string;
  progress: number;
  moduleSlug?: string;
  priority: "high" | "medium";
};

const GOAL_DEADLINE_DAYS: Record<StudentGoalId, number> = {
  ent: 90,
  grade_improve: 21,
  olympiad: 45,
  catch_up: 14,
};

function formatDeadline(date: Date): string {
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function addDays(base: number, days: number): number {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d.getTime();
}

function mainGoalMeta(profile: StudentProfile): {
  id: string;
  title: string;
  subtitle: string;
  days: number;
} {
  switch (profile.goalId) {
    case "ent":
      return {
        id: "goal-main-ent",
        title: "Подготовка к ЕНТ",
        subtitle: `Закрыть ${profile.gaps.length} выявленных пробелов до экзамена`,
        days: GOAL_DEADLINE_DAYS.ent,
      };
    case "olympiad":
      return {
        id: "goal-main-olympiad",
        title: "Олимпиадный цикл",
        subtitle: "Углубить слабые темы и выйти на нестандартные задачи",
        days: GOAL_DEADLINE_DAYS.olympiad,
      };
    case "grade_improve":
      return {
        id: "goal-main-grade",
        title: "Подтянуть оценку",
        subtitle: `Стабилизировать ${profile.subject} по программе ${profile.grade} класса`,
        days: GOAL_DEADLINE_DAYS.grade_improve,
      };
    default:
      return {
        id: "goal-main-catchup",
        title: "Закрыть пробелы по порядку",
        subtitle: "Пройти модули по выявленным корневым темам",
        days: GOAL_DEADLINE_DAYS.catch_up,
      };
  }
}

function gapGoalTitle(gap: DiagnosticGap): string {
  if (gap.moduleSlug === "odz-fractions") {
    return "Закрыть пробел: ОДЗ и дроби";
  }
  if (gap.moduleSlug === "quadratic-equations") {
    return "Закрыть пробел: Квадратные уравнения";
  }
  if (gap.moduleSlug === "pythagoras") {
    return "Закрыть пробел: Теорема Пифагора";
  }
  return `Закрыть пробел: ${gap.topic}`;
}

export function buildGoalsFromProfile(
  profile: StudentProfile,
  progressMap: Record<string, number> = {},
): GoalCard[] {
  const base = profile.completedAt;
  const main = mainGoalMeta(profile);
  const mainDeadline = addDays(base, main.days);
  const diagnosticProgress = Math.round(
    (profile.testScore / profile.totalQuestions) * 100,
  );

  const cards: GoalCard[] = [
    {
      id: main.id,
      title: main.title,
      subtitle: main.subtitle,
      deadline: mainDeadline,
      deadlineLabel: formatDeadline(new Date(mainDeadline)),
      progress: progressMap[main.id] ?? diagnosticProgress,
      priority: "medium",
    },
  ];

  profile.gaps.forEach((gap, index) => {
    const gapDays =
      GOAL_DEADLINE_DAYS[profile.goalId] - index * 3 + index * 2;
    const days = Math.max(7, gapDays);
    const deadline = addDays(base, days);
    const gapId = `goal-gap-${gap.id}`;

    cards.push({
      id: gapId,
      title: gapGoalTitle(gap),
      subtitle: gap.label,
      deadline,
      deadlineLabel: formatDeadline(new Date(deadline)),
      progress: progressMap[gapId] ?? 0,
      moduleSlug: gap.moduleSlug,
      priority: "high",
    });
  });

  return cards.sort((a, b) => a.deadline - b.deadline);
}

export function matchGapGoalId(
  profile: StudentProfile,
  topic: string | undefined,
): string | null {
  if (!topic) return null;
  const normalized = topic.toLowerCase();
  for (const gap of profile.gaps) {
    if (
      normalized.includes(gap.topic.toLowerCase()) ||
      gap.topic.toLowerCase().includes(normalized)
    ) {
      return `goal-gap-${gap.id}`;
    }
  }
  return null;
}

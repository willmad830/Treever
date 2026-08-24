import type { DiagnosticGap, StudentGoalId } from "@/lib/profileStorage";

export const studentGrades = [7, 8, 9, 10, 11, 12] as const;

export const studentSubjects = [
  { id: "math", label: "Математика" },
  { id: "algebra", label: "Алгебра" },
  { id: "geometry", label: "Геометрия" },
] as const;

export const studentGoals: {
  id: StudentGoalId;
  label: string;
  description: string;
}[] = [
  {
    id: "ent",
    label: "Подготовка к ЕНТ",
    description: "Закрыть пробелы и выйти на целевой балл",
  },
  {
    id: "grade_improve",
    label: "Подтянуть оценку",
    description: "Стабильно решать задачи текущей программы",
  },
  {
    id: "olympiad",
    label: "Олимпиадная математика",
    description: "Углубить теорию и нестандартные задачи",
  },
  {
    id: "catch_up",
    label: "Наверстать программу",
    description: "Найти корневые пробелы и закрыть их по порядку",
  },
];

export type DiagnosticQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  gapOnWrong: Omit<DiagnosticGap, "id">;
};

export const diagnosticQuestions: DiagnosticQuestion[] = [
  {
    id: "q1-quad",
    prompt: "Решите уравнение: $x^2 - 5x + 6 = 0$",
    options: ["$x_1 = 2,\\ x_2 = 3$", "$x_1 = -2,\\ x_2 = -3$", "$x = 5$"],
    correctIndex: 0,
    gapOnWrong: {
      topic: "Квадратные уравнения",
      grade: 7,
      label: "7 класс: Пробел в квадратных уравнениях",
      moduleSlug: "quadratic-equations",
      skillNodeId: "s7-quad",
    },
  },
  {
    id: "q2-odz",
    prompt:
      "При каком $x$ выражение $\\dfrac{3}{x - 2}$ имеет смысл?",
    options: ["$x \\neq 2$", "$x > 2$", "При любых $x$"],
    correctIndex: 0,
    gapOnWrong: {
      topic: "ОДЗ в дробных выражениях",
      grade: 5,
      label: "5 класс: Пробел в ОДЗ",
      moduleSlug: "odz-fractions",
      skillNodeId: "s5-odz",
    },
  },
  {
    id: "q3-pyth",
    prompt:
      "Прямоугольный треугольник: катеты 3 и 4. Найдите гипотенузу.",
    options: ["$5$", "$7$", "$12$"],
    correctIndex: 0,
    gapOnWrong: {
      topic: "Теорема Пифагора",
      grade: 7,
      label: "7 класс: Пробел в теореме Пифагора",
      moduleSlug: "pythagoras",
      skillNodeId: "s7-pyth",
    },
  },
];

export function buildGapsFromAnswers(
  answers: { questionId: string; selectedIndex: number }[],
): DiagnosticGap[] {
  const gaps: DiagnosticGap[] = [];
  const seen = new Set<string>();

  for (const answer of answers) {
    const question = diagnosticQuestions.find((q) => q.id === answer.questionId);
    if (!question) continue;
    if (answer.selectedIndex === question.correctIndex) continue;

    const key = question.gapOnWrong.skillNodeId;
    if (seen.has(key)) continue;
    seen.add(key);

    gaps.push({
      id: `gap-${key}`,
      ...question.gapOnWrong,
    });
  }

  if (gaps.length === 0) {
    gaps.push({
      id: "gap-s7-quad-focus",
      topic: "Квадратные уравнения",
      grade: 7,
      label: "7 класс: Углубление — квадратные уравнения",
      moduleSlug: "quadratic-equations",
      skillNodeId: "s7-quad",
    });
  }

  return gaps;
}

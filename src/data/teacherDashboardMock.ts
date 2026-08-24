import { kzSchools, kzStudents } from "@/data/mockData";

export type StudentTrafficStatus = "green" | "yellow" | "red";

export type ClassStudent = {
  id: string;
  name: string;
  status: StudentTrafficStatus;
  rootGap: { grade: number; topic: string };
  lastScan: { timeLabel: string; topic: string };
  streak: number;
};

export type ClassAnalytics = {
  mainSystemGap: {
    percentage: number;
    topic: string;
    grade: number;
    summary: string;
  };
  performance: {
    averageScore: number;
    progressPercent: number;
    label: string;
  };
  statusDistribution: Record<StudentTrafficStatus, number>;
  timeSaved: {
    hoursPerWeek: number;
    checksAutomated: number;
    label: string;
  };
};

export type TeacherClass = {
  id: string;
  label: string;
  school: string;
  analytics: ClassAnalytics;
  students: ClassStudent[];
};

export const teacherProfile = {
  name: "Гульнара Касымова",
  initials: "ГК",
  subject: "Математика",
  school: kzSchools[9],
} as const;

const rootGapPool = [
  { grade: 5, topic: "Знаки при «=»" },
  { grade: 5, topic: "ОДЗ" },
  { grade: 6, topic: "Линейные уравнения" },
  { grade: 6, topic: "Пропорции" },
  { grade: 7, topic: "Квадратные уравнения" },
  { grade: 7, topic: "Системы уравнений" },
  { grade: 8, topic: "Иррациональные уравнения" },
  { grade: 8, topic: "Функции и графики" },
] as const;

const lastScanPool = [
  { timeLabel: "Сегодня, 09:14", topic: "Иррациональные уравнения" },
  { timeLabel: "Сегодня, 08:42", topic: "Квадратные уравнения" },
  { timeLabel: "Вчера, 17:30", topic: "Линейные уравнения" },
  { timeLabel: "Вчера, 14:05", topic: "Знаки при «=»" },
  { timeLabel: "19 авг, 11:20", topic: "ОДЗ" },
  { timeLabel: "18 авг, 16:48", topic: "Пропорции" },
  { timeLabel: "17 авг, 10:15", topic: "Системы уравнений" },
  { timeLabel: "16 авг, 13:40", topic: "Функции и графики" },
] as const;

const statusPattern6A: StudentTrafficStatus[] = [
  "green",
  "green",
  "yellow",
  "green",
  "red",
  "yellow",
  "green",
  "green",
  "yellow",
  "red",
  "green",
  "yellow",
  "green",
  "red",
  "yellow",
  "green",
  "red",
  "yellow",
  "green",
  "yellow",
];

const extendedNames = [
  "Әлихан Сәрсенов",
  "Дильнара Жұмабекова",
  "Тагир Нұрланов",
  ...kzStudents.slice(3),
] as const;

function buildStudents(
  names: readonly string[],
  statuses: StudentTrafficStatus[],
): ClassStudent[] {
  return names.map((name, index) => ({
    id: `student-${index + 1}`,
    name,
    status: statuses[index] ?? "yellow",
    rootGap: rootGapPool[index % rootGapPool.length],
    lastScan: lastScanPool[index % lastScanPool.length],
    streak: Math.max(0, 14 - index * 2 + (index % 3) * 5),
  }));
}

const students6A = buildStudents(extendedNames, statusPattern6A);

const students6B = buildStudents(
  kzStudents.slice(0, 14),
  [
    "green",
    "green",
    "green",
    "yellow",
    "green",
    "yellow",
    "green",
    "green",
    "yellow",
    "green",
    "yellow",
    "green",
    "green",
    "yellow",
  ],
);

const students7A = buildStudents(
  kzStudents.slice(6, 18),
  [
    "green",
    "yellow",
    "green",
    "red",
    "yellow",
    "green",
    "green",
    "yellow",
    "red",
    "green",
    "yellow",
    "green",
  ],
);

export const teacherClasses: TeacherClass[] = [
  {
    id: "6a",
    label: "6 «А»",
    school: teacherProfile.school,
    analytics: {
      mainSystemGap: {
        percentage: 72,
        topic: "ОДЗ и знаки при «=»",
        grade: 5,
        summary: "72% валятся на ОДЗ и знаках при «=» [5 класс]",
      },
      performance: {
        averageScore: 68,
        progressPercent: 74,
        label: "Средняя успеваемость класса",
      },
      statusDistribution: {
        green: 8,
        yellow: 7,
        red: 5,
      },
      timeSaved: {
        hoursPerWeek: 4.5,
        checksAutomated: 127,
        label: "Экономия времени на проверке",
      },
    },
    students: students6A,
  },
  {
    id: "6b",
    label: "6 «Б»",
    school: teacherProfile.school,
    analytics: {
      mainSystemGap: {
        percentage: 58,
        topic: "Линейные уравнения",
        grade: 6,
        summary: "58% ошибок связаны с линейными уравнениями [6 класс]",
      },
      performance: {
        averageScore: 74,
        progressPercent: 81,
        label: "Средняя успеваемость класса",
      },
      statusDistribution: {
        green: 9,
        yellow: 4,
        red: 1,
      },
      timeSaved: {
        hoursPerWeek: 3.2,
        checksAutomated: 89,
        label: "Экономия времени на проверке",
      },
    },
    students: students6B,
  },
  {
    id: "7a",
    label: "7 «А»",
    school: teacherProfile.school,
    analytics: {
      mainSystemGap: {
        percentage: 64,
        topic: "Квадратные уравнения",
        grade: 7,
        summary: "64% повторяют ошибки в квадратных уравнениях [7 класс]",
      },
      performance: {
        averageScore: 71,
        progressPercent: 77,
        label: "Средняя успеваемость класса",
      },
      statusDistribution: {
        green: 6,
        yellow: 4,
        red: 2,
      },
      timeSaved: {
        hoursPerWeek: 3.8,
        checksAutomated: 102,
        label: "Экономия времени на проверке",
      },
    },
    students: students7A,
  },
];

export const studentStatusMeta: Record<
  StudentTrafficStatus,
  { label: string; dotClass: string; badgeClass: string }
> = {
  green: {
    label: "Green",
    dotClass: "bg-emerald-500",
    badgeClass:
      "border-emerald-500/25 bg-emerald-50 text-emerald-700",
  },
  yellow: {
    label: "Yellow",
    dotClass: "bg-amber-400",
    badgeClass: "border-amber-500/25 bg-amber-50 text-amber-800",
  },
  red: {
    label: "Red",
    dotClass: "bg-red-500",
    badgeClass: "border-red-500/25 bg-red-50 text-red-700",
  },
};

export type StatusFilter = "all" | StudentTrafficStatus;

export function getStudentById(id: string): ClassStudent | undefined {
  for (const cls of teacherClasses) {
    const found = cls.students.find((s) => s.id === id);
    if (found) return found;
  }
  return undefined;
}

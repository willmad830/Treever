export const kzSchools = [
  "Назарбаев Интеллектуальная школа физико-математического направления, Астана",
  "Назарбаев Интеллектуальная школа химико-биологического направления, Алматы",
  "Республиканская физико-математическая школа, Алматы",
  "Республиканская физико-математическая школа, Астана",
  "Казахско-турецкий лицей, Астана",
  "Лицей №1, Астана",
  "Лицей №2, Астана",
  "Гимназия №5, Астана",
  "Гимназия №6, Астана",
  "Школа-гимназия №17, Астана",
  "Школа-лицей №35, Астана",
  "Школа-лицей №38, Астана",
  "Школа-лицей №59, Астана",
  "Школа-гимназия №3, Алматы",
  "Школа-лицей №48, Алматы",
  "Гимназия №25, Алматы",
  "Школа-лицей №7, Караганда",
  "Гимназия №1, Шымкент",
  "Школа-лицей №9, Костанай",
  "Школа-гимназия №10, Кызылорда",
] as const;

export const kzStudents = [
  "Әлихан Сәрсенов",
  "Аружан Нұртаева",
  "Данияр Қасымов",
  "Айзере Бекенова",
  "Нұрасыл Әбдірахман",
  "Томирис Жанұзақова",
  "Санжар Омаров",
  "Аяла Маратова",
  "Ерсұлтан Төлеген",
  "Інжу Сейітова",
  "Бекзат Қуаныш",
  "Мөлдір Ермекова",
  "Нұрәли Ахметов",
  "Дана Серікқызы",
  "Айдос Жұмабек",
  "Кәусар Бақытова",
  "Арман Есенов",
  "Айым Мұратова",
  "Расул Ниязбек",
  "Саяжан Қабылова",
] as const;

export const kzCurriculumInfo = {
  order399:
    "Приказ Министра просвещения РК №399 от 16 сентября 2022 года (с изм. от 1 сентября 2025 года)",
  order500: "Приказ №500 — Типовые учебные планы 5–9 классов",
} as const;

export const financialMetrics = {
  b2gPricePerStudentYear: 3500,
  tam: { students: 1900000, totalTenge: 6650000000 },
  sam: { students: 1140000, totalTenge: 3990000000 },
  som: {
    b2gStudents: 7000,
    b2gTenge: 24500000,
    b2cPremiumUsers: 300,
    b2cMonthlyTenge: 2900,
    b2cYearlyTenge: 10440000,
    totalSomTenge: 34940000,
  },
  tutorCosts: {
    hourlyRate: 4000,
    monthlyOneSubject: 32000,
    yearlyOneSubject: 288000,
    yearlyThreeSubjects: 864000,
  },
} as const;

export const defaultMockAnalysis = {
  recognized_data: {
    problem_statement: "√(2x - 7) = x + 7",
    student_solution: "x² + 12x + 56 = 0",
  },
  is_correct: false,
  feedback_message: "В решении найдена ошибка при переносе знака.",
  target_topic: "Иррациональные уравнения",
  root_error_node_id: "node_5_signs",
  nodes: [
    {
      id: "node_8_eq",
      grade: 8,
      title: "Иррациональные уравнения",
      status: "error",
      description: "Ошибка при переносе слагаемого через знак равенства",
      micro_summary_30sec: null,
    },
    {
      id: "node_5_signs",
      grade: 5,
      title: "Знаки при переносе через «=»",
      status: "root_cause",
      description: "При переносе -7 знак сохранен вместо смены на +7.",
      micro_summary_30sec:
        "При переносе слагаемого через «=» знак всегда меняется на противоположный (+ → −, − → +).",
    },
  ],
  edges: [{ source: "node_8_eq", target: "node_5_signs" }],
} as const;

export const kzMathGapTopics = [
  { grade: 5, topic: "Знаки при «=»" },
  { grade: 5, topic: "ОДЗ" },
  { grade: 6, topic: "Линейные уравнения" },
  { grade: 7, topic: "Квадратные уравнения" },
  { grade: 8, topic: "Иррациональные уравнения" },
] as const;

export type SentMaterialCompletion =
  | { kind: "delivered"; label: "Доставлено" }
  | { kind: "partial"; label: string; completed: number; total: number }
  | { kind: "completed"; label: string; completed: number; total: number };

export type MockSentMaterial = {
  id: string;
  classId: string;
  classLabel: string;
  topic: string;
  fileName?: string;
  message?: string;
  recipientLabel: string;
  sentAtLabel: string;
  sentAt: number;
  completion: SentMaterialCompletion;
};

export const mockSentMaterials: MockSentMaterial[] = [
  {
    id: "mat-mock-1",
    classId: "6a",
    classLabel: "6 «А»",
    topic: "5 класс: Знаки при «=»",
    fileName: "micro-lesson-signs.pdf",
    message: "Пройти микро-урок и решить 3 адаптивные задачи",
    recipientLabel: "Red-зона (5)",
    sentAtLabel: "21 авг, 15:40",
    sentAt: 1724238000000,
    completion: { kind: "partial", label: "Выполнено 3/5", completed: 3, total: 5 },
  },
  {
    id: "mat-mock-2",
    classId: "6a",
    classLabel: "6 «А»",
    topic: "ОДЗ в дробных выражениях",
    fileName: "odz-fractions-cards.png",
    message: "Разобрать карточки и сдать фото решения",
    recipientLabel: "Әлихан Сәрсенов",
    sentAtLabel: "20 авг, 10:15",
    sentAt: 1724133300000,
    completion: { kind: "delivered", label: "Доставлено" },
  },
  {
    id: "mat-mock-3",
    classId: "6b",
    classLabel: "6 «Б»",
    topic: "6 класс: Линейные уравнения",
    fileName: "linear-eq-worksheet.pdf",
    message: "Решить 5 задач из рабочего листа",
    recipientLabel: "Весь класс 6 «Б»",
    sentAtLabel: "19 авг, 08:30",
    sentAt: 1724044200000,
    completion: { kind: "partial", label: "Выполнено 9/14", completed: 9, total: 14 },
  },
];

export function formatGapTopic(grade: number, topic: string) {
  return `${grade} класс: ${topic}`;
}

export const kzAssignmentTopicOptions = [
  ...kzMathGapTopics.map((t) => formatGapTopic(t.grade, t.topic)),
  "ОДЗ в дробных выражениях",
  "Пропорции и проценты",
  "Системы линейных уравнений",
] as const;

import type {
  SkillTreeEdgeMock,
  SkillTreeNodeMock,
} from "@/data/studentDashboardMock";
import type { DiagnosticGap, StudentProfile } from "@/lib/profileStorage";

export type ModuleSection = {
  title: string;
  body: string;
};

export type LearningModule = {
  slug: string;
  title: string;
  subtitle: string;
  grade: number;
  skillNodeId: string;
  sections: ModuleSection[];
  practiceProblem: string;
  practiceHint: string;
};

export const learningModules: LearningModule[] = [
  {
    slug: "quadratic-equations",
    title: "Квадратные уравнения",
    subtitle: "От стандартного вида до теоремы Виета",
    grade: 7,
    skillNodeId: "s7-quad",
    practiceProblem:
      "Решите уравнение: x² - 7x + 12 = 0. Покажите все шаги решения.",
    practiceHint: "Попробуйте разложить на множители или применить формулу корней.",
    sections: [
      {
        title: "Что такое квадратное уравнение",
        body: `Квадратное уравнение имеет вид $ax^2 + bx + c = 0$, где $a \\neq 0$. Неизвестная $x$ входит во второй степени — именно поэтому такие задачи встречаются в задачах на движение, площади и оптимизацию.

Главная цель — найти все значения $x$, при которых равенство верно. В школьной программе РК (Приказ №500) тема проходит в 7–8 классах и становится фундаментом для функций, неравенств и ЕНТ.`,
      },
      {
        title: "Метод разложения на множители",
        body: `Если трёхчлен легко разложить, уравнение решается быстрее формулы.

Пример: $x^2 - 5x + 6 = 0$.

Ищем два числа, произведение которых $6$, а сумма $-5$: это $-2$ и $-3$.

Получаем $(x - 2)(x - 3) = 0$, откуда $x_1 = 2$, $x_2 = 3$.

Проверка: подставьте корни в исходное уравнение — левая часть должна обратиться в ноль.`,
      },
      {
        title: "Формула корней и дискриминант",
        body: `Универсальный метод — формула корней:

$$x = \\frac{-b \\pm \\sqrt{D}}{2a}, \\quad D = b^2 - 4ac.$$

Если $D > 0$ — два корня, $D = 0$ — один (кратный), $D < 0$ — действительных корней нет.

Пример: $2x^2 - 4x - 6 = 0$. Делим на 2: $x^2 - 2x - 3 = 0$, $D = 4 + 12 = 16$, корни $x_1 = 3$, $x_2 = -1$.`,
      },
      {
        title: "Типичные ошибки",
        body: `1. Потеря знака при переносе через «=» (корень часто в 5 классе).
2. Забывают проверить $a \\neq 0$ и делят на $x$, теряя корень $x = 0$.
3. Путают знаки в формуле Виета: для $x^2 + px + q = 0$ сумма корней $-p$, произведение $q$.

Treever подсвечивает такие пробелы на Skill Tree и возвращает к нужному микро-модулю.`,
      },
    ],
  },
  {
    slug: "odz-fractions",
    title: "ОДЗ и дроби",
    subtitle: "Область допустимых значений в алгебраических выражениях",
    grade: 5,
    skillNodeId: "s5-odz",
    practiceProblem:
      "Найдите ОДЗ выражения: (2x + 1) / (x² - 9). Запишите ответ в виде неравенства или объединения условий.",
    practiceHint: "Знаменатель не должен обращаться в ноль: x² - 9 ≠ 0.",
    sections: [
      {
        title: "Зачем нужна ОДЗ",
        body: `ОДЗ (область допустимых значений) — множество всех $x$, при которых выражение имеет смысл. Без ОДЗ нельзя корректно сокращать дроби, умножать обе части уравнения или подставлять ответ в исходную задачу.

В контексте школ Казахстана ошибки в ОДЗ «тянутся» с 5–6 класса и всплывают в иррациональных и рациональных уравнениях 8–9 класса.`,
      },
      {
        title: "Дробные выражения",
        body: `Главное правило: **знаменатель $\\neq 0$**.

Пример: $\\dfrac{5}{x - 2}$ определено при $x \\neq 2$.

Пример сложнее: $\\dfrac{x + 1}{x^2 - 9}$. Разложим знаменатель: $x^2 - 9 = (x - 3)(x + 3)$. Запрещены $x = 3$ и $x = -3$.

ОДЗ: $x \\in \\mathbb{R} \\setminus \\{-3;\\ 3\\}$.`,
      },
      {
        title: "Сокращение дробей без потери корней",
        body: `Сокращать можно только **общий множитель**, не обнуляющий знаменатель.

Неверно: $\\dfrac{(x - 2)(x + 3)}{x - 2} = x + 3$ без условия $x \\neq 2$.

Верно: при $x \\neq 2$ выражение равно $x + 3$. При $x = 2$ исходная дробь не определена — это отдельный случай, его нельзя «потерять» при сокращении.`,
      },
      {
        title: "Алгоритм для задач",
        body: `1. Запишите все знаменатели и радиканды.
2. Найдите значения, обнуляющие знаменатель.
3. Исключите их из множества решений **до** преобразований.
4. После решения проверьте каждый корень на принадлежность ОДЗ.

На практике в Treever вы загружаете решение — AI сверяет шаги с ОДЗ и находит корневой пробел.`,
      },
    ],
  },
  {
    slug: "pythagoras",
    title: "Теорема Пифагора",
    subtitle: "Связь сторон прямоугольного треугольника",
    grade: 7,
    skillNodeId: "s7-pyth",
    practiceProblem:
      "Прямоугольный треугольник: катеты 5 см и 12 см. Найдите гипотенузу и площадь треугольника.",
    practiceHint: "c² = a² + b². Площадь = (a · b) / 2.",
    sections: [
      {
        title: "Формулировка",
        body: `В прямоугольном треугольнике квадрат гипотенузы $c$ равен сумме квадратов катетов $a$ и $b$:

$$c^2 = a^2 + b^2.$$

Теорема — мост между алгеброй и геометрией: она нужна для расстояний на координатной плоскости, векторов, тригонометрии и задач ЕНТ на планиметрию.`,
      },
      {
        title: "Базовый пример",
        body: `Катеты 3 см и 4 см. Тогда

$$c^2 = 3^2 + 4^2 = 9 + 16 = 25, \\quad c = 5.$$

Тройка (3, 4, 5) — пифагорова тройка. Аналогично: (5, 12, 13), (8, 15, 17) — полезно запомнить для устного счёта.`,
      },
      {
        title: "Обратная задача",
        body: `Если известна гипотенуза $c = 13$ и катет $a = 5$, найдём второй катет:

$$b^2 = c^2 - a^2 = 169 - 25 = 144, \\quad b = 12.$$

Частая ошибка — складывать все стороны подряд или забывать извлечь корень из $b^2$.`,
      },
      {
        title: "Применение в координатах",
        body: `Расстояние между точками $A(x_1, y_1)$ и $B(x_2, y_2)$:

$$AB = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}.$$

Это та же теорема Пифагора на прямоугольном треугольнике со сторонами $|x_2 - x_1|$ и $|y_2 - y_1|$. Понимание этой связи закрывает целый класс задач на графиках и векторах.`,
      },
    ],
  },
];

export function getModuleBySlug(slug: string): LearningModule | undefined {
  return learningModules.find((m) => m.slug === slug);
}

export function getModuleBySkillNodeId(
  nodeId: string,
): LearningModule | undefined {
  return learningModules.find((m) => m.skillNodeId === nodeId);
}

const baseNodes: SkillTreeNodeMock[] = [
  { id: "s5-signs", label: "Знаки при «=»", grade: 5, status: "mastered", x: 80, y: 220 },
  { id: "s5-odz", label: "ОДЗ", grade: 5, status: "mastered", x: 180, y: 180 },
  { id: "s6-eq", label: "Линейные ур-я", grade: 6, status: "mastered", x: 280, y: 150 },
  { id: "s7-quad", label: "Квадратные", grade: 7, status: "mastered", x: 400, y: 120 },
  { id: "s7-pyth", label: "Пифагор", grade: 7, status: "mastered", x: 400, y: 260 },
  { id: "s8-irr", label: "Иррациональные", grade: 8, status: "mastered", x: 560, y: 150 },
  { id: "s8-focus", label: "Текущая цель", grade: 8, status: "active", x: 640, y: 280 },
];

const baseEdges: SkillTreeEdgeMock[] = [
  { from: "s5-signs", to: "s5-odz" },
  { from: "s5-odz", to: "s6-eq" },
  { from: "s6-eq", to: "s7-quad" },
  { from: "s6-eq", to: "s7-pyth" },
  { from: "s7-quad", to: "s8-irr" },
  { from: "s7-pyth", to: "s8-focus" },
  { from: "s8-irr", to: "s8-focus" },
];

export function buildSkillTreeFromProfile(profile: StudentProfile | null) {
  const gapIds = new Set(profile?.gaps.map((g) => g.skillNodeId) ?? []);
  const gapLabels = new Map(
    profile?.gaps.map((g) => [g.skillNodeId, g.label]) ?? [],
  );

  const nodes: EnrichedSkillNode[] = baseNodes.map((node) => {
    if (gapIds.has(node.id)) {
      return {
        ...node,
        status: "gap" as const,
        label: gapLabels.get(node.id)?.split(": ").pop() ?? node.label,
        accentLabel: gapLabels.get(node.id),
      };
    }
    if (profile && node.id === "s8-focus") {
      return { ...node, status: "active" as const };
    }
    return { ...node };
  });

  const firstGap = profile?.gaps[0];
  if (firstGap) {
    const focusIdx = nodes.findIndex((n) => n.id === "s8-focus");
    if (focusIdx >= 0) {
      nodes[focusIdx] = {
        ...nodes[focusIdx],
        label: firstGap.topic.slice(0, 18),
        status: "active",
        accentLabel: firstGap.label,
      };
    }
  }

  return { nodes, edges: baseEdges };
}

export type EnrichedSkillNode = SkillTreeNodeMock & {
  accentLabel?: string;
  moduleSlug?: string;
};

export function enrichTreeNodes(
  nodes: SkillTreeNodeMock[],
  gaps: DiagnosticGap[],
): EnrichedSkillNode[] {
  const slugByNode = new Map(gaps.map((g) => [g.skillNodeId, g.moduleSlug]));
  const accentByNode = new Map(gaps.map((g) => [g.skillNodeId, g.label]));

  return nodes.map((node) => ({
    ...node,
    moduleSlug: slugByNode.get(node.id) ?? getModuleBySkillNodeId(node.id)?.slug,
    accentLabel: accentByNode.get(node.id),
  }));
}

import { useEffect, useState } from "react";
import type { ScanAnalysis } from "@/types/scan";

export const DEMO_MODE_STORAGE_KEY = "treever:demo-mode";
export const DEMO_INDEX_STORAGE_KEY = "treever:demo-index";
const DEMO_EVENT_NAME = "treever:demo-mode-changed";

export const DEMO_SCAN_MOCKS: ScanAnalysis[] = [
  {
    recognized_data: {
      problem_statement: "√(2x - 1) + 1 = x",
      student_solution:
        "√(2x - 1) = x - 1 => 2x - 1 = x² - 2x + 1 => x² - 4x + 2 = 0 => x = 2 ± √2",
    },
    is_correct: false,
    feedback_message:
      "Ошибка в арифметике при переносе слагаемых в квадратном уравнении.",
    target_topic: "Иррациональные уравнения",
    root_error_node_id: "node_7_signs",
    nodes: [
      {
        id: "node_8_irrat",
        grade: 8,
        title: "Иррациональные уравнения",
        status: "error",
        description:
          "Неверно приведены подобные слагаемые: (-1) при переносе вправо должно дать +2, но в уравнении ошибка со знаком",
        micro_summary_30sec: null,
      },
      {
        id: "node_7_signs",
        grade: 7,
        title: "Правила переноса слагаемых и знаки",
        status: "root_cause",
        description:
          "Базовый пробел: при переносе числа за знак '=' знак числа меняется на противоположный",
        micro_summary_30sec:
          "Перенося (-1) из левой части в правую, получаем: 1 + 1 = +2. Уравнение должно быть: x² - 4x + 2 = 0!",
      },
    ],
    edges: [
      {
        source: "node_8_irrat",
        target: "node_7_signs",
      },
    ],
  },
  {
    recognized_data: {
      problem_statement: "(x² - 9) / (x - 3) = 6",
      student_solution: "(x - 3)(x + 3) / (x - 3) = 6 => x + 3 = 6 => x = 3",
    },
    is_correct: false,
    feedback_message:
      "Найдена критическая ошибка: корень x = 3 не входит в область допустимых значений (ОДЗ).",
    target_topic: "Дробно-рациональные уравнения",
    root_error_node_id: "node_6_zero_div",
    nodes: [
      {
        id: "node_8_frac",
        grade: 8,
        title: "Дробно-рациональные уравнения",
        status: "error",
        description:
          "Получен корень x = 3, при котором знаменатель (x - 3) обращается в 0",
        micro_summary_30sec: null,
      },
      {
        id: "node_6_zero_div",
        grade: 6,
        title: "Область допустимых значений и деление на ноль",
        status: "root_cause",
        description:
          "Фундаментальный пробел: делить на ноль нельзя, x = 3 является посторонним корнем",
        micro_summary_30sec:
          "Если x = 3, то (x - 3) = 0. На ноль делить нельзя! Значит у уравнения НЕТ решений.",
      },
    ],
    edges: [
      {
        source: "node_8_frac",
        target: "node_6_zero_div",
      },
    ],
  },
  {
    recognized_data: {
      problem_statement: "2x² - 7x + 3 = 0",
      student_solution:
        "D = (-7)² - 4*2*3 = 49 - 24 = 25. x1 = (7 + 5)/2 = 6, x2 = (7 - 5)/2 = 1",
    },
    is_correct: false,
    feedback_message:
      "Дискриминант найден верно, но допущена ошибка в формуле корней.",
    target_topic: "Квадратные уравнения",
    root_error_node_id: "node_8_quad_formula",
    nodes: [
      {
        id: "node_8_quad",
        grade: 8,
        title: "Формула корней квадратного уравнения",
        status: "error",
        description:
          "В знаменателе формулы x = (-b ± √D) / 2a забыли умножить на коэффициент a (2)",
        micro_summary_30sec: null,
      },
      {
        id: "node_8_quad_formula",
        grade: 8,
        title: "Знаменатель 2a в формуле корней",
        status: "root_cause",
        description:
          "Забыто умножение на a=2 в знаменателе: делили на 2 вместо 2*2 = 4",
        micro_summary_30sec:
          "Формула: x = (-b ± √D) / (2a). В знаменателе должно быть 2 * 2 = 4, а не просто 2!",
      },
    ],
    edges: [
      {
        source: "node_8_quad",
        target: "node_8_quad_formula",
      },
    ],
  },
];

export function isDemoModeEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(DEMO_MODE_STORAGE_KEY) === "true";
}

export function setDemoModeEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(DEMO_MODE_STORAGE_KEY, enabled ? "true" : "false");
  window.dispatchEvent(new CustomEvent(DEMO_EVENT_NAME, { detail: { enabled } }));
}

export function toggleDemoMode(): boolean {
  const current = isDemoModeEnabled();
  const next = !current;
  setDemoModeEnabled(next);
  return next;
}

export function getNextDemoAnalysis(): ScanAnalysis {
  if (typeof window === "undefined") {
    return JSON.parse(JSON.stringify(DEMO_SCAN_MOCKS[0]));
  }

  const rawIndex = localStorage.getItem(DEMO_INDEX_STORAGE_KEY);
  const currentIndex = rawIndex ? parseInt(rawIndex, 10) : 0;
  const safeIndex = isNaN(currentIndex) ? 0 : Math.max(0, currentIndex);

  const selectedMock = DEMO_SCAN_MOCKS[safeIndex % DEMO_SCAN_MOCKS.length];
  const nextIndex = (safeIndex + 1) % DEMO_SCAN_MOCKS.length;

  localStorage.setItem(DEMO_INDEX_STORAGE_KEY, String(nextIndex));
  return JSON.parse(JSON.stringify(selectedMock)) as ScanAnalysis;
}

export function useDemoMode() {
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    setIsDemo(isDemoModeEnabled());

    const handleCustomChange = () => {
      setIsDemo(isDemoModeEnabled());
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === DEMO_MODE_STORAGE_KEY) {
        setIsDemo(e.newValue === "true");
      }
    };

    window.addEventListener(DEMO_EVENT_NAME, handleCustomChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener(DEMO_EVENT_NAME, handleCustomChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return {
    isDemo,
    toggleDemo: () => toggleDemoMode(),
    setDemo: (enabled: boolean) => setDemoModeEnabled(enabled),
  };
}

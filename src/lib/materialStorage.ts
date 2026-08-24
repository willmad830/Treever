import {
  mockSentMaterials,
  type MockSentMaterial,
} from "@/data/mockData";

export const TEACHER_MATERIALS_STORAGE_KEY = "treever:teacher-sent-materials";

export type SentMaterial = MockSentMaterial;

export function loadSentMaterials(): SentMaterial[] {
  if (typeof window === "undefined") return [...mockSentMaterials];
  try {
    const raw = localStorage.getItem(TEACHER_MATERIALS_STORAGE_KEY);
    if (!raw) return [...mockSentMaterials];
    const parsed = JSON.parse(raw) as SentMaterial[];
    return parsed.length > 0 ? parsed : [...mockSentMaterials];
  } catch {
    return [...mockSentMaterials];
  }
}

export function saveSentMaterials(materials: SentMaterial[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(TEACHER_MATERIALS_STORAGE_KEY, JSON.stringify(materials));
  } catch {
  }
}

export function formatSentAtLabel(date: Date) {
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const time = date.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isToday) return `Сегодня, ${time}`;

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isYesterday) return `Вчера, ${time}`;

  const day = date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
  });
  return `${day}, ${time}`;
}

export const GOAL_PROGRESS_STORAGE_KEY = "treever:goal-progress";

export type GoalProgressMap = Record<string, number>;

export function loadGoalProgress(): GoalProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(GOAL_PROGRESS_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as GoalProgressMap;
  } catch {
    return {};
  }
}

export function saveGoalProgress(map: GoalProgressMap) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(GOAL_PROGRESS_STORAGE_KEY, JSON.stringify(map));
  } catch {
  }
}

export function setGoalProgress(goalId: string, progress: number) {
  const map = loadGoalProgress();
  map[goalId] = Math.min(100, Math.max(0, Math.round(progress)));
  saveGoalProgress(map);
  return map;
}

export function bumpGoalProgress(goalId: string, delta: number) {
  const map = loadGoalProgress();
  const current = map[goalId] ?? 0;
  map[goalId] = Math.min(100, Math.max(0, Math.round(current + delta)));
  saveGoalProgress(map);
  return map;
}

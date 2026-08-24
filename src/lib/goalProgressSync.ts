import { matchGapGoalId } from "@/lib/goalsBuilder";
import { bumpGoalProgress, setGoalProgress } from "@/lib/goalProgressStorage";
import { loadStudentProfile } from "@/lib/profileStorage";
import type { StoredScanResult } from "@/lib/scanStorage";

function mainGoalId(goalId: string): string {
  switch (goalId) {
    case "ent":
      return "goal-main-ent";
    case "olympiad":
      return "goal-main-olympiad";
    case "grade_improve":
      return "goal-main-grade";
    default:
      return "goal-main-catchup";
  }
}

export function syncGoalsAfterScan(result: StoredScanResult) {
  const profile = loadStudentProfile();
  if (!profile) return;

  const gapGoalId = matchGapGoalId(profile, result.analysis.target_topic);
  const mainId = mainGoalId(profile.goalId);

  if (result.analysis.is_correct) {
    if (gapGoalId) setGoalProgress(gapGoalId, 100);
    bumpGoalProgress(mainId, 12);
  } else {
    if (gapGoalId) bumpGoalProgress(gapGoalId, 25);
    bumpGoalProgress(mainId, 5);
  }
}

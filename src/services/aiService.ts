import type { ScanAnalysis } from "@/types/scan";
import { getNextDemoAnalysis, isDemoModeEnabled } from "@/lib/demoMode";

export async function analyzeSolutionWithAI(input: {
  image?: string;
  text?: string;
}): Promise<ScanAnalysis> {
  // Demo Mode: completely block real network requests, delay for 2 seconds and cycle mock responses
  if (isDemoModeEnabled()) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return getNextDemoAnalysis();
  }

  const response = await fetch("/api/scan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      image: input.image,
      text: input.text,
    }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      typeof payload?.error === "string"
        ? payload.error
        : `Scan failed (${response.status})`,
    );
  }

  return payload as ScanAnalysis;
}


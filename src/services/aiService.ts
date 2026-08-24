import type { ScanAnalysis } from "@/types/scan";

export async function analyzeSolutionWithAI(input: {
  image?: string;
  text?: string;
}): Promise<ScanAnalysis> {
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

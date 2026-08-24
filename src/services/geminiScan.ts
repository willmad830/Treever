import { GoogleGenerativeAI } from "@google/generative-ai";
import { AI_CONFIG } from "@/config/aiConfig";
import type { ScanAnalysis } from "@/types/scan";

function stripJsonFences(raw: string): string {
  return raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function parseDataUrl(image: string): { mimeType: string; data: string } | null {
  const match = image.match(/^data:([^;]+);base64,(.+)$/i);
  if (!match) return null;
  return { mimeType: match[1], data: match[2] };
}

function normalizeAnalysis(raw: unknown): ScanAnalysis {
  if (!raw || typeof raw !== "object") {
    throw new Error("AI returned empty analysis");
  }

  const data = raw as Record<string, unknown>;
  const nodes = Array.isArray(data.nodes) ? data.nodes : [];
  const edges = Array.isArray(data.edges) ? data.edges : [];

  return {
    recognized_data:
      data.recognized_data && typeof data.recognized_data === "object"
        ? (data.recognized_data as ScanAnalysis["recognized_data"])
        : undefined,
    is_correct: Boolean(data.is_correct),
    feedback_message:
      typeof data.feedback_message === "string"
        ? data.feedback_message
        : undefined,
    target_topic:
      typeof data.target_topic === "string" ? data.target_topic : undefined,
    root_error_node_id:
      typeof data.root_error_node_id === "string"
        ? data.root_error_node_id
        : data.root_error_node_id === null
          ? null
          : undefined,
    nodes: nodes.map((node, index) => {
      const n = (node ?? {}) as Record<string, unknown>;
      return {
        id: typeof n.id === "string" ? n.id : `node_${index}`,
        grade: typeof n.grade === "number" ? n.grade : Number(n.grade) || 8,
        title: typeof n.title === "string" ? n.title : `Узел ${index + 1}`,
        status: typeof n.status === "string" ? n.status : "junction",
        description:
          typeof n.description === "string" ? n.description : null,
        micro_summary_30sec:
          typeof n.micro_summary_30sec === "string"
            ? n.micro_summary_30sec
            : null,
      };
    }),
    edges: edges.map((edge) => {
      const e = (edge ?? {}) as Record<string, unknown>;
      return {
        source:
          typeof e.source === "string"
            ? e.source
            : typeof e.from === "string"
              ? e.from
              : "",
        target:
          typeof e.target === "string"
            ? e.target
            : typeof e.to === "string"
              ? e.to
              : "",
      };
    }),
  };
}

function parseJsonResponse(raw: string): unknown {
  const cleaned = stripJsonFences(raw);
  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("AI response is not valid JSON");
    return JSON.parse(match[0]);
  }
}

export type AnalyzeSolutionInput = {
  imageBase64OrUrl?: string;
  text?: string;
};

export async function analyzeSolutionWithGemini({
  imageBase64OrUrl,
  text,
}: AnalyzeSolutionInput): Promise<ScanAnalysis> {
  if (!AI_CONFIG.apiKey) {
    throw new Error("Gemini API key is missing");
  }

  if (!AI_CONFIG.model) {
    throw new Error("AI model is missing in environment");
  }

  if (!AI_CONFIG.systemPrompt || !AI_CONFIG.userPrompt) {
    throw new Error("AI prompts are missing in environment");
  }

  const genAI = new GoogleGenerativeAI(AI_CONFIG.apiKey);
  const model = genAI.getGenerativeModel({
    model: AI_CONFIG.model,
    systemInstruction: AI_CONFIG.systemPrompt,
    generationConfig: {
      temperature: 0.2,
      responseMimeType: "application/json",
    },
  });

  const userText = text?.trim()
    ? `${AI_CONFIG.userPrompt}\n\nТекст / условие от ученика:\n${text.trim()}`
    : AI_CONFIG.userPrompt;

  const parts: Array<
    | { text: string }
    | { inlineData: { mimeType: string; data: string } }
  > = [{ text: userText }];

  if (imageBase64OrUrl) {
    const parsed = parseDataUrl(imageBase64OrUrl);
    if (parsed) {
      parts.push({
        inlineData: {
          mimeType: parsed.mimeType,
          data: parsed.data,
        },
      });
    } else if (/^[A-Za-z0-9+/=]+$/.test(imageBase64OrUrl.replace(/\s/g, ""))) {
      parts.push({
        inlineData: {
          mimeType: "image/png",
          data: imageBase64OrUrl.replace(/\s/g, ""),
        },
      });
    } else {
      throw new Error("Image must be a Base64 data URL");
    }
  }

  const result = await model.generateContent({ contents: [{ role: "user", parts }] });
  const raw = result.response.text();

  if (!raw) {
    throw new Error("AI returned an empty response");
  }

  return normalizeAnalysis(parseJsonResponse(raw));
}

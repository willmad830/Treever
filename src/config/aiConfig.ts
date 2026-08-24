export const AI_CONFIG = {
  apiKey:
    process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "",
  model: process.env.AI_MODEL || process.env.NEXT_PUBLIC_AI_MODEL || "",
  systemPrompt:
    process.env.AI_SYSTEM_PROMPT ||
    process.env.NEXT_PUBLIC_AI_SYSTEM_PROMPT ||
    "",
  userPrompt:
    process.env.AI_USER_PROMPT ||
    process.env.NEXT_PUBLIC_AI_USER_PROMPT ||
    "",
};

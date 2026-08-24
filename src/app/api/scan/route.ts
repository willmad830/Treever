import { NextResponse } from "next/server";
import { analyzeSolutionWithGemini } from "@/services/geminiScan";

export const runtime = "nodejs";

type ScanBody = {
  image?: string;
  text?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ScanBody;
    const image = typeof body.image === "string" ? body.image.trim() : "";
    const text = typeof body.text === "string" ? body.text.trim() : "";

    if (!image && !text) {
      return NextResponse.json(
        { error: "Provide an image (Base64 data URL) or text to analyze." },
        { status: 400 },
      );
    }

    const analysis = await analyzeSolutionWithGemini({
      imageBase64OrUrl: image || undefined,
      text: text || undefined,
    });

    return NextResponse.json(analysis);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown scan error";
    console.error("[api/scan]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

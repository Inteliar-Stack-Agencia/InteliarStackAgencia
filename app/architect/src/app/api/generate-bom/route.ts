import { NextRequest, NextResponse } from "next/server";
import { sendMessageForJSON, type ChatMessage } from "@inteliar/llm-client";
import { BomSchema, BOM_GENERATION_SYSTEM_PROMPT } from "@/lib/bom-schema";
import { ReportSchema, REPORT_GENERATION_SYSTEM_PROMPT } from "@/lib/report-schema";

export const runtime = "nodejs";

interface DiagnoseRequestBody {
  messages: ChatMessage[];
}

function transcriptToText(messages: ChatMessage[]): string {
  return messages
    .map((m) => `${m.role === "user" ? "Dueño de la empresa" : "Architect"}: ${m.content}`)
    .join("\n\n");
}

export async function POST(req: NextRequest) {
  let body: DiagnoseRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return NextResponse.json({ error: "messages is required" }, { status: 400 });
  }

  try {
    // Sprint 2 — generar el BOM a partir de la transcripción real, nunca inventado.
    const bomRaw = await sendMessageForJSON({
      system: BOM_GENERATION_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Transcripción de la conversación:\n\n${transcriptToText(body.messages)}`,
        },
      ],
      maxTokens: 2048,
    });

    const bomResult = BomSchema.safeParse(bomRaw);
    if (!bomResult.success) {
      console.error("[api/generate-bom] BOM validation failed", bomResult.error.flatten());
      return NextResponse.json(
        { error: "No pudimos armar un BOM válido a partir de la conversación." },
        { status: 502 }
      );
    }
    const bom = bomResult.data;

    // Sprint 3 — el reporte se genera desde el BOM, no desde la transcripción.
    const reportRaw = await sendMessageForJSON({
      system: REPORT_GENERATION_SYSTEM_PROMPT,
      messages: [{ role: "user", content: JSON.stringify(bom, null, 2) }],
      maxTokens: 1024,
    });

    const reportResult = ReportSchema.safeParse(reportRaw);
    if (!reportResult.success) {
      console.error("[api/generate-bom] Report validation failed", reportResult.error.flatten());
      // El BOM sí es válido — devolverlo igual, sin reporte, es mejor que un 502 total.
      return NextResponse.json({ bom, report: null });
    }

    return NextResponse.json({ bom, report: reportResult.data });
  } catch (err) {
    console.error("[api/generate-bom]", err);
    return NextResponse.json(
      { error: "No pudimos generar el diagnóstico. Probá de nuevo." },
      { status: 500 }
    );
  }
}

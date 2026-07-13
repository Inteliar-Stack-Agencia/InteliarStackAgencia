import { NextRequest, NextResponse } from "next/server";
import { sendMessage, type ChatMessage } from "@inteliar/llm-client";
import { DISCOVER_SYSTEM_PROMPT, DISCOVER_COMPLETE_MARKER } from "@/lib/discover-prompt";

export const runtime = "nodejs";

interface ChatRequestBody {
  messages: ChatMessage[];
}

export async function POST(req: NextRequest) {
  let body: ChatRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return NextResponse.json({ error: "messages is required" }, { status: 400 });
  }
  if (body.messages.length > 60) {
    return NextResponse.json({ error: "Conversation too long" }, { status: 400 });
  }

  try {
    const raw = await sendMessage({
      system: DISCOVER_SYSTEM_PROMPT,
      messages: body.messages,
      maxTokens: 1024,
    });

    const discoverComplete = raw.includes(DISCOVER_COMPLETE_MARKER);
    const reply = raw.replace(DISCOVER_COMPLETE_MARKER, "").trim();

    return NextResponse.json({ reply, discoverComplete });
  } catch (err) {
    console.error("[api/chat]", err);
    return NextResponse.json(
      { error: "No pudimos generar una respuesta. Probá de nuevo." },
      { status: 500 }
    );
  }
}

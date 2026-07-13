/**
 * Minimal server-side LLM client.
 *
 * FOUNDING_DECISIONS.md principle #8 in practice: no client ever calls an
 * LLM provider directly. This package is the one place that does, and it
 * must only ever be imported from server-side code (API routes, server
 * components) — never from a "use client" component.
 *
 * This is deliberately NOT the full AI Runtime described in AR-011 (model
 * router, cost optimizer, cognitive resource management, ...). That
 * abstraction is a hypothesis (see FOUNDING_DECISIONS.md) that earns its
 * complexity once there are multiple real AI Pods in production to
 * observe. Today there is one: the Architect conversation. A single
 * provider, called directly, is the honest amount of infrastructure for
 * that.
 */

import Anthropic from "@anthropic-ai/sdk";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface SendMessageOptions {
  system: string;
  messages: ChatMessage[];
  maxTokens?: number;
  model?: string;
}

const DEFAULT_MODEL = "claude-sonnet-4-6";

export class LLMClientError extends Error {}

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (client) return client;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new LLMClientError(
      "ANTHROPIC_API_KEY is not set. This client only runs server-side; " +
        "set it in the environment where the API route executes."
    );
  }
  client = new Anthropic({ apiKey });
  return client;
}

/**
 * Sends a message and returns the assistant's full text response.
 * No streaming in v0 — added when a real usage pattern needs it, not before.
 */
export async function sendMessage(options: SendMessageOptions): Promise<string> {
  const anthropic = getClient();

  const response = await anthropic.messages.create({
    model: options.model ?? DEFAULT_MODEL,
    max_tokens: options.maxTokens ?? 2048,
    system: options.system,
    messages: options.messages.map((m) => ({ role: m.role, content: m.content })),
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new LLMClientError("Model response contained no text block");
  }
  return textBlock.text;
}

/**
 * Sends a message and parses the response as JSON, retrying once with a
 * stricter instruction if the first attempt isn't valid JSON.
 *
 * Governance rule (learned from the best AI pattern found in the org's
 * repository audit, real-estate-copilot-latam/llm_client.py): the model
 * is never the source of truth for structured data on its own — the
 * caller must validate the shape it returns. This helper only guarantees
 * "valid JSON came back"; schema validation (with zod, per call site) is
 * still the caller's job.
 */
export async function sendMessageForJSON<T = unknown>(
  options: SendMessageOptions
): Promise<T> {
  const raw = await sendMessage(options);
  const parsed = tryParseJSON<T>(raw);
  if (parsed !== null) return parsed;

  // Retry once, more strictly.
  const retryText = await sendMessage({
    ...options,
    messages: [
      ...options.messages,
      { role: "assistant", content: raw },
      {
        role: "user",
        content:
          "Eso no era JSON válido. Respondé ÚNICAMENTE con el JSON, sin texto antes ni después, sin bloques de markdown.",
      },
    ],
  });
  const retryParsed = tryParseJSON<T>(retryText);
  if (retryParsed !== null) return retryParsed;

  throw new LLMClientError("Model did not return valid JSON after retry");
}

function tryParseJSON<T>(text: string): T | null {
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "");
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    return null;
  }
}

"use client";

import { useState, useRef, useEffect } from "react";
import ReportView from "./ReportView";
import type { Bom } from "@/lib/bom-schema";
import type { Report } from "@/lib/report-schema";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const OPENING_MESSAGE =
  "Hola 👋 Soy Architect. Contame sobre tu empresa — ¿a qué se dedican?";

type Phase = "conversation" | "generating" | "report";

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: OPENING_MESSAGE },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [discoverComplete, setDiscoverComplete] = useState(false);
  const [phase, setPhase] = useState<Phase>("conversation");
  const [error, setError] = useState<string | null>(null);
  const [bom, setBom] = useState<Bom | null>(null);
  const [report, setReport] = useState<Report | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    const text = input.trim();
    if (!text || sending) return;

    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setSending(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error desconocido");

      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
      if (data.discoverComplete) setDiscoverComplete(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Algo falló. Probá de nuevo.");
    } finally {
      setSending(false);
    }
  }

  async function generateDiagnosis() {
    setPhase("generating");
    setError(null);
    try {
      const res = await fetch("/api/generate-bom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error desconocido");

      setBom(data.bom);
      setReport(data.report);
      setPhase("report");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No pudimos generar el diagnóstico.");
      setPhase("conversation");
    }
  }

  function startOver() {
    setMessages([{ role: "assistant", content: OPENING_MESSAGE }]);
    setDiscoverComplete(false);
    setBom(null);
    setReport(null);
    setPhase("conversation");
    setError(null);
  }

  if (phase === "report" && bom) {
    return <ReportView bom={bom} report={report} onStartOver={startOver} />;
  }

  return (
    <div className="max-w-xl mx-auto flex flex-col h-screen px-4">
      <div className="flex-1 overflow-y-auto py-8 space-y-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                m.role === "user"
                  ? "bg-neutral-100 text-neutral-900"
                  : "bg-neutral-800 text-neutral-100"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {sending && (
          <div className="flex justify-start">
            <div className="bg-neutral-800 text-neutral-500 rounded-2xl px-4 py-2.5 text-sm">
              Architect está pensando…
            </div>
          </div>
        )}

        {discoverComplete && phase === "conversation" && (
          <div className="flex justify-center pt-4">
            <button
              onClick={generateDiagnosis}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium px-5 py-2.5 rounded-lg"
            >
              Generar mi diagnóstico
            </button>
          </div>
        )}

        {phase === "generating" && (
          <p className="text-center text-sm text-neutral-500">Armando tu diagnóstico…</p>
        )}

        {error && <p className="text-center text-sm text-red-400">{error}</p>}

        <div ref={bottomRef} />
      </div>

      <div className="border-t border-neutral-800 py-4">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            disabled={sending || phase !== "conversation"}
            placeholder="Escribí tu respuesta…"
            className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600"
          />
          <button
            onClick={send}
            disabled={sending || !input.trim() || phase !== "conversation"}
            className="bg-neutral-100 text-neutral-900 rounded-lg px-4 py-2.5 text-sm font-medium disabled:opacity-40"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}

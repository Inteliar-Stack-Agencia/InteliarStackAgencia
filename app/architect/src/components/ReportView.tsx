"use client";

import type { Bom } from "@/lib/bom-schema";
import type { Report } from "@/lib/report-schema";

interface ReportViewProps {
  bom: Bom;
  report: Report | null;
  onStartOver: () => void;
}

export default function ReportView({ bom, report, onStartOver }: ReportViewProps) {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="no-print flex justify-between items-center mb-8">
        <button
          onClick={onStartOver}
          className="text-sm text-neutral-400 hover:text-neutral-200"
        >
          ← Empezar de nuevo
        </button>
        <button
          onClick={() => window.print()}
          className="text-sm bg-neutral-100 text-neutral-900 px-4 py-2 rounded-md font-medium hover:bg-white"
        >
          Guardar como PDF
        </button>
      </div>

      <h1 className="text-2xl font-semibold mb-1">
        Diagnóstico{bom.identity.name ? `: ${bom.identity.name}` : ""}
      </h1>
      <p className="text-neutral-400 text-sm mb-10">
        {[bom.identity.industry, bom.identity.size].filter(Boolean).join(" · ")}
      </p>

      {report && (
        <section className="mb-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 mb-3">
            Resumen
          </h2>
          <p className="text-neutral-200 leading-relaxed">{report.summary}</p>
        </section>
      )}

      {report && report.problems.length > 0 && (
        <section className="mb-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 mb-3">
            Problemas detectados
          </h2>
          <ul className="space-y-2">
            {report.problems.map((p, i) => (
              <li key={i} className="text-neutral-200 leading-relaxed pl-4 border-l-2 border-red-900">
                {p}
              </li>
            ))}
          </ul>
        </section>
      )}

      {report && report.recommendations.length > 0 && (
        <section className="mb-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 mb-3">
            Recomendaciones
          </h2>
          <ul className="space-y-2">
            {report.recommendations.map((r, i) => (
              <li key={i} className="text-neutral-200 leading-relaxed pl-4 border-l-2 border-emerald-800">
                {r}
              </li>
            ))}
          </ul>
        </section>
      )}

      {bom.capabilities.length > 0 && (
        <section className="mb-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 mb-3">
            Capacidades detectadas
          </h2>
          <div className="space-y-3">
            {bom.capabilities.map((c, i) => (
              <div key={i} className="border border-neutral-800 rounded-md p-3">
                <div className="flex justify-between items-baseline">
                  <span className="font-medium">{c.name}</span>
                  {c.current_tool && (
                    <span className="text-xs text-neutral-500">hoy: {c.current_tool}</span>
                  )}
                </div>
                {c.pain_points.length > 0 && (
                  <ul className="mt-2 text-sm text-neutral-400 list-disc list-inside">
                    {c.pain_points.map((p, j) => (
                      <li key={j}>{p}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {bom.objectives.length > 0 && (
        <section className="mb-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 mb-3">
            Objetivos
          </h2>
          <ul className="space-y-1">
            {bom.objectives.map((o, i) => (
              <li key={i} className="text-neutral-200">
                <span className="font-medium">{o.name}</span>
                {o.description && <span className="text-neutral-400"> — {o.description}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="no-print text-xs text-neutral-600 mt-16">
        Este diagnóstico se generó a partir de lo que contaste, sin inventar información.
        Es el primer paso de Discover — todavía no es una cotización.
      </p>
    </div>
  );
}

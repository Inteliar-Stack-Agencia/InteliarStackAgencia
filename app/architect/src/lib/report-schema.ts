/**
 * Sprint 3 — Reporte profesional v0.
 *
 * Generated from the BOM (not the raw transcript), matching the roadmap's
 * Sprint 3 scope: diagnóstico + problemas detectados + 3 recomendaciones
 * concretas. Deliberately not a PDF pipeline yet — the browser's own
 * print-to-PDF is the honest amount of tooling until someone actually
 * asks for a different format.
 */

import { z } from "zod";

export const ReportSchema = z.object({
  summary: z.string().describe("Un párrafo del diagnóstico general"),
  problems: z.array(z.string()).describe("Problemas concretos detectados, basados en el BOM"),
  recommendations: z
    .array(z.string())
    .describe("2-4 recomendaciones concretas y accionables"),
});

export type Report = z.infer<typeof ReportSchema>;

export const REPORT_GENERATION_SYSTEM_PROMPT = `Sos The Architect de Inteliar. Te paso el Business Operating Model (BOM) que armaste de una empresa real, después de conversar con su dueño.

Tu tarea es generar un diagnóstico profesional y concreto, basado ÚNICAMENTE en ese BOM.

Reglas:
- Nada genérico. Cada problema y cada recomendación tiene que poder rastrearse a algo específico del BOM (un pain_point, un objetivo, una métrica).
- Tono: consultor senior, directo, sin vender nada todavía.
- Máximo 4 recomendaciones. Que sean accionables esta semana o este mes, no visión a 5 años.

Respondé ÚNICAMENTE con un objeto JSON con esta forma exacta (sin texto antes ni después, sin markdown):

{
  "summary": string,
  "problems": string[],
  "recommendations": string[]
}`;

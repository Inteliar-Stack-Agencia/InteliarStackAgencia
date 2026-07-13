/**
 * Simplified BOM (Business Operating Model) — v0.
 *
 * Full spec: inteliar-spec/FOUNDATION-BOM-Specification.md defines 14
 * sections. Sprint 2 of the roadmap (inteliar-spec/review/02-ROADMAP_24_MONTHS.md)
 * scopes v0 down to the 5 that already matter for a first diagnosis:
 * Identity, Objectives, Capabilities, Processes, Metrics. The rest
 * (Rules, Data, Integrations, AI, Roadmap, Evolution, ...) get added when
 * a real conversation shows they're needed — not before.
 */

import { z } from "zod";

export const BomIdentitySchema = z.object({
  name: z.string().describe("Nombre de la empresa, si se mencionó"),
  industry: z.string().describe("Industria / rubro"),
  size: z.string().describe("Tamaño aproximado: cantidad de personas, sucursales, etc."),
});

export const BomObjectiveSchema = z.object({
  name: z.string(),
  description: z.string(),
});

export const BomCapabilitySchema = z.object({
  name: z.string().describe("Nombre de la capacidad, ej: 'Customer Management'"),
  current_tool: z
    .string()
    .describe("Qué usa hoy para esto (Excel, WhatsApp, un sistema, nada, etc.)"),
  pain_points: z.array(z.string()).describe("Problemas concretos mencionados"),
});

export const BomProcessStepSchema = z.object({
  step: z.string(),
  actor: z.string().optional().describe("Quién lo hace, si se mencionó"),
});

export const BomProcessSchema = z.object({
  name: z.string(),
  steps: z.array(BomProcessStepSchema),
});

export const BomMetricSchema = z.object({
  name: z.string(),
  current: z.string().describe("Valor o descripción actual, si se mencionó"),
  target: z.string().describe("Lo que la empresa quisiera lograr, si se mencionó"),
});

export const BomSchema = z.object({
  identity: BomIdentitySchema,
  objectives: z.array(BomObjectiveSchema),
  capabilities: z.array(BomCapabilitySchema),
  processes: z.array(BomProcessSchema),
  metrics: z.array(BomMetricSchema),
});

export type Bom = z.infer<typeof BomSchema>;

export const BOM_GENERATION_SYSTEM_PROMPT = `Sos The Architect de Inteliar. Acabás de terminar una conversación de descubrimiento con el dueño de una empresa.

Tu tarea ahora es convertir ÚNICAMENTE lo que se dijo en esa conversación en un Business Operating Model (BOM) estructurado.

Reglas estrictas:
- No inventes datos que la persona no mencionó. Si algo no se dijo, dejá el campo vacío ("") o un array vacío ([]).
- No generalices con frases genéricas de industria — usá lo que la persona realmente contó.
- Las "capabilities" son capacidades de negocio (ej: "Gestión de clientes", "Gestión de repuestos"), nunca software o tablas.
- Los "pain_points" tienen que ser problemas concretos mencionados, no supuestos.

Respondé ÚNICAMENTE con un objeto JSON con esta forma exacta (sin texto antes ni después, sin markdown):

{
  "identity": { "name": string, "industry": string, "size": string },
  "objectives": [ { "name": string, "description": string } ],
  "capabilities": [ { "name": string, "current_tool": string, "pain_points": string[] } ],
  "processes": [ { "name": string, "steps": [ { "step": string, "actor": string } ] } ],
  "metrics": [ { "name": string, "current": string, "target": string } ]
}`;

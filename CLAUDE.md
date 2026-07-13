# inteliar-stack — CLAUDE.md

**Qué es este repo:** el monorepo real de Inteliar. Hoy contiene exactamente una cosa: la conversación de Architect (Sprint 1-3 del roadmap). No contiene Identity, Permission, Workflow, Builder, ni Marketplace — esos son hipótesis o roadmap futuro, no código de hoy.

**La especificación completa** (Constitución, Architecture Reference, ADRs, la revisión de arquitectura, y sobre todo `FOUNDING_DECISIONS.md`) vive en otro repo: `Inteliar-Stack-Agencia/AGENTIC-IA`, carpeta `inteliar-spec/`. Si estás por tomar una decisión de arquitectura acá, leé `FOUNDING_DECISIONS.md` primero — no se repite acá para no tener dos copias desincronizadas.

## La regla que importa antes que cualquier otra

No se agrega nada a este repo que no esté ya autorizado por `FOUNDING_DECISIONS.md` o por el roadmap activo (`inteliar-spec/review/02-ROADMAP_24_MONTHS.md`). Si te parece que falta algo (Identity, Marketplace, Capabilities, lo que sea), primero completá `PROPOSAL_TEMPLATE.md` en el otro repo — no lo construyas acá directamente.

## Estructura

```
inteliar-stack/
├── app/architect/     # Next.js — la conversación de Architect
├── lib/llm-client/    # Cliente mínimo de Claude, server-side siempre
└── docs/              # Puntero a inteliar-spec, no una copia
```

## Estado real (no aspiracional)

- ✅ Conversación de Architect (las 8 preguntas de Discover)
- ✅ Generación de BOM simplificado (Identity, Objectives, Capabilities, Processes, Metrics)
- ✅ Reporte v0 (resumen + problemas + recomendaciones)
- ❌ Persistencia real (por ahora todo vive en memoria del navegador durante la sesión — ver docs/README.md)
- ❌ Identity, Permission, Workflow, Builder, Marketplace: no existen todavía, y no se construyen hasta validar con conversaciones reales (Regla del Fundador)

## Convenciones

- Ningún componente client-side llama a un LLM directamente. Todo pasa por `lib/llm-client`, y ese paquete solo se importa desde código server-side (API routes).
- No agregar Supabase, Postgres, ni ningún datastore hasta que haya una razón real medida en uso (ver `01-PROPOSED_ARCHITECTURE.md §3` en `inteliar-spec/`).

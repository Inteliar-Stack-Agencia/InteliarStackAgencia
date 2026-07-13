# Inteliar Stack

La conversación de Architect. Nada más, todavía.

> "Hola 👋 Soy Architect. Contame sobre tu empresa."

Eso es lo único que existe hoy en este repo: una conversación real con IA que hace las 8 preguntas de Discover, genera un Business Operating Model simplificado, y devuelve un diagnóstico. Sin dashboard, sin login, sin Marketplace, sin Builder.

Por qué: ver `FOUNDING_DECISIONS.md` e `inteliar-spec/review/` en el repo `Inteliar-Stack-Agencia/AGENTIC-IA`.

## Correr localmente

```bash
npm install
cp app/architect/.env.example app/architect/.env.local
# completar ANTHROPIC_API_KEY en app/architect/.env.local
npm run dev
```

Abrí http://localhost:3000.

## Estructura

Ver `CLAUDE.md`.

## Estado de persistencia (v0)

La conversación y el diagnóstico viven solo en memoria del navegador durante la sesión — no hay backend de persistencia todavía. Eso es una decisión, no un olvido: agregar una base de datos antes de validar con conversaciones reales sería repetir el error que la revisión de arquitectura de Inteliar identificó (construir infraestructura antes de tener evidencia de que hace falta). Se agrega cuando el primer lote de conversaciones reales (Regla del Fundador) muestre que hace falta guardar algo entre sesiones.

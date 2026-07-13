# BACKLOG — Post-validación

**Regla de este archivo:** nada de lo que está acá se construye antes de completar la validación de Sprint 4-5 (20 entrevistas reales, ver `inteliar-spec/review/02-ROADMAP_24_MONTHS.md`). Es una lista de ideas capturadas para no perderlas, no un plan de sprint.

Si en algún momento se decide construir algo de acá antes de tiempo, tiene que pasar primero por `PROPOSAL_TEMPLATE.md` (en `inteliar-spec/`, repo AGENTIC-IA).

---

## Por qué existe este archivo

Después de la primera prueba real de Architect (un diagnóstico de calidad sobre una distribuidora), surgió una propuesta de backlog completa: mejorar Discover, mejorar el BOM, agregar un loop de validación explícito, un botón para repetir entrevistas, un panel interno, y una IA que analice patrones entre entrevistas.

La conclusión de esa misma propuesta fue la correcta: *"no tocaría el código, haría 20 entrevistas — eso no se descubre programando, se descubre escuchando."* Este archivo existe para que esa idea no se pierda mientras se hacen esas 20 entrevistas, sin tocar código mientras tanto.

---

## Fase 1 — Mejorar Discover (después de validar)

Objetivo: que Architect entienda cualquier empresa, no solo siga un formulario fijo de 8 preguntas.

- Memoria real durante la conversación (hoy manda toda la transcripción cada vez — funciona, pero no distingue qué ya quedó claro de qué falta)
- Preguntas dinámicas en vez de las 8 fijas siempre en el mismo orden
- Detectar contradicciones en lo que la persona cuenta
- Pedir ejemplos concretos cuando una respuesta es vaga (esto ya está en el system prompt, pero sin verificar qué tan bien lo hace en la práctica)
- Detectar procesos, software actual, dolores y objetivos de forma más precisa
- Antes de generar el BOM, confirmar explícitamente: *"Entendí esto de tu empresa. ¿Es correcto?"* — y solo generar el BOM después de un sí. Hoy el BOM se genera directo cuando el modelo decide que ya tiene suficiente, sin ese chequeo intermedio.

**Por qué no se construye ya:** ninguna de estas mejoras tiene evidencia todavía de que resuelva un problema real observado. Se sabe cuáles preguntas sobran o faltan recién después de ver 10-20 conversaciones reales fallar o funcionar de formas específicas.

## Fase 2 — Calidad del BOM (después de validar)

El BOM/reporte de hoy puede ser más largo de lo necesario para un dueño de PyME (ver el ejemplo real generado — es bueno, pero denso). Simplificar a algo más escaneable, tipo:

```yaml
empresa: Taller de reparación
procesos: [Recepción, Diagnóstico, Presupuesto, Reparación, Entrega]
problemas: [Sin trazabilidad, Stock manual, Avisos manuales por WhatsApp]
objetivos: [Reducir tiempos, Automatizar comunicación]
capabilities_sugeridas: [Customers, Repairs, Inventory, Notifications]
```

**Por qué no se construye ya:** no sabemos todavía si el reporte actual es "demasiado largo" para un dueño real o si el largo es justamente lo que lo hace sentir tomado en serio. Eso se mide preguntando, no adivinando.

## Fase 3 — Loop de validación explícito ✅ implementado (2026-07-13)

En vez de terminar la conversación con un simple final, Architect ahora resume lo que entendió y pregunta explícitamente "¿es correcto? ¿falta algo?" antes de generar el BOM — solo avanza después de una confirmación real del usuario, con vueltas de corrección si hace falta.

**Por qué se pudo hacer sin esperar validación:** resultó ser un cambio de prompt puro, no una feature nueva. El mecanismo de "conversación completa" (`DISCOVER_COMPLETE_MARKER`) ya existía — solo se cambió *cuándo* el modelo lo emite (después de una confirmación explícita del usuario, no cuando el modelo decide unilateralmente que ya tiene suficiente). Cero código nuevo, cero riesgo de sobre-construcción. Ver `src/lib/discover-prompt.ts`.

De paso se refinaron las 8 preguntas originales a una versión más concreta y natural ("Discover Framework v1": identidad, cómo entra el trabajo, el proceso completo sin interrumpir, herramientas, dolor, excepciones, objetivos a 1 año) y se cambió la persona de "asistente genérico" a "consultor de procesos con 20 años de experiencia". Todavía no se backporteó a `inteliar-spec/capitulos/18-Discover-Engine.md` — eso espera evidencia real de que esta versión funciona mejor, no se asume.

## Ya existe, sin código nuevo

- **"Tengo otra empresa":** ya es el botón "← Empezar de nuevo" en `ReportView.tsx`. No hace falta construir nada para esto.
- **Panel interno de entrevistas:** ya es `business-research/` (repo AGENTIC-IA), ahora organizado en 5 categorías (talleres, gastronomía, retail, salud, servicios) con un objetivo explícito de 100 entrevistas (20 por categoría). Una carpeta con un `.md` por entrevista, usando `INTERVIEW_TEMPLATE.md`, es una base de datos suficiente para eso. Se justifica un panel de verdad (con estados 🟢🟡🔴, búsqueda, etc.) recién cuando navegar esa carpeta a mano se vuelva insoportable — no antes.

## Meta-IA (mucho después)

Una IA que analice patrones entre entrevistas: *"¿qué preguntas nunca aportan información útil?"*, *"¿qué industrias entendemos peor?"* Esto es, literalmente, el Knowledge Engine — ya está registrado como hipótesis 🟡 en `FOUNDING_DECISIONS.md`, con la nota explícita de que requiere volumen real de organizaciones que hoy no existe. Con 20 entrevistas no hay volumen suficiente para que esta IA aprenda nada real — seguiría siendo prematuro incluso después de Sprint 4-5. Revisar cuando haya cientos, no docenas.

---

*Ver también: `inteliar-spec/FOUNDING_DECISIONS.md`, `inteliar-spec/PROPOSAL_TEMPLATE.md` (repo AGENTIC-IA)*

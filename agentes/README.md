# Equipo de agentes · GooLive

Este directorio define el **equipo de agentes** que desarrolla y opera GooLive.
Cada archivo es la especificación (rol, responsabilidades, entradas/salidas y
criterios de calidad) de un agente. El frontmatter YAML es compatible con
subagentes de Claude Code, así que estos archivos pueden copiarse a
`.claude/agents/` para volverlos invocables.

> **Principio rector del producto — "Honestidad Radical":** ningún agente
> entrega una caja negra. Todo cálculo se explica, todo dato es real o se marca
> como simulado, y nada se afirma como "funciona" sin haberlo verificado.

## Modelo de orquestación

```
                    ┌───────────────────────┐
                    │      ORQUESTADOR       │
                    │  (planifica · delega · │
                    │   integra · verifica)  │
                    └───────────┬───────────┘
        ┌───────────┬───────────┼───────────┬───────────┐
        ▼           ▼           ▼           ▼           ▼
   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
   │ DISEÑO  │ │DESARROLLO│ │MARKETING│ │ SOPORTE │ │ IA-APP  │
   │ UX/UI   │ │Full-stack│ │ Growth  │ │ Success │ │ Coach   │
   └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘
```

El **orquestador** no construye: descompone la meta en tareas, elige el
subagente correcto, corre en paralelo lo independiente, y **verifica** cada
entrega antes de integrarla. Los subagentes son especialistas con un único foco.

## Índice de agentes

| Agente | Archivo | Foco |
|---|---|---|
| Orquestador | [orquestador.md](orquestador.md) | Coordina el equipo, planifica y verifica |
| Diseño (UX/UI) | [diseno.md](diseno.md) | Flujos, sistema visual, accesibilidad, marca |
| Desarrollo | [desarrollo.md](desarrollo.md) | Frontend + backend + datos + motores de cálculo |
| Marketing | [marketing.md](marketing.md) | Posicionamiento, contenido, ASO, adquisición |
| Soporte | [soporte.md](soporte.md) | Atención, documentación, incidencias, feedback |
| IA de la App | [ia-app.md](ia-app.md) | Coach nutricional dentro del producto (feature) |

> **Nota:** "IA de la App" es distinto de los demás. Los otros cinco son agentes
> que **construyen y operan** GooLive. La IA de la App es una **función del
> producto** (el coach que ve el usuario final); su ficha define cómo debe
> comportarse ese asistente dentro de la app.

## Cómo se usa un agente como subagente real

```bash
# Copiar (o enlazar) las fichas al directorio de subagentes de Claude Code
mkdir -p .claude/agents
cp agentes/*.md .claude/agents/
```

Luego se invocan por su `name` (frontmatter). Mantén el **source of truth** aquí
en `agentes/`; `.claude/agents/` es solo la copia operativa.

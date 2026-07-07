# GooLive

**Ecosistema digital de salud, fitness y recomposición corporal adaptativa** —
web + app móvil híbrida. Nace contra la opacidad de la industria del fitness: en
lugar de entregar reportes que nadie entiende, GooLive **abre sus algoritmos**.

> **Propuesta de valor — "Honestidad Radical":** cada métrica se explica con su
> fórmula exacta, cada dato es real (o va marcado como ejemplo), y automatizamos
> el registro para eliminar el conteo manual de calorías y ejercicios.

Para **cualquier persona que haga actividad física regular** (running, ciclismo,
calistenia, entrenamiento en casa, yoga o gimnasio), que quiera optimizar su
composición corporal perdiendo grasa y protegiendo su músculo.

## Estructura del repositorio

```
goolive/
├── agentes/     Equipo de agentes que desarrolla y opera el proyecto
└── app/         Código de la aplicación (producto real, versionado)
```

- **[agentes/](agentes/)** — Orquestador + subagentes (diseño, desarrollo,
  marketing, soporte, IA del producto). Ver [agentes/README.md](agentes/README.md).
- **[app/](app/)** — La aplicación. Ver [app/README.md](app/README.md).

## Equipo de agentes

| Agente | Rol |
|---|---|
| [Orquestador](agentes/orquestador.md) | Planifica, delega, integra y verifica |
| [Diseño](agentes/diseno.md) | UX/UI, sistema visual, accesibilidad, marca |
| [Desarrollo](agentes/desarrollo.md) | Full-stack: motores, datos, API |
| [Marketing](agentes/marketing.md) | Posicionamiento, landing, ASO, growth |
| [Soporte](agentes/soporte.md) | Atención, docs, incidencias, feedback |
| [IA de la App](agentes/ia-app.md) | Coach nutricional dentro del producto |

## Estado

- ✅ Estructura del repo y definición del equipo de agentes.
- ⏳ Núcleo funcional del MVP (valoración + registro nutricional + persistencia)
  — próximo entregable.
- 🔜 Backend real (API + base de datos, multiusuario) y coach IA in-app.

**Fuera del MVP (aplazado):** cámara IA de platos, wearables multimarca y capa
clínica de fisioterapia — vistosos pero caros/poco confiables hoy.

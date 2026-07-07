# App · GooLive

Código de la aplicación GooLive. Aquí vive el producto real (frontend + motores
de cálculo + persistencia; y luego backend + API). **Todo lo funcional se versiona
aquí**, nunca en directorios temporales.

## Principio

**Honestidad Radical:** todo número mostrado es cálculo real o va marcado como
ejemplo; cada fórmula se puede desglosar; nada se declara "funciona" sin haberse
verificado end-to-end.

## Estructura prevista

```
app/
├── README.md              (este archivo)
├── index.html             (entrada de la app — próximo entregable)
├── src/
│   ├── motores/           motor metabólico, macros, ranking (cálculo puro + tests)
│   ├── datos/             base de alimentos, factores de actividad
│   ├── ui/                pantallas: valoración · hoy · ranking · coach
│   └── persistencia/      localStorage (MVP) → API (backend)
└── server/                backend fase 2: API REST + base de datos
```

## Roadmap de construcción (MVP → backend)

1. **Núcleo funcional (MVP, sin backend):**
   - Valoración → meta calórica real (Mifflin-St Jeor / Katch-McArdle) con desglose.
   - Registro nutricional contra base de alimentos real → kcal/macros del día.
   - Ranking computado desde el registro real.
   - Persistencia local (localStorage), verificada tras recarga.
2. **Backend real (fase 2):** API + base de datos (Supabase/Firebase), auth,
   multiusuario, ranking entre personas reales. Tablas: `Usuarios_Metricas`,
   `Planes_Nutricion`, `Sincronizacion_Wearable_Diaria`.
3. **Coach IA in-app:** asistente que explica cada recomendación (ver
   [../agentes/ia-app.md](../agentes/ia-app.md)).

## Fuera del MVP (aplazado — ver análisis de alcance)

Cámara IA de platos, integración de wearables multimarca y capa clínica de
fisioterapia. Vistosos pero caros/poco confiables hoy; no bloquean el valor central.

## Estado

Estructura inicial creada. El primer entregable de código (valoración funcional)
lo produce el agente de [desarrollo](../agentes/desarrollo.md) bajo el
[orquestador](../agentes/orquestador.md).

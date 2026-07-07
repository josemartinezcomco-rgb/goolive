// Factores de actividad y objetivos de composición corporal.
// Fuente de los factores: multiplicadores estándar sobre el TDEE (Harris-Benedict/
// Mifflin). Todo se expone al usuario (Honestidad Radical): nada de cajas negras.

export const NIVELES_ACTIVIDAD = [
  { id: 'sedentario', etiqueta: 'Sedentario (poco o nada de ejercicio)', factor: 1.2 },
  { id: 'ligero', etiqueta: 'Ligero (1–3 días/semana)', factor: 1.375 },
  { id: 'moderado', etiqueta: 'Moderado (3–5 días/semana)', factor: 1.55 },
  { id: 'alto', etiqueta: 'Alto (6–7 días/semana)', factor: 1.725 },
  { id: 'muy_alto', etiqueta: 'Muy alto (2× día / trabajo físico)', factor: 1.9 },
];

// Ajuste calórico sobre el TDEE según el objetivo de recomposición.
// Déficit/superávit moderados para proteger masa muscular.
export const OBJETIVOS = [
  { id: 'perder_grasa', etiqueta: 'Perder grasa', ajuste: 0.80, proteinaGkg: 2.0 },
  { id: 'recomposicion', etiqueta: 'Recomposición', ajuste: 0.90, proteinaGkg: 2.0 },
  { id: 'mantener', etiqueta: 'Mantener', ajuste: 1.0, proteinaGkg: 1.8 },
  { id: 'ganar_musculo', etiqueta: 'Ganar músculo', ajuste: 1.10, proteinaGkg: 1.8 },
];

export const nivelPorId = (id) => NIVELES_ACTIVIDAD.find((n) => n.id === id);
export const objetivoPorId = (id) => OBJETIVOS.find((o) => o.id === id);

// Motor de macronutrientes. Reparte la meta calórica en proteína/grasa/carbos
// con proteína alta para proteger masa muscular. Devuelve el desglose.
//
// Proteína: g/kg según objetivo (1.8–2.2 g/kg).
// Grasa: 25% de las kcal de la meta (mínimo saludable de ácidos grasos).
// Carbohidratos: el resto de las kcal.

import { objetivoPorId } from '../datos/actividad.js';

const r = (x) => Math.round(x);

/**
 * @param {number} metaKcal  meta calórica diaria
 * @param {number} pesoKg
 * @param {string} objetivoId
 */
export function calcularMacros(metaKcal, pesoKg, objetivoId) {
  const objetivo = objetivoPorId(objetivoId);
  const proteinaGkg = objetivo ? objetivo.proteinaGkg : 1.8;

  const proteinaG = proteinaGkg * pesoKg;
  const proteinaKcal = proteinaG * 4;

  const grasaKcal = metaKcal * 0.25;
  const grasaG = grasaKcal / 9;

  const carbosKcal = Math.max(0, metaKcal - proteinaKcal - grasaKcal);
  const carbosG = carbosKcal / 4;

  return {
    proteinaG: r(proteinaG),
    carbosG: r(carbosG),
    grasaG: r(grasaG),
    desglose: {
      proteina: `${proteinaGkg} g/kg × ${pesoKg} kg = ${r(proteinaG)} g (${r(proteinaKcal)} kcal)`,
      grasa: `25% de ${metaKcal} kcal = ${r(grasaKcal)} kcal ÷ 9 = ${r(grasaG)} g`,
      carbos: `resto: ${metaKcal} − ${r(proteinaKcal)} − ${r(grasaKcal)} = ${r(carbosKcal)} kcal ÷ 4 = ${r(carbosG)} g`,
    },
  };
}

/** Suma los macros y kcal de una lista de comidas registradas. */
export function totalesDelDia(registros) {
  return registros.reduce(
    (acc, x) => ({
      kcal: acc.kcal + x.kcal,
      proteinaG: acc.proteinaG + x.proteinaG,
      carbosG: acc.carbosG + x.carbosG,
      grasaG: acc.grasaG + x.grasaG,
    }),
    { kcal: 0, proteinaG: 0, carbosG: 0, grasaG: 0 }
  );
}

/** Calcula el aporte de una porción (alimento × gramos). */
export function aportePorcion(alimento, gramos) {
  const factor = gramos / 100;
  const p = alimento.p * factor;
  const c = alimento.c * factor;
  const g = alimento.g * factor;
  return {
    id: alimento.id,
    nombre: alimento.nombre,
    gramos,
    proteinaG: Math.round(p * 10) / 10,
    carbosG: Math.round(c * 10) / 10,
    grasaG: Math.round(g * 10) / 10,
    kcal: Math.round(p * 4 + c * 4 + g * 9),
  };
}

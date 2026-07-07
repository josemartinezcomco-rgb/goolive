// Motor metabólico abierto. Calcula BMR, TDEE y meta calórica, devolviendo
// SIEMPRE el desglose paso a paso para el Botón de Transparencia.
//
// Mifflin-St Jeor: base general (no requiere % de grasa).
// Katch-McArdle: prioritaria cuando el usuario conoce su masa libre de grasa
//   (a partir del % de grasa corporal), porque calcula sobre el músculo real.

import { nivelPorId, objetivoPorId } from '../datos/actividad.js';

const r = (x, d = 0) => {
  const f = 10 ** d;
  return Math.round(x * f) / f;
};

/**
 * BMR por Mifflin-St Jeor.
 * Hombre: 10·peso + 6.25·altura − 5·edad + 5
 * Mujer:  10·peso + 6.25·altura − 5·edad − 161
 */
export function bmrMifflin({ pesoKg, alturaCm, edad, sexo }) {
  const base = 10 * pesoKg + 6.25 * alturaCm - 5 * edad;
  const ajusteSexo = sexo === 'hombre' ? 5 : -161;
  const bmr = base + ajusteSexo;
  return {
    metodo: 'Mifflin-St Jeor',
    bmr: r(bmr, 1),
    formula: `10 × ${pesoKg} + 6.25 × ${alturaCm} − 5 × ${edad} ${sexo === 'hombre' ? '+ 5' : '− 161'}`,
    pasos: [
      `10 × peso (${pesoKg} kg) = ${r(10 * pesoKg, 1)}`,
      `6.25 × altura (${alturaCm} cm) = ${r(6.25 * alturaCm, 1)}`,
      `− 5 × edad (${edad}) = ${r(-5 * edad, 1)}`,
      `ajuste por sexo (${sexo}) = ${ajusteSexo}`,
      `BMR = ${r(bmr, 1)} kcal`,
    ],
  };
}

/**
 * BMR por Katch-McArdle. Requiere % de grasa corporal.
 * MLG (masa libre de grasa) = peso × (1 − grasa%/100)
 * BMR = 370 + 21.6 × MLG
 */
export function bmrKatch({ pesoKg, grasaPct }) {
  const mlg = pesoKg * (1 - grasaPct / 100);
  const bmr = 370 + 21.6 * mlg;
  return {
    metodo: 'Katch-McArdle',
    bmr: r(bmr, 1),
    mlgKg: r(mlg, 1),
    formula: `370 + 21.6 × MLG`,
    pasos: [
      `MLG = ${pesoKg} × (1 − ${grasaPct}/100) = ${r(mlg, 1)} kg`,
      `BMR = 370 + 21.6 × ${r(mlg, 1)} = ${r(bmr, 1)} kcal`,
    ],
  };
}

/**
 * Cálculo completo de la valoración.
 * @param {{pesoKg,alturaCm,edad,sexo, grasaPct?, nivelId, objetivoId}} p
 * @returns desglose transparente con bmr, tdee y meta.
 */
export function calcularValoracion(p) {
  const { nivelId, objetivoId, grasaPct } = p;
  const nivel = nivelPorId(nivelId);
  const objetivo = objetivoPorId(objetivoId);
  if (!nivel) throw new Error(`Nivel de actividad desconocido: ${nivelId}`);
  if (!objetivo) throw new Error(`Objetivo desconocido: ${objetivoId}`);

  // Prioriza Katch-McArdle si hay % de grasa válido; si no, Mifflin.
  const usaKatch = typeof grasaPct === 'number' && grasaPct > 0 && grasaPct < 70;
  const bmrCalc = usaKatch ? bmrKatch(p) : bmrMifflin(p);

  const tdee = bmrCalc.bmr * nivel.factor;
  const meta = tdee * objetivo.ajuste;

  return {
    bmr: bmrCalc,
    actividad: { id: nivel.id, etiqueta: nivel.etiqueta, factor: nivel.factor },
    objetivo: { id: objetivo.id, etiqueta: objetivo.etiqueta, ajuste: objetivo.ajuste },
    tdee: r(tdee),
    tdeeFormula: `${bmrCalc.bmr} × ${nivel.factor} (${nivel.etiqueta.split(' ')[0].toLowerCase()}) = ${r(tdee)} kcal`,
    metaKcal: r(meta),
    metaFormula: `${r(tdee)} × ${objetivo.ajuste} (${objetivo.etiqueta.toLowerCase()}) = ${r(meta)} kcal`,
  };
}

export const _redondear = r;

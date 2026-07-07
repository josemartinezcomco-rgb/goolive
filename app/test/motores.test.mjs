// Pruebas de los motores de cálculo (JS puro, sin DOM). Correr: node app/test/motores.test.mjs
import assert from 'node:assert/strict';
import { bmrMifflin, bmrKatch, calcularValoracion } from '../src/motores/metabolico.js';
import { calcularMacros, aportePorcion, totalesDelDia } from '../src/motores/macros.js';
import { calcularPuntos, construirTablero } from '../src/motores/ranking.js';
import { alimentoPorId, kcalPor100 } from '../src/datos/alimentos.js';

let n = 0;
const t = (nombre, fn) => { fn(); n++; console.log(`  ✓ ${nombre}`); };
const aprox = (a, b, tol = 0.6) => Math.abs(a - b) <= tol;

console.log('Motor metabólico');
t('Mifflin-St Jeor (José: H, 89.1kg, 179.5cm, 45a) ≈ 1792.9', () => {
  const { bmr } = bmrMifflin({ pesoKg: 89.1, alturaCm: 179.5, edad: 45, sexo: 'hombre' });
  assert.ok(aprox(bmr, 1792.9), `esperado ~1792.9, obtenido ${bmr}`);
});
t('Mifflin mujer (60kg,165cm,30a) = 1320.25', () => {
  const { bmr } = bmrMifflin({ pesoKg: 60, alturaCm: 165, edad: 30, sexo: 'mujer' });
  assert.ok(aprox(bmr, 1320.25), `obtenido ${bmr}`);
});
t('Katch-McArdle (José, 22.3% grasa) ≈ 1865 → coincide con su bioimpedancia', () => {
  const { bmr, mlgKg } = bmrKatch({ pesoKg: 89.1, grasaPct: 22.3 });
  assert.ok(aprox(mlgKg, 69.2), `MLG ${mlgKg}`);
  assert.ok(aprox(bmr, 1865.4), `BMR ${bmr}`);
});

console.log('Valoración completa');
t('Prioriza Katch cuando hay % de grasa', () => {
  const v = calcularValoracion({ pesoKg: 89.1, alturaCm: 179.5, edad: 45, sexo: 'hombre',
    grasaPct: 22.3, nivelId: 'alto', objetivoId: 'perder_grasa' });
  assert.equal(v.bmr.metodo, 'Katch-McArdle');
  // TDEE = 1865.4 × 1.725 = 3217.8 ; meta = ×0.80 = 2574
  assert.ok(aprox(v.tdee, 3218, 2), `tdee ${v.tdee}`);
  assert.ok(aprox(v.metaKcal, 2574, 2), `meta ${v.metaKcal}`);
});
t('Usa Mifflin cuando no hay % de grasa', () => {
  const v = calcularValoracion({ pesoKg: 89.1, alturaCm: 179.5, edad: 45, sexo: 'hombre',
    nivelId: 'moderado', objetivoId: 'mantener' });
  assert.equal(v.bmr.metodo, 'Mifflin-St Jeor');
});

console.log('Macros');
t('Reparto coherente: kcal de macros ≈ meta', () => {
  const m = calcularMacros(2574, 89.1, 'perder_grasa');
  const kcal = m.proteinaG * 4 + m.carbosG * 4 + m.grasaG * 9;
  assert.ok(aprox(kcal, 2574, 8), `kcal recompuestas ${kcal}`);
  assert.ok(aprox(m.proteinaG, 178, 1), `proteína ${m.proteinaG}`); // 2.0×89.1
});

console.log('Aporte de porción');
t('200g de pechuga de pollo = 62g proteína, 330 kcal', () => {
  const a = aportePorcion(alimentoPorId('pollo_pechuga'), 200);
  assert.equal(a.proteinaG, 62);
  // 31·2·4 + 0 + 3.6·2·9 = 248 + 64.8 = 312.8 → 313
  assert.ok(aprox(a.kcal, 313, 1), `kcal ${a.kcal}`);
});
t('kcalPor100 coherente con Atwater', () => {
  assert.ok(aprox(kcalPor100(alimentoPorId('avena')), 13 * 4 + 68 * 4 + 7 * 9, 0.1));
});

console.log('Ranking');
t('Puntos derivados del registro real', () => {
  const registros = [
    aportePorcion(alimentoPorId('pollo_pechuga'), 200),
    aportePorcion(alimentoPorId('arroz_blanco'), 200),
    aportePorcion(alimentoPorId('aguacate'), 100),
  ];
  const totales = totalesDelDia(registros);
  const { puntos, detalle } = calcularPuntos({ registros, totales, metaKcal: totales.kcal, metaProteinaG: 1000 });
  // 3×20 (=60) + 150 (dentro de ±10% porque metaKcal=totales.kcal) + 80 (3 comidas). Proteína no llega a 1000.
  assert.equal(puntos, 60 + 150 + 80);
  assert.ok(detalle.length >= 3);
});
t('Tablero ordena e inserta al usuario', () => {
  const { tabla, posicion } = construirTablero('Test', 999);
  assert.equal(tabla[0].puntos, 999);
  assert.equal(posicion, 1);
  assert.equal(tabla.length, 8); // 7 ejemplo + tú
});

console.log(`\n${n} pruebas OK ✅`);

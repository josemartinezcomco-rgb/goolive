// Motor de ranking. Los puntos del usuario se DERIVAN de su registro real del día
// (no son un número arbitrario). El resto del tablero son usuarios de ejemplo,
// marcados como tales (ejemplo:true) — honestidad: no fingimos una comunidad real
// hasta que exista backend multiusuario.

/**
 * Puntos del día a partir del registro y las metas.
 * - 20 pts por cada alimento registrado
 * - +120 si alcanza la meta de proteína
 * - +150 si queda dentro de ±10% de la meta calórica
 * - +80 si registra 3 o más comidas
 */
export function calcularPuntos({ registros, totales, metaKcal, metaProteinaG }) {
  const nItems = registros.length;
  let puntos = nItems * 20;
  const detalle = [{ concepto: `${nItems} alimento(s) × 20`, pts: nItems * 20 }];

  if (metaProteinaG && totales.proteinaG >= metaProteinaG) {
    puntos += 120;
    detalle.push({ concepto: 'Meta de proteína alcanzada', pts: 120 });
  }
  if (metaKcal) {
    const dentro = Math.abs(totales.kcal - metaKcal) <= metaKcal * 0.1;
    if (dentro) {
      puntos += 150;
      detalle.push({ concepto: 'Dentro de ±10% de la meta calórica', pts: 150 });
    }
  }
  if (nItems >= 3) {
    puntos += 80;
    detalle.push({ concepto: '3+ comidas registradas', pts: 80 });
  }
  return { puntos, detalle };
}

// Tablero de ejemplo (NO son personas reales; se reemplaza con backend en fase 2).
export const USUARIOS_EJEMPLO = [
  { nombre: 'Ana', puntos: 460, ejemplo: true },
  { nombre: 'Carlos', puntos: 420, ejemplo: true },
  { nombre: 'Diana', puntos: 390, ejemplo: true },
  { nombre: 'Sofía', puntos: 350, ejemplo: true },
  { nombre: 'Miguel', puntos: 300, ejemplo: true },
  { nombre: 'Laura', puntos: 260, ejemplo: true },
  { nombre: 'Pedro', puntos: 210, ejemplo: true },
];

/**
 * Inserta al usuario (con sus puntos reales) en el tablero y lo ordena.
 * @returns {{tabla: Array, posicion:number}}
 */
export function construirTablero(nombreUsuario, puntosUsuario) {
  const yo = { nombre: nombreUsuario || 'Tú', puntos: puntosUsuario, tu: true };
  const tabla = [...USUARIOS_EJEMPLO, yo]
    .sort((a, b) => b.puntos - a.puntos)
    .map((u, i) => ({ ...u, pos: i + 1 }));
  const posicion = tabla.find((u) => u.tu).pos;
  return { tabla, posicion };
}

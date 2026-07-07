// Controlador de la UI. Une motores + datos + persistencia con el DOM.
import { NIVELES_ACTIVIDAD, OBJETIVOS } from '../datos/actividad.js';
import { ALIMENTOS, alimentoPorId } from '../datos/alimentos.js';
import { calcularValoracion } from '../motores/metabolico.js';
import { calcularMacros, totalesDelDia, aportePorcion } from '../motores/macros.js';
import { calcularPuntos, construirTablero } from '../motores/ranking.js';
import * as store from '../persistencia/store.js';

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));
const el = (tag, attrs = {}, ...kids) => {
  const n = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'class') n.className = v;
    else if (k === 'html') n.innerHTML = v;
    else if (k.startsWith('on')) n.addEventListener(k.slice(2), v);
    else n.setAttribute(k, v);
  });
  kids.forEach((c) => n.append(c));
  return n;
};

let perfil = store.cargarPerfil();
let registros = store.cargarRegistro();

// ---------- Navegación ----------
function mostrarVista(id) {
  $$('.vista').forEach((v) => v.classList.toggle('activa', v.id === id));
  $$('.nav-btn').forEach((b) => b.classList.toggle('activo', b.dataset.vista === id));
}

// ---------- Valoración ----------
function initValoracion() {
  const selNivel = $('#nivel');
  const selObjetivo = $('#objetivo');
  NIVELES_ACTIVIDAD.forEach((n) => selNivel.append(el('option', { value: n.id }, n.etiqueta)));
  OBJETIVOS.forEach((o) => selObjetivo.append(el('option', { value: o.id }, o.etiqueta)));

  if (perfil) {
    $('#edad').value = perfil.edad;
    $('#altura').value = perfil.alturaCm;
    $('#peso').value = perfil.pesoKg;
    $('#grasa').value = perfil.grasaPct ?? '';
    $(`input[name=sexo][value=${perfil.sexo}]`).checked = true;
    selNivel.value = perfil.nivelId;
    selObjetivo.value = perfil.objetivoId;
    renderResultadoValoracion();
  }

  $('#form-valoracion').addEventListener('submit', (e) => {
    e.preventDefault();
    const grasaRaw = parseFloat($('#grasa').value);
    perfil = {
      edad: parseInt($('#edad').value, 10),
      alturaCm: parseFloat($('#altura').value),
      pesoKg: parseFloat($('#peso').value),
      grasaPct: isNaN(grasaRaw) ? undefined : grasaRaw,
      sexo: $('input[name=sexo]:checked').value,
      nivelId: selNivel.value,
      objetivoId: selObjetivo.value,
    };
    store.guardarPerfil(perfil);
    renderResultadoValoracion();
    renderHoy();
    renderRanking();
  });
}

function metasActuales() {
  if (!perfil) return null;
  const val = calcularValoracion(perfil);
  const macros = calcularMacros(val.metaKcal, perfil.pesoKg, perfil.objetivoId);
  return { val, macros };
}

function renderResultadoValoracion() {
  const cont = $('#resultado-valoracion');
  const m = metasActuales();
  if (!m) return;
  const { val, macros } = m;
  cont.innerHTML = '';
  cont.append(
    el('div', { class: 'meta-grande' },
      el('span', { class: 'meta-num' }, String(val.metaKcal)),
      el('span', { class: 'meta-unidad' }, 'kcal / día')
    ),
    el('div', { class: 'macro-row' },
      chip('Proteína', macros.proteinaG, 'g', 'p'),
      chip('Carbos', macros.carbosG, 'g', 'c'),
      chip('Grasa', macros.grasaG, 'g', 'g')
    ),
    botonTransparencia(val, macros)
  );
}

function chip(label, val, unidad, cls) {
  return el('div', { class: `chip chip-${cls}` },
    el('span', { class: 'chip-label' }, label),
    el('span', { class: 'chip-val' }, `${val} ${unidad}`)
  );
}

function botonTransparencia(val, macros) {
  const detalle = el('div', { class: 'transp-detalle', hidden: 'true' },
    seccion(`${val.bmr.metodo} → BMR = ${val.bmr.bmr} kcal`, val.bmr.pasos),
    seccion('TDEE (gasto total)', [val.tdeeFormula]),
    seccion('Meta calórica', [val.metaFormula]),
    seccion('Reparto de macros', [macros.desglose.proteina, macros.desglose.grasa, macros.desglose.carbos])
  );
  const btn = el('button', {
    class: 'btn-transp', type: 'button',
    onclick: () => { detalle.hidden = !detalle.hidden; btn.classList.toggle('abierto'); },
  }, '🔍 Ver la fórmula exacta (sin cajas negras)');
  return el('div', {}, btn, detalle);
}

function seccion(titulo, lineas) {
  return el('div', { class: 'transp-sec' },
    el('h4', {}, titulo),
    el('ul', {}, ...lineas.map((l) => el('li', {}, l)))
  );
}

// ---------- Hoy ----------
function initHoy() {
  const sel = $('#alimento');
  ALIMENTOS.forEach((a) => sel.append(el('option', { value: a.id }, `${a.nombre} · ${a.cat}`)));
  $('#form-comida').addEventListener('submit', (e) => {
    e.preventDefault();
    const alimento = alimentoPorId(sel.value);
    const gramos = parseFloat($('#gramos').value);
    if (!alimento || !gramos || gramos <= 0) return;
    registros.push(aportePorcion(alimento, gramos));
    store.guardarRegistro(registros);
    $('#gramos').value = '';
    renderHoy();
    renderRanking();
  });
}

function renderHoy() {
  const cont = $('#lista-comidas');
  const t = totalesDelDia(registros);
  cont.innerHTML = '';
  registros.forEach((rgs, i) => {
    cont.append(el('div', { class: 'comida' },
      el('div', { class: 'comida-info' },
        el('strong', {}, rgs.nombre),
        el('span', { class: 'muted' }, ` · ${rgs.gramos} g`)
      ),
      el('div', { class: 'comida-macros' },
        el('span', {}, `${rgs.kcal} kcal`),
        el('span', { class: 'muted' }, ` P${rgs.proteinaG} C${rgs.carbosG} G${rgs.grasaG}`)
      ),
      el('button', { class: 'btn-x', onclick: () => quitarComida(i) }, '✕')
    ));
  });

  const m = metasActuales();
  const resumen = $('#resumen-hoy');
  if (!m) {
    resumen.innerHTML = '<p class="muted">Completa tu valoración para ver tu progreso vs. tu meta.</p>';
    return;
  }
  const pct = Math.min(100, Math.round((t.kcal / m.val.metaKcal) * 100));
  resumen.innerHTML = '';
  resumen.append(
    el('div', { class: 'progreso' },
      el('div', { class: 'progreso-txt' }, `${t.kcal} / ${m.val.metaKcal} kcal (${pct}%)`),
      el('div', { class: 'barra' }, el('div', { class: 'barra-fill', style: `width:${pct}%` }))
    ),
    barraMacro('Proteína', t.proteinaG, m.macros.proteinaG, 'p'),
    barraMacro('Carbos', t.carbosG, m.macros.carbosG, 'c'),
    barraMacro('Grasa', t.grasaG, m.macros.grasaG, 'g')
  );
}

function barraMacro(label, actual, meta, cls) {
  const pct = meta ? Math.min(100, Math.round((actual / meta) * 100)) : 0;
  return el('div', { class: 'macro-linea' },
    el('div', { class: 'macro-linea-top' },
      el('span', {}, label),
      el('span', { class: 'muted' }, `${Math.round(actual)} / ${meta} g`)
    ),
    el('div', { class: 'barra barra-sm' }, el('div', { class: `barra-fill fill-${cls}`, style: `width:${pct}%` }))
  );
}

function quitarComida(i) {
  registros.splice(i, 1);
  store.guardarRegistro(registros);
  renderHoy();
  renderRanking();
}

// ---------- Ranking ----------
function renderRanking() {
  const cont = $('#tabla-ranking');
  const m = metasActuales();
  const t = totalesDelDia(registros);
  const metaProteinaG = m ? m.macros.proteinaG : null;
  const metaKcal = m ? m.val.metaKcal : null;
  const { puntos, detalle } = calcularPuntos({ registros, totales: t, metaKcal, metaProteinaG });
  const { tabla, posicion } = construirTablero(perfil?.nombre || 'Tú', puntos);

  cont.innerHTML = '';
  cont.append(el('p', { class: 'muted small' },
    `Tu puntaje se calcula de tu registro real. Los demás son usuarios de ejemplo (se reemplazan con la comunidad real cuando exista backend).`));

  tabla.forEach((u) => {
    cont.append(el('div', { class: `fila-rank ${u.tu ? 'tu-fila' : ''}` },
      el('span', { class: 'rank-pos' }, `#${u.pos}`),
      el('span', { class: 'rank-nombre' }, u.tu ? `${u.nombre} (tú)` : u.nombre + (u.ejemplo ? ' · ejemplo' : '')),
      el('span', { class: 'rank-pts' }, `${u.puntos} pts`)
    ));
  });

  const desg = $('#detalle-puntos');
  desg.innerHTML = '';
  desg.append(el('h4', {}, `Tus ${puntos} puntos, desglosados`),
    el('ul', {}, ...detalle.map((d) => el('li', {}, `${d.concepto}: +${d.pts}`))));
}

// ---------- Arranque ----------
function init() {
  $$('.nav-btn').forEach((b) => b.addEventListener('click', () => mostrarVista(b.dataset.vista)));
  $('#tema-toggle').addEventListener('click', () => {
    const root = document.documentElement;
    const actual = root.getAttribute('data-theme') || 'light';
    root.setAttribute('data-theme', actual === 'light' ? 'dark' : 'light');
  });
  $('#btn-reset').addEventListener('click', () => {
    if (!confirm('¿Borrar tu perfil y registro guardados?')) return;
    store.limpiarTodo();
    perfil = null; registros = [];
    location.reload();
  });
  initValoracion();
  initHoy();
  renderHoy();
  renderRanking();
  mostrarVista('vista-valoracion');
}

document.addEventListener('DOMContentLoaded', init);

// Persistencia local (MVP, mono-usuario). Guarda perfil y registro del día en
// localStorage. En fase 2 esto se reemplaza por llamadas a la API del backend.
// Guardas de entorno para poder importar el módulo también en Node (tests).

const KEY_PERFIL = 'goolive.perfil';
const KEY_REGISTRO = 'goolive.registro';

const hayLocalStorage = () =>
  typeof globalThis !== 'undefined' && typeof globalThis.localStorage !== 'undefined';

export function guardarPerfil(perfil) {
  if (!hayLocalStorage()) return;
  localStorage.setItem(KEY_PERFIL, JSON.stringify(perfil));
}

export function cargarPerfil() {
  if (!hayLocalStorage()) return null;
  const raw = localStorage.getItem(KEY_PERFIL);
  return raw ? JSON.parse(raw) : null;
}

export function guardarRegistro(registros) {
  if (!hayLocalStorage()) return;
  localStorage.setItem(KEY_REGISTRO, JSON.stringify(registros));
}

export function cargarRegistro() {
  if (!hayLocalStorage()) return [];
  const raw = localStorage.getItem(KEY_REGISTRO);
  return raw ? JSON.parse(raw) : [];
}

export function limpiarTodo() {
  if (!hayLocalStorage()) return;
  localStorage.removeItem(KEY_PERFIL);
  localStorage.removeItem(KEY_REGISTRO);
}

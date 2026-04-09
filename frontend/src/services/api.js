// ============================================================
// SERVICIO: api.js
// Aquí centralizamos todas las llamadas al backend Laravel.
// En vez de escribir fetch() en cada componente, lo hacemos
// aquí una vez y lo reutilizamos en toda la app.
// ============================================================

// URL base del backend Laravel
const API_URL = 'http://localhost:8000/api';

/**
 * Función auxiliar para hacer peticiones HTTP.
 * Añade automáticamente el token de autenticación si existe.
 */
async function fetchAPI(endpoint, options = {}) {
  // Obtenemos el token guardado en localStorage (si el usuario está logueado)
  const token = localStorage.getItem('token');

  // Configuración de la petición
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      // Si hay token, lo añadimos a la cabecera (así Laravel sabe quién somos)
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);
  const data = await response.json();

  // Si hay error de autenticación (token caducado), limpiamos la sesión
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = '/login';
  }

  return { ok: response.ok, status: response.status, data };
}

// ── AUTENTICACIÓN ─────────────────────────────────────────────

/**
 * Registra un nuevo usuario
 * @param {Object} datos - { nombre, apellidos, email, password, password_confirmation, rol, ciudad }
 */
export async function registrar(datos) {
  return fetchAPI('/register', {
    method: 'POST',
    body: JSON.stringify(datos),
  });
}

/**
 * Inicia sesión
 * @param {string} email
 * @param {string} password
 */
export async function login(email, password) {
  const resultado = await fetchAPI('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  // Si el login es correcto, guardamos el token y los datos del usuario
  if (resultado.ok) {
    localStorage.setItem('token', resultado.data.token);
    localStorage.setItem('usuario', JSON.stringify(resultado.data.usuario));
  }

  return resultado;
}

/**
 * Cierra la sesión del usuario
 */
export async function logout() {
  await fetchAPI('/logout', { method: 'POST' });
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
}

// ── ANUNCIOS ──────────────────────────────────────────────────

/**
 * Obtiene todos los anuncios (con filtros opcionales)
 * @param {Object} filtros - { asignatura, ciudad, precio_max }
 */
export async function getAnuncios(filtros = {}) {
  // Convertimos los filtros a parámetros de URL: ?asignatura=Mates&ciudad=Madrid
  const params = new URLSearchParams(filtros).toString();
  return fetchAPI(`/anuncios${params ? '?' + params : ''}`);
}

/**
 * Obtiene un anuncio concreto por su ID
 */
export async function getAnuncio(id) {
  return fetchAPI(`/anuncios/${id}`);
}

/**
 * Crea un nuevo anuncio (solo profesores)
 */
export async function crearAnuncio(datos) {
  return fetchAPI('/anuncios', {
    method: 'POST',
    body: JSON.stringify(datos),
  });
}

// ── RESERVAS ──────────────────────────────────────────────────

/**
 * Obtiene las reservas del usuario autenticado
 */
export async function getMisReservas() {
  return fetchAPI('/reservas');
}

/**
 * Crea una nueva reserva
 */
export async function crearReserva(datos) {
  return fetchAPI('/reservas', {
    method: 'POST',
    body: JSON.stringify(datos),
  });
}

/**
 * Cancela una reserva
 */
export async function cancelarReserva(id) {
  return fetchAPI(`/reservas/${id}/cancelar`, { method: 'POST' });
}

// ── UTILIDADES ────────────────────────────────────────────────

/**
 * Devuelve el usuario guardado en localStorage
 * Uso: const usuario = getUsuarioActual()
 */
export function getUsuarioActual() {
  const usuario = localStorage.getItem('usuario');
  return usuario ? JSON.parse(usuario) : null;
}

/**
 * Comprueba si hay un usuario logueado
 */
export function estaLogueado() {
  return !!localStorage.getItem('token');
}

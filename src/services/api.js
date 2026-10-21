// Cliente HTTP único para hablar con el back (Spring Boot en :8080).
// Mientras se arman las pantallas, los datos salen de los JSON de /public/data,
// que respetan exactamente los DTOs del back. Se piden con el mismo fetch que la API real.
// Para pegarle al back: crear `.env.local` con VITE_USE_MOCK=false

export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

export async function apiFetch(path, { method = 'GET', body, token, base = API_URL } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${base}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    // El back responde con ApiError { timestamp, status, error, message, path, detalles }
    const error = await res.json().catch(() => ({}));
    const detalle = error.detalles?.length ? `: ${error.detalles.join(', ')}` : '';
    throw new Error(`${error.message || `Error ${res.status} al llamar a ${path}`}${detalle}`);
  }

  return res.status === 204 ? null : res.json();
}

// GET de datos: en modo mock lee /data/<archivo>.json, si no llama al endpoint real
export const getJson = (mockFile, endpoint, opciones) =>
  USE_MOCK ? apiFetch(`/data/${mockFile}`, { ...opciones, base: '' }) : apiFetch(endpoint, opciones);

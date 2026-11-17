// En desarrollo se usa el proxy de Vite (ruta relativa).
// En producción define VITE_API_URL con la dirección del servidor.
const BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')
const CLAVE_SESION = 'buildtech-admin-token'

export class ErrorApi extends Error {
  constructor(mensaje, estado) {
    super(mensaje)
    this.estado = estado
  }
}

// ---------- Clave de administrador (solo mientras la pestaña esté abierta) ----------
export function leerToken() {
  try {
    return sessionStorage.getItem(CLAVE_SESION) ?? ''
  } catch {
    return ''
  }
}

export function guardarToken(token) {
  try {
    sessionStorage.setItem(CLAVE_SESION, token)
  } catch {
    // Si el navegador bloquea el almacenamiento, la sesión dura solo en memoria
  }
}

export function borrarToken() {
  try {
    sessionStorage.removeItem(CLAVE_SESION)
  } catch {
    // nada que borrar
  }
}

// ---------- Llamadas a la API ----------
async function pedir(ruta, token, opciones = {}) {
  let respuesta
  try {
    respuesta = await fetch(`${BASE}${ruta}`, {
      ...opciones,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
  } catch {
    throw new ErrorApi('No se pudo conectar con el servidor.', 0)
  }

  let datos = null
  try {
    datos = await respuesta.json()
  } catch {
    // la respuesta no traía JSON
  }

  if (!respuesta.ok) {
    throw new ErrorApi(datos?.error ?? 'Ocurrió un error inesperado.', respuesta.status)
  }
  return datos
}

export const listarCotizaciones = (token) =>
  pedir('/api/quotes?limit=500', token)

export const cambiarEstado = (token, id, estado) =>
  pedir(`/api/quotes/${id}`, token, {
    method: 'PATCH',
    body: JSON.stringify({ estado }),
  })
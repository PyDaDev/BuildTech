import { enlaceWhatsApp } from './quote'
import { WHATSAPP_NUMBER } from '../config'

// En desarrollo se usa el proxy de Vite (ruta relativa).
// En producción define VITE_API_URL con la dirección del servidor.
const BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

async function guardarCotizacion(datos) {
  try {
    const respuesta = await fetch(`${BASE}/api/quotes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
      keepalive: true,
    })
    return respuesta.ok
  } catch {
    return false
  }
}

// Abre WhatsApp con la cotización y la guarda en el servidor
export function solicitarCotizacion({ cliente, texto, total, cantidad }) {
  window.open(enlaceWhatsApp(WHATSAPP_NUMBER, texto), '_blank', 'noopener')

  // No esperamos la respuesta: WhatsApp es el canal principal
  guardarCotizacion({
    cliente,
    total: Math.round(total),
    cantidad,
    mensaje: texto,
  })
}
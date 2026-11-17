import crypto from 'node:crypto'
import rateLimit from 'express-rate-limit'

const hash = (texto) => crypto.createHash('sha256').update(texto).digest()

if (process.env.ADMIN_TOKEN && process.env.ADMIN_TOKEN.length < 16) {
  console.warn(
    'Aviso: el ADMIN_TOKEN es corto. Usa una clave de al menos 16 caracteres (mejor 32).',
  )
}

// Cuenta solo los intentos fallidos (respuesta 401): 10 cada 15 minutos por IP.
// Con el límite superado, la IP recibe 429 aunque use la clave correcta.
const limitarIntentos = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  requestWasSuccessful: (_req, res) => res.statusCode !== 401,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Demasiados intentos fallidos. Intenta de nuevo en 15 minutos.' },
})

// Exige "Authorization: Bearer <ADMIN_TOKEN>"
function verificarClave(req, res, next) {
  const esperado = process.env.ADMIN_TOKEN

  if (!esperado) {
    return res
      .status(503)
      .json({ error: 'El panel de administración no está configurado.' })
  }

  const cabecera = req.get('authorization') ?? ''
  const token = cabecera.startsWith('Bearer ') ? cabecera.slice(7) : ''

  // Comparación en tiempo constante (evita ataques por tiempo de respuesta)
  if (!crypto.timingSafeEqual(hash(token), hash(esperado))) {
    console.warn(`Intento fallido de acceso al panel desde ${req.ip}`)
    return res.status(401).json({ error: 'No autorizado.' })
  }

  next()
}

export const requireAdmin = [limitarIntentos, verificarClave]
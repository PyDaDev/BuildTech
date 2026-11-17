import crypto from 'node:crypto'

const hash = (texto) => crypto.createHash('sha256').update(texto).digest()

// Protege las rutas del panel: exige "Authorization: Bearer <ADMIN_TOKEN>"
export function requireAdmin(req, res, next) {
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
    return res.status(401).json({ error: 'No autorizado.' })
  }

  next()
}
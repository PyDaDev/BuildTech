import { Router } from 'express'
import db from '../db.js'
import { requireAdmin } from '../middleware/auth.js'

const router = Router()

export const ESTADOS = ['nueva', 'contactada', 'cerrada', 'descartada']

const insertar = db.prepare(`
  INSERT INTO quotes (nombre, telefono, ciudad, total, cantidad_items, mensaje)
  VALUES (@nombre, @telefono, @ciudad, @total, @cantidad_items, @mensaje)
`)
const porId = db.prepare('SELECT * FROM quotes WHERE id = ?')
const listarTodas = db.prepare('SELECT * FROM quotes ORDER BY id DESC LIMIT ?')
const listarPorEstado = db.prepare(
  'SELECT * FROM quotes WHERE estado = ? ORDER BY id DESC LIMIT ?',
)
const cambiarEstado = db.prepare('UPDATE quotes SET estado = ? WHERE id = ?')

const textoValido = (valor, min, max) =>
  typeof valor === 'string' &&
  valor.trim().length >= min &&
  valor.trim().length <= max

// ---------- Crear cotización (público) ----------
router.post('/', (req, res) => {
  const { cliente, total, cantidad, mensaje } = req.body ?? {}

  if (!textoValido(cliente?.nombre, 2, 80)) {
    return res.status(400).json({ error: 'El nombre no es válido.' })
  }

  const telefono = typeof cliente?.telefono === 'string' ? cliente.telefono.trim() : ''
  const digitos = telefono.replace(/\D/g, '')
  if (digitos.length < 7 || telefono.length > 20) {
    return res.status(400).json({ error: 'El teléfono no es válido.' })
  }

  const ciudad = typeof cliente?.ciudad === 'string' ? cliente.ciudad.trim() : ''
  if (ciudad.length > 80) {
    return res.status(400).json({ error: 'La ciudad es demasiado larga.' })
  }

  if (!Number.isInteger(total) || total < 0 || total > 1_000_000_000) {
    return res.status(400).json({ error: 'El total no es válido.' })
  }
  if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > 100) {
    return res.status(400).json({ error: 'La cantidad no es válida.' })
  }
  if (!textoValido(mensaje, 1, 6000)) {
    return res.status(400).json({ error: 'El detalle de la cotización no es válido.' })
  }

  const { lastInsertRowid } = insertar.run({
    nombre: cliente.nombre.trim(),
    telefono,
    ciudad: ciudad || null,
    total,
    cantidad_items: cantidad,
    mensaje: mensaje.trim(),
  })

  res.status(201).json({ id: Number(lastInsertRowid) })
})

// ---------- Listar cotizaciones (administrador) ----------
router.get('/', requireAdmin, (req, res) => {
  const { estado } = req.query
  const limite = Math.min(Math.max(Number(req.query.limit) || 100, 1), 500)

  if (estado !== undefined && !ESTADOS.includes(estado)) {
    return res.status(400).json({ error: 'Estado no válido.' })
  }

  const filas = estado
    ? listarPorEstado.all(estado, limite)
    : listarTodas.all(limite)

  res.json(filas)
})

// ---------- Cambiar el estado de una cotización (administrador) ----------
router.patch('/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id)
  const estado = req.body?.estado

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: 'Identificador no válido.' })
  }
  if (!ESTADOS.includes(estado)) {
    return res.status(400).json({ error: 'Estado no válido.' })
  }

  const { changes } = cambiarEstado.run(estado, id)
  if (changes === 0) {
    return res.status(404).json({ error: 'Cotización no encontrada.' })
  }

  res.json(porId.get(id))
})

export default router
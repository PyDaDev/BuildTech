import { Router } from 'express'
import db from '../db.js'
import { requireAdmin } from '../middleware/auth.js'

const router = Router()

export const ESTADOS = ['nueva', 'contactada', 'cerrada', 'descartada']

const ID_MAXIMO = 2_147_483_647

const COLUMNAS = `
  id, nombre, telefono, ciudad, total, cantidad_items, mensaje, estado,
  to_char(creada_en AT TIME ZONE 'UTC', 'YYYY-MM-DD HH24:MI:SS') AS creada_en
`

// Envuelve una ruta asíncrona para que cualquier error llegue al manejador de errores
const manejar = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)

const textoValido = (valor, min, max) =>
  typeof valor === 'string' &&
  valor.trim().length >= min &&
  valor.trim().length <= max

// ---------- Crear cotización (público) ----------
router.post(
  '/',
  manejar(async (req, res) => {
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
      return res
        .status(400)
        .json({ error: 'El detalle de la cotización no es válido.' })
    }

    const { rows } = await db.query(
      `INSERT INTO quotes (nombre, telefono, ciudad, total, cantidad_items, mensaje)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [cliente.nombre.trim(), telefono, ciudad || null, total, cantidad, mensaje.trim()],
    )

    res.status(201).json({ id: rows[0].id })
  }),
)

// ---------- Listar cotizaciones (administrador) ----------
router.get(
  '/',
  requireAdmin,
  manejar(async (req, res) => {
    const { estado } = req.query
    const limite = Math.min(Math.max(Number(req.query.limit) || 100, 1), 500)

    if (estado !== undefined && !ESTADOS.includes(estado)) {
      return res.status(400).json({ error: 'Estado no válido.' })
    }

    const { rows } = estado
      ? await db.query(
          `SELECT ${COLUMNAS} FROM quotes WHERE estado = $1 ORDER BY id DESC LIMIT $2`,
          [estado, limite],
        )
      : await db.query(
          `SELECT ${COLUMNAS} FROM quotes ORDER BY id DESC LIMIT $1`,
          [limite],
        )

    res.json(rows)
  }),
)

// ---------- Cambiar el estado de una cotización (administrador) ----------
router.patch(
  '/:id',
  requireAdmin,
  manejar(async (req, res) => {
    const id = Number(req.params.id)
    const estado = req.body?.estado

    if (!Number.isInteger(id) || id < 1 || id > ID_MAXIMO) {
      return res.status(400).json({ error: 'Identificador no válido.' })
    }
    if (!ESTADOS.includes(estado)) {
      return res.status(400).json({ error: 'Estado no válido.' })
    }

    const { rows } = await db.query(
      `UPDATE quotes SET estado = $1 WHERE id = $2 RETURNING ${COLUMNAS}`,
      [estado, id],
    )

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Cotización no encontrada.' })
    }

    res.json(rows[0])
  }),
)

export default router
import { Router } from 'express'
import db from '../db.js'
import { requireAdmin } from '../middleware/auth.js'

const router = Router()

export const ESTADOS = ['nueva', 'contactada', 'cerrada', 'descartada']
export const METODOS_PAGO = ['efectivo', 'transferencia']

const ID_MAXIMO = 2_147_483_647

const COLUMNAS = `
  id, nombre, telefono, direccion, ciudad, departamento, descripcion_domicilio,
  metodo_pago, total, cantidad_items, mensaje, estado,
  to_char(creada_en AT TIME ZONE 'UTC', 'YYYY-MM-DD HH24:MI:SS') AS creada_en
`

// Envuelve una ruta asíncrona para que cualquier error llegue al manejador de errores
const manejar = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)

// Devuelve el texto recortado, o '' si no es una cadena
const texto = (valor) => (typeof valor === 'string' ? valor.trim() : '')

const largoValido = (valor, min, max) => valor.length >= min && valor.length <= max

// ---------- Crear cotización (público) ----------
router.post(
  '/',
  manejar(async (req, res) => {
    const { cliente, total, cantidad, mensaje } = req.body ?? {}

    const nombre = texto(cliente?.nombre)
    const telefono = texto(cliente?.telefono)
    const direccion = texto(cliente?.direccion)
    const departamento = texto(cliente?.departamento)
    const ciudad = texto(cliente?.ciudad)
    const descripcion = texto(cliente?.descripcion)
    const pago = texto(cliente?.pago)
    const detalle = texto(mensaje)

    if (!largoValido(nombre, 2, 80)) {
      return res.status(400).json({ error: 'El nombre no es válido.' })
    }

    const digitos = telefono.replace(/\D/g, '')
    if (digitos.length < 7 || telefono.length > 20) {
      return res.status(400).json({ error: 'El teléfono no es válido.' })
    }

    if (!largoValido(direccion, 5, 150)) {
      return res.status(400).json({ error: 'La dirección es obligatoria.' })
    }
    if (!largoValido(departamento, 3, 40)) {
      return res.status(400).json({ error: 'El departamento es obligatorio.' })
    }
    if (!largoValido(ciudad, 2, 80)) {
      return res.status(400).json({ error: 'La ciudad es obligatoria.' })
    }
    if (!largoValido(descripcion, 10, 300)) {
      return res
        .status(400)
        .json({ error: 'La descripción del domicilio es obligatoria (mínimo 10 caracteres).' })
    }
    if (!METODOS_PAGO.includes(pago)) {
      return res
        .status(400)
        .json({ error: 'El método de pago debe ser efectivo o transferencia.' })
    }
    if (cliente?.acepta !== true) {
      return res.status(400).json({
        error: 'Debes aceptar la política de tratamiento de datos personales.',
      })
    }

    if (!Number.isInteger(total) || total < 0 || total > 1_000_000_000) {
      return res.status(400).json({ error: 'El total no es válido.' })
    }
    if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > 100) {
      return res.status(400).json({ error: 'La cantidad no es válida.' })
    }
    if (!largoValido(detalle, 1, 10000)) {
      return res
        .status(400)
        .json({ error: 'El detalle de la cotización no es válido.' })
    }

    const { rows } = await db.query(
      `INSERT INTO quotes
         (nombre, telefono, direccion, departamento, ciudad,
          descripcion_domicilio, metodo_pago, consentimiento_en,
          total, cantidad_items, mensaje)
       VALUES ($1, $2, $3, $4, $5, $6, $7, now(), $8, $9, $10)
       RETURNING id`,
      [
        nombre,
        telefono,
        direccion,
        departamento,
        ciudad,
        descripcion,
        pago,
        total,
        cantidad,
        detalle,
      ],
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
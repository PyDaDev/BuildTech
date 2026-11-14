import { construir } from './build'
import { servicios as catalogo } from '../data/services'
import { perifericos } from '../data/peripherals'

export const MAX_UNIDADES = 10

function resolverPC(item) {
  const pc = construir(item.sel, item.limite)
  const serviciosElegidos = catalogo.filter(
    (s) => s.incluido || item.servicios.includes(s.id),
  )
  const totalServicios = serviciosElegidos.reduce((suma, s) => suma + s.precio, 0)

  return {
    ...item,
    tipo: 'pc',
    pc,
    serviciosElegidos,
    totalServicios,
    totalFinal: pc.total + totalServicios,
  }
}

function resolverPeriferico(item) {
  const producto = perifericos.find((p) => p.id === item.productoId)
  if (!producto) throw new Error('Producto no encontrado')

  const cantidad = Math.max(1, Math.min(Number(item.cantidad) || 1, MAX_UNIDADES))

  return {
    ...item,
    tipo: 'periferico',
    producto,
    cantidad,
    totalFinal: producto.precio * cantidad,
  }
}

// Convierte un ítem guardado (solo ids) en un ítem completo con sus totales.
// Los ítems antiguos, sin "tipo", se tratan como PCs.
export function resolverItem(item) {
  return item.tipo === 'periferico' ? resolverPeriferico(item) : resolverPC(item)
}
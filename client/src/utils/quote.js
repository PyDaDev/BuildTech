import { formatCOP } from './format'
import { NOMBRE_TIENDA } from '../config'

export const USOS = {
  estudio: 'Estudio',
  trabajo: 'Trabajo',
  gaming: 'Gaming',
  diseno: 'Diseño y edición',
  programacion: 'Programación',
  profesional: 'Uso profesional',
}

const PRESUPUESTOS = {
  '0-2M': 'Menos de $2.000.000',
  '2-3M': '$2.000.000 – $3.000.000',
  '3-4M': '$3.000.000 – $4.000.000',
  '4-5M': '$4.000.000 – $5.000.000',
  '5M+': 'Más de $5.000.000',
}

const lineasCliente = (cliente) => [
  `Cliente: ${cliente.nombre}`,
  `Teléfono: ${cliente.telefono}`,
  cliente.ciudad ? `Ciudad: ${cliente.ciudad}` : null,
]

const lineasComponentes = (pc) => [
  `• Procesador: ${pc.cpu.nombre}`,
  `• Placa madre: ${pc.cpu.placa.nombre}`,
  `• RAM: ${pc.ram.nombre} ${pc.cpu.ram}`,
  `• Almacenamiento: ${pc.storage.nombre}`,
  `• Tarjeta gráfica: ${pc.gpu.nombre}`,
  `• Enfriamiento: ${pc.cooler.nombre}`,
  `• Fuente: ${pc.fuente.nombre}`,
  `• Gabinete: ${pc.caja.nombre}`,
]

const lineasServicios = (serviciosElegidos) =>
  serviciosElegidos.map(
    (s) => `• ${s.nombre}${s.precio ? ` (${formatCOP(s.precio)})` : ' (incluido)'}`,
  )

const unir = (lineas) => lineas.filter((l) => l !== null).join('\n')

// ---------- Cotización de un solo PC ----------
export function construirMensaje({
  cliente,
  pc,
  uso,
  presupuesto,
  serviciosElegidos,
  totalServicios,
  totalFinal,
}) {
  return unir([
    `*Cotización ${NOMBRE_TIENDA}*`,
    '',
    ...lineasCliente(cliente),
    '',
    `Uso: ${USOS[uso] ?? uso}`,
    `Presupuesto: ${PRESUPUESTOS[presupuesto] ?? presupuesto}`,
    '',
    '*Componentes*',
    ...lineasComponentes(pc),
    '',
    '*Servicios*',
    ...lineasServicios(serviciosElegidos),
    '',
    `Equipo: ${formatCOP(pc.total)}`,
    `Servicios: ${formatCOP(totalServicios)}`,
    `*TOTAL ESTIMADO: ${formatCOP(totalFinal)}*`,
    '',
    'Precios referenciales, sujetos a confirmación.',
  ])
}

// ---------- Cotización del carrito (PCs y periféricos) ----------
export function construirMensajeCarrito({ cliente, items, total }) {
  const pcs = items.filter((i) => i.tipo !== 'periferico')
  const perifericos = items.filter((i) => i.tipo === 'periferico')
  const unidades = perifericos.reduce((suma, i) => suma + i.cantidad, 0)
  const subtotalPerifericos = perifericos.reduce((suma, i) => suma + i.totalFinal, 0)

  const resumen = [
    pcs.length ? `${pcs.length} ${pcs.length === 1 ? 'equipo' : 'equipos'}` : null,
    unidades ? `${unidades} ${unidades === 1 ? 'periférico' : 'periféricos'}` : null,
  ]
    .filter(Boolean)
    .join(', ')

  const bloquesPC = pcs.flatMap((item, i) => [
    `*PC ${i + 1}: ${USOS[item.uso] ?? item.uso}*`,
    ...lineasComponentes(item.pc),
    '_Servicios:_',
    ...lineasServicios(item.serviciosElegidos),
    `Subtotal PC ${i + 1}: ${formatCOP(item.totalFinal)}`,
    '',
  ])

  const bloquePerifericos = perifericos.length
    ? [
        '*Periféricos*',
        ...perifericos.map(
          (i) => `• ${i.cantidad} x ${i.producto.nombre}: ${formatCOP(i.totalFinal)}`,
        ),
        `Subtotal periféricos: ${formatCOP(subtotalPerifericos)}`,
        '',
      ]
    : []

  return unir([
    `*Cotización ${NOMBRE_TIENDA}* (${resumen})`,
    '',
    ...lineasCliente(cliente),
    '',
    ...bloquesPC,
    ...bloquePerifericos,
    `*TOTAL ESTIMADO: ${formatCOP(total)}*`,
    '',
    'Precios referenciales, sujetos a confirmación.',
  ])
}

export const enlaceWhatsApp = (numero, texto) =>
  `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`
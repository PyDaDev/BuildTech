
const DIFERENCIA_MAXIMA = 3

export function evaluarEquilibrio(pc) {
  if (pc.gpu.integrada) return { ok: true, tipo: null, mensaje: '' }

  const diferencia = pc.gpu.nivel - pc.cpu.nivel

  if (diferencia >= DIFERENCIA_MAXIMA) {
    return {
      ok: false,
      tipo: 'cpu',
      mensaje: `El procesador ${pc.cpu.nombre} es de menor nivel que la ${pc.gpu.nombre} y puede limitar su rendimiento (cuello de botella). Considera un procesador más potente o una gráfica más modesta.`,
    }
  }

  if (-diferencia >= DIFERENCIA_MAXIMA) {
    return {
      ok: false,
      tipo: 'gpu',
      mensaje: `La ${pc.gpu.nombre} es de menor nivel que el procesador ${pc.cpu.nombre}. Estás invirtiendo mucho en el procesador y la gráfica puede quedarse corta, sobre todo para gaming y diseño.`,
    }
  }

  return { ok: true, tipo: null, mensaje: '' }
}
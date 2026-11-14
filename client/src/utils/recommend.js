import { cpus, rams, storages, gpus, psus, cases, coolers } from '../data/catalog'

// Tope de cada rango de presupuesto (COP)
const LIMITES = {
  '0-2M': 2000000,
  '2-3M': 3000000,
  '3-4M': 4000000,
  '4-5M': 5000000,
  '5M+': 6500000,
}

// Qué porcentaje del presupuesto va a cada componente según el uso
// (la fuente se calcula aparte, según la potencia necesaria)
const PESOS = {
  gaming:       { cpu: 0.30, gpu: 0.42, ram: 0.08, storage: 0.10, caja: 0.10 },
  estudio:      { cpu: 0.38, gpu: 0,    ram: 0.17, storage: 0.25, caja: 0.20 },
  trabajo:      { cpu: 0.38, gpu: 0,    ram: 0.18, storage: 0.24, caja: 0.20 },
  diseno:       { cpu: 0.28, gpu: 0.33, ram: 0.15, storage: 0.14, caja: 0.10 },
  programacion: { cpu: 0.36, gpu: 0.10, ram: 0.22, storage: 0.18, caja: 0.14 },
  profesional:  { cpu: 0.31, gpu: 0.30, ram: 0.17, storage: 0.13, caja: 0.09 },
}

const MARGEN = 0.95 // apuntamos al 95 % del tope para no quedar justos
const RESERVA_FUENTE = 200000
const TOLERANCIA = 1.5 // cuánto puede crecer un componente sobre su parte
const GPU_CENTRAL = 0.3 // desde este peso, la gráfica es protagonista del uso

const COOLER_ORIGINAL = coolers.find((c) => c.stock)
const COOLER_BASICO = coolers.find((c) => c.id === 'cooler-aire')
const GPU_DEDICADA_MIN = Math.min(
  ...gpus.filter((g) => !g.integrada).map((g) => g.precio),
)

// ---------- Enfriamiento ----------
// Si el procesador trae cooler se usa el original; si no, uno básico.
// Si el usuario ya eligió un cooler mejor, se respeta.
export function coolerPara(cpu, actual) {
  const porDefecto = cpu.coolerIncluido ? COOLER_ORIGINAL : COOLER_BASICO
  if (!actual || actual.stock) return porDefecto
  return actual
}

// ---------- Costos ----------
const costoCpu = (cpu) => cpu.precio + cpu.placa.precio
// Costo del procesador + placa + el cooler que necesite
const costoCpuEfectivo = (cpu) => costoCpu(cpu) + coolerPara(cpu).precio
const costoRam = (ram, cpu) => ram.precio[cpu.ram]

const costoDe = {
  cpu: (b) => costoCpu(b.cpu) + b.cooler.precio,
  gpu: (b) => b.gpu.precio,
  ram: (b) => costoRam(b.ram, b.cpu),
  storage: (b) => b.storage.precio,
  caja: (b) => b.caja.precio,
}

export const costoTotal = (b) =>
  costoDe.cpu(b) +
  costoDe.gpu(b) +
  costoDe.ram(b) +
  costoDe.storage(b) +
  costoDe.caja(b) +
  b.fuente.precio

// ---------- Listas ordenadas de menor a mayor costo ----------
const listas = {
  cpu: [...cpus].sort((a, b) => costoCpuEfectivo(a) - costoCpuEfectivo(b)),
  gpu: [...gpus].sort((a, b) => a.precio - b.precio),
  ram: [...rams].sort((a, b) => a.gb - b.gb),
  storage: [...storages].sort((a, b) => a.precio - b.precio),
  caja: [...cases].sort((a, b) => a.precio - b.precio),
}

// ---------- Compatibilidad ----------
export function elegirFuente(cpu, gpu) {
  const necesarios = (cpu.watts + gpu.watts + 100) * 1.6
  return psus.find((p) => p.watts >= necesarios) ?? psus[psus.length - 1]
}

function armar(partes) {
  return {
    ...partes,
    fuente: elegirFuente(partes.cpu, partes.gpu),
    cooler: coolerPara(partes.cpu, partes.cooler),
  }
}

// Los gráficos integrados solo sirven con un procesador que los tenga
const esValida = (b) => !(b.gpu.integrada && !b.cpu.igpu)

// El mejor que quepa en "maximo"; si ninguno cabe, el más barato
function elegir(lista, costo, maximo) {
  const cabe = lista.filter((x) => costo(x) <= maximo)
  return cabe.length ? cabe[cabe.length - 1] : lista[0]
}

// ---------- Función principal ----------
export function recomendar(uso, presupuesto) {
  const pesos = PESOS[uso] ?? PESOS.gaming
  const limite = LIMITES[presupuesto] ?? LIMITES['3-4M']
  const objetivo = limite * MARGEN
  const disponible = Math.max(objetivo - RESERVA_FUENTE, 0)

  // Si la gráfica no es protagonista y el presupuesto no alcanza para una
  // dedicada, exigimos un procesador con gráficos integrados (ej. Ryzen 5 5600G)
  const exigeIgpu =
    pesos.gpu < GPU_CENTRAL && disponible * pesos.gpu < GPU_DEDICADA_MIN
  const cpusPosibles = exigeIgpu ? listas.cpu.filter((c) => c.igpu) : listas.cpu

  // 1. Primera elección según el reparto
  const cpu = elegir(cpusPosibles, costoCpuEfectivo, disponible * pesos.cpu)
  const gpuValidas = listas.gpu.filter((g) => !g.integrada || cpu.igpu)

  let build = armar({
    cpu,
    gpu: elegir(gpuValidas, (g) => g.precio, disponible * pesos.gpu),
    ram: elegir(listas.ram, (r) => costoRam(r, cpu), disponible * pesos.ram),
    storage: elegir(listas.storage, (s) => s.precio, disponible * pesos.storage),
    caja: elegir(listas.caja, (c) => c.precio, disponible * pesos.caja),
  })

  // 2. Mejoras con lo que sobre (empezando por lo que más pesa en este uso)
  const orden = Object.keys(pesos)
    .filter((cat) => pesos[cat] > 0)
    .sort((a, b) => pesos[b] - pesos[a])

  let mejorado = true
  while (mejorado) {
    mejorado = false
    for (const cat of orden) {
      const lista = listas[cat]
      const i = lista.findIndex((x) => x.id === build[cat].id)
      const siguiente = lista[i + 1]
      if (!siguiente) continue

      const candidato = armar({ ...build, [cat]: siguiente })
      const cabeEnParte = costoDe[cat](candidato) <= disponible * pesos[cat] * TOLERANCIA

      if (esValida(candidato) && cabeEnParte && costoTotal(candidato) <= objetivo) {
        build = candidato
        mejorado = true
        break
      }
    }
  }

  const total = costoTotal(build)
  return {
    ...build,
    total,
    limite,
    dentroPresupuesto: total <= limite,
    excedente: Math.max(total - limite, 0),
  }
}
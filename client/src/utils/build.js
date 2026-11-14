import { cpus, rams, storages, gpus, cases, coolers } from '../data/catalog'
import { elegirFuente, costoTotal, coolerPara } from './recommend'

const porId = (lista, id) => lista.find((x) => x.id === id)

export function construir(sel, limite) {
  const cpu = porId(cpus, sel.cpu)
  const gpu = porId(gpus, sel.gpu)
  const ram = porId(rams, sel.ram)
  const storage = porId(storages, sel.storage)
  const caja = porId(cases, sel.caja)
  const cooler = coolerPara(cpu, porId(coolers, sel.cooler))

  const build = {
    cpu,
    gpu,
    ram,
    storage,
    caja,
    cooler,
    fuente: elegirFuente(cpu, gpu),
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

export const aSeleccion = (pc) => ({
  cpu: pc.cpu.id,
  gpu: pc.gpu.id,
  ram: pc.ram.id,
  storage: pc.storage.id,
  caja: pc.caja.id,
  cooler: pc.cooler.id,
})
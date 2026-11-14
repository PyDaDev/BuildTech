import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Cpu,
  MemoryStick,
  HardDrive,
  Monitor,
  Box,
  Fan,
  Check,
  AlertTriangle,
  Info,
} from 'lucide-react'
import WizardLayout from '../components/WizardLayout'
import ComponentSelect from '../components/ComponentSelect'
import { useWizard } from '../context/WizardContext'
import { cpus, rams, storages, gpus, cases, coolers } from '../data/catalog'
import { recomendar, coolerPara } from '../utils/recommend'
import { construir, aSeleccion } from '../utils/build'
import { evaluarEquilibrio } from '../utils/balance'
import { formatCOP } from '../utils/format'

export default function Customize() {
  const { uso, presupuesto, configuracion, setConfiguracion } = useWizard()
  const navigate = useNavigate()

  // Si el usuario entra directo a esta URL, calculamos la recomendación
  const base = configuracion ?? recomendar(uso, presupuesto)
  const limite = base.limite

  const [sel, setSel] = useState(() => aSeleccion(base))
  const [aviso, setAviso] = useState('')

  const build = useMemo(() => construir(sel, limite), [sel, limite])
  const equilibrio = useMemo(() => evaluarEquilibrio(build), [build])

  // Guardamos la configuración final para la pantalla 5
  useEffect(() => {
    setConfiguracion(build)
  }, [build, setConfiguracion])

  const cambiar = (categoria, id) => {
    const siguiente = { ...sel, [categoria]: id }
    let mensaje = ''

    if (categoria === 'cpu') {
      const anterior = cpus.find((c) => c.id === sel.cpu)
      const nuevo = cpus.find((c) => c.id === id)
      const gpuActual = gpus.find((g) => g.id === sel.gpu)
      const coolerActual = coolers.find((c) => c.id === sel.cooler)

      if (nuevo.socket !== anterior.socket) {
        mensaje = `Se ajustó la placa madre a ${nuevo.placa.nombre} y la RAM ahora es ${nuevo.ram}.`
      }

      // Sin gráficos integrados no se puede dejar la GPU integrada
      if (gpuActual.integrada && !nuevo.igpu) {
        siguiente.gpu = 'rx-6600'
        mensaje += ' Este procesador no tiene gráficos integrados, así que añadimos una tarjeta gráfica.'
      }

      // Ajuste del cooler según el procesador
      const coolerNuevo = coolerPara(nuevo, coolerActual)
      siguiente.cooler = coolerNuevo.id
      if (!nuevo.coolerIncluido && anterior.coolerIncluido) {
        mensaje += ' Este procesador no incluye cooler, así que añadimos uno.'
      }
    }

    setSel(siguiente)
    setAviso(mensaje.trim())
  }

  const cpuOpts = cpus.map((c) => ({
    value: c.id,
    label: `${c.nombre} · ${formatCOP(c.precio + c.placa.precio)}`,
  }))

  const ramOpts = rams.map((r) => ({
    value: r.id,
    label: `${r.nombre} ${build.cpu.ram} · ${formatCOP(r.precio[build.cpu.ram])}`,
  }))

  const storageOpts = storages.map((s) => ({
    value: s.id,
    label: `${s.nombre} · ${formatCOP(s.precio)}`,
  }))

  const gpuOpts = gpus.map((g) => ({
    value: g.id,
    label: `${g.nombre} · ${g.precio === 0 ? 'Incluidos' : formatCOP(g.precio)}`,
    disabled: g.integrada && !build.cpu.igpu,
  }))

  const coolerOpts = coolers.map((c) => ({
    value: c.id,
    label: `${c.nombre} · ${c.precio === 0 ? 'Incluido' : formatCOP(c.precio)}`,
    disabled: c.stock && !build.cpu.coolerIncluido,
  }))

  const caseOpts = cases.map((c) => ({
    value: c.id,
    label: `${c.nombre} · ${formatCOP(c.precio)}`,
  }))

  const porcentaje = Math.min((build.total / limite) * 100, 100)

  return (
    <WizardLayout
      step={4}
      onBack={() => navigate('/recomendacion')}
      onNext={() => navigate('/servicios')}
    >
      <main className="flex flex-1 flex-col gap-5 py-6">
        <h2 className="text-2xl font-extrabold uppercase sm:text-3xl">
          Personaliza tu PC
        </h2>

        <div className="grid gap-5 lg:grid-cols-[1fr_340px] lg:items-start">
          {/* Resumen del presupuesto (arriba en móvil, a la derecha en escritorio) */}
          <aside className="order-first rounded-2xl bg-white p-5 text-slate-800 shadow-xl lg:order-last">
            <p className="text-sm text-slate-500">Presupuesto disponible</p>
            <p className="text-2xl font-extrabold">{formatCOP(limite)}</p>

            <p className="mt-3 text-sm text-slate-500">Configuración actual</p>
            <p className="text-2xl font-extrabold text-brand">
              {formatCOP(build.total)}
            </p>

            {/* Barra de progreso */}
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className={`h-full rounded-full transition-all ${
                  build.dentroPresupuesto ? 'bg-green-500' : 'bg-amber-500'
                }`}
                style={{ width: `${porcentaje}%` }}
              />
            </div>

            <div
              className={`mt-4 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold ${
                build.dentroPresupuesto
                  ? 'bg-green-50 text-green-700'
                  : 'bg-amber-50 text-amber-700'
              }`}
            >
              {build.dentroPresupuesto ? (
                <>
                  <Check className="h-5 w-5 shrink-0" /> Dentro de tu presupuesto
                </>
              ) : (
                <>
                  <AlertTriangle className="h-5 w-5 shrink-0" /> Excede tu
                  presupuesto por {formatCOP(build.excedente)}
                </>
              )}
            </div>

            {/* Piezas que se ajustan solas */}
            <ul className="mt-4 space-y-1 border-t border-slate-200 pt-3 text-xs text-slate-500">
              <li>Placa madre: {build.cpu.placa.nombre} (incluida con el procesador)</li>
              <li>Fuente: {build.fuente.nombre} (según el consumo)</li>
            </ul>
          </aside>

          {/* Selectores */}
          <section className="rounded-2xl bg-white p-4 text-slate-800 shadow-xl sm:p-6">
            {aviso && (
              <div className="mb-2 flex items-start gap-2 rounded-xl bg-brand/10 px-3 py-2 text-sm text-brand-dark">
                <Info className="mt-0.5 h-5 w-5 shrink-0" />
                <p>{aviso}</p>
              </div>
            )}

            {!equilibrio.ok && (
              <div className="mb-2 flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-800">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                <p>
                  <span className="font-semibold">Configuración desequilibrada. </span>
                  {equilibrio.mensaje}
                </p>
              </div>
            )}

            <div className="divide-y divide-slate-200">
              <ComponentSelect
                icon={Cpu}
                label="Procesador"
                value={sel.cpu}
                onChange={(id) => cambiar('cpu', id)}
                options={cpuOpts}
                hint="El precio incluye la placa madre compatible."
              />
              <ComponentSelect
                icon={MemoryStick}
                label="RAM"
                value={sel.ram}
                onChange={(id) => cambiar('ram', id)}
                options={ramOpts}
              />
              <ComponentSelect
                icon={HardDrive}
                label="Almacenamiento"
                value={sel.storage}
                onChange={(id) => cambiar('storage', id)}
                options={storageOpts}
              />
              <ComponentSelect
                icon={Monitor}
                label="Tarjeta gráfica"
                value={sel.gpu}
                onChange={(id) => cambiar('gpu', id)}
                options={gpuOpts}
              />
              <ComponentSelect
                icon={Fan}
                label="Enfriamiento"
                value={sel.cooler}
                onChange={(id) => cambiar('cooler', id)}
                options={coolerOpts}
                hint={
                  build.cpu.coolerIncluido
                    ? 'Tu procesador ya trae cooler. Puedes mejorarlo si quieres.'
                    : 'Este procesador no incluye cooler, es obligatorio comprar uno.'
                }
              />
              <ComponentSelect
                icon={Box}
                label="Gabinete"
                value={sel.caja}
                onChange={(id) => cambiar('caja', id)}
                options={caseOpts}
              />
            </div>
          </section>
        </div>
      </main>
    </WizardLayout>
  )
}
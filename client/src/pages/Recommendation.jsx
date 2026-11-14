import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Trophy,
  Check,
  Cpu,
  CircuitBoard,
  MemoryStick,
  HardDrive,
  Monitor,
  Zap,
  Box,
  Fan,
} from 'lucide-react'
import WizardLayout from '../components/WizardLayout'
import { useWizard } from '../context/WizardContext'
import { recomendar } from '../utils/recommend'
import { evaluarEquilibrio } from '../utils/balance'
import { formatCOP } from '../utils/format'

function Verificacion({ ok = true, children }) {
  return (
    <li className="flex items-start gap-3">
      <span
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${
          ok ? 'bg-green-500' : 'bg-amber-500'
        }`}
      >
        {ok ? <Check className="h-4 w-4" /> : '!'}
      </span>
      <span className="text-sm font-medium sm:text-base">{children}</span>
    </li>
  )
}

export default function Recommendation() {
  const { uso, presupuesto, setConfiguracion } = useWizard()
  const navigate = useNavigate()

  const pc = useMemo(() => recomendar(uso, presupuesto), [uso, presupuesto])
  const equilibrio = useMemo(() => evaluarEquilibrio(pc), [pc])

  // Guardamos la configuración para usarla en la pantalla de personalización
  useEffect(() => {
    setConfiguracion(pc)
  }, [pc, setConfiguracion])

  const especificaciones = [
    { icon: Cpu, etiqueta: 'Procesador', valor: pc.cpu.nombre },
    { icon: CircuitBoard, etiqueta: 'Placa madre', valor: pc.cpu.placa.nombre },
    { icon: MemoryStick, etiqueta: 'RAM', valor: `${pc.ram.nombre} ${pc.cpu.ram}` },
    { icon: HardDrive, etiqueta: 'Almacenamiento', valor: pc.storage.nombre },
    { icon: Monitor, etiqueta: 'Tarjeta gráfica', valor: pc.gpu.nombre },
    { icon: Fan, etiqueta: 'Enfriamiento', valor: pc.cooler.nombre },
    { icon: Zap, etiqueta: 'Fuente', valor: pc.fuente.nombre },
    { icon: Box, etiqueta: 'Gabinete', valor: pc.caja.nombre },
  ]

  const actualizable = pc.cpu.socket === 'AM5'

  const textoEquilibrio = !pc.dentroPresupuesto
    ? `Supera tu presupuesto por ${formatCOP(pc.excedente)}`
    : !equilibrio.ok
      ? 'Revisa el equilibrio entre procesador y gráfica'
      : 'Equilibrado para tu uso'

  return (
    <WizardLayout
      step={3}
      onBack={() => navigate('/presupuesto')}
      onNext={() => navigate('/personalizar')}
    >
      <main className="flex flex-1 items-center py-6">
        <div className="w-full rounded-3xl bg-white p-5 text-slate-800 shadow-2xl sm:p-8">
          {/* Título */}
          <div className="flex items-center gap-3">
            <Trophy className="h-9 w-9 text-amber-500" />
            <h2 className="text-2xl font-extrabold sm:text-3xl">
              TU PC RECOMENDADO
            </h2>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr_auto] lg:items-center">
            {/* Imagen */}
            <div className="flex justify-center rounded-2xl bg-night p-3 sm:p-4">
              <img
                src="/pc-hero.png"
                alt="PC recomendado"
                className="max-h-32 w-auto object-contain sm:max-h-48"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            </div>

            {/* Especificaciones */}
            <ul className="grid gap-2">
              {especificaciones.map(({ icon: Icon, etiqueta, valor }) => (
                <li key={etiqueta} className="flex items-start gap-3 text-sm sm:text-base">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                  <span>
                    <span className="font-semibold">{etiqueta}:</span> {valor}
                  </span>
                </li>
              ))}
            </ul>

            {/* Verificaciones */}
            <ul className="grid gap-3 lg:max-w-60">
              <Verificacion>Compatible</Verificacion>
              <Verificacion ok={pc.dentroPresupuesto && equilibrio.ok}>
                {textoEquilibrio}
              </Verificacion>
              <Verificacion ok={actualizable}>
                {actualizable
                  ? 'Posibilidad de actualización'
                  : 'Actualización limitada'}
              </Verificacion>
            </ul>
          </div>

          {/* Precio y acción */}
          <div className="mt-6 flex flex-col items-center gap-4 border-t border-slate-200 pt-5 sm:flex-row sm:justify-between">
            <div className="rounded-xl bg-brand px-6 py-3 text-center text-lg font-bold text-white shadow-lg shadow-brand/40">
              Precio estimado: {formatCOP(pc.total)}
            </div>

            <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
              <span className="text-center text-sm text-slate-600">
                ¿Quieres modificar algún componente?
              </span>
              <button
                onClick={() => navigate('/personalizar')}
                className="min-h-11 rounded-xl border-2 border-brand px-5 py-2 text-sm font-bold text-brand transition hover:bg-brand hover:text-white"
              >
                PERSONALIZAR PC
              </button>
            </div>
          </div>
        </div>
      </main>
    </WizardLayout>
  )
}
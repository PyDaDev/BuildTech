import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PartyPopper, Headset, ShoppingCart } from 'lucide-react'
import WizardLayout from '../components/WizardLayout'
import ServiceItem from '../components/ServiceItem'
import QuoteModal from '../components/QuoteModal'
import { useWizard } from '../context/WizardContext'
import { useCart } from '../context/CartContext'
import { servicios as catalogo } from '../data/services'
import { recomendar } from '../utils/recommend'
import { aSeleccion } from '../utils/build'
import { construirMensaje, enlaceWhatsApp } from '../utils/quote'
import { formatCOP } from '../utils/format'
import { WHATSAPP_NUMBER } from '../config'

export default function Services() {
  const { uso, presupuesto, configuracion, servicios, setServicios } = useWizard()
  const { agregar, abrir } = useCart()
  const navigate = useNavigate()
  const [abierto, setAbierto] = useState(false)

  // Si el usuario entra directo a esta URL, calculamos la recomendación
  const pc = configuracion ?? recomendar(uso, presupuesto)

  const alternar = (id) =>
    setServicios((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )

  const serviciosElegidos = catalogo.filter(
    (s) => s.incluido || servicios.includes(s.id),
  )
  const totalServicios = serviciosElegidos.reduce((suma, s) => suma + s.precio, 0)
  const totalFinal = pc.total + totalServicios

  const enviarCotizacion = (cliente) => {
    const texto = construirMensaje({
      cliente,
      pc,
      uso,
      presupuesto,
      serviciosElegidos,
      totalServicios,
      totalFinal,
    })
    window.open(enlaceWhatsApp(WHATSAPP_NUMBER, texto), '_blank', 'noopener')
  }

  const agregarAlCarrito = () => {
    agregar({
      uso,
      presupuesto,
      limite: pc.limite,
      sel: aSeleccion(pc),
      servicios,
    })
    abrir()
  }

  return (
    <WizardLayout
      step={5}
      nextLabel="QUIERO MI PC"
      onBack={() => navigate('/personalizar')}
      onNext={() => setAbierto(true)}
    >
      <main className="flex flex-1 flex-col gap-5 py-6">
        {/* Título */}
        <div className="text-center">
          <h2 className="flex items-center justify-center gap-2 text-2xl font-extrabold uppercase sm:text-3xl">
            <PartyPopper className="h-8 w-8 shrink-0 text-accent" />
            Tu PC está casi listo
          </h2>
          <p className="mt-1 text-sm text-slate-200 sm:text-base">
            ¿Quieres que nosotros nos encarguemos del resto?
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_300px] lg:items-start">
          {/* Lista de servicios */}
          <section className="flex flex-col gap-2">
            {catalogo.map((s) => (
              <ServiceItem
                key={s.id}
                servicio={s}
                selected={servicios.includes(s.id)}
                onToggle={() => alternar(s.id)}
              />
            ))}
          </section>

          {/* Soporte */}
          <aside className="flex items-center gap-4 rounded-2xl border border-brand/40 bg-white/5 p-5 lg:flex-col lg:text-center">
            <Headset
              className="h-14 w-14 shrink-0 text-brand lg:h-24 lg:w-24"
              strokeWidth={1.2}
            />
            <div>
              <p className="font-bold">Soporte siempre contigo</p>
              <p className="mt-1 text-sm text-slate-300">
                Te acompañamos antes, durante y después de tu compra.
              </p>
            </div>
          </aside>
        </div>

        {/* Total */}
        <div className="rounded-2xl bg-black/30 px-4 py-4 sm:px-6">
          <dl className="space-y-1 text-sm text-slate-300">
            <div className="flex justify-between">
              <dt>Equipo</dt>
              <dd>{formatCOP(pc.total)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Servicios</dt>
              <dd>{formatCOP(totalServicios)}</dd>
            </div>
          </dl>
          <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4 border-t border-white/10 pt-3">
            <span className="text-base font-extrabold uppercase sm:text-xl">
              Total estimado:
            </span>
            <span className="text-2xl font-extrabold text-accent sm:text-3xl">
              {formatCOP(totalFinal)}
            </span>
          </div>

          <button
            onClick={agregarAlCarrito}
            className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-brand font-bold text-white transition hover:bg-brand"
          >
            <ShoppingCart className="h-5 w-5" />
            Agregar al carrito
          </button>
        </div>
      </main>

      {abierto && (
        <QuoteModal
          total={totalFinal}
          onClose={() => setAbierto(false)}
          onSubmit={enviarCotizacion}
        />
      )}
    </WizardLayout>
  )
}
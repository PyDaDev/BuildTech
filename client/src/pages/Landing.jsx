import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Cpu,
  GraduationCap,
  Briefcase,
  Gamepad2,
  Palette,
  Code2,
  Rocket,
  ClipboardList,
  Wallet,
  Trophy,
  SlidersHorizontal,
  ShieldCheck,
  Wrench,
  Headset,
  MessageCircle,
} from 'lucide-react'
import SiteLayout from '../components/SiteLayout'
import ProductCard from '../components/ProductCard'
import { useWizard } from '../context/WizardContext'
import { useCart } from '../context/CartContext'
import { perifericos } from '../data/peripherals'

const usos = [
  {
    id: 'estudio',
    label: 'Estudio',
    detalle: 'Clases virtuales, tareas y trabajos.',
    icon: GraduationCap,
  },
  {
    id: 'trabajo',
    label: 'Trabajo',
    detalle: 'Oficina, reuniones y multitarea.',
    icon: Briefcase,
  },
  {
    id: 'gaming',
    label: 'Gaming',
    detalle: 'Rendimiento y fluidez en tus juegos.',
    icon: Gamepad2,
  },
  {
    id: 'diseno',
    label: 'Diseño y edición',
    detalle: 'Foto, video y diseño gráfico.',
    icon: Palette,
  },
  {
    id: 'programacion',
    label: 'Programación',
    detalle: 'Mucha RAM y un procesador ágil.',
    icon: Code2,
  },
  {
    id: 'profesional',
    label: 'Uso profesional',
    detalle: 'Potencia para cargas exigentes.',
    icon: Rocket,
  },
]

const pasos = [
  {
    icon: ClipboardList,
    titulo: 'Cuéntanos tu uso',
    texto: 'Elige para qué usarás el computador.',
  },
  {
    icon: Wallet,
    titulo: 'Define tu presupuesto',
    texto: 'Selecciona cuánto quieres invertir.',
  },
  {
    icon: Trophy,
    titulo: 'Recibe tu recomendación',
    texto: 'Armamos la configuración más equilibrada.',
  },
  {
    icon: SlidersHorizontal,
    titulo: 'Personaliza y cotiza',
    texto: 'Ajusta piezas y pide tu cotización por WhatsApp.',
  },
]

const beneficios = [
  {
    icon: ShieldCheck,
    titulo: 'Compatibilidad asegurada',
    texto: 'Revisamos procesador, RAM, placa y fuente para que todo encaje.',
  },
  {
    icon: Wrench,
    titulo: 'Armado profesional',
    texto: 'Ensamblado con cableado ordenado y pruebas de rendimiento.',
  },
  {
    icon: Headset,
    titulo: 'Soporte y garantía',
    texto: 'Te acompañamos antes, durante y después de tu compra.',
  },
  {
    icon: MessageCircle,
    titulo: 'Cotización inmediata',
    texto: 'Recibe el detalle completo en tu WhatsApp, sin compromiso.',
  },
]

const destacados = perifericos.filter((p) => p.destacado).slice(0, 4)

function Titulo({ children, subtitulo }) {
  return (
    <div className="mb-6 text-center">
      <h2 className="text-2xl font-extrabold sm:text-3xl">{children}</h2>
      {subtitulo && (
        <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-300 sm:text-base">
          {subtitulo}
        </p>
      )}
    </div>
  )
}

export default function Landing() {
  const { setUso } = useWizard()
  const { agregarPeriferico, cantidadDe } = useCart()
  const navigate = useNavigate()
  const [imagenFalla, setImagenFalla] = useState(false)

  const elegirUso = (id) => {
    setUso(id)
    navigate('/asistente')
  }

  return (
    <SiteLayout>
      <main className="flex flex-1 flex-col gap-14 py-8 sm:gap-20 sm:py-12">
        {/* ---------- Hero ---------- */}
        <section className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <p className="inline-block rounded-full border border-brand/50 bg-brand/15 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-slate-100 sm:text-sm">
              Computadores a tu medida
            </p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              TU PC <span className="italic text-brand">IDEAL</span>,
              <br />
              SIN COMPLICACIONES
            </h1>
            <p className="mt-4 max-w-lg text-base text-slate-200 sm:text-lg">
              Responde unas preguntas y te armamos la configuración perfecta
              para estudiar, trabajar, jugar o crear. Compatible, equilibrada y
              dentro de tu presupuesto.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/asistente"
                className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand px-6 font-bold tracking-wide transition hover:bg-brand-dark"
              >
                ARMAR MI PC <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/perifericos"
                className="flex min-h-12 items-center justify-center rounded-xl border-2 border-brand px-6 font-bold tracking-wide transition hover:bg-brand"
              >
                VER PERIFÉRICOS
              </Link>
            </div>

            <dl className="mt-8 grid max-w-md grid-cols-3 gap-3 text-center">
              {[
                ['5', 'pasos'],
                ['6', 'usos'],
                ['100 %', 'compatible'],
              ].map(([valor, etiqueta]) => (
                <div
                  key={etiqueta}
                  className="rounded-xl border border-white/10 bg-white/5 px-2 py-3"
                >
                  <dt className="text-xl font-extrabold text-accent sm:text-2xl">
                    {valor}
                  </dt>
                  <dd className="text-xs text-slate-300 sm:text-sm">{etiqueta}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Imagen del PC (si no existe, se muestra un ícono) */}
          <div className="flex min-h-48 items-center justify-center">
            {imagenFalla ? (
              <Cpu
                className="h-40 w-40 text-brand drop-shadow-[0_0_40px_rgba(124,77,255,0.7)] sm:h-56 sm:w-56"
                strokeWidth={1}
              />
            ) : (
              <img
                src="/pc-hero.png"
                alt="Computador gamer BuildTech"
                onError={() => setImagenFalla(true)}
                className="max-h-72 w-auto object-contain drop-shadow-[0_0_40px_rgba(124,77,255,0.5)] sm:max-h-96"
              />
            )}
          </div>
        </section>

        {/* ---------- Cómo funciona ---------- */}
        <section>
          <Titulo subtitulo="En cuatro pasos tienes tu configuración lista.">
            ¿Cómo funciona?
          </Titulo>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pasos.map(({ icon: Icono, titulo, texto }, i) => (
              <li
                key={titulo}
                className="relative rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <span className="absolute right-4 top-3 text-4xl font-extrabold text-white/10">
                  {i + 1}
                </span>
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/20 text-brand">
                  <Icono className="h-6 w-6" />
                </span>
                <h3 className="mt-3 font-bold">{titulo}</h3>
                <p className="mt-1 text-sm text-slate-300">{texto}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ---------- Usos ---------- */}
        <section>
          <Titulo subtitulo="Elige tu uso principal y empezamos desde ahí.">
            ¿Para qué lo necesitas?
          </Titulo>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {usos.map(({ id, label, detalle, icon: Icono }) => (
              <button
                key={id}
                onClick={() => elegirUso(id)}
                className="group flex min-h-40 flex-col items-center justify-center gap-2 rounded-2xl bg-white/95 p-4 text-center text-slate-800 shadow-lg transition hover:-translate-y-1 hover:bg-brand hover:text-white"
              >
                <Icono className="h-9 w-9 text-brand transition group-hover:text-white" />
                <span className="font-bold">{label}</span>
                <span className="text-xs text-slate-500 transition group-hover:text-slate-100">
                  {detalle}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* ---------- Beneficios ---------- */}
        <section>
          <Titulo subtitulo="Más que vender computadores, te ayudamos a elegir bien.">
            ¿Por qué BuildTech?
          </Titulo>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {beneficios.map(({ icon: Icono, titulo, texto }) => (
              <article
                key={titulo}
                className="rounded-2xl border border-brand/30 bg-gradient-to-br from-white/10 to-white/0 p-5"
              >
                <Icono className="h-8 w-8 text-accent" />
                <h3 className="mt-3 font-bold">{titulo}</h3>
                <p className="mt-1 text-sm text-slate-300">{texto}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ---------- Periféricos destacados ---------- */}
        <section>
          <Titulo subtitulo="Completa tu setup con lo más pedido.">
            Periféricos destacados
          </Titulo>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {destacados.map((p) => (
              <ProductCard
                key={p.id}
                producto={p}
                enCarrito={cantidadDe(p.id)}
                onAgregar={() => agregarPeriferico(p.id)}
              />
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link
              to="/perifericos"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border-2 border-brand px-6 font-bold transition hover:bg-brand"
            >
              Ver todos los periféricos <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>

        {/* ---------- Llamado final ---------- */}
        <section className="flex flex-col items-center gap-4 rounded-3xl border border-brand/40 bg-gradient-to-br from-brand/30 to-brand/5 px-6 py-10 text-center">
          <h2 className="text-2xl font-extrabold sm:text-3xl">
            ¿Listo para armar tu PC?
          </h2>
          <p className="max-w-xl text-sm text-slate-200 sm:text-base">
            Te toma menos de dos minutos y la cotización no tiene compromiso.
          </p>
          <Link
            to="/asistente"
            className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand px-8 font-bold tracking-wide transition hover:bg-brand-dark"
          >
            EMPEZAR AHORA <ArrowRight className="h-5 w-5" />
          </Link>
        </section>
      </main>
    </SiteLayout>
  )
}
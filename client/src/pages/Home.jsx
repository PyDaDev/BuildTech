import { useState } from 'react'
import { ShoppingCart, ArrowRight } from 'lucide-react'
import Logo from '../components/Logo'
import UseSelector from '../components/UseSelector'

export default function Home() {
  const [uso, setUso] = useState('gaming')

  const continuar = () => {
    // Más adelante aquí navegaremos al paso 2 (presupuesto)
    console.log('Uso elegido:', uso)
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-night via-[#140f3d] to-[#2a1070]">
      {/* Resplandor decorativo */}
      <div className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-brand/30 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-5 sm:px-8">
        {/* Encabezado */}
        <header className="flex items-center justify-between">
          <Logo />
          <button
            aria-label="Carrito"
            className="rounded-full p-2 hover:bg-white/10"
          >
            <ShoppingCart className="h-6 w-6" />
          </button>
        </header>

        {/* Hero */}
        <main className="grid flex-1 items-center gap-8 py-8 lg:grid-cols-2">
          <div>
            <h2 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              ARMA TU <br />
              PC <span className="italic text-brand">IDEAL</span>
            </h2>
            <p className="mt-4 max-w-md text-base text-slate-200 sm:text-lg">
              Cuéntanos para qué utilizarás tu computador y te ayudaremos a
              encontrar la configuración adecuada.
            </p>
          </div>

          {/* Imagen del PC */}
          <div className="flex justify-center">
            <img
              src="/pc-hero.png"
              alt="Computador gamer BuildTech"
              className="max-h-72 w-auto object-contain drop-shadow-[0_0_40px_rgba(124,77,255,0.5)] sm:max-h-96"
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
          </div>
        </main>

        {/* Selector de uso */}
        <UseSelector selected={uso} onSelect={setUso} />

        {/* Pie: paso y botón */}
        <footer className="mt-5 flex items-center justify-between">
          <span className="text-lg font-semibold">1 / 5</span>
          <button
            onClick={continuar}
            className="flex items-center gap-2 rounded-xl bg-brand px-6 py-3 font-bold tracking-wide transition hover:bg-brand-dark"
          >
            CONTINUAR <ArrowRight className="h-5 w-5" />
          </button>
        </footer>
      </div>
    </div>
  )
}
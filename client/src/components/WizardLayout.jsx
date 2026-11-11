import { ShoppingCart, ArrowRight, ArrowLeft } from 'lucide-react'
import Logo from './Logo'
import Stepper from './Stepper'

export default function WizardLayout({
  step,
  total = 5,
  showStepper = true,
  onNext,
  onBack,
  nextLabel = 'CONTINUAR',
  nextDisabled = false,
  children,
}) {
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

        {/* Stepper */}
        {showStepper && (
          <div className="mt-6">
            <Stepper current={step} />
          </div>
        )}

        {/* Contenido de cada pantalla */}
        <div className="flex flex-1 flex-col">{children}</div>

        {/* Pie: paso y botones */}
        <footer className="mt-5 flex items-center justify-between">
          <span className="text-lg font-semibold">
            {step} / {total}
          </span>

          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center gap-2 rounded-xl px-4 py-3 font-semibold text-slate-200 transition hover:bg-white/10"
              >
                <ArrowLeft className="h-5 w-5" /> Atrás
              </button>
            )}
            <button
              onClick={onNext}
              disabled={nextDisabled}
              className="flex items-center gap-2 rounded-xl bg-brand px-6 py-3 font-bold tracking-wide transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              {nextLabel} <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </footer>
      </div>
    </div>
  )
}
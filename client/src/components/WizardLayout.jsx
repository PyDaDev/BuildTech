import { ArrowRight, ArrowLeft } from 'lucide-react'
import SiteLayout from './SiteLayout'
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
    <SiteLayout>
      <div className="flex flex-1 flex-col pt-5 sm:pt-6">
        {/* Stepper */}
        {showStepper && <Stepper current={step} />}

        {/* Contenido de cada pantalla */}
        <div className="flex flex-1 flex-col">{children}</div>

        {/* Paso actual y botones del asistente */}
        <div className="mt-4 flex items-center justify-between gap-3 sm:mt-5">
          <span className="text-base font-semibold sm:text-lg">
            {step} / {total}
          </span>

          <div className="flex items-center gap-2 sm:gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="flex min-h-11 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10 sm:gap-2 sm:px-4 sm:text-base"
              >
                <ArrowLeft className="h-5 w-5" /> Atrás
              </button>
            )}
            <button
              onClick={onNext}
              disabled={nextDisabled}
              className="flex min-h-11 items-center gap-1.5 rounded-xl bg-brand px-4 text-sm font-bold tracking-wide transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50 sm:gap-2 sm:px-6 sm:text-base"
            >
              {nextLabel} <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </SiteLayout>
  )
}
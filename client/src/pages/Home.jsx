import { useNavigate } from 'react-router-dom'
import WizardLayout from '../components/WizardLayout'
import UseSelector from '../components/UseSelector'
import { useWizard } from '../context/WizardContext'

export default function Home() {
  const { uso, setUso } = useWizard()
  const navigate = useNavigate()

  return (
    <WizardLayout
      step={1}
      showStepper={false}
      onNext={() => navigate('/presupuesto')}
    >
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
    </WizardLayout>
  )
}
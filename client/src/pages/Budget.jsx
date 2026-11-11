import { useNavigate } from 'react-router-dom'
import { PiggyBank, BadgeCheck } from 'lucide-react'
import WizardLayout from '../components/WizardLayout'
import RadioOption from '../components/RadioOption'
import { useWizard } from '../context/WizardContext'

const rangos = [
  { id: '0-2M', label: 'Menos de $2.000.000' },
  { id: '2-3M', label: '$2.000.000 – $3.000.000' },
  { id: '3-4M', label: '$3.000.000 – $4.000.000' },
  { id: '4-5M', label: '$4.000.000 – $5.000.000' },
  { id: '5M+', label: 'Más de $5.000.000' },
]

export default function Budget() {
  const { presupuesto, setPresupuesto } = useWizard()
  const navigate = useNavigate()

  return (
    <WizardLayout
      step={2}
      onBack={() => navigate('/')}
      onNext={() => navigate('/recomendacion')}
    >
      <main className="grid flex-1 items-center gap-8 py-8 lg:grid-cols-2">
        {/* Opciones */}
        <div>
          <h2 className="text-3xl font-bold sm:text-4xl">
            ¿Cuál es tu presupuesto?
          </h2>
          <p className="mt-2 text-base text-slate-200 sm:text-lg">
            Selecciona cuánto estás dispuesto a invertir.
          </p>

          <div role="radiogroup" className="mt-6 flex flex-col gap-3">
            {rangos.map((r) => (
              <RadioOption
                key={r.id}
                label={r.label}
                selected={presupuesto === r.id}
                onSelect={() => setPresupuesto(r.id)}
              />
            ))}
          </div>
        </div>

        {/* Ilustración y dato curioso */}
        <div className="flex flex-col items-center gap-6">
          <PiggyBank
            className="hidden h-48 w-48 text-brand drop-shadow-[0_0_30px_rgba(124,77,255,0.6)] lg:block"
            strokeWidth={1}
          />
          <div className="flex items-center gap-3 rounded-xl border border-brand/40 bg-white/5 px-5 py-4">
            <BadgeCheck className="h-8 w-8 shrink-0 text-green-400" />
            <p className="text-sm sm:text-base">
              El rango más elegido
              <br />
              por nuestros clientes
            </p>
          </div>
        </div>
      </main>
    </WizardLayout>
  )
}
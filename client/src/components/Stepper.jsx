import { Check } from 'lucide-react'

const pasos = ['Uso', 'Presupuesto', 'Recomendación', 'Personalización', 'Servicios']

export default function Stepper({ current }) {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <ol className="flex w-full">
        {pasos.map((label, i) => {
          const numero = i + 1
          const done = numero < current
          const active = numero === current
          const isLast = i === pasos.length - 1

          return (
            <li key={label} className="relative flex flex-1 flex-col items-center">
              {/* Línea hacia el siguiente paso */}
              {!isLast && (
                <span
                  className={`absolute left-1/2 top-4 h-0.5 w-full sm:top-5 ${
                    done ? 'bg-brand' : 'bg-slate-600'
                  }`}
                />
              )}

              {/* Círculo */}
              <span
                className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold sm:h-10 sm:w-10 ${
                  done || active
                    ? 'bg-brand text-white'
                    : 'bg-slate-700 text-slate-300'
                } ${active ? 'ring-4 ring-brand/30' : ''}`}
              >
                {done ? <Check className="h-4 w-4 sm:h-5 sm:w-5" /> : numero}
              </span>

              {/* Etiqueta (escritorio y tablet) */}
              <span
                className={`mt-2 hidden text-center text-xs leading-tight sm:block ${
                  active ? 'font-semibold text-white' : 'text-slate-300'
                }`}
              >
                {label}
              </span>
            </li>
          )
        })}
      </ol>

      {/* Etiqueta del paso activo (solo móvil) */}
      <p className="mt-3 text-center text-sm font-semibold sm:hidden">
        {pasos[current - 1]}
      </p>
    </div>
  )
}
import {
  GraduationCap,
  Briefcase,
  Gamepad2,
  Palette,
  Code2,
  Rocket,
} from 'lucide-react'

const usos = [
  { id: 'estudio', label: 'Estudio', icon: GraduationCap },
  { id: 'trabajo', label: 'Trabajo', icon: Briefcase },
  { id: 'gaming', label: 'Gaming', icon: Gamepad2 },
  { id: 'diseno', label: 'Diseño y edición', icon: Palette },
  { id: 'programacion', label: 'Programación', icon: Code2 },
  { id: 'profesional', label: 'Uso profesional', icon: Rocket },
]

export default function UseSelector({ selected, onSelect }) {
  return (
    <div className="rounded-2xl bg-white/95 p-4 text-slate-800 shadow-xl sm:p-6">
      <h3 className="mb-4 text-lg font-semibold">¿Cuál será su uso principal?</h3>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {usos.map(({ id, label, icon: Icon }) => {
          const active = selected === id
          return (
            <button
              key={id}
              onClick={() => onSelect(id)}
              className={`flex min-h-24 flex-col items-center justify-center gap-2 rounded-xl p-3 text-center text-sm font-medium transition ${
                active
                  ? 'bg-brand text-white shadow-lg shadow-brand/40'
                  : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              <Icon className="h-7 w-7" />
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
import { Check } from 'lucide-react'
import { formatCOP } from '../utils/format'

export default function ServiceItem({ servicio, selected, onToggle }) {
  const { icon: Icon, nombre, detalle, precio, incluido } = servicio
  const activo = incluido || selected

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={activo}
      disabled={incluido}
      onClick={onToggle}
      className={`flex min-h-14 w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition sm:gap-4 sm:px-4 ${
        activo
          ? 'border-brand/60 bg-brand/15'
          : 'border-white/10 bg-white/5 hover:bg-white/10'
      } ${incluido ? 'cursor-default' : ''}`}
    >
      {/* Casilla */}
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 ${
          activo ? 'border-brand bg-brand' : 'border-slate-400'
        }`}
      >
        {activo && <Check className="h-4 w-4 text-white" />}
      </span>

      <Icon className="hidden h-5 w-5 shrink-0 text-brand sm:block" />

      {/* Texto */}
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold sm:text-base">{nombre}</span>
        <span className="block text-xs text-slate-300 sm:text-sm">{detalle}</span>
      </span>

      {/* Precio */}
      <span
        className={`shrink-0 text-right text-xs font-bold sm:text-sm ${
          precio === 0 ? 'text-green-400' : 'text-accent'
        }`}
      >
        {precio === 0 ? 'Incluido' : `+ ${formatCOP(precio)}`}
      </span>
    </button>
  )
}
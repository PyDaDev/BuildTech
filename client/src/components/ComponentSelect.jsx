import { ChevronDown } from 'lucide-react'

export default function ComponentSelect({
  icon: Icon,
  label,
  value,
  onChange,
  options,
  hint,
}) {
  return (
    <div className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:gap-4">
      <div className="flex items-center gap-3 sm:w-48 sm:shrink-0">
        <Icon className="h-6 w-6 shrink-0 text-brand" />
        <span className="font-semibold">{label}</span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="relative">
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="min-h-12 w-full appearance-none rounded-xl border border-slate-300 bg-white py-2 pl-4 pr-10 text-slate-800 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/30"
          >
            {options.map((o) => (
              <option key={o.value} value={o.value} disabled={o.disabled}>
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
        </div>
        {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
      </div>
    </div>
  )
}
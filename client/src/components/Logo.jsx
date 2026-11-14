import { Link } from 'react-router-dom'
import { Cpu } from 'lucide-react'

export default function Logo() {
  return (
    <Link
      to="/"
      aria-label="BuildTech, ir al inicio"
      className="flex min-w-0 items-center gap-2 rounded-xl outline-none transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-brand sm:gap-3"
    >
      <div className="shrink-0 rounded-xl border-2 border-brand p-1.5 text-brand sm:p-2">
        <Cpu className="h-6 w-6 sm:h-9 sm:w-9" strokeWidth={1.5} />
      </div>
      <div className="min-w-0 leading-tight">
        <h1 className="text-xl font-bold sm:text-3xl">
          Build<span className="text-brand">Tech</span>
        </h1>
        <p className="truncate text-[10px] text-slate-300 sm:text-sm">
          Construye. Rinde. Disfruta.
        </p>
      </div>
    </Link>
  )
}
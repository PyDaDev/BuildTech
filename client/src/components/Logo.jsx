import { Cpu } from 'lucide-react'

export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="rounded-xl border-2 border-brand p-1.5 text-brand sm:p-2">
        <Cpu className="h-7 w-7 sm:h-9 sm:w-9" strokeWidth={1.5} />
      </div>
      <div className="leading-tight">
        <h1 className="text-2xl font-bold sm:text-3xl">
          Build<span className="text-brand">Tech</span>
        </h1>
        <p className="text-[11px] text-slate-300 sm:text-sm">
          Construye. Rinde. Disfruta.
        </p>
      </div>
    </div>
  )
}
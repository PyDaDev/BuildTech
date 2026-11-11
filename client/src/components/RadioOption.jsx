export default function RadioOption({ label, selected, onSelect }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left text-base font-medium transition sm:text-lg ${
        selected
          ? 'bg-brand text-white shadow-lg shadow-brand/40'
          : 'bg-white/95 text-slate-800 hover:bg-white'
      }`}
    >
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
          selected ? 'border-white' : 'border-slate-400'
        }`}
      >
        {selected && <span className="h-3 w-3 rounded-full bg-white" />}
      </span>
      {label}
    </button>
  )
}
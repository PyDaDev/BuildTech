import { useEffect, useState } from 'react'
import { X, MessageCircle, CheckCircle2 } from 'lucide-react'
import { formatCOP } from '../utils/format'

const campo =
  'min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-slate-800 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/30'

export default function QuoteModal({ total, onClose, onSubmit }) {
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [ciudad, setCiudad] = useState('')
  const [error, setError] = useState('')
  const [enviado, setEnviado] = useState(false)

  // Cerrar con Escape y bloquear el scroll de la página de fondo
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const previo = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previo
    }
  }, [onClose])

  const enviar = (e) => {
    e.preventDefault()
    const soloDigitos = telefono.replace(/\D/g, '')

    if (nombre.trim().length < 2) {
      setError('Escribe tu nombre.')
      return
    }
    if (soloDigitos.length < 7) {
      setError('Escribe un teléfono válido.')
      return
    }

    setError('')
    onSubmit({
      nombre: nombre.trim(),
      telefono: telefono.trim(),
      ciudad: ciudad.trim(),
    })
    setEnviado(true)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Solicitar cotización"
        className="max-h-dvh w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-5 text-slate-800 shadow-2xl sm:rounded-3xl sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl font-extrabold">
            {enviado ? '¡Cotización lista!' : 'Solicita tu cotización'}
          </h3>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {enviado ? (
          <div className="mt-4 text-center">
            <CheckCircle2 className="mx-auto h-14 w-14 text-green-500" />
            <p className="mt-3">
              Se abrió WhatsApp con tu cotización. Solo falta que pulses
              <strong> enviar</strong> en esa conversación.
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Si no se abrió, revisa que tu navegador no haya bloqueado la
              ventana emergente.
            </p>
            <button
              onClick={onClose}
              className="mt-5 min-h-12 w-full rounded-xl bg-brand font-bold text-white transition hover:bg-brand-dark"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <form onSubmit={enviar} className="mt-4 space-y-3" noValidate>
            <p className="text-sm text-slate-500">
              Total estimado:{' '}
              <strong className="text-brand">{formatCOP(total)}</strong>. Te
              contactaremos para confirmar disponibilidad y precio final.
            </p>

            <label className="block text-sm font-semibold">
              Nombre
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                autoComplete="name"
                placeholder="Tu nombre"
                className={`${campo} mt-1 font-normal`}
              />
            </label>

            <label className="block text-sm font-semibold">
              Teléfono / WhatsApp
              <input
                type="tel"
                inputMode="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                autoComplete="tel"
                placeholder="300 123 4567"
                className={`${campo} mt-1 font-normal`}
              />
            </label>

            <label className="block text-sm font-semibold">
              Ciudad (opcional)
              <input
                type="text"
                value={ciudad}
                onChange={(e) => setCiudad(e.target.value)}
                autoComplete="address-level2"
                placeholder="Neiva"
                className={`${campo} mt-1 font-normal`}
              />
            </label>

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-green-600 font-bold text-white transition hover:bg-green-700"
            >
              <MessageCircle className="h-5 w-5" />
              Enviar por WhatsApp
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
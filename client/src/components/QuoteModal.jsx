import { useEffect, useState } from 'react'
import {
  X,
  MessageCircle,
  CheckCircle2,
  Banknote,
  Landmark,
} from 'lucide-react'
import { formatCOP } from '../utils/format'
import { DEPARTAMENTOS } from '../data/departamentos'

const campo =
  'min-h-12 w-full rounded-xl border bg-white px-4 py-2 font-normal text-slate-800 outline-none transition focus:ring-2'

const claseCampo = (error) =>
  `${campo} mt-1 ${
    error
      ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
      : 'border-slate-300 focus:border-brand focus:ring-brand/30'
  }`

const METODOS = [
  { id: 'efectivo', etiqueta: 'Efectivo', detalle: 'Pagas al recibir', icon: Banknote },
  { id: 'transferencia', etiqueta: 'Transferencia', detalle: 'Te enviamos los datos', icon: Landmark },
]

function Error({ id, children }) {
  if (!children) return null
  return (
    <p id={id} role="alert" className="mt-1 text-xs font-semibold text-red-600">
      {children}
    </p>
  )
}

function validar(f) {
  const errores = {}
  const nombre = f.nombre.trim()
  const direccion = f.direccion.trim()
  const ciudad = f.ciudad.trim()
  const descripcion = f.descripcion.trim()

  if (nombre.length < 2) errores.nombre = 'Escribe tu nombre.'
  if (f.telefono.replace(/\D/g, '').length < 7) {
    errores.telefono = 'Escribe un teléfono válido.'
  }
  if (direccion.length < 5) errores.direccion = 'Escribe tu dirección completa.'
  if (!f.departamento) errores.departamento = 'Selecciona el departamento.'
  if (ciudad.length < 2) errores.ciudad = 'Escribe la ciudad.'
  if (descripcion.length < 10) {
    errores.descripcion = 'Describe el domicilio (mínimo 10 caracteres).'
  }
  if (!f.pago) errores.pago = 'Elige cómo vas a pagar.'

  return errores
}

export default function QuoteModal({ total, onClose, onSubmit }) {
  const [form, setForm] = useState({
    nombre: '',
    telefono: '',
    direccion: '',
    departamento: '',
    ciudad: '',
    descripcion: '',
    pago: '',
  })
  const [errores, setErrores] = useState({})
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

  const cambiar = (nombre, valor) => {
    setForm((prev) => ({ ...prev, [nombre]: valor }))
    // Al corregir un campo, se quita su error
    if (errores[nombre]) {
      setErrores((prev) => ({ ...prev, [nombre]: undefined }))
    }
  }

  const enviar = (e) => {
    e.preventDefault()
    const encontrados = validar(form)

    if (Object.keys(encontrados).length > 0) {
      setErrores(encontrados)
      // Lleva el foco al primer campo con error
      const primero = Object.keys(encontrados)[0]
      document.getElementById(`campo-${primero}`)?.focus()
      return
    }

    setErrores({})
    onSubmit({
      nombre: form.nombre.trim(),
      telefono: form.telefono.trim(),
      direccion: form.direccion.trim(),
      departamento: form.departamento,
      ciudad: form.ciudad.trim(),
      descripcion: form.descripcion.trim(),
      pago: form.pago,
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
        className="max-h-dvh w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-5 text-slate-800 shadow-2xl sm:rounded-3xl sm:p-7"
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
          <form onSubmit={enviar} className="mt-4 space-y-4" noValidate>
            <p className="text-sm text-slate-500">
              Total estimado:{' '}
              <strong className="text-brand">{formatCOP(total)}</strong>. Todos
              los campos son obligatorios. Te contactaremos para confirmar
              disponibilidad, precio final y entrega.
            </p>

            {/* ---------- Datos personales ---------- */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold">
                Nombre
                <input
                  id="campo-nombre"
                  type="text"
                  value={form.nombre}
                  onChange={(e) => cambiar('nombre', e.target.value)}
                  autoComplete="name"
                  placeholder="Tu nombre completo"
                  maxLength={80}
                  aria-invalid={Boolean(errores.nombre)}
                  aria-describedby={errores.nombre ? 'error-nombre' : undefined}
                  className={claseCampo(errores.nombre)}
                />
                <Error id="error-nombre">{errores.nombre}</Error>
              </label>

              <label className="block text-sm font-semibold">
                Teléfono / WhatsApp
                <input
                  id="campo-telefono"
                  type="tel"
                  inputMode="tel"
                  value={form.telefono}
                  onChange={(e) => cambiar('telefono', e.target.value)}
                  autoComplete="tel"
                  placeholder="300 123 4567"
                  maxLength={20}
                  aria-invalid={Boolean(errores.telefono)}
                  aria-describedby={errores.telefono ? 'error-telefono' : undefined}
                  className={claseCampo(errores.telefono)}
                />
                <Error id="error-telefono">{errores.telefono}</Error>
              </label>
            </div>

            {/* ---------- Datos de entrega ---------- */}
            <fieldset className="space-y-3 rounded-2xl border border-slate-200 p-4">
              <legend className="px-2 text-sm font-extrabold text-brand">
                Datos de entrega
              </legend>

              <label className="block text-sm font-semibold">
                Dirección
                <input
                  id="campo-direccion"
                  type="text"
                  value={form.direccion}
                  onChange={(e) => cambiar('direccion', e.target.value)}
                  autoComplete="street-address"
                  placeholder="Cra 10 # 20-30, barrio Centro"
                  maxLength={150}
                  aria-invalid={Boolean(errores.direccion)}
                  aria-describedby={errores.direccion ? 'error-direccion' : undefined}
                  className={claseCampo(errores.direccion)}
                />
                <Error id="error-direccion">{errores.direccion}</Error>
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-sm font-semibold">
                  Departamento
                  <select
                    id="campo-departamento"
                    value={form.departamento}
                    onChange={(e) => cambiar('departamento', e.target.value)}
                    autoComplete="address-level1"
                    aria-invalid={Boolean(errores.departamento)}
                    aria-describedby={
                      errores.departamento ? 'error-departamento' : undefined
                    }
                    className={claseCampo(errores.departamento)}
                  >
                    <option value="">Selecciona…</option>
                    {DEPARTAMENTOS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  <Error id="error-departamento">{errores.departamento}</Error>
                </label>

                <label className="block text-sm font-semibold">
                  Ciudad
                  <input
                    id="campo-ciudad"
                    type="text"
                    value={form.ciudad}
                    onChange={(e) => cambiar('ciudad', e.target.value)}
                    autoComplete="address-level2"
                    placeholder="Medellín"
                    maxLength={80}
                    aria-invalid={Boolean(errores.ciudad)}
                    aria-describedby={errores.ciudad ? 'error-ciudad' : undefined}
                    className={claseCampo(errores.ciudad)}
                  />
                  <Error id="error-ciudad">{errores.ciudad}</Error>
                </label>
              </div>

              <label className="block text-sm font-semibold">
                Descripción del domicilio
                <textarea
                  id="campo-descripcion"
                  value={form.descripcion}
                  onChange={(e) => cambiar('descripcion', e.target.value)}
                  rows={3}
                  maxLength={300}
                  placeholder="Casa de dos pisos, portón negro, frente al parque. Apto 302, torre 2…"
                  aria-invalid={Boolean(errores.descripcion)}
                  aria-describedby={
                    errores.descripcion ? 'error-descripcion' : undefined
                  }
                  className={`${claseCampo(errores.descripcion)} resize-none`}
                />
                <span className="mt-1 block text-right text-xs font-normal text-slate-400">
                  {form.descripcion.length}/300
                </span>
                <Error id="error-descripcion">{errores.descripcion}</Error>
              </label>
            </fieldset>

            {/* ---------- Método de pago ---------- */}
            <fieldset>
              <legend className="text-sm font-semibold">Método de pago</legend>
              <div
                role="radiogroup"
                aria-label="Método de pago"
                aria-describedby={errores.pago ? 'error-pago' : undefined}
                className="mt-1 grid gap-2 sm:grid-cols-2"
              >
                {METODOS.map(({ id, etiqueta, detalle, icon: Icono }, i) => {
                  const activo = form.pago === id
                  return (
                    <button
                      key={id}
                      id={i === 0 ? 'campo-pago' : undefined}
                      type="button"
                      role="radio"
                      aria-checked={activo}
                      onClick={() => cambiar('pago', id)}
                      className={`flex min-h-14 items-center gap-3 rounded-xl border-2 px-4 py-2 text-left transition ${
                        activo
                          ? 'border-brand bg-brand/10'
                          : errores.pago
                            ? 'border-red-300 hover:border-brand'
                            : 'border-slate-300 hover:border-brand'
                      }`}
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                          activo ? 'border-brand' : 'border-slate-400'
                        }`}
                      >
                        {activo && <span className="h-2.5 w-2.5 rounded-full bg-brand" />}
                      </span>
                      <Icono className="h-5 w-5 shrink-0 text-brand" />
                      <span>
                        <span className="block font-bold">{etiqueta}</span>
                        <span className="block text-xs text-slate-500">{detalle}</span>
                      </span>
                    </button>
                  )
                })}
              </div>
              <Error id="error-pago">{errores.pago}</Error>
            </fieldset>

            {Object.keys(errores).length > 0 && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                Revisa los campos marcados en rojo.
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
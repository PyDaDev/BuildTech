import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  X,
  ShoppingCart,
  Trash2,
  MessageCircle,
  Monitor,
  Minus,
  Plus,
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import QuoteModal from './QuoteModal'
import { construirMensajeCarrito, enlaceWhatsApp, USOS } from '../utils/quote'
import { MAX_UNIDADES } from '../utils/cart'
import { categoriaDe } from '../data/peripherals'
import { formatCOP } from '../utils/format'
import { WHATSAPP_NUMBER } from '../config'

export default function CartDrawer() {
  const {
    items,
    cantidad,
    total,
    quitar,
    vaciar,
    cambiarCantidad,
    abierto,
    cerrar,
  } = useCart()
  const navigate = useNavigate()
  const [cotizando, setCotizando] = useState(false)

  // Cerrar con Escape y bloquear el scroll del fondo mientras está abierto
  useEffect(() => {
    if (!abierto) return
    const onKey = (e) => e.key === 'Escape' && !cotizando && cerrar()
    document.addEventListener('keydown', onKey)
    const previo = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previo
    }
  }, [abierto, cotizando, cerrar])

  // Numeración de los PCs (los periféricos no cuentan)
  const numeros = {}
  items
    .filter((i) => i.tipo !== 'periferico')
    .forEach((pc, idx) => {
      numeros[pc.id] = idx + 1
    })

  const irA = (ruta) => {
    cerrar()
    navigate(ruta)
  }

  const enviarCotizacion = (cliente) => {
    const texto = construirMensajeCarrito({ cliente, items, total })
    window.open(enlaceWhatsApp(WHATSAPP_NUMBER, texto), '_blank', 'noopener')
  }

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        style={{
          visibility: abierto ? 'visible' : 'hidden',
          transition: `visibility 0s linear ${abierto ? '0s' : '0.3s'}`,
        }}
        aria-hidden={!abierto}
      >
        {/* Fondo oscuro */}
        <div
          onClick={cerrar}
          className={`absolute inset-0 bg-black/70 transition-opacity duration-300 ${
            abierto ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Panel */}
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Carrito de compras"
          className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white text-slate-800 shadow-2xl transition-transform duration-300 ${
            abierto ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Encabezado */}
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 sm:px-5">
            <h2 className="flex items-center gap-2 text-lg font-extrabold">
              <ShoppingCart className="h-6 w-6 text-brand" />
              Tu carrito ({cantidad})
            </h2>
            <button
              onClick={cerrar}
              aria-label="Cerrar carrito"
              className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Contenido */}
          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
              <ShoppingCart className="h-16 w-16 text-slate-300" strokeWidth={1.2} />
              <p className="text-lg font-bold">Tu carrito está vacío</p>
              <p className="text-sm text-slate-500">
                Arma tu PC ideal con el asistente o explora los periféricos.
              </p>
              <div className="mt-2 flex w-full max-w-xs flex-col gap-2">
                <button
                  onClick={() => irA('/')}
                  className="min-h-12 rounded-xl bg-brand px-6 font-bold text-white transition hover:bg-brand-dark"
                >
                  Armar mi PC
                </button>
                <button
                  onClick={() => irA('/perifericos')}
                  className="min-h-12 rounded-xl border-2 border-brand px-6 font-bold text-brand transition hover:bg-brand hover:text-white"
                >
                  Ver periféricos
                </button>
              </div>
            </div>
          ) : (
            <>
              <ul className="flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:px-5">
                {items.map((item) =>
                  item.tipo === 'periferico' ? (
                    /* ---------- Periférico ---------- */
                    <li
                      key={item.id}
                      className="rounded-2xl border border-slate-200 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-start gap-3">
                          {(() => {
                            const Icono = categoriaDe(item.producto.categoria).icon
                            return (
                              <Icono className="mt-0.5 h-6 w-6 shrink-0 text-brand" />
                            )
                          })()}
                          <div className="min-w-0">
                            <p className="font-bold leading-snug">
                              {item.producto.nombre}
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                              {formatCOP(item.producto.precio)} c/u
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => quitar(item.id)}
                          aria-label={`Quitar ${item.producto.nombre} del carrito`}
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                        <div className="flex items-center rounded-xl border border-slate-200">
                          <button
                            onClick={() => cambiarCantidad(item.id, -1)}
                            disabled={item.cantidad <= 1}
                            aria-label="Disminuir cantidad"
                            className="flex h-10 w-10 items-center justify-center rounded-l-xl hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span
                            className="w-8 text-center font-bold"
                            aria-live="polite"
                          >
                            {item.cantidad}
                          </span>
                          <button
                            onClick={() => cambiarCantidad(item.id, 1)}
                            disabled={item.cantidad >= MAX_UNIDADES}
                            aria-label="Aumentar cantidad"
                            className="flex h-10 w-10 items-center justify-center rounded-r-xl hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <span className="text-base font-extrabold text-brand">
                          {formatCOP(item.totalFinal)}
                        </span>
                      </div>
                    </li>
                  ) : (
                    /* ---------- PC ---------- */
                    <li
                      key={item.id}
                      className="rounded-2xl border border-slate-200 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-start gap-3">
                          <Monitor className="mt-0.5 h-6 w-6 shrink-0 text-brand" />
                          <div className="min-w-0">
                            <p className="font-bold">
                              PC {numeros[item.id]} · {USOS[item.uso] ?? item.uso}
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                              {item.pc.cpu.nombre} · {item.pc.ram.nombre}{' '}
                              {item.pc.cpu.ram} · {item.pc.storage.nombre}
                            </p>
                            <p className="text-sm text-slate-500">
                              {item.pc.gpu.nombre}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => quitar(item.id)}
                          aria-label={`Quitar PC ${numeros[item.id]} del carrito`}
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>

                      <dl className="mt-3 space-y-1 border-t border-slate-100 pt-3 text-sm">
                        <div className="flex justify-between text-slate-500">
                          <dt>Equipo</dt>
                          <dd>{formatCOP(item.pc.total)}</dd>
                        </div>
                        <div className="flex justify-between text-slate-500">
                          <dt>Servicios</dt>
                          <dd>{formatCOP(item.totalServicios)}</dd>
                        </div>
                        <div className="flex justify-between text-base font-extrabold">
                          <dt>Subtotal</dt>
                          <dd className="text-brand">{formatCOP(item.totalFinal)}</dd>
                        </div>
                      </dl>
                    </li>
                  ),
                )}
              </ul>

              {/* Pie con total y acciones */}
              <div className="space-y-3 border-t border-slate-200 px-4 py-4 sm:px-5">
                <div className="flex items-baseline justify-between">
                  <span className="font-extrabold uppercase">Total estimado</span>
                  <span className="text-2xl font-extrabold text-brand">
                    {formatCOP(total)}
                  </span>
                </div>

                <button
                  onClick={() => setCotizando(true)}
                  className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-green-600 font-bold text-white transition hover:bg-green-700"
                >
                  <MessageCircle className="h-5 w-5" />
                  Solicitar cotización
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => irA('/')}
                    className="min-h-11 rounded-xl border-2 border-brand text-sm font-bold text-brand transition hover:bg-brand hover:text-white"
                  >
                    Armar otro PC
                  </button>
                  <button
                    onClick={() => irA('/perifericos')}
                    className="min-h-11 rounded-xl border-2 border-brand text-sm font-bold text-brand transition hover:bg-brand hover:text-white"
                  >
                    Ver periféricos
                  </button>
                </div>

                <button
                  onClick={vaciar}
                  className="min-h-10 w-full rounded-xl text-sm font-semibold text-slate-500 transition hover:bg-slate-100"
                >
                  Vaciar carrito
                </button>
              </div>
            </>
          )}
        </aside>
      </div>

      {cotizando && (
        <QuoteModal
          total={total}
          onClose={() => setCotizando(false)}
          onSubmit={enviarCotizacion}
        />
      )}
    </>
  )
}
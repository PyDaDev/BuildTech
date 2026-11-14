import { useState } from 'react'
import { Check, ShoppingCart } from 'lucide-react'
import { categoriaDe } from '../data/peripherals'
import { formatCOP } from '../utils/format'

export default function ProductCard({ producto, enCarrito, onAgregar }) {
  const [imagenFalla, setImagenFalla] = useState(false)
  const { icon: Icono, nombre: categoria } = categoriaDe(producto.categoria)
  const mostrarImagen = producto.imagen && !imagenFalla

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl bg-white text-slate-800 shadow-xl">
      {/* Imagen o ícono de la categoría */}
      <div className="relative flex h-40 items-center justify-center bg-gradient-to-br from-night to-[#2a1070] sm:h-44">
        {producto.destacado && (
          <span className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-extrabold text-night">
            Popular
          </span>
        )}

        {mostrarImagen ? (
          <img
            src={producto.imagen}
            alt={producto.nombre}
            loading="lazy"
            onError={() => setImagenFalla(true)}
            className="h-full w-full object-contain p-4"
          />
        ) : (
          <Icono
            className="h-16 w-16 text-brand drop-shadow-[0_0_20px_rgba(124,77,255,0.6)]"
            strokeWidth={1.2}
          />
        )}
      </div>

      {/* Información */}
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand">
          {categoria}
        </p>
        <h3 className="mt-1 font-bold leading-snug">{producto.nombre}</h3>

        <ul className="mt-2 space-y-1 text-sm text-slate-500">
          {producto.specs.map((spec) => (
            <li key={spec} className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
              {spec}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-4">
          <p className="text-xl font-extrabold">{formatCOP(producto.precio)}</p>

          <button
            onClick={onAgregar}
            className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand font-bold text-white transition hover:bg-brand-dark"
          >
            <ShoppingCart className="h-5 w-5" />
            {enCarrito > 0 ? 'Agregar otro' : 'Agregar al carrito'}
          </button>

          {enCarrito > 0 && (
            <p className="mt-2 text-center text-xs font-semibold text-green-600">
              En tu carrito: {enCarrito}
            </p>
          )}
        </div>
      </div>
    </article>
  )
}
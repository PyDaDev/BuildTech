import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, ChevronDown, PackageSearch, ShoppingCart } from 'lucide-react'
import SiteLayout from '../components/SiteLayout'
import ProductCard from '../components/ProductCard'
import { useCart } from '../context/CartContext'
import { categorias, perifericos } from '../data/peripherals'

const ORDENES = [
  { id: 'relevancia', etiqueta: 'Más populares' },
  { id: 'menor', etiqueta: 'Precio: menor a mayor' },
  { id: 'mayor', etiqueta: 'Precio: mayor a menor' },
]

// Para que la búsqueda ignore mayúsculas y tildes
const normalizar = (texto) =>
  texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

export default function Peripherals() {
  const { agregarPeriferico, cantidadDe, abrir } = useCart()
  const [categoria, setCategoria] = useState('todos')
  const [busqueda, setBusqueda] = useState('')
  const [orden, setOrden] = useState('relevancia')
  const [aviso, setAviso] = useState('')

  // Ocultar el aviso "agregado" después de 3 segundos
  useEffect(() => {
    if (!aviso) return
    const temporizador = setTimeout(() => setAviso(''), 3000)
    return () => clearTimeout(temporizador)
  }, [aviso])

  const productos = useMemo(() => {
    const q = normalizar(busqueda.trim())

    const lista = perifericos.filter(
      (p) =>
        (categoria === 'todos' || p.categoria === categoria) &&
        (!q || normalizar(`${p.nombre} ${p.specs.join(' ')}`).includes(q)),
    )

    if (orden === 'menor') return [...lista].sort((a, b) => a.precio - b.precio)
    if (orden === 'mayor') return [...lista].sort((a, b) => b.precio - a.precio)
    // Más populares: primero los destacados
    return [...lista].sort(
      (a, b) => Number(Boolean(b.destacado)) - Number(Boolean(a.destacado)),
    )
  }, [categoria, busqueda, orden])

  const agregar = (producto) => {
    agregarPeriferico(producto.id)
    setAviso(`${producto.nombre} se agregó al carrito`)
  }

  const limpiar = () => {
    setCategoria('todos')
    setBusqueda('')
  }

  return (
    <SiteLayout>
      <main className="flex flex-1 flex-col gap-5 py-6">
        {/* Título */}
        <div>
          <h2 className="text-3xl font-extrabold sm:text-4xl">Periféricos</h2>
          <p className="mt-1 text-base text-slate-200 sm:text-lg">
            Completa tu setup con monitores, teclados, mouse, audio y más.
          </p>
        </div>

        {/* Búsqueda y orden */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative block flex-1">
            <span className="sr-only">Buscar periféricos</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
            <input
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar monitor, teclado, mouse…"
              className="min-h-12 w-full rounded-xl border border-slate-300 bg-white py-2 pl-12 pr-4 text-slate-800 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/30"
            />
          </label>

          <label className="relative block sm:w-64">
            <span className="sr-only">Ordenar por</span>
            <select
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
              className="min-h-12 w-full appearance-none rounded-xl border border-slate-300 bg-white py-2 pl-4 pr-10 text-slate-800 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/30"
            >
              {ORDENES.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.etiqueta}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
          </label>
        </div>

        {/* Categorías (con scroll horizontal en móvil) */}
        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-2 pb-1 sm:flex-wrap">
            <button
              onClick={() => setCategoria('todos')}
              aria-pressed={categoria === 'todos'}
              className={`min-h-11 shrink-0 rounded-full border px-4 text-sm font-semibold transition ${
                categoria === 'todos'
                  ? 'border-brand bg-brand text-white'
                  : 'border-white/20 text-slate-200 hover:bg-white/10'
              }`}
            >
              Todos
            </button>
            {categorias.map(({ id, nombre, icon: Icono }) => (
              <button
                key={id}
                onClick={() => setCategoria(id)}
                aria-pressed={categoria === id}
                className={`flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition ${
                  categoria === id
                    ? 'border-brand bg-brand text-white'
                    : 'border-white/20 text-slate-200 hover:bg-white/10'
                }`}
              >
                <Icono className="h-4 w-4" />
                {nombre}
              </button>
            ))}
          </div>
        </div>

        <p className="text-sm text-slate-300" aria-live="polite">
          {productos.length} {productos.length === 1 ? 'producto' : 'productos'}
        </p>

        {/* Productos */}
        {productos.length > 0 ? (
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {productos.map((p) => (
              <ProductCard
                key={p.id}
                producto={p}
                enCarrito={cantidadDe(p.id)}
                onAgregar={() => agregar(p)}
              />
            ))}
          </section>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-12 text-center">
            <PackageSearch className="h-14 w-14 text-slate-400" strokeWidth={1.2} />
            <p className="text-lg font-bold">No encontramos resultados</p>
            <p className="text-sm text-slate-300">
              Prueba con otra palabra o quita los filtros.
            </p>
            <button
              onClick={limpiar}
              className="mt-2 min-h-11 rounded-xl bg-brand px-6 font-bold transition hover:bg-brand-dark"
            >
              Ver todos los productos
            </button>
          </div>
        )}

        {/* Invitación al asistente */}
        <section className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-brand/40 bg-white/5 p-6 text-center sm:flex-row sm:text-left">
          <div>
            <h3 className="text-xl font-extrabold">¿Todavía no tienes computador?</h3>
            <p className="mt-1 text-sm text-slate-300">
              Cuéntanos cómo lo vas a usar y te armamos la configuración ideal.
            </p>
          </div>
          <Link
            to="/"
            className="flex min-h-12 shrink-0 items-center justify-center rounded-xl bg-brand px-6 font-bold tracking-wide transition hover:bg-brand-dark"
          >
            ARMAR MI PC
          </Link>
        </section>
      </main>

      {/* Aviso al agregar un producto */}
      {aviso && (
        <div
          role="status"
          className="fixed bottom-4 left-1/2 z-30 flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 items-center justify-between gap-3 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-2xl"
        >
          <span className="min-w-0">{aviso}</span>
          <button
            onClick={abrir}
            className="flex shrink-0 items-center gap-1.5 rounded-lg bg-brand px-3 py-2 text-white transition hover:bg-brand-dark"
          >
            <ShoppingCart className="h-4 w-4" />
            Ver
          </button>
        </div>
      )}
    </SiteLayout>
  )
}
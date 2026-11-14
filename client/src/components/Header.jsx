import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShoppingCart, Menu, X, Phone, Mail } from 'lucide-react'
import Logo from './Logo'
import { useCart } from '../context/CartContext'
import { CONTACTO } from '../config'

const RUTAS_ASISTENTE = [
  '/',
  '/presupuesto',
  '/recomendacion',
  '/personalizar',
  '/servicios',
]

const enlaces = [
  { to: '/', etiqueta: 'Armar mi PC', activo: (ruta) => RUTAS_ASISTENTE.includes(ruta) },
  { to: '/perifericos', etiqueta: 'Periféricos', activo: (ruta) => ruta.startsWith('/perifericos') },
  { href: '#contacto', etiqueta: 'Contacto' },
]

function NavItem({ enlace, activo, movil, onClick }) {
  const base = movil
    ? 'flex min-h-12 items-center rounded-xl px-4 text-base font-semibold'
    : 'inline-flex min-h-10 items-center rounded-lg px-4 text-sm font-semibold'
  const estado = activo
    ? 'bg-brand/20 text-white'
    : 'text-slate-300 hover:bg-white/10 hover:text-white'
  const clase = `${base} transition ${estado}`

  if (enlace.to) {
    return (
      <Link
        to={enlace.to}
        onClick={onClick}
        aria-current={activo ? 'page' : undefined}
        className={clase}
      >
        {enlace.etiqueta}
      </Link>
    )
  }

  return (
    <a href={enlace.href} onClick={onClick} className={clase}>
      {enlace.etiqueta}
    </a>
  )
}

export default function Header() {
  const { pathname } = useLocation()
  const { cantidad, abrir } = useCart()
  const [menuAbierto, setMenuAbierto] = useState(false)

  // Cerrar el menú móvil con Escape
  useEffect(() => {
    if (!menuAbierto) return
    const onKey = (e) => e.key === 'Escape' && setMenuAbierto(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menuAbierto])

  const cerrarMenu = () => setMenuAbierto(false)

  const abrirCarrito = () => {
    setMenuAbierto(false)
    abrir()
  }

  return (
    <>
      {/* Barra superior (solo tablet y escritorio) */}
      <div className="hidden border-b border-white/10 bg-black/40 text-xs text-slate-300 sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-1.5">
          <p>Asesoría gratuita para armar tu PC ideal</p>
          <div className="flex items-center gap-5">
            <a
              href={CONTACTO.telefonoLink}
              className="flex items-center gap-1.5 hover:text-white"
            >
              <Phone className="h-3.5 w-3.5" />
              {CONTACTO.telefono}
            </a>
            <a
              href={`mailto:${CONTACTO.email}`}
              className="flex items-center gap-1.5 hover:text-white"
            >
              <Mail className="h-3.5 w-3.5" />
              {CONTACTO.email}
            </a>
          </div>
        </div>
      </div>

      {/* Barra principal */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-night/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-8">
          <Logo />

          {/* Menú de escritorio */}
          <nav aria-label="Principal" className="hidden items-center gap-1 md:flex">
            {enlaces.map((enlace) => (
              <NavItem
                key={enlace.etiqueta}
                enlace={enlace}
                activo={enlace.activo ? enlace.activo(pathname) : false}
              />
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-1">
            {/* Carrito */}
            <button
              onClick={abrirCarrito}
              aria-label={`Abrir carrito, ${cantidad} ${cantidad === 1 ? 'producto' : 'productos'}`}
              className="relative flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-white/10"
            >
              <ShoppingCart className="h-6 w-6" />
              {cantidad > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-extrabold text-night">
                  {cantidad}
                </span>
              )}
            </button>

            {/* Botón hamburguesa (solo móvil) */}
            <button
              onClick={() => setMenuAbierto((v) => !v)}
              aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={menuAbierto}
              aria-controls="menu-movil"
              className="flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-white/10 md:hidden"
            >
              {menuAbierto ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        {menuAbierto && (
          <nav
            id="menu-movil"
            aria-label="Principal"
            className="border-t border-white/10 px-4 pb-3 pt-2 md:hidden"
          >
            <ul className="space-y-1">
              {enlaces.map((enlace) => (
                <li key={enlace.etiqueta}>
                  <NavItem
                    enlace={enlace}
                    movil
                    activo={enlace.activo ? enlace.activo(pathname) : false}
                    onClick={cerrarMenu}
                  />
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>
    </>
  )
}
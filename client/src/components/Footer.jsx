import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { CONTACTO, NOMBRE_TIENDA, WHATSAPP_NUMBER } from '../config'

const enlaceClase =
  'inline-flex min-h-8 items-center text-slate-300 transition hover:text-white'

const tituloClase = 'mb-3 text-sm font-bold uppercase tracking-wider text-white'

export default function Footer() {
  const { abrir, cantidad } = useCart()
  const anio = new Date().getFullYear()

  return (
    <footer
      id="contacto"
      className="relative border-t border-white/10 bg-black/30"
    >
      <div
        className="mx-auto max-w-7xl px-4 pt-10 sm:px-8"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Marca */}
          <div>
            <p className="text-2xl font-bold">
              Build<span className="text-brand">Tech</span>
            </p>
            <p className="mt-1 text-sm text-slate-300">
              Construye. Rinde. Disfruta.
            </p>
            <p className="mt-3 max-w-xs text-sm text-slate-400">
              Computadores a tu medida para estudio, trabajo, gaming, diseño y
              más. Te ayudamos a elegir, armar y mantener tu equipo.
            </p>
          </div>

          {/* Enlaces */}
          <nav aria-label="Enlaces del sitio">
            <h3 className={tituloClase}>Navegación</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <Link to="/" className={enlaceClase}>
                  Armar mi PC
                </Link>
              </li>
              <li>
                <Link to="/perifericos" className={enlaceClase}>
                  Periféricos
                </Link>
              </li>
              <li>
                <Link to="/presupuesto" className={enlaceClase}>
                  Presupuesto
                </Link>
              </li>
              <li>
                <Link to="/personalizar" className={enlaceClase}>
                  Personalizar PC
                </Link>
              </li>
              <li>
                <Link to="/servicios" className={enlaceClase}>
                  Servicios
                </Link>
              </li>
              <li>
                <button onClick={abrir} className={enlaceClase}>
                  Mi carrito{cantidad > 0 ? ` (${cantidad})` : ''}
                </button>
              </li>
            </ul>
          </nav>

          {/* Contacto */}
          <div>
            <h3 className={tituloClase}>Contáctanos</h3>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                <a href={CONTACTO.telefonoLink} className="hover:text-white">
                  {CONTACTO.telefono}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  Escríbenos por WhatsApp
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                <a
                  href={`mailto:${CONTACTO.email}`}
                  className="break-all hover:text-white"
                >
                  {CONTACTO.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                <span>{CONTACTO.direccion}</span>
              </li>
            </ul>
          </div>

          {/* Horario y redes */}
          <div>
            <h3 className={tituloClase}>Horario de atención</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              {CONTACTO.horario.map((linea) => (
                <li key={linea} className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                  <span>{linea}</span>
                </li>
              ))}
            </ul>

            <h3 className={`${tituloClase} mt-6`}>Síguenos</h3>
            <ul className="flex flex-wrap gap-2">
              {CONTACTO.redes.map((red) => (
                <li key={red.nombre}>
                  <a
                    href={red.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-10 items-center rounded-full border border-white/20 px-4 text-sm text-slate-200 transition hover:border-brand hover:bg-brand"
                  >
                    {red.nombre}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Franja inferior */}
        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-white/10 py-5 text-center text-xs text-slate-400 sm:flex-row sm:text-left">
          <p>
            © {anio} {NOMBRE_TIENDA}. Todos los derechos reservados.
          </p>
          <p>Proyecto académico · Los precios son referenciales.</p>
        </div>
      </div>
    </footer>
  )
}
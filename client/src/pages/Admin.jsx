import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Lock,
  LogOut,
  RefreshCw,
  Search,
  ChevronDown,
  MessageCircle,
  Inbox,
  AlertTriangle,
  Loader2,
  MapPin,
  Banknote,
  Landmark,
} from 'lucide-react'
import SiteLayout from '../components/SiteLayout'
import {
  leerToken,
  guardarToken,
  borrarToken,
  listarCotizaciones,
  cambiarEstado,
} from '../utils/adminApi'
import { formatCOP } from '../utils/format'

const ESTADOS = [
  { id: 'nueva', etiqueta: 'Nueva', clase: 'bg-amber-100 text-amber-800' },
  { id: 'contactada', etiqueta: 'Contactada', clase: 'bg-sky-100 text-sky-800' },
  { id: 'cerrada', etiqueta: 'Cerrada', clase: 'bg-green-100 text-green-800' },
  { id: 'descartada', etiqueta: 'Descartada', clase: 'bg-slate-200 text-slate-700' },
]

const estadoDe = (id) => ESTADOS.find((e) => e.id === id) ?? ESTADOS[0]

const PAGOS = {
  efectivo: {
    etiqueta: 'Efectivo',
    icon: Banknote,
    clase: 'bg-emerald-100 text-emerald-800',
  },
  transferencia: {
    etiqueta: 'Transferencia',
    icon: Landmark,
    clase: 'bg-violet-100 text-violet-800',
  },
}

// Para que la búsqueda ignore mayúsculas y tildes
const normalizar = (texto) =>
  String(texto ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

// SQLite guardaba la fecha en UTC como "2026-11-16 21:14:00"; el servidor
// actual devuelve el mismo formato.
const formatearFecha = (valor) => {
  const fecha = new Date(`${String(valor).replace(' ', 'T')}Z`)
  if (Number.isNaN(fecha.getTime())) return valor
  return fecha.toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })
}

// Si el teléfono tiene 10 dígitos (Colombia), le agrega el 57
const numeroWhatsApp = (telefono) => {
  const digitos = String(telefono).replace(/\D/g, '')
  return digitos.length === 10 ? `57${digitos}` : digitos
}

const enlaceCliente = (c) =>
  `https://wa.me/${numeroWhatsApp(c.telefono)}?text=${encodeURIComponent(
    `Hola ${c.nombre}, te escribimos de BuildTech por tu cotización #${c.id}.`,
  )}`

// "Cra 10 # 20-30, Medellín, Antioquia" (omite lo que esté vacío)
const ubicacionDe = (c) =>
  [c.direccion, c.ciudad, c.departamento].filter(Boolean).join(', ')

const enlaceMapa = (c) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${ubicacionDe(c)}, Colombia`,
  )}`

// ---------- Pantalla de acceso ----------
function Acceso({ aviso, onEntrar }) {
  const [clave, setClave] = useState('')

  const enviar = (e) => {
    e.preventDefault()
    if (clave.trim()) onEntrar(clave.trim())
  }

  return (
    <main className="flex flex-1 items-center justify-center py-10">
      <form
        onSubmit={enviar}
        className="w-full max-w-sm rounded-3xl bg-white p-6 text-slate-800 shadow-2xl sm:p-8"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/15 text-brand">
            <Lock className="h-6 w-6" />
          </span>
          <div>
            <h2 className="text-xl font-extrabold">Panel de administración</h2>
            <p className="text-sm text-slate-500">Solo para el equipo de BuildTech</p>
          </div>
        </div>

        {aviso && (
          <p
            role="alert"
            className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {aviso}
          </p>
        )}

        <label className="mt-5 block text-sm font-semibold">
          Clave de acceso
          <input
            type="password"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            autoComplete="current-password"
            placeholder="Ingresa la contraseña"
            className="mt-1 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 py-2 font-normal text-slate-800 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/30"
          />
        </label>

        <button
          type="submit"
          className="mt-4 min-h-12 w-full rounded-xl bg-brand font-bold text-white transition hover:bg-brand-dark"
        >
          Entrar
        </button>
      </form>
    </main>
  )
}

// ---------- Tarjeta de una cotización ----------
function TarjetaCotizacion({ cotizacion: c, abierta, guardando, onAlternar, onEstado }) {
  const estado = estadoDe(c.estado)
  const pago = PAGOS[c.metodo_pago]
  const ubicacion = ubicacionDe(c)

  return (
    <li className="overflow-hidden rounded-2xl bg-white text-slate-800 shadow-lg">
      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-500">
              Cotización #{c.id} · {formatearFecha(c.creada_en)}
            </p>
            <h3 className="mt-0.5 break-words text-lg font-extrabold">{c.nombre}</h3>
            <p className="text-sm text-slate-600">{c.telefono}</p>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-1">
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${estado.clase}`}
            >
              {estado.etiqueta}
            </span>
            {pago && (
              <span
                className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${pago.clase}`}
              >
                <pago.icon className="h-3.5 w-3.5" />
                {pago.etiqueta}
              </span>
            )}
          </div>
        </div>

        {/* Datos de entrega (las cotizaciones antiguas pueden no tenerlos) */}
        {ubicacion && (
          <div className="mt-3 rounded-xl bg-slate-50 p-3 text-sm">
            <p className="flex items-start gap-2 font-semibold">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
              <span className="min-w-0 break-words">{ubicacion}</span>
            </p>
            {c.descripcion_domicilio && (
              <p className="mt-1 break-words pl-6 text-slate-600">
                {c.descripcion_domicilio}
              </p>
            )}
            {c.direccion && (
              <a
                href={enlaceMapa(c)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex min-h-9 items-center pl-6 text-sm font-bold text-brand hover:underline"
              >
                Ver en el mapa
              </a>
            )}
          </div>
        )}

        <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-2xl font-extrabold text-brand">{formatCOP(c.total)}</p>
          <p className="text-sm text-slate-500">
            {c.cantidad_items} {c.cantidad_items === 1 ? 'ítem' : 'ítems'}
          </p>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto_auto]">
          {/* Cambiar estado */}
          <label className="relative block">
            <span className="sr-only">Estado de la cotización #{c.id}</span>
            <select
              value={c.estado}
              disabled={guardando}
              onChange={(e) => onEstado(c.id, e.target.value)}
              className="min-h-11 w-full appearance-none rounded-xl border border-slate-300 bg-white py-2 pl-4 pr-10 text-sm font-semibold text-slate-800 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/30 disabled:opacity-60"
            >
              {ESTADOS.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.etiqueta}
                </option>
              ))}
            </select>
            {guardando ? (
              <Loader2 className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-slate-500" />
            ) : (
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
            )}
          </label>

          <a
            href={enlaceCliente(c)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-green-600 px-4 text-sm font-bold text-white transition hover:bg-green-700"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>

          <button
            onClick={() => onAlternar(c.id)}
            aria-expanded={abierta}
            className="min-h-11 rounded-xl border-2 border-brand px-4 text-sm font-bold text-brand transition hover:bg-brand hover:text-white"
          >
            {abierta ? 'Ocultar detalle' : 'Ver detalle'}
          </button>
        </div>
      </div>

      {abierta && (
        <pre className="max-h-96 overflow-auto whitespace-pre-wrap break-words border-t border-slate-200 bg-slate-50 p-4 font-sans text-sm text-slate-700 sm:p-5">
          {c.mensaje}
        </pre>
      )}
    </li>
  )
}

// ---------- Página ----------
export default function Admin() {
  const [token, setToken] = useState(leerToken)
  const [cotizaciones, setCotizaciones] = useState([])
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [avisoAcceso, setAvisoAcceso] = useState('')
  const [filtro, setFiltro] = useState('todas')
  const [busqueda, setBusqueda] = useState('')
  const [abierta, setAbierta] = useState(null)
  const [guardandoId, setGuardandoId] = useState(null)

  const salir = useCallback((aviso = '') => {
    borrarToken()
    setToken('')
    setCotizaciones([])
    setError('')
    setAbierta(null)
    setAvisoAcceso(aviso)
  }, [])

  const cargar = useCallback(
    async (clave) => {
      setCargando(true)
      setError('')
      try {
        const datos = await listarCotizaciones(clave)
        setCotizaciones(datos)
        guardarToken(clave)
      } catch (e) {
        if (e.estado === 401) {
          salir('La clave no es correcta o tu sesión expiró.')
        } else if (e.estado === 503) {
          salir('El servidor no tiene configurado el ADMIN_TOKEN.')
        } else {
          setError(e.message)
        }
      } finally {
        setCargando(false)
      }
    },
    [salir],
  )

  // Cargar las cotizaciones al entrar o al iniciar sesión
  useEffect(() => {
    if (token) cargar(token)
  }, [token, cargar])

  const entrar = (clave) => {
    setAvisoAcceso('')
    setToken(clave)
  }

  const actualizarEstado = async (id, estado) => {
    setGuardandoId(id)
    setError('')
    try {
      const fila = await cambiarEstado(token, id, estado)
      setCotizaciones((prev) => prev.map((c) => (c.id === id ? fila : c)))
    } catch (e) {
      if (e.estado === 401) salir('Tu sesión expiró. Vuelve a entrar.')
      else setError(e.message)
    } finally {
      setGuardandoId(null)
    }
  }

  const conteos = useMemo(() => {
    const base = { todas: cotizaciones.length }
    ESTADOS.forEach((e) => {
      base[e.id] = cotizaciones.filter((c) => c.estado === e.id).length
    })
    return base
  }, [cotizaciones])

  const visibles = useMemo(() => {
    const q = normalizar(busqueda.trim())
    return cotizaciones.filter((c) => {
      if (filtro !== 'todas' && c.estado !== filtro) return false
      if (!q) return true

      const texto = normalizar(
        [
          c.id,
          c.nombre,
          c.telefono,
          c.direccion,
          c.ciudad,
          c.departamento,
          c.descripcion_domicilio,
          PAGOS[c.metodo_pago]?.etiqueta,
        ].join(' '),
      )
      return texto.includes(q)
    })
  }, [cotizaciones, filtro, busqueda])

  // ---------- Sin sesión ----------
  if (!token) {
    return (
      <SiteLayout>
        <Acceso aviso={avisoAcceso} onEntrar={entrar} />
      </SiteLayout>
    )
  }

  // ---------- Con sesión ----------
  const filtros = [{ id: 'todas', etiqueta: 'Todas' }, ...ESTADOS]

  return (
    <SiteLayout>
      <main className="flex flex-1 flex-col gap-5 py-6">
        {/* Título y acciones */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-3xl font-extrabold sm:text-4xl">Cotizaciones</h2>
            <p className="mt-1 text-sm text-slate-300 sm:text-base">
              Solicitudes recibidas desde el sitio.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => cargar(token)}
              disabled={cargando}
              className="flex min-h-11 items-center gap-2 rounded-xl border-2 border-brand px-4 text-sm font-bold transition hover:bg-brand disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4 ${cargando ? 'animate-spin' : ''}`} />
              Actualizar
            </button>
            <button
              onClick={() => salir()}
              className="flex min-h-11 items-center gap-2 rounded-xl px-4 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
            >
              <LogOut className="h-4 w-4" />
              Salir
            </button>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Búsqueda */}
        <label className="relative block">
          <span className="sr-only">Buscar cotizaciones</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
          <input
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre, teléfono, dirección, ciudad, pago o número…"
            className="min-h-12 w-full rounded-xl border border-slate-300 bg-white py-2 pl-12 pr-4 text-slate-800 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/30"
          />
        </label>

        {/* Filtros por estado (con scroll horizontal en móvil) */}
        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-2 pb-1 sm:flex-wrap">
            {filtros.map((f) => (
              <button
                key={f.id}
                onClick={() => setFiltro(f.id)}
                aria-pressed={filtro === f.id}
                className={`flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition ${
                  filtro === f.id
                    ? 'border-brand bg-brand text-white'
                    : 'border-white/20 text-slate-200 hover:bg-white/10'
                }`}
              >
                {f.etiqueta}
                <span className="rounded-full bg-black/30 px-2 py-0.5 text-xs">
                  {conteos[f.id]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Lista */}
        {cargando && cotizaciones.length === 0 ? (
          <div className="flex items-center justify-center gap-3 py-16 text-slate-300">
            <Loader2 className="h-6 w-6 animate-spin" />
            Cargando cotizaciones…
          </div>
        ) : visibles.length > 0 ? (
          <ul className="grid gap-4 lg:grid-cols-2">
            {visibles.map((c) => (
              <TarjetaCotizacion
                key={c.id}
                cotizacion={c}
                abierta={abierta === c.id}
                guardando={guardandoId === c.id}
                onAlternar={(id) => setAbierta((actual) => (actual === id ? null : id))}
                onEstado={actualizarEstado}
              />
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-12 text-center">
            <Inbox className="h-14 w-14 text-slate-400" strokeWidth={1.2} />
            <p className="text-lg font-bold">
              {cotizaciones.length === 0
                ? 'Aún no hay cotizaciones'
                : 'No hay resultados con esos filtros'}
            </p>
            <p className="text-sm text-slate-300">
              {cotizaciones.length === 0
                ? 'Cuando un cliente solicite una, aparecerá aquí.'
                : 'Prueba con otra búsqueda o cambia el estado.'}
            </p>
          </div>
        )}
      </main>
    </SiteLayout>
  )
}
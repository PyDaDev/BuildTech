import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { resolverItem, MAX_UNIDADES } from '../utils/cart'

const CartContext = createContext(null)
const STORAGE_KEY = 'buildtech-cart'

function leerGuardado() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const data = raw ? JSON.parse(raw) : []
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

// (crypto.randomUUID no existe en http://192.168.x.x, por eso usamos esto)
const nuevoId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

export function CartProvider({ children }) {
  const [guardados, setGuardados] = useState(leerGuardado)
  const [abierto, setAbierto] = useState(false)

  // Guardar cada vez que cambie el carrito
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(guardados))
    } catch {
      // Si el navegador bloquea el almacenamiento, el carrito sigue funcionando en memoria
    }
  }, [guardados])

  // Ítems completos (si alguno quedó inválido por cambios en el catálogo, se omite)
  const items = useMemo(
    () =>
      guardados
        .map((g) => {
          try {
            return resolverItem(g)
          } catch {
            return null
          }
        })
        .filter(Boolean),
    [guardados],
  )

  const total = items.reduce((suma, i) => suma + i.totalFinal, 0)

  // Unidades totales: cada PC cuenta 1 y cada periférico cuenta por su cantidad
  const cantidad = items.reduce(
    (suma, i) => suma + (i.tipo === 'periferico' ? i.cantidad : 1),
    0,
  )

  // ----- PCs -----
  const agregar = (item) =>
    setGuardados((prev) => [...prev, { ...item, tipo: 'pc', id: nuevoId() }])

  // ----- Periféricos -----
  const agregarPeriferico = (productoId) =>
    setGuardados((prev) => {
      const existente = prev.find(
        (i) => i.tipo === 'periferico' && i.productoId === productoId,
      )
      if (!existente) {
        return [
          ...prev,
          { id: nuevoId(), tipo: 'periferico', productoId, cantidad: 1 },
        ]
      }
      return prev.map((i) =>
        i === existente
          ? { ...i, cantidad: Math.min(i.cantidad + 1, MAX_UNIDADES) }
          : i,
      )
    })

  const cambiarCantidad = (id, delta) =>
    setGuardados((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, cantidad: Math.max(1, Math.min(i.cantidad + delta, MAX_UNIDADES)) }
          : i,
      ),
    )

  // Cuántas unidades de un periférico hay en el carrito
  const cantidadDe = (productoId) =>
    guardados.find((i) => i.tipo === 'periferico' && i.productoId === productoId)
      ?.cantidad ?? 0

  // ----- Comunes -----
  const quitar = (id) =>
    setGuardados((prev) => prev.filter((i) => i.id !== id))

  const vaciar = () => setGuardados([])

  return (
    <CartContext.Provider
      value={{
        items,
        cantidad,
        total,
        agregar,
        agregarPeriferico,
        cambiarCantidad,
        cantidadDe,
        quitar,
        vaciar,
        abierto,
        abrir: () => setAbierto(true),
        cerrar: () => setAbierto(false),
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider')
  return ctx
}
import {
  Wrench,
  Settings,
  Gauge,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  MessageCircle,
} from 'lucide-react'

// Precios ilustrativos en COP.
// "incluido: true" = va siempre con la compra y no se puede quitar.
export const servicios = [
  {
    id: 'armado',
    icon: Wrench,
    nombre: 'Armado y organización de componentes',
    detalle: 'Ensamblado profesional con cableado ordenado.',
    precio: 0,
    incluido: true,
  },
  {
    id: 'instalacion',
    icon: Settings,
    nombre: 'Instalación y configuración inicial',
    detalle: 'Windows, controladores y programas básicos listos para usar.',
    precio: 90000,
  },
  {
    id: 'pruebas',
    icon: Gauge,
    nombre: 'Prueba de rendimiento',
    detalle: 'Pruebas de estabilidad y temperaturas antes de entregarlo.',
    precio: 0,
    incluido: true,
  },
  {
    id: 'garantia',
    icon: ShieldCheck,
    nombre: 'Garantía extendida (12 meses)',
    detalle: 'Cubre fallas de fábrica. Incluye 3 meses de garantía básica.',
    precio: 150000,
  },
  {
    id: 'mantenimiento',
    icon: Sparkles,
    nombre: 'Mantenimiento preventivo',
    detalle: 'Limpieza interna y cambio de pasta térmica a los 6 meses.',
    precio: 120000,
  },
  {
    id: 'actualizacion',
    icon: RefreshCw,
    nombre: 'Actualización de componentes',
    detalle: 'Mano de obra incluida cuando quieras mejorar una pieza.',
    precio: 60000,
  },
  {
    id: 'asesoria',
    icon: MessageCircle,
    nombre: 'Asesoría posventa',
    detalle: 'Resolvemos tus dudas por WhatsApp después de la compra.',
    precio: 0,
    incluido: true,
  },
]

// Servicios opcionales que vienen marcados al entrar
export const serviciosPorDefecto = ['instalacion']
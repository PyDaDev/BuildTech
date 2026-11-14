import { Monitor, Keyboard, Mouse, Headphones, Webcam, Usb } from 'lucide-react'

export const categorias = [
  { id: 'monitores', nombre: 'Monitores', icon: Monitor },
  { id: 'teclados', nombre: 'Teclados', icon: Keyboard },
  { id: 'mouse', nombre: 'Mouse', icon: Mouse },
  { id: 'audio', nombre: 'Audio', icon: Headphones },
  { id: 'webcams', nombre: 'Webcams y micrófonos', icon: Webcam },
  { id: 'accesorios', nombre: 'Accesorios', icon: Usb },
]

export const categoriaDe = (id) =>
  categorias.find((c) => c.id === id) ?? categorias[0]

// Precios ilustrativos en COP.
// Para usar una foto real, agrega el campo "imagen" con una ruta dentro de
// client/public, por ejemplo: imagen: '/perifericos/monitor-24.png'
export const perifericos = [
  // ---------- Monitores ----------
  {
    id: 'mon-24-fhd',
    categoria: 'monitores',
    nombre: 'Monitor 24" Full HD IPS',
    specs: ['1920 × 1080 (Full HD)', 'Panel IPS, 75 Hz', 'HDMI y VGA'],
    precio: 489000,
    destacado: true,
  },
  {
    id: 'mon-27-qhd',
    categoria: 'monitores',
    nombre: 'Monitor gamer 27" QHD 165 Hz',
    specs: ['2560 × 1440 (QHD)', 'Panel IPS, 165 Hz', 'HDMI y DisplayPort'],
    precio: 1190000,
    destacado: true,
  },
  {
    id: 'mon-27-4k',
    categoria: 'monitores',
    nombre: 'Monitor 27" 4K para diseño',
    specs: ['3840 × 2160 (4K)', 'Panel IPS, 60 Hz', 'Colores precisos para edición'],
    precio: 1690000,
  },
  {
    id: 'mon-32-curvo',
    categoria: 'monitores',
    nombre: 'Monitor curvo 32" QHD 144 Hz',
    specs: ['2560 × 1440 (QHD)', 'Panel curvo VA, 144 Hz', 'HDMI y DisplayPort'],
    precio: 1490000,
  },

  // ---------- Teclados ----------
  {
    id: 'tec-membrana',
    categoria: 'teclados',
    nombre: 'Teclado de membrana en español',
    specs: ['Distribución en español', 'Conexión USB', 'Teclas silenciosas'],
    precio: 59000,
  },
  {
    id: 'tec-tkl',
    categoria: 'teclados',
    nombre: 'Teclado mecánico TKL RGB',
    specs: ['Formato compacto sin teclado numérico', 'Switches mecánicos', 'Iluminación RGB'],
    precio: 219000,
    destacado: true,
  },
  {
    id: 'tec-full',
    categoria: 'teclados',
    nombre: 'Teclado mecánico completo',
    specs: ['Formato 100 % con teclado numérico', 'Switches rojos lineales', 'Cable USB trenzado'],
    precio: 289000,
  },
  {
    id: 'tec-bt',
    categoria: 'teclados',
    nombre: 'Teclado inalámbrico compacto',
    specs: ['Bluetooth y receptor USB', 'Batería recargable', 'Ideal para oficina y estudio'],
    precio: 129000,
  },

  // ---------- Mouse ----------
  {
    id: 'mou-basico',
    categoria: 'mouse',
    nombre: 'Mouse óptico USB',
    specs: ['Sensor óptico 1.200 DPI', 'Conexión USB', 'Diseño ambidiestro'],
    precio: 25000,
  },
  {
    id: 'mou-gamer',
    categoria: 'mouse',
    nombre: 'Mouse gamer RGB 12.000 DPI',
    specs: ['Hasta 12.000 DPI', '6 botones programables', 'Iluminación RGB'],
    precio: 99000,
    destacado: true,
  },
  {
    id: 'mou-ergo',
    categoria: 'mouse',
    nombre: 'Mouse inalámbrico ergonómico',
    specs: ['Diseño que reduce la fatiga', 'Bluetooth y receptor USB', 'Batería de larga duración'],
    precio: 119000,
  },
  {
    id: 'mou-pro',
    categoria: 'mouse',
    nombre: 'Mouse gamer inalámbrico ultraligero',
    specs: ['Menos de 70 g', 'Conexión inalámbrica de baja latencia', 'Sensor de alta precisión'],
    precio: 249000,
  },

  // ---------- Audio ----------
  {
    id: 'aud-usb',
    categoria: 'audio',
    nombre: 'Audífonos con micrófono USB',
    specs: ['Micrófono con cancelación de ruido', 'Almohadillas suaves', 'Ideal para clases virtuales'],
    precio: 79000,
  },
  {
    id: 'aud-gamer',
    categoria: 'audio',
    nombre: 'Audífonos gamer 7.1 RGB',
    specs: ['Sonido envolvente virtual 7.1', 'Micrófono desmontable', 'Iluminación RGB'],
    precio: 189000,
    destacado: true,
  },
  {
    id: 'aud-bt',
    categoria: 'audio',
    nombre: 'Audífonos Bluetooth con cancelación de ruido',
    specs: ['Cancelación activa de ruido', 'Hasta 30 h de batería', 'Plegables'],
    precio: 259000,
  },
  {
    id: 'aud-parlantes',
    categoria: 'audio',
    nombre: 'Parlantes 2.1 con subwoofer',
    specs: ['Subwoofer de madera', 'Control de volumen y graves', 'Entrada de 3,5 mm'],
    precio: 149000,
  },

  // ---------- Webcams y micrófonos ----------
  {
    id: 'cam-hd',
    categoria: 'webcams',
    nombre: 'Webcam HD 720p',
    specs: ['1280 × 720 a 30 fps', 'Micrófono integrado', 'Plug and play por USB'],
    precio: 69000,
  },
  {
    id: 'cam-fhd',
    categoria: 'webcams',
    nombre: 'Webcam Full HD 1080p',
    specs: ['1920 × 1080 a 30 fps', 'Enfoque automático', 'Micrófono estéreo'],
    precio: 139000,
    destacado: true,
  },
  {
    id: 'cam-mic',
    categoria: 'webcams',
    nombre: 'Micrófono USB de condensador',
    specs: ['Patrón cardioide', 'Ideal para streaming y podcasts', 'Soporte de mesa incluido'],
    precio: 179000,
  },

  // ---------- Accesorios ----------
  {
    id: 'acc-pad',
    categoria: 'accesorios',
    nombre: 'Mousepad XL 90 × 40 cm',
    specs: ['Superficie de tela suave', 'Base antideslizante', 'Bordes cosidos'],
    precio: 49000,
  },
  {
    id: 'acc-hub',
    categoria: 'accesorios',
    nombre: 'Hub USB 3.0 de 4 puertos',
    specs: ['Transferencia de hasta 5 Gbps', 'Cable de 30 cm', 'Compatible con PC y portátiles'],
    precio: 45000,
  },
  {
    id: 'acc-hdmi',
    categoria: 'accesorios',
    nombre: 'Cable HDMI 2.1 de 2 metros',
    specs: ['Compatible con 4K a 120 Hz', 'Conectores bañados en oro', 'Blindaje contra interferencias'],
    precio: 39000,
  },
  {
    id: 'acc-soporte',
    categoria: 'accesorios',
    nombre: 'Soporte ajustable para monitor',
    specs: ['Altura e inclinación regulables', 'Para monitores de 17" a 32"', 'Gestión de cables'],
    precio: 129000,
  },
  {
    id: 'acc-ups',
    categoria: 'accesorios',
    nombre: 'UPS 650 VA con regulador',
    specs: ['Respaldo ante cortes de energía', '6 tomas protegidas', 'Protección contra picos de voltaje'],
    precio: 259000,
  },
]
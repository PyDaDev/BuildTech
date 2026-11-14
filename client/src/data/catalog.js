// Precios ilustrativos en COP. Ajústalos a tu proveedor.
// "nivel" (0 a 5) es el rendimiento relativo, se usa para detectar desequilibrios.

export const cpus = [
  {
    id: 'r5-5500',
    nombre: 'Ryzen 5 5500',
    precio: 400000,
    igpu: false,
    coolerIncluido: true,
    nivel: 1,
    watts: 65,
    socket: 'AM4',
    ram: 'DDR4',
    placa: { nombre: 'A520M', precio: 300000 },
  },
  {
    id: 'r5-5600g',
    nombre: 'Ryzen 5 5600G',
    precio: 580000,
    igpu: true,
    coolerIncluido: true,
    nivel: 1,
    watts: 65,
    socket: 'AM4',
    ram: 'DDR4',
    placa: { nombre: 'B550M', precio: 400000 },
  },
  {
    id: 'r5-7600',
    nombre: 'Ryzen 5 7600',
    precio: 900000,
    igpu: true,
    coolerIncluido: true,
    nivel: 2,
    watts: 65,
    socket: 'AM5',
    ram: 'DDR5',
    placa: { nombre: 'B650M', precio: 650000 },
  },
  {
    id: 'r7-7700',
    nombre: 'Ryzen 7 7700',
    precio: 1150000,
    igpu: true,
    coolerIncluido: true,
    nivel: 3,
    watts: 65,
    socket: 'AM5',
    ram: 'DDR5',
    placa: { nombre: 'B650M', precio: 700000 },
  },
  {
    id: 'r7-7800x3d',
    nombre: 'Ryzen 7 7800X3D',
    precio: 1800000,
    igpu: true,
    coolerIncluido: false, // no trae cooler: hay que comprarlo aparte
    nivel: 4,
    watts: 120,
    socket: 'AM5',
    ram: 'DDR5',
    placa: { nombre: 'B650', precio: 800000 },
  },
]

export const coolers = [
  { id: 'stock', nombre: 'Cooler original del procesador', precio: 0, stock: true },
  { id: 'cooler-aire', nombre: 'Torre de aire 120 mm', precio: 120000 },
  { id: 'cooler-aire-dual', nombre: 'Torre de aire doble ventilador', precio: 200000 },
  { id: 'cooler-liquido', nombre: 'Refrigeración líquida 240 mm', precio: 380000 },
]

export const rams = [
  { id: 'ram-8', nombre: '8 GB', gb: 8, precio: { DDR4: 130000, DDR5: 190000 } },
  { id: 'ram-16', nombre: '16 GB', gb: 16, precio: { DDR4: 230000, DDR5: 330000 } },
  { id: 'ram-32', nombre: '32 GB', gb: 32, precio: { DDR4: 420000, DDR5: 600000 } },
  { id: 'ram-64', nombre: '64 GB', gb: 64, precio: { DDR4: 800000, DDR5: 1100000 } },
]

export const storages = [
  { id: 'ssd-500', nombre: 'SSD 500 GB NVMe', precio: 190000 },
  { id: 'ssd-1tb', nombre: 'SSD 1 TB NVMe', precio: 300000 },
  { id: 'ssd-2tb', nombre: 'SSD 2 TB NVMe', precio: 560000 },
  { id: 'ssd-4tb', nombre: 'SSD 4 TB NVMe', precio: 1100000 },
]

export const gpus = [
  {
    id: 'igpu',
    nombre: 'Gráficos integrados',
    gama: 'Integrada',
    precio: 0,
    watts: 0,
    nivel: 0,
    integrada: true,
  },
  { id: 'rx-6600', nombre: 'Radeon RX 6600 8 GB', gama: 'Entrada', precio: 850000, watts: 132, nivel: 1 },
  { id: 'rtx-4060', nombre: 'GeForce RTX 4060 8 GB', gama: 'Media', precio: 1350000, watts: 115, nivel: 2 },
  { id: 'rtx-5060ti', nombre: 'GeForce RTX 5060 Ti 16 GB', gama: 'Media-alta', precio: 1900000, watts: 180, nivel: 3 },
  { id: 'rtx-5070', nombre: 'GeForce RTX 5070 12 GB', gama: 'Alta', precio: 2500000, watts: 250, nivel: 4 },
  { id: 'rtx-5070ti', nombre: 'GeForce RTX 5070 Ti 16 GB', gama: 'Muy alta', precio: 3600000, watts: 300, nivel: 5 },
]

export const psus = [
  { id: 'psu-450', nombre: '450 W', watts: 450, precio: 150000 },
  { id: 'psu-550', nombre: '550 W', watts: 550, precio: 190000 },
  { id: 'psu-650', nombre: '650 W', watts: 650, precio: 240000 },
  { id: 'psu-750', nombre: '750 W', watts: 750, precio: 320000 },
  { id: 'psu-850', nombre: '850 W', watts: 850, precio: 420000 },
  { id: 'psu-1000', nombre: '1000 W', watts: 1000, precio: 600000 },
]

export const cases = [
  { id: 'case-basico', nombre: 'ATX básico', precio: 120000 },
  { id: 'case-ventilado', nombre: 'ATX con buena ventilación', precio: 200000 },
  { id: 'case-rgb', nombre: 'Diseño gamer RGB', precio: 300000 },
  { id: 'case-premium', nombre: 'Premium de alto flujo de aire', precio: 450000 },
]
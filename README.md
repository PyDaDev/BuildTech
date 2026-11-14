# 🖥️ BuildTech

**Construye. Rinde. Disfruta.**

BuildTech es un sitio web de venta de computadores con un **asistente paso a paso** que recomienda y personaliza el PC ideal según el uso y el presupuesto. Incluye carrito de compras, sección de periféricos y cotización por WhatsApp. Diseño responsivo, pensado para abrirse desde el celular.

> Proyecto universitario en desarrollo. Los precios y datos de contacto son ficticios o referenciales.

🔗 **Sitio en vivo:** _(agrega aquí tu enlace de Vercel)_

## ✨ Características

- **Asistente de 5 pasos:** Uso → Presupuesto → Recomendación → Personalización → Servicios
- **Motor de recomendación** basado en reglas: reparte el presupuesto según el uso (gaming, estudio, trabajo, diseño, programación y uso profesional)
- **Compatibilidad automática:** tipo de RAM según el procesador (DDR4/DDR5), placa madre, gráficos integrados, potencia de la fuente y cooler
- **Aviso de desequilibrio** entre procesador y tarjeta gráfica (cuello de botella)
- **Personalización en tiempo real** con total, barra de progreso e indicador de presupuesto
- **Servicios adicionales:** instalación, garantía extendida, mantenimiento y más
- **Periféricos:** 23 productos en 6 categorías, con búsqueda, filtros y orden por precio
- **Carrito de compras** con panel lateral, cantidades y persistencia en `localStorage`
- **Cotización por WhatsApp** con el detalle completo de PCs, servicios y periféricos
- **Header y footer** tradicionales, con menú hamburguesa en móvil
- **Diseño responsivo** (móvil, tablet y escritorio)

## 🚧 Estado del proyecto

- [x] Configuración inicial del proyecto
- [x] Pantalla 1: Inicio y selección de uso
- [x] Pantalla 2: Presupuesto
- [x] Pantalla 3: Recomendación
- [x] Pantalla 4: Personalización
- [x] Pantalla 5: Servicios y cotización
- [x] Carrito de compras funcional
- [x] Header y footer
- [x] Sección de periféricos
- [x] Publicación en Vercel
- [ ] Página de inicio con presentación de la tienda
- [ ] Catálogo de componentes
- [ ] Backend con API y base de datos (guardar cotizaciones)
- [ ] Panel de administración
- [ ] Pagos en línea

## 🛠️ Tecnologías

| Área | Herramientas |
| --- | --- |
| Frontend | React, Vite, Tailwind CSS, React Router, Lucide React |
| Backend | Node.js, Express _(en preparación)_ |
| Despliegue | Vercel |
| Control de versiones | Git y GitHub |

## 🗺️ Rutas del sitio

| Ruta | Descripción |
| --- | --- |
| `/` | Paso 1: uso principal del PC |
| `/presupuesto` | Paso 2: rango de presupuesto |
| `/recomendacion` | Paso 3: PC recomendado |
| `/personalizar` | Paso 4: cambio de componentes |
| `/servicios` | Paso 5: servicios y cotización |
| `/perifericos` | Catálogo de periféricos |

## 📁 Estructura del proyecto

```
BuildTech/
├── client/                    # Aplicación React (interfaz)
│   ├── public/                # Imágenes estáticas
│   ├── src/
│   │   ├── components/        # Header, Footer, Stepper, CartDrawer, etc.
│   │   ├── context/           # Estado global (asistente y carrito)
│   │   ├── data/              # Catálogos: componentes, servicios, periféricos
│   │   ├── pages/             # Pantallas del sitio
│   │   ├── utils/             # Recomendación, compatibilidad, cotización
│   │   ├── App.jsx
│   │   ├── config.js          # Datos de contacto y número de WhatsApp
│   │   └── main.jsx
│   ├── index.html
│   └── vercel.json
├── server/                    # API con Node.js y Express (en preparación)
├── .gitignore
└── README.md
```

## 🚀 Cómo ejecutarlo en tu equipo

### Requisitos

- [Node.js](https://nodejs.org) (versión LTS)
- [Git](https://git-scm.com)

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/PyDaDev/BuildTech.git
cd BuildTech

# 2. Instalar dependencias del cliente
cd client
npm install

# 3. Iniciar el servidor de desarrollo
npm run dev
```

Abre en el navegador: `http://localhost:5173`

### Probar en el celular

Con el computador y el celular en la misma red Wi-Fi:

```bash
npm run dev -- --host
```

Abre en el celular la dirección que aparece en la línea `Network:`.

### Compilar para producción

```bash
npm run build
```

## ⚙️ Configuración

Los datos de contacto y el número de WhatsApp que recibe las cotizaciones están en `client/src/config.js`. El formato del número es código de país + número, sin `+` ni espacios (por ejemplo `573188806750`).

## 🧠 Cómo funciona la recomendación

1. Cada **uso** reparte el presupuesto con pesos distintos (por ejemplo, gaming destina cerca del 42 % a la tarjeta gráfica).
2. Para cada categoría se elige el mejor componente que quepa en su parte.
3. Con lo que sobra se **mejoran** componentes uno a uno sin pasar el tope.
4. Se valida la **compatibilidad** y se ajustan fuente y cooler.

Es un sistema basado en reglas con un catálogo reducido. Los precios y los niveles de rendimiento son referenciales.

## 🌐 Despliegue

El sitio se publica en **Vercel** conectado a este repositorio. Configuración:

- **Root Directory:** `client`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

El archivo `client/vercel.json` redirige todas las rutas a `index.html` para que recargar en `/servicios` o `/perifericos` no dé error 404. Cada `git push` a `main` actualiza el sitio automáticamente.

## 👤 Autor

**Tu Nombre**
GitHub: [@PyDaDev](https://github.com/PyDaDev)

## 📄 Licencia

Proyecto con fines académicos.
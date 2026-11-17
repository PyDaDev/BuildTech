import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { WizardProvider } from './context/WizardContext'
import { CartProvider } from './context/CartContext'
import CartDrawer from './components/CartDrawer'
import Landing from './pages/Landing'
import Home from './pages/Home'
import Budget from './pages/Budget'
import Recommendation from './pages/Recommendation'
import Customize from './pages/Customize'
import Services from './pages/Services'
import Peripherals from './pages/Peripherals'
import Privacy from './pages/Privacy'
import Admin from './pages/Admin'

// Al cambiar de página, vuelve al inicio de la pantalla
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])

  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <WizardProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/asistente" element={<Home />} />
            <Route path="/presupuesto" element={<Budget />} />
            <Route path="/recomendacion" element={<Recommendation />} />
            <Route path="/personalizar" element={<Customize />} />
            <Route path="/servicios" element={<Services />} />
            <Route path="/perifericos" element={<Peripherals />} />
            <Route path="/privacidad" element={<Privacy />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
          <CartDrawer />
        </CartProvider>
      </WizardProvider>
    </BrowserRouter>
  )
}
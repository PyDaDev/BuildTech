import { BrowserRouter, Routes, Route } from 'react-router-dom'
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
import Admin from './pages/Admin'

export default function App() {
  return (
    <BrowserRouter>
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
            <Route path="/admin" element={<Admin />} />
          </Routes>
          <CartDrawer />
        </CartProvider>
      </WizardProvider>
    </BrowserRouter>
  )
}
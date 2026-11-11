import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { WizardProvider } from './context/WizardContext'
import Home from './pages/Home'
import Budget from './pages/Budget'

export default function App() {
  return (
    <BrowserRouter>
      <WizardProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/presupuesto" element={<Budget />} />
        </Routes>
      </WizardProvider>
    </BrowserRouter>
  )
}
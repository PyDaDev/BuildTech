import { createContext, useContext, useState } from 'react'
import { serviciosPorDefecto } from '../data/services'

const WizardContext = createContext(null)

export function WizardProvider({ children }) {
  const [uso, setUso] = useState('gaming')
  const [presupuesto, setPresupuesto] = useState('3-4M')
  const [configuracion, setConfiguracion] = useState(null)
  const [servicios, setServicios] = useState(serviciosPorDefecto)

  return (
    <WizardContext.Provider
      value={{
        uso,
        setUso,
        presupuesto,
        setPresupuesto,
        configuracion,
        setConfiguracion,
        servicios,
        setServicios,
      }}
    >
      {children}
    </WizardContext.Provider>
  )
}

export function useWizard() {
  const ctx = useContext(WizardContext)
  if (!ctx) throw new Error('useWizard debe usarse dentro de WizardProvider')
  return ctx
}
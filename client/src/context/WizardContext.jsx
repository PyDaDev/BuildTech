import { createContext, useContext, useState } from 'react'

const WizardContext = createContext(null)

export function WizardProvider({ children }) {
  const [uso, setUso] = useState('gaming')
  const [presupuesto, setPresupuesto] = useState('3-4M')

  return (
    <WizardContext.Provider
      value={{ uso, setUso, presupuesto, setPresupuesto }}
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
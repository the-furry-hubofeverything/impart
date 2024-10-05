import { createContext, useContext, useState } from 'react'

export interface ActiveContextMenuData {
  activeId?: string
  setActiveId: (id?: string) => void
}

const ActiveContextMenuContext = createContext<ActiveContextMenuData | null>(null)

export interface ActiveContextMenuProviderProps {
  children?: React.ReactNode
}

export function ActiveContextMenuProvider({ children }: ActiveContextMenuProviderProps) {
  const [activeId, setActiveId] = useState<string>()

  return (
    <ActiveContextMenuContext.Provider value={{ activeId, setActiveId }}>
      {children}
    </ActiveContextMenuContext.Provider>
  )
}

export function useActiveContextMenu() {
  const result = useContext(ActiveContextMenuContext)

  if (!result) {
    throw new Error(
      'useActiveContextMenu() cannot be used without being wrapped by a ActiveContextMenuProvider'
    )
  }

  return result
}

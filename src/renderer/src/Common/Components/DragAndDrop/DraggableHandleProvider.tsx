import { DraggableAttributes } from '@dnd-kit/core'
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities'
import { createContext, useContext } from 'react'

export interface DraggableHandleData {
  listeners?: SyntheticListenerMap
  attributes: DraggableAttributes
}

const DraggableHandleContext = createContext<DraggableHandleData | null>(null)

export interface DraggableHandleProviderProps extends DraggableHandleData {
  children?: React.ReactNode
}

export function DraggableHandleProvider({ children, ...data }: DraggableHandleProviderProps) {
  return <DraggableHandleContext.Provider value={data}>{children}</DraggableHandleContext.Provider>
}

export function useDraggableHandle() {
  const result = useContext(DraggableHandleContext)

  if (!result) {
    return false
  }

  return { ...result.attributes, ...result.listeners }
}

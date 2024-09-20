import { createContext, useContext, useState } from 'react'

export interface TaskStatusData {
  isIndexing: boolean
}

const TaskStatusContext = createContext<TaskStatusData | null>(null)

export interface TaskStatusProviderProps {
  children?: React.ReactNode
}

export function TaskStatusProvider({ children }: TaskStatusProviderProps) {
  const [isIndexing, setIndexing] = useState(false)

  return <TaskStatusContext.Provider value={{ isIndexing }}>{children}</TaskStatusContext.Provider>
}

export function useTaskStatus() {
  const result = useContext(TaskStatusContext)

  if (!result) {
    throw new Error('useTaskStatus() cannot be used without being wrapped by a TaskStatusProvider')
  }

  return result
}

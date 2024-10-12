import { createContext, useContext, useEffect } from 'react'
import { usePartialState } from '@renderer/Common/Hooks/usePartialState'
import { useTaskStatus } from '@renderer/TaskStatusProvider'
import { useImpartIpcData } from '@renderer/Common/Hooks/useImpartIpc'

interface TaggableData {
  taggables: Impart.Taggable[]
  isLoading: boolean
  fetchTaggables: () => Promise<void>
  fetchOptions: Impart.FetchTaggablesOptions
  setFetchOptions: (options: Partial<Impart.FetchTaggablesOptions>) => void
}

const TaggableContext = createContext<TaggableData | null>(null)

export interface TaggableProviderProps {
  children?: React.ReactNode
}

const DEFAULT_ORDER_KEY = 'defaultOrder'

export function TaggableProvider({ children }: TaggableProviderProps) {
  const { isTaskRunning } = useTaskStatus()

  const [fetchOptions, setFetchOptions] = usePartialState<Impart.FetchTaggablesOptions>(() => ({
    order: (localStorage.getItem(DEFAULT_ORDER_KEY) as 'alpha' | 'date' | null) ?? 'alpha'
  }))

  const {
    data: taggables,
    isLoading,
    reload: fetchTaggables
  } = useImpartIpcData(() => window.taggableApi.getTaggables(fetchOptions), [fetchOptions])

  useEffect(() => {
    if (fetchOptions.order) {
      localStorage.setItem(DEFAULT_ORDER_KEY, fetchOptions.order)
    }
  }, [fetchOptions.order])

  useEffect(() => {
    if (isTaskRunning) {
      let interval = setInterval(() => fetchTaggables(), 1000)

      return () => clearInterval(interval)
    } else {
      fetchTaggables()
    }
  }, [isTaskRunning, fetchTaggables])

  return (
    <TaggableContext.Provider
      value={{
        taggables: taggables ?? [],
        isLoading,
        fetchTaggables,
        fetchOptions,
        setFetchOptions
      }}
    >
      {children}
    </TaggableContext.Provider>
  )
}

export function useTaggables() {
  const result = useContext(TaggableContext)

  if (!result) {
    throw new Error(
      'useTaggableIndexStatus() cannot be used without being wrapped by a TaggableIndexStatusProvider'
    )
  }

  return result
}

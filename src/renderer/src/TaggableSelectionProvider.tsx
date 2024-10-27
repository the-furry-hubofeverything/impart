import { createContext, useContext } from 'react'

export interface TaggableSelectionData {
  selection: Impart.Taggable[]
  setSelection: (selection: Impart.Taggable[]) => void
}

const TaggableSelectionContext = createContext<TaggableSelectionData | null>(null)

export interface TaggableSelectionProviderProps extends TaggableSelectionData {
  children?: React.ReactNode
}

export function TaggableSelectionProvider({ children, ...data }: TaggableSelectionProviderProps) {
  return (
    <TaggableSelectionContext.Provider value={data}>{children}</TaggableSelectionContext.Provider>
  )
}

export function useTaggableSelection() {
  const result = useContext(TaggableSelectionContext)

  if (!result) {
    throw new Error(
      'useTaggableSelection() cannot be used without being wrapped by a TaggableSelectionProvider'
    )
  }

  return result
}

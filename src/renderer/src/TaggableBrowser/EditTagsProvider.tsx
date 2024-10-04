import { useTaggables } from '@renderer/EntityProviders/TaggableProvider'
import { createContext, useCallback, useContext } from 'react'

export interface EditTagsData {
  editTarget?: Impart.Taggable
  tags: Impart.Tag[]
  save: () => Promise<void>
  close: () => void
}

const EditTagsContext = createContext<EditTagsData | null>(null)

export interface EditTagsProviderProps {
  editTarget?: Impart.Taggable
  tags: Impart.Tag[]
  onEdited: () => void
  onClose: () => void
  children?: React.ReactNode
}

export function EditTagsProvider({
  editTarget,
  tags,
  onEdited,
  onClose,
  children
}: EditTagsProviderProps) {
  const save = useCallback(async () => {
    if (editTarget) {
      await window.tagApi.editFileTags(
        editTarget.id,
        tags.map((t) => t.id)
      )
      onEdited && onEdited()
    }
  }, [editTarget, tags])

  return (
    <EditTagsContext.Provider value={{ editTarget, tags, save, close: onClose }}>
      {children}
    </EditTagsContext.Provider>
  )
}

export function useEditTags() {
  const result = useContext(EditTagsContext)

  if (!result) {
    return false
  }

  return result
}

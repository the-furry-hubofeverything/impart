import { useTaggables } from '@renderer/EntityProviders/TaggableProvider'
import { createContext, useCallback, useContext, useMemo } from 'react'

export interface EditTagsData {
  editTarget?: Impart.Taggable
  tags: Impart.Tag[]
  saveAndClose: () => Promise<void>
}

const EditTagsContext = createContext<EditTagsData | null>(null)

export interface EditTagsProviderProps {
  editTarget?: Impart.Taggable
  tags: Impart.Tag[]
  onFinish?: () => void
  children?: React.ReactNode
}

export function EditTagsProvider({ editTarget, tags, onFinish, children }: EditTagsProviderProps) {
  const saveAndClose = useCallback(async () => {
    if (editTarget) {
      await window.tagApi.editFileTags(
        editTarget.id,
        tags.map((t) => t.id)
      )
      onFinish && onFinish()
    }
  }, [editTarget, tags])

  const result = useMemo(
    () => ({ editTarget, tags, saveAndClose }),
    [editTarget, tags, saveAndClose]
  )

  return <EditTagsContext.Provider value={result}>{children}</EditTagsContext.Provider>
}

export function useEditTags() {
  const result = useContext(EditTagsContext)

  if (!result) {
    return false
  }

  return result
}

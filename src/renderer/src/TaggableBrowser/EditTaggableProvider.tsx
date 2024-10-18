import { useTaggables } from '@renderer/EntityProviders/TaggableProvider'
import { createContext, useCallback, useContext, useMemo } from 'react'

export interface EditTaggableData {
  editTarget?: Impart.Taggable
  renameTarget?: Impart.TaggableStack
  tags: Impart.Tag[]
  removeTag: (tag: Impart.Tag) => void
  saveTagsAndClose: () => Promise<void>
  close: () => void
}

const EditTaggableContext = createContext<EditTaggableData | null>(null)

export interface EditTaggableProviderProps {
  editTarget?: Impart.Taggable
  renameTarget?: Impart.TaggableStack
  tags: Impart.Tag[]
  onFinish?: () => void
  onRemoveTag: (tag: Impart.Tag) => void
  children?: React.ReactNode
}

export function EditTaggableProvider({
  editTarget,
  tags,
  onFinish,
  children,
  renameTarget,
  onRemoveTag
}: EditTaggableProviderProps) {
  const saveTagsAndClose = useCallback(async () => {
    if (editTarget) {
      await window.tagApi.editFileTags(
        editTarget.id,
        tags.map((t) => t.id)
      )
      onFinish && onFinish()
    }
  }, [editTarget, tags, renameTarget, onFinish])

  const result = useMemo(
    () => ({
      editTarget,
      tags,
      saveTagsAndClose,
      removeTag: onRemoveTag,
      renameTarget,
      close: onFinish ?? (() => {})
    }),
    [editTarget, tags, saveTagsAndClose, renameTarget, onFinish]
  )

  return <EditTaggableContext.Provider value={result}>{children}</EditTaggableContext.Provider>
}

export function useEditTaggable() {
  const result = useContext(EditTaggableContext)

  if (!result) {
    return false
  }

  return result
}

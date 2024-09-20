import React from 'react'
import { DirectoryEditor } from './DirectoryEditor'
import { produce } from 'immer'

export interface DirectoryListProps {
  directoryState: Impart.Directory[]
  originalDirectories?: Impart.Directory[]
  onChange: (state: Impart.Directory[]) => void
}

export function DirectoryList({
  directoryState,
  originalDirectories,
  onChange
}: DirectoryListProps) {
  function removeDir(dir: Impart.Directory) {
    return produce(directoryState, (next) => {
      const index = next.findIndex((d) => d.path === dir.path)

      if (index != -1) {
        next?.splice(index, 1)
      }
    })
  }

  function restoreDir(dir: Impart.Directory) {
    return produce(directoryState, (next) => {
      const index = next.findIndex((d) => d.path === dir.path)
      const originalDir = originalDirectories?.find((d) => d.path === dir.path)

      if (index != -1) {
        if (originalDir) {
          next?.splice(index, 1, originalDir)
        } else {
          next.splice(index, 1)
        }
      } else {
        if (originalDir) {
          next.push(originalDir)
        }
      }
    })
  }

  return (
    <>
      {originalDirectories?.map((od) => (
        <DirectoryEditor
          key={od.path}
          directoryState={directoryState.find((ds) => ds.path === od.path)}
          originalDirectory={od}
          onDelete={() => onChange(removeDir(od))}
          onRestore={() => onChange(restoreDir(od))}
        />
      ))}
      {directoryState
        .filter((ds) => !originalDirectories?.some((od) => od.path === ds.path))
        .map((ds) => (
          <DirectoryEditor
            key={ds.path}
            directoryState={ds}
            onDelete={() => onChange(removeDir(ds))}
          />
        ))}
    </>
  )
}

import { ElectronAPI } from '@electron-toolkit/preload'

type CallbackFunc<Payload> = (callback: (values: FileIndexedEvent) => void) => () => void

declare global {
  interface ImageResult {
    data: string
    width: number
    height: number
  }

  interface FileIndexedEvent {
    amountIndexed: number
    total: number
  }

  interface IndexedDirectory {
    path: string
  }

  interface Window {
    electron: ElectronAPI

    imageApi: {
      getImage: (fileName: string) => Promise<ImageResult>
    }

    fileApi: {
      getFiles: () => Promise<string[]>
      selectAndIndexDirectory: () => Promise<void>
      getDirectories: () => Promise<IndexedDirectory[]>

      onFileIndexed: CallbackFunc<FileIndexedEvent>
    }
  }
}

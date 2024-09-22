import React from 'react'
import ReactDOM from 'react-dom/client'
import { Impart } from './Impart'
import { TagProvider } from './EntityProviders/TagProvider/TagProvider'
import { TaggableProvider } from './EntityProviders/TaggableProvider'
import { DirectoryProvider } from './EntityProviders/DirectoryProvider'
import { TaskStatusProvider } from './TaskStatusProvider'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <TaskStatusProvider>
      <DirectoryProvider>
        <TaggableProvider>
          <TagProvider>
            <Impart />
          </TagProvider>
        </TaggableProvider>
      </DirectoryProvider>
    </TaskStatusProvider>
  </React.StrictMode>
)

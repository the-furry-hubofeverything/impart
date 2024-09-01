import React from 'react'
import ReactDOM from 'react-dom/client'
import { Impart } from './Impart'
import { TagProvider } from './EntityProviders/TagProvider/TagProvider'
import { TaggableProvider } from './EntityProviders/TaggableProvider'
import { DirectoryProvider } from './EntityProviders/DirectoryProvider'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <DirectoryProvider>
      <TaggableProvider>
        <TagProvider>
          <Impart />
        </TagProvider>
      </TaggableProvider>
    </DirectoryProvider>
  </React.StrictMode>
)

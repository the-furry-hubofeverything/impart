import React from 'react'
import ReactDOM from 'react-dom/client'
import { Impart } from './Impart'
import { FileProvider } from './FileProvider/FileProvider'
import { TagProvider } from './TagProvider'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <FileProvider>
      <TagProvider>
        <Impart />
      </TagProvider>
    </FileProvider>
  </React.StrictMode>
)

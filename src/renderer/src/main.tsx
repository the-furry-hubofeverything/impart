import React from 'react'
import ReactDOM from 'react-dom/client'
import { Impart } from './Impart'
import { TagProvider } from './TagProvider'
import { TaggableProvider } from './TaggableProvider'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <TaggableProvider>
      <TagProvider>
        <Impart />
      </TagProvider>
    </TaggableProvider>
  </React.StrictMode>
)

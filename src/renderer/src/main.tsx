import React from 'react'
import ReactDOM from 'react-dom/client'
import { Impart } from './Impart'
import { TagProvider } from './EntityProviders/TagProvider'
import { TaggableProvider } from './EntityProviders/TaggableProvider'
import { DirectoryProvider } from './EntityProviders/DirectoryProvider'
import { TaskStatusProvider } from './TaskStatusProvider'
import { ThemeProvider } from '@emotion/react'
import { CssBaseline } from '@mui/material'
import { theme } from './theme'
import { ErrorNotificationProvider } from './common/ErrorNotificationProvider'
import { ActiveContextMenuProvider } from './common/ContextMenu/ActiveContextMenuProvider'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ErrorNotificationProvider>
      <TaskStatusProvider>
        <DirectoryProvider>
          <TaggableProvider>
            <TagProvider>
              <ActiveContextMenuProvider>
                <ThemeProvider theme={theme}>
                  <CssBaseline />
                  <Impart />
                </ThemeProvider>
              </ActiveContextMenuProvider>
            </TagProvider>
          </TaggableProvider>
        </DirectoryProvider>
      </TaskStatusProvider>
    </ErrorNotificationProvider>
  </React.StrictMode>
)

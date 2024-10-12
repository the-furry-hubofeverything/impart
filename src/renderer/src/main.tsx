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
import { ErrorNotificationProvider } from './Common/Components/ErrorNotificationProvider'
import { ActiveContextMenuProvider } from './Common/Components/ContextMenu/ActiveContextMenuProvider'
import { ConfirmationDialogProvider } from './Common/Components/ConfirmationDialogProvider'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ErrorNotificationProvider>
      <TaskStatusProvider>
        <DirectoryProvider>
          <TaggableProvider>
            <TagProvider>
              <ThemeProvider theme={theme}>
                <ActiveContextMenuProvider>
                  <ConfirmationDialogProvider>
                    <CssBaseline />
                    <Impart />
                  </ConfirmationDialogProvider>
                </ActiveContextMenuProvider>
              </ThemeProvider>
            </TagProvider>
          </TaggableProvider>
        </DirectoryProvider>
      </TaskStatusProvider>
    </ErrorNotificationProvider>
  </React.StrictMode>
)

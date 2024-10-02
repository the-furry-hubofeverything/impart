import { Alert, Snackbar } from '@mui/material'
import { createContext, useCallback, useContext, useState } from 'react'

export interface ErrorNotificationData {
  sendError: (message: string) => void
}

const ErrorNotificationContext = createContext<ErrorNotificationData | null>(null)

export interface ErrorNotificationProviderProps {
  children?: React.ReactNode
}

export function ErrorNotificationProvider({ children }: ErrorNotificationProviderProps) {
  const [showError, setShowError] = useState(false)
  const [message, setMessage] = useState('')

  const sendError = useCallback((m: string) => {
    setShowError(true)
    setMessage(m)
  }, [])

  return (
    <ErrorNotificationContext.Provider value={{ sendError }}>
      {children}
      <Snackbar open={showError} onClose={() => setShowError(false)}>
        <Alert variant="filled" severity="error" onClose={() => setShowError(false)}>
          {message}
        </Alert>
      </Snackbar>
    </ErrorNotificationContext.Provider>
  )
}

export function useErrorNotification() {
  const result = useContext(ErrorNotificationContext)

  if (!result) {
    throw new Error(
      'useErrorNotification() cannot be used without being wrapped by a ErrorNotificationProvider'
    )
  }

  return result.sendError
}

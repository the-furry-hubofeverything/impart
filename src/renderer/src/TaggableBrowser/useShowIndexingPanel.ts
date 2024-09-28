import { useTaskStatus } from '@renderer/TaskStatusProvider'
import { useState, useEffect } from 'react'

export function useShowIndexingPanel() {
  const { isTaskRunning } = useTaskStatus()
  const [showIndexingPanel, setShowIndexingPanel] = useState(false)

  useEffect(() => {
    if (isTaskRunning) {
      setShowIndexingPanel(true)
    } else {
      const timer = setTimeout(() => setShowIndexingPanel(false), 3000)

      return () => clearTimeout(timer)
    }
  }, [isTaskRunning])

  return showIndexingPanel
}

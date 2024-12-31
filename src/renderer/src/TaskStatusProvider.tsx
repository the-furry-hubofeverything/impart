import { createContext, useContext, useEffect, useState } from 'react'
import { useNotification } from './Common/Components/NotificationProvider'

export interface TaskStatusData {
  isTaskRunning: boolean
  taskType?: Impart.TaskType
  currentTask: number
  taskCount: number
  currentStep: number
  stepCount: number
}

const TaskStatusContext = createContext<TaskStatusData | null>(null)

export interface TaskStatusProviderProps {
  children?: React.ReactNode
}

export function TaskStatusProvider({ children }: TaskStatusProviderProps) {
  const [isTaskRunning, setTaskRunning] = useState(false)
  const [taskType, setTaskType] = useState<Impart.TaskType>()

  const [currentTask, setCurrentTask] = useState(0)
  const [taskCount, setTaskCount] = useState(0)

  const [currentStep, setCurrentStep] = useState(0)
  const [stepCount, setStepCount] = useState(0)

  const { sendError } = useNotification()

  useEffect(() => {
    return window.taskApi.onSequenceStarted(() => {
      setTaskRunning(true)
      setCurrentTask(0)
      setTaskCount(0)
    })
  }, [])

  useEffect(() => {
    return window.taskApi.onItemAddedToSequence(() => setTaskCount((count) => count + 1))
  }, [])

  useEffect(() => {
    return window.taskApi.onTaskStarted(({ type, steps }) => {
      setTaskType(type)
      setCurrentStep(0)
      setStepCount(steps)
    })
  }, [])

  useEffect(() => {
    return window.taskApi.onStepTaken(() => setCurrentStep((step) => step + 1))
  }, [])

  useEffect(() => {
    return window.taskApi.onErrorThrown(({ message }) => sendError(message))
  }, [sendError])

  useEffect(() => {
    return window.taskApi.onTaskFinished(() => setCurrentTask((task) => task + 1))
  }, [])

  useEffect(() => {
    return window.taskApi.onSequenceFinished(() => {
      setTaskRunning(false)
      setTaskType(undefined)
    })
  })

  return (
    <TaskStatusContext.Provider
      value={{ isTaskRunning, taskType, currentTask, taskCount, currentStep, stepCount }}
    >
      {children}
    </TaskStatusContext.Provider>
  )
}

export function useTaskStatus() {
  const result = useContext(TaskStatusContext)

  if (!result) {
    throw new Error('useTaskStatus() cannot be used without being wrapped by a TaskStatusProvider')
  }

  return result
}

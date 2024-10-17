import { Box, Card, CardContent, LinearProgress, Stack, Typography } from '@mui/material'
import { useTaskStatus } from '@renderer/TaskStatusProvider'

export interface TaskStatusProps {}

export function TaskStatus({}: TaskStatusProps) {
  const { currentStep, stepCount, taskType, currentTask, taskCount } = useTaskStatus()

  const getTaskLabel = () => {
    if (!taskType) {
      return 'Finished!'
    }

    switch (taskType) {
      case 'bulkTag':
        return 'Bulk Tagging...'
      case 'indexing':
        return 'Indexing...'
      case 'sourceAssociation':
        return 'Associating images with source files...'
      case 'removing':
        return 'Removing deleted files...'
    }
  }

  return (
    <Stack gap={2}>
      <Box>
        <Typography variant="body2">
          Step {Math.min(currentTask + 1, taskCount)}/{taskCount}
        </Typography>
        {taskCount != 0 && (
          <LinearProgress value={(currentTask / taskCount) * 100} variant="determinate" />
        )}
      </Box>
      <Box>
        <Typography variant="body2">{getTaskLabel()}</Typography>
        {stepCount != 0 && (
          <LinearProgress value={(currentStep / stepCount) * 100} variant="determinate" />
        )}
      </Box>
    </Stack>
  )
}

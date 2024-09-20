import { impartApp } from '..'
import { TaskType } from './taskQueue'

class TaskMessenger {
  public sequenceStarted() {
    impartApp.mainWindow?.webContents.send('task/sequenceStarted')
  }

  public itemAddedToSequence() {
    impartApp.mainWindow?.webContents.send('task/itemAddedToSequence')
  }

  public taskStarted(type: TaskType, steps?: number) {
    impartApp.mainWindow?.webContents.send('task/taskStarted', {
      type,
      steps
    })
  }

  public stepTaken() {
    impartApp.mainWindow?.webContents.send('task/stepTaken')
  }

  public taskFinished() {
    impartApp.mainWindow?.webContents.send('task/taskFinished')
  }

  public sequenceFinished() {
    impartApp.mainWindow?.webContents.send('task/sequenceFinished')
  }
}

export const taskMessenger = new TaskMessenger()

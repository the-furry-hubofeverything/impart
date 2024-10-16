import { delay } from '../common/sleep'
import { ImpartTask } from './impartTask'
import { taskMessenger } from './taskMessenger'

class TaskQueue {
  private queue: ImpartTask<any>[] = []
  private isProcessing = false

  public add(task: ImpartTask<any>) {
    this.queue.push(task)

    if (!this.isProcessing) {
      this.isProcessing = true
      taskMessenger.sequenceStarted()
      this.performNextTask()
    }

    taskMessenger.itemAddedToSequence()
  }

  private async performNextTask() {
    const task = this.queue.shift()

    if (task) {
      await task.perform()
    }

    if (this.queue.length > 0) {
      await this.performNextTask()
    } else {
      this.isProcessing = false
      taskMessenger.sequenceFinished()
    }
  }
}

export const taskQueue = new TaskQueue()

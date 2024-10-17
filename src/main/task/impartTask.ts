import { delay } from '../common/sleep'
import { taskMessenger } from './taskMessenger'

export type TaskType = 'indexing' | 'sourceAssociation' | 'bulkTag' | 'removing' | 'stackRemoval'

export abstract class ImpartTask<T> {
  protected abstract readonly TYPE: TaskType
  protected abstract readonly DELAY: number
  protected targets?: T[]

  protected abstract prepare(): Promise<void>
  protected abstract performStep(item: T): Promise<void>

  public async perform() {
    await this.prepare()

    if (!this.targets) {
      throw new Error('The task was not prepared properly')
    }

    taskMessenger.taskStarted(this.TYPE, this.targets.length)

    await Promise.all(
      this.targets.map((item, index) =>
        delay(async () => {
          await this.performStep(item)
          taskMessenger.stepTaken()
        }, index * this.DELAY)
      )
    )

    taskMessenger.taskFinished()
  }
}

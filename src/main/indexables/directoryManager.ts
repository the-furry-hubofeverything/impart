import { dialog } from 'electron'
import { impartApp } from '..'
import { Directory } from '../database/entities/Directory'
import { indexingManager } from './indexingManager'

interface DirectoryPayload {
  path: string
}

type Queueable = () => Promise<any>

export class DirectoryManager {
  public async getIndexedDirectories() {
    const query = Directory.createQueryBuilder('directories')

    const result = await query
      .loadRelationCountAndMap('directories.taggableCount', 'directories.taggables', 'taggables')
      .getMany()

    return result
  }

  public async selectAndIndexDirectory() {
    if (!impartApp.mainWindow) {
      throw new Error('Tried to open a file dialog without access to the window')
    }

    const result = dialog.showOpenDialogSync(impartApp.mainWindow, {
      properties: ['openDirectory']
    })

    if (!result) {
      return
    }

    const directory = Directory.create({ path: result[0] })
    await directory.save()

    indexingManager.indexFiles(directory)
  }

  public async updateDirectories(directoryPayloads: DirectoryPayload[]) {
    let tasks: Queueable[] = []
    const directories = await Directory.find()

    const unaddedDirectories = directoryPayloads.filter(
      (p) => !directories.some((d) => d.path === p.path)
    )
    const updatedDirectories = directories
      .map((d) => ({ directory: d, payload: directoryPayloads.find((p) => p.path === d.path) }))
      .filter((d) => d.payload == null)
    const removedDirectories = directories.filter(
      (d) => !directoryPayloads.some((p) => p.path === d.path)
    )

    for (const d of unaddedDirectories) {
      const dirTasks = await this.createDirectory(d)
      tasks = tasks.concat(dirTasks)
    }

    for (const d of updatedDirectories) {
      const dirTasks = await this.updateDirectory(d.directory, d.payload!)
      tasks = tasks.concat(dirTasks)
    }

    for (const d of removedDirectories) {
      await d.remove()
    }

    //This can happen asynchronously, so we just fire it off without an await
    this.performTasks(tasks)
  }

  private async createDirectory(payload: DirectoryPayload): Promise<Queueable[]> {
    const tasks: Queueable[] = []

    const directory = Directory.create({ path: payload.path })
    await directory.save()
    tasks.push(() => indexingManager.indexFiles(directory))

    return tasks
  }

  private async updateDirectory(
    directory: Directory,
    payload: DirectoryPayload
  ): Promise<Queueable[]> {
    //Placeholder
    return []
  }

  private async performTasks(queue: Queueable[]) {
    for (const task of queue) {
      await task()
    }
  }
}

export const directoryManager = new DirectoryManager()

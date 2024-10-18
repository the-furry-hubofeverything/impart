import { In } from 'typeorm'
import { Taggable } from '../database/entities/Taggable'
import { isTaggableImage } from '../database/entities/TaggableImage'
import { TaggableStack } from '../database/entities/TaggableStack'
import { ImpartTask, TaskType } from '../task/impartTask'
import { taskQueue } from '../task/taskQueue'

export namespace StackManager {
  export async function create(
    name: string,
    taggableIds: number[],
    coverId?: number,
    parentStackId?: number
  ) {
    const childTaggables = await Taggable.find({
      where: { id: In(taggableIds) }
    })
    const cover = childTaggables.find((t) => t.id === coverId)
    let parent: TaggableStack | undefined = undefined

    if (parentStackId) {
      parent = await TaggableStack.findOneByOrFail({ id: parentStackId })
    }

    const stack = TaggableStack.create({
      name,
      cover: cover && isTaggableImage(cover) ? cover : undefined,
      taggables: childTaggables,
      dateModified: new Date(Math.max(...childTaggables.map((t) => t.dateModified.getTime()))),
      parent,
      tags: findCommonTags(childTaggables)
    })

    await stack.save()
  }

  function findCommonTags(items: Taggable[]) {
    let tags = items[0].tags

    for (const item of items.slice(1)) {
      tags = tags.filter((t) => item.tags.some((it) => it.id === t.id))
    }

    return tags
  }

  export async function addToStack(
    taggableIds: number[],
    stackId: number,
    currentStackId?: number
  ) {
    const childTaggables = await Taggable.find({
      where: { id: In(taggableIds) }
    })

    await Promise.all(
      childTaggables.map(async (t) => {
        t.parentId = stackId
        await t.save()
      })
    )

    if (currentStackId) {
      await validateStackCover(currentStackId)
    }
  }

  export async function moveTaggablesToHome(taggableIds: number[], currentStackId: number) {
    const stack = await TaggableStack.findOneOrFail({
      where: { id: currentStackId },
      relations: { taggables: true }
    })

    //Remove all target taggables from this stack (which will send them to the home stack)
    stack.taggables = stack.taggables!.filter((t) => !taggableIds.some((id) => t.id === id))
    await stack.save()

    await validateStackCover(currentStackId)
  }

  async function validateStackCover(stackId: number) {
    const stack = await TaggableStack.findOneOrFail({
      where: { id: stackId },
      relations: { taggables: true }
    })

    if (!stack.taggables?.some((t) => t.id === stack.cover?.id)) {
      stack.cover = stack.taggables?.find(isTaggableImage) ?? null
      await stack.save()
    }
  }

  export async function removeAllEmptyStacks() {
    taskQueue.add(new RemoveEmptyStacksTask())
  }

  export async function removeStack(stackId: number) {
    const stack = await TaggableStack.findOneOrFail({
      where: { id: stackId },
      relations: { taggables: true }
    })

    await removeLoadedStack(stack)
  }

  async function removeLoadedStack(stack: TaggableStack) {
    if (stack.taggables == null) {
      throw new Error('The stack taggables were not loaded')
    }

    if (stack.parentId != null) {
      await Promise.all(
        stack.taggables.map(async (t) => {
          t.parentId = stack.parentId
          await t.save()
        })
      )
    }

    await stack.remove()
  }

  //CURRENTLY UNUSED. Finds all stacks with 0 or 1 items and removes them
  class RemoveEmptyStacksTask extends ImpartTask<TaggableStack> {
    protected override TYPE: TaskType = 'stackRemoval'
    protected override DELAY: number = 8

    protected override async prepare(): Promise<void> {
      const ids = (
        await TaggableStack.createQueryBuilder('stack')
          .select('stack.id AS id')
          .leftJoinAndSelect('stack.taggables', 'taggables')
          .groupBy('stack.id')
          .having('COUNT(taggables.id) <= 1')
          .getRawMany<{ id: number }>()
      ).map((r) => r.id)

      this.targets = await TaggableStack.find({
        where: { id: In(ids) },
        relations: { taggables: true }
      })
    }
    protected override async performStep(item: TaggableStack): Promise<void> {
      await removeLoadedStack(item)
    }
  }
}

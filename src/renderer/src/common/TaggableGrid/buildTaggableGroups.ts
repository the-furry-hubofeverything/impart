export type GroupedTaggables = { directory: string; taggables: Impart.Taggable[] }[]

export function buildTaggableGroups(taggables: Impart.Taggable[]) {
  const groups: GroupedTaggables = []

  taggables.forEach((t) => {
    const group = groups.find((g) => g.directory === t.directory)

    if (group) {
      group.taggables.push(t)
    } else {
      groups.push({
        directory: t.directory,
        taggables: [t]
      })
    }
  })

  groups.sort((a, b) => a.directory.localeCompare(b.directory))

  return groups
}

export function satisfiesFilter(tag: Impart.Tag, filter?: string) {
  if (!filter) {
    return true
  }

  return filter.split(' ').every((f) => tag.label?.toLowerCase().includes(f.toLowerCase()))
}

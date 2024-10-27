//Copied from https://github.com/sindresorhus/array-move/blob/main/index.js
// since the package wasn't working for some reason
export function arrayMoveMutable<T>(array: T[], fromIndex: number, toIndex: number) {
  const startIndex = fromIndex < 0 ? array.length + fromIndex : fromIndex

  if (startIndex >= 0 && startIndex < array.length) {
    const endIndex = toIndex < 0 ? array.length + toIndex : toIndex

    const [item] = array.splice(fromIndex, 1)
    array.splice(endIndex, 0, item)
  }
}

export function arrayMoveImmutable<T>(array: T[], fromIndex: number, toIndex: number) {
  const newArray = [...array]
  arrayMoveMutable(newArray, fromIndex, toIndex)
  return newArray
}

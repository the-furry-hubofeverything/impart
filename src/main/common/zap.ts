type Zapped<T, S> = {
  first?: T
  second?: S
}[]

export function zap<T, S>(
  first: T[],
  second: S[],
  equals: (first: T, second: S) => boolean
): Zapped<T, S> {
  const unmatchedSecond = second.filter((s) => !first.some((f) => equals(f, s)))

  return [
    ...first.map((f) => ({ first: f, second: second.find((s) => equals(f, s)) })),
    ...unmatchedSecond.map((s) => ({ first: undefined, second: s }))
  ]
}

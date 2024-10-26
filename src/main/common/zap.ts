type Zapped<T, S> = [T | undefined, S | undefined]

export function zap<T, S>(
  first: T[],
  second: S[],
  equals: (first: T, second: S) => boolean
): Zapped<T, S>[] {
  const unmatchedSecond = second.filter((s) => !first.some((f) => equals(f, s)))

  return [
    ...first.map((f) =>
      toZapped(
        f,
        second.find((s) => equals(f, s))
      )
    ),
    ...unmatchedSecond.map((s) => toZapped(undefined, s))
  ]
}

function toZapped<T, S>(first?: T, second?: S): Zapped<T, S> {
  return [first, second]
}

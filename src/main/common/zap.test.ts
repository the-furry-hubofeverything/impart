import { test, expect } from 'vitest'
import { zap } from './zap'

interface Named {
  id: number
  name: string
}

interface Fruit {
  id: number
  fruit: string
}

const first: Named[] = [
  { id: 1, name: 'First' },
  { id: 2, name: 'Second' },
  { id: 3, name: 'Third' }
]

const second: Fruit[] = [
  { id: 2, fruit: 'Apple' },
  { id: 3, fruit: 'Pear' },
  { id: 4, fruit: 'Banana' }
]

test('matches ids together correctly', () => {
  const result = zap(first, second, (a, b) => a.id === b.id)

  const loneName = result.find((r) => r.first?.id === 1)
  const matched = result.find((r) => r.first?.id === 2)
  const loneFruit = result.find((r) => r.second?.id === 4)

  expect(loneName?.second).toBeUndefined()
  expect(matched?.first).toBeDefined()
  expect(matched?.second).toBeDefined()
  expect(loneFruit?.first).toBeUndefined()
})

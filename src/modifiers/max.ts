import { assert } from '../utils/assert'

export type Max = {
  name: 'max'
  validate: (value: number) => number
}

export const max = (max: number, message?: string): Max => {
  const errorMessage = message || 'Maximum value exceeded'

  return {
    name: 'max',
    validate: (value: number) => {
      assert(value <= max, errorMessage)
      return value
    },
  }
}

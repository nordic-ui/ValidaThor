import { assert } from '../utils/assert'

export type Min = {
  name: 'min'
  validate: (value: number) => number
}

export const min = (min: number, message?: string): Min => {
  const errorMessage = message || 'Minimum value not met'

  return {
    name: 'min',
    validate: (value: number) => {
      assert(value >= min, errorMessage)
      return value
    },
  }
}

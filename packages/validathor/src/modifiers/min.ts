import { assert } from '../utils/assert'
import { TypeError } from '../utils/errors'

export type Min = {
  name: 'min'
  validate: (value: number) => number
}

export const min = (min: number, message?: string): Min => {
  const errorMessage = message || 'Minimum value not met'

  return {
    name: 'min',
    validate: (value: number) => {
      // Type checks
      assert(typeof value === 'number', new TypeError('Expected a number'))
      assert(isFinite(value), new TypeError('Expected a finite number'))

      // Validation checks
      assert(value >= min, errorMessage)

      return value
    },
  }
}

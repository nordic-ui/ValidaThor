import { assert } from '../utils/assert'
import { TypeError } from '../utils/errors'

export type Min = {
  name: 'min'
  validate: (value: number) => number
}

export const min = (
  min: number,
  message?: {
    type_error?: string
    error?: string
  },
): Min => {
  return {
    name: 'min',
    validate: (value: number) => {
      // Type checks
      assert(typeof value === 'number', new TypeError(message?.type_error || 'Expected a number'))
      assert(isFinite(value), new TypeError(message?.type_error || 'Expected a finite number'))

      // Validation checks
      assert(value >= min, message?.error || 'Minimum value not met')

      return value
    },
  }
}

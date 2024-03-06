import { assert } from '@/utils/assert'
import { TypeError } from '@/utils/errors'

export type Max = {
  name: 'max'
  validate: (value: number) => number
}

export const max = (
  max: number,
  message?: {
    type_error?: string
    error?: string
  },
): Max => {
  return {
    name: 'max',
    validate: (value: number) => {
      // Type checks
      assert(typeof value === 'number', new TypeError(message?.type_error || 'Expected a number'))
      assert(isFinite(value), new TypeError(message?.type_error || 'Expected a finite number'))

      // Validation checks
      assert(value <= max, message?.error || 'Maximum value exceeded')

      return value
    },
  }
}

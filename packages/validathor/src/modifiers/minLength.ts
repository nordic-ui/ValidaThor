import { assert } from '../utils/assert'
import { TypeError } from '../utils/errors'

export type MinLength = {
  name: 'minLength'
  validate: (value: string) => string
}

export const minLength = (
  min: number,
  message?: {
    type_error?: string
    min_length_error?: string
    error?: string
  },
): MinLength => {
  return {
    name: 'minLength',
    validate: (value: string) => {
      // Type checks
      assert(typeof value === 'string', new TypeError(message?.type_error || 'Expected a string'))
      assert(typeof min === 'number', new TypeError(message?.type_error || 'Expected a number'))
      assert(isFinite(min), new TypeError(message?.type_error || 'Expected a finite number'))

      // Validation checks
      assert(min >= 0, message?.min_length_error || 'Minimum length must be a positive number')
      assert(value.length >= min, message?.error || 'Minimum value not met')

      return value
    },
  }
}

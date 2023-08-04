import { assert } from '../utils/assert'
import { TypeError } from '../utils/errors'

export type MinLength = {
  name: 'minLength'
  validate: (value: string) => string
}

export const minLength = (min: number, message?: string): MinLength => {
  const negativeMessage = message || 'Minimum length must be a positive number'
  const errorMessage = message || 'Minimum value not met'

  return {
    name: 'minLength',
    validate: (value: string) => {
      // Type checks
      assert(typeof value === 'string', new TypeError('Expected a string'))
      assert(typeof min === 'number', new TypeError('Expected a number'))
      assert(isFinite(min), new TypeError('Expected a finite number'))

      // Validation checks
      assert(min >= 0, negativeMessage)
      assert(value.length >= min, errorMessage)

      return value
    },
  }
}

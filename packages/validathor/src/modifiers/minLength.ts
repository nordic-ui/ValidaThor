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
      assert(typeof value === 'string', new TypeError(message || 'Expected a string'))
      assert(typeof min === 'number', new TypeError(message || 'Expected a number'))
      assert(isFinite(min), new TypeError(message || 'Expected a finite number'))

      assert(min >= 0, negativeMessage)
      assert(value.length >= min, errorMessage)
      return value
    },
  }
}

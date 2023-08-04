import { assert } from '../utils/assert'
import { TypeError } from '../utils/errors'

export type MaxLength = {
  name: 'maxLength'
  validate: (value: string) => string
}

export const maxLength = (max: number, message?: string): MaxLength => {
  const negativeMessage = message || 'Maximum length must be a positive number'
  const errorMessage = message || 'Maximum value exceeded'

  return {
    name: 'maxLength',
    validate: (value: string) => {
      // Type checks
      assert(typeof max === 'number', new TypeError('Expected a number'))
      assert(isFinite(max), new TypeError('Expected a finite number'))

      // Validation checks
      assert(max >= 0, negativeMessage)
      assert(value.length <= max, errorMessage)

      return value
    },
  }
}

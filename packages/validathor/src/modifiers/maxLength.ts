import { assert } from '../utils/assert'
import { TypeError } from '../utils/errors'

export type MaxLength = {
  name: 'maxLength'
  validate: (value: string) => string
}

export const maxLength = (
  max: number,
  message?: {
    type_error?: string
    max_length_error?: string
    error?: string
  },
): MaxLength => {
  const negativeMessage = message?.max_length_error || 'Maximum length must be a positive number'
  const errorMessage = message?.error || 'Maximum value exceeded'

  return {
    name: 'maxLength',
    validate: (value: string) => {
      // Type checks
      assert(typeof value === 'string', new TypeError(message?.type_error || 'Expected a string'))
      assert(typeof max === 'number', new TypeError(message?.type_error || 'Expected a number'))
      assert(isFinite(max), new TypeError(message?.type_error || 'Expected a finite number'))

      // Validation checks
      assert(max >= 0, negativeMessage)
      assert(value.length <= max, errorMessage)

      return value
    },
  }
}

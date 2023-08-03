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
      assert(typeof max === 'number', new TypeError(message || 'Expected a number'))
      assert(isFinite(max), new TypeError(message || 'Expected a finite number'))

      assert(max >= 0, negativeMessage)
      assert(value.length <= max, errorMessage)
      return value
    },
  }
}

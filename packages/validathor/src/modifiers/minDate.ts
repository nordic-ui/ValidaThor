import { assert } from '../utils/assert'
import { TypeError } from '../utils/errors'

export type MinDate = {
  name: 'minDate'
  validate: (value: Date) => Date
}

export const minDate = (date: Date, message?: string): MinDate => {
  const errorMessage = message || 'Minimum value not met'

  return {
    name: 'minDate',
    validate: (value: Date) => {
      // Type checks
      assert(date instanceof Date, new TypeError('Expected a date'))
      assert(value instanceof Date, new TypeError('Expected a date'))

      // Validation checks
      assert(value.valueOf() >= date.valueOf(), errorMessage)

      return value
    },
  }
}

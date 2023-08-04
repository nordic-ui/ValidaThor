import { assert } from '../utils/assert'
import { TypeError } from '../utils/errors'

export type MaxDate = {
  name: 'maxDate'
  validate: (value: Date) => Date
}

export const maxDate = (date: Date, message?: string): MaxDate => {
  const errorMessage = message || 'Maximum value exceeded'

  return {
    name: 'maxDate',
    validate: (value: Date) => {
      // Type checks
      assert(date instanceof Date, new TypeError('Expected a date'))
      assert(value instanceof Date, new TypeError('Expected a date'))

      // Validation checks
      assert(value.valueOf() <= date.valueOf(), errorMessage)

      return value
    },
  }
}

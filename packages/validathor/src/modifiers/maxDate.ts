import { assert } from '../utils/assert'
import { TypeError } from '../utils/errors'

export type MaxDate = {
  name: 'maxDate'
  validate: (value: Date) => Date
}

export const maxDate = (
  date: Date,
  message?: {
    type_error?: string
    error?: string
  },
): MaxDate => {
  return {
    name: 'maxDate',
    validate: (value: Date) => {
      // Type checks
      assert(date instanceof Date, new TypeError(message?.type_error || 'Expected a date'))
      assert(value instanceof Date, new TypeError(message?.type_error || 'Expected a date'))

      // Validation checks
      assert(value.valueOf() <= date.valueOf(), message?.error || 'Maximum value exceeded')

      return value
    },
  }
}

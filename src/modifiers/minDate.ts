import { assert } from '../utils/assert'

export type MinDate = {
  name: 'minDate'
  validate: (value: Date) => Date
}

export const minDate = (date: Date, message?: string): MinDate => {
  const errorMessage = message || 'Minimum value not met'

  return {
    name: 'minDate',
    validate: (value: Date) => {
      assert(value.valueOf() >= date.valueOf(), errorMessage)
      return value
    },
  }
}

import { assert } from '../utils/assert'

export type MaxDate = {
  name: 'maxDate'
  validate: (value: Date) => Date
}

export const maxDate = (date: Date, message?: string): MaxDate => {
  const errorMessage = message || 'Maximum value exceeded'

  return {
    name: 'maxDate',
    validate: (value: Date) => {
      assert(value.valueOf() <= date.valueOf(), errorMessage)
      return value
    },
  }
}

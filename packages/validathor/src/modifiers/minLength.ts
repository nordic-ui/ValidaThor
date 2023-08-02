import { assert } from '../utils/assert'

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
      assert(min >= 0, negativeMessage)
      assert(value.length >= min, errorMessage)
      return value
    },
  }
}

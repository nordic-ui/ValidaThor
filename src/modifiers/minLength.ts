import { assert } from '../utils/assert'

export type MinLength = {
  name: 'minLength'
  validate: (value: string) => string
}

export const minLength = (min: number, message?: string): MinLength => {
  const errorMessage = message || 'Minimum value not met'

  return {
    name: 'minLength',
    validate: (value: string) => {
      assert(value.length >= min, errorMessage)
      return value
    },
  }
}

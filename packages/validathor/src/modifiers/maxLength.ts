import { assert } from '../utils/assert'

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
      assert(max >= 0, negativeMessage)
      assert(value.length <= max, errorMessage)
      return value
    },
  }
}

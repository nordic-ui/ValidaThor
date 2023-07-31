import { assert } from '../utils/assert'

export type MaxLength = {
  name: 'maxLength'
  validate: (value: string) => string
}

export const maxLength = (max: number, message?: string): MaxLength => {
  const errorMessage = message || 'Maximum value exceeded'

  return {
    name: 'maxLength',
    validate: (value: string) => {
      assert(value.length <= max, errorMessage)
      return value
    },
  }
}

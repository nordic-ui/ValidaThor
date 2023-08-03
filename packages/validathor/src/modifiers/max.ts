import { assert } from '../utils/assert'
import { TypeError } from '../utils/errors'

export type Max = {
  name: 'max'
  validate: (value: number) => number
}

export const max = (max: number, message?: string): Max => {
  const errorMessage = message || 'Maximum value exceeded'

  return {
    name: 'max',
    validate: (value: number) => {
      assert(typeof value === 'number', new TypeError(message || 'Expected a number'))
      assert(isFinite(value), new TypeError(message || 'Expected a finite number'))

      assert(value <= max, errorMessage)
      return value
    },
  }
}

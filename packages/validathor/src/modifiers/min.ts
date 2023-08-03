import { assert } from '../utils/assert'
import { TypeError } from '../utils/errors'

export type Min = {
  name: 'min'
  validate: (value: number) => number
}

export const min = (min: number, message?: string): Min => {
  const errorMessage = message || 'Minimum value not met'

  return {
    name: 'min',
    validate: (value: number) => {
      assert(typeof value === 'number', new TypeError(message || 'Expected a number'))
      assert(isFinite(value), new TypeError(message || 'Expected a finite number'))

      assert(value >= min, errorMessage)
      return value
    },
  }
}

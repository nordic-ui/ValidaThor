import { assert, TypeError } from '../utils'

export const regex = (message?: string) => ({
  parse: (value: RegExp) => {
    assert(value instanceof RegExp, new TypeError(message || 'Expected a RegExp'))

    return value
  },
})

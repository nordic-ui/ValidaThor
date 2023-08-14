import { assert, TypeError } from '../utils'

export const regex = (message?: { type_error?: string }) => ({
  parse: (value: RegExp) => {
    assert(value instanceof RegExp, new TypeError(message?.type_error || 'Expected a RegExp'))

    return value
  },
})

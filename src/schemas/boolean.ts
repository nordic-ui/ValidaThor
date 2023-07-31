import { assert, TypeError } from '../utils'

export const boolean = (message?: string) => ({
  parse: (value: boolean) => {
    assert(typeof value === 'boolean', new TypeError(message || 'Expected a boolean'))

    return value
  },
})

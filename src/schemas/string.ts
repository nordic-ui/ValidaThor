import type { HelperReturnType } from '../types'
import { assert, TypeError } from '../utils'

export const string = (args?: HelperReturnType[], message?: string) => ({
  parse: (value: string) => {
    assert(typeof value === 'string', new TypeError(message || 'Expected a string'))

    args?.forEach((arg) => {
      switch (arg.name) {
        case 'email': {
          const emailRegex = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
          assert(emailRegex.test(value), arg.args.message)
          if (!!arg.args.domain) {
            assert(value.endsWith(arg.args.domain), arg.args.message)
          }
          break
        }
        case 'min': {
          assert(value.length >= arg.args.min, arg.args.message)
          break
        }
        case 'max': {
          assert(value.length <= arg.args.max, arg.args.message)
          break
        }
      }
    })

    return value
  },
})

import type { HelperReturnType } from '../types'
import { assert, TypeError } from '../utils'

export const date = (args?: HelperReturnType[], message?: string) => ({
  parse: (value: Date) => {
    assert(value instanceof Date, new TypeError(message || 'Expected a Date'))

    args?.forEach((arg) => {
      switch (arg.name) {
        case 'minDate': {
          if ('min' in arg.args) {
            assert(value.valueOf() >= arg.args.min, arg.args.message)
          }
          break
        }
        case 'maxDate': {
          if ('max' in arg.args) {
            assert(value.valueOf() <= arg.args.max, arg.args.message)
          }
          break
        }
      }
    })

    return value
  },
})

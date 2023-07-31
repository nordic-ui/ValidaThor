import type { HelperReturnType } from '../types'
import { assert, TypeError } from '../utils'

export const date = (args?: HelperReturnType[], message?: string) => ({
  parse: (value: Date) => {
    assert(value instanceof Date, new TypeError(message || 'Expected a Date'))

    args?.forEach((arg) => {
      switch (arg.name) {
        case 'minDate': {
          assert(value.valueOf() >= arg.args.minDate, arg.args.message)
          break
        }
        case 'maxDate': {
          assert(value.valueOf() <= arg.args.maxDate, arg.args.message)
          break
        }
      }
    })

    return value
  },
})

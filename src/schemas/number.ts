import type { HelperReturnType } from '../types'
import { assert, TypeError } from '../utils'

export const number = (args?: HelperReturnType[], message?: string) => ({
  parse: (value: number) => {
    assert(typeof value === 'number', new TypeError(message || 'Expected a number'))
    assert(isFinite(value), message || 'Expected a finite number')

    args?.forEach((arg) => {
      switch (arg.name) {
        case 'min': {
          assert(value >= arg.args.min, arg.args.message)
          break
        }
        case 'max': {
          assert(value <= arg.args.max, arg.args.message)
          break
        }
      }
    })

    return value
  },
})

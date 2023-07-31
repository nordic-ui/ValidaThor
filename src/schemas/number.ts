import type { HelperReturnType } from '../types'
import { assert, TypeError } from '../utils'

export const number = (args?: HelperReturnType[], message?: string) => ({
  parse: (value: number) => {
    assert(typeof value === 'number', new TypeError(message || 'Expected a number'))
    assert(isFinite(value), message || 'Expected a finite number')

    args?.forEach((arg) => {
      switch (arg.name) {
        case 'min': {
          if ('min' in arg.args) {
            assert(value >= arg.args.min, arg.args.message)
          }
          break
        }
        case 'max': {
          if ('max' in arg.args) {
            assert(value <= arg.args.max, arg.args.message)
          }
          break
        }
      }
    })

    return value
  },
})

import { Max, Min } from '../modifiers'
import { assert, TypeError } from '../utils'

export type NumberSchemaArgs = Array<Min | Max>

export const number = (args?: NumberSchemaArgs, message?: string) => ({
  parse: (value: number) => {
    assert(typeof value === 'number', new TypeError(message || 'Expected a number'))
    assert(isFinite(value), message || 'Expected a finite number')

    args?.forEach((arg) => {
      arg.validate(value)
    })

    return value
  },
})

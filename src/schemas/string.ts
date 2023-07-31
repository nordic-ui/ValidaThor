import { Email, MaxLength, MinLength } from '../modifiers'
import { assert, TypeError } from '../utils'

export type StringSchemaArgs = Array<MinLength | MaxLength | Email>

export const string = (args?: StringSchemaArgs, message?: string) => ({
  parse: (value: string) => {
    assert(typeof value === 'string', new TypeError(message || 'Expected a string'))

    args?.forEach((arg) => {
      arg.validate(value)
    })

    return value
  },
})

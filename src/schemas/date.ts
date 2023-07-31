import { MaxDate, MinDate } from '../modifiers'
import { assert, TypeError } from '../utils'

export type DateSchemaArgs = Array<MinDate | MaxDate>

export const date = (args?: DateSchemaArgs, message?: string) => ({
  parse: (value: Date) => {
    assert(value instanceof Date, new TypeError(message || 'Expected a Date'))

    args?.forEach((arg) => {
      arg.validate(value)
    })

    return value
  },
})

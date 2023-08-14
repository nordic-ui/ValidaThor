import { validateModifiers } from '../core/validateModifiers'
import type { Custom, Email, MaxLength, MinLength } from '../modifiers'
import { assert, TypeError } from '../utils'

export type StringSchemaArgs = Array<MinLength | MaxLength | Email | Custom<string>>

export const string = (
  args?: StringSchemaArgs,
  message?: {
    type_error?: string
  },
) => ({
  parse: (value: string) => {
    assert(typeof value === 'string', new TypeError(message?.type_error || 'Expected a string'))

    validateModifiers(value, args)

    return value
  },
})

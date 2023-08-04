import { validateModifiers } from '../core/validateModifiers'
import type { Custom } from '../modifiers/custom'
import { assert, TypeError } from '../utils'

export type BooleanSchemaArgs = Array<Custom<boolean>>

export const boolean = (args?: BooleanSchemaArgs, message?: string) => ({
  parse: (value: boolean) => {
    assert(typeof value === 'boolean', new TypeError(message || 'Expected a boolean'))

    validateModifiers(value, args)

    return value
  },
})

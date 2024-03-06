import { validateModifiers } from '@/core/validateModifiers'
import type { Custom, Max, Min } from '@/modifiers'
import { assert, TypeError } from '@/utils'

export type NumberSchemaArgs = Array<Min | Max | Custom<number>>

export const number = (
  args?: NumberSchemaArgs,
  message?: {
    type_error?: string
  },
) => ({
  parse: (value: number) => {
    assert(typeof value === 'number', new TypeError(message?.type_error || 'Expected a number'))
    assert(isFinite(value), new TypeError(message?.type_error || 'Expected a finite number'))

    validateModifiers(value, args)

    return value
  },
})
